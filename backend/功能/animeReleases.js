const express = require("express");
const pool = require("../db/database");
const router = express.Router();
// GET /api/anime-releases?date=YYYY-MM-DD：取得指定日期播出資訊
router.get("/", async (req, res) => {
  const { date } = req.query;
  try {
    const taipeiToday = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const selectedDate = date ?? taipeiToday;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      return res.status(400).json({
        message: "日期格式必須為 YYYY-MM-DD",
      });
    }

    const startUtcDate = new Date(`${selectedDate}T00:00:00+08:00`);

    if (Number.isNaN(startUtcDate.getTime())) {
      return res.status(400).json({
        message: "日期不存在",
      });
    }
    const normalizedDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(startUtcDate);
    if (normalizedDate !== selectedDate) {
      return res.status(400).json({
        message: "日期不存在",
      });
    }

    const startUtc = startUtcDate.toISOString().slice(0, 19).replace("T", " ");

    const endUtcDate = new Date(startUtcDate.getTime() + 24 * 60 * 60 * 1000);

    const endUtc = endUtcDate.toISOString().slice(0, 19).replace("T", " ");

    const [rows] = await pool.query(
      `
        WITH ranked_releases AS (
          SELECT
            ar.*,
            ROW_NUMBER() OVER (
              PARTITION BY
                ar.work_id,
                ar.episode_number,
                ar.region_code,
                ar.version_type,
                ar.language_code
              ORDER BY ar.platform_id ASC
            ) AS platform_rank
          FROM anime_episode_releases AS ar
          WHERE ar.scheduled_at_utc >= ?
            AND ar.scheduled_at_utc < ?
        )
        SELECT
            ar.release_id,
            ar.episode_number,
            ar.version_type,
            ar.language_code,
            ar.scheduled_at_utc,
            ar.status,
            ar.change_reason,
            ar.region_code,
            w.work_id,
            w.slug,
            w.title_zh,
            w.title_jp,
            w.cover_image_url,
            p.name AS platform_name,
            p.logo_url AS platform_logo_url,
            COALESCE(wp.is_exclusive, FALSE) AS is_exclusive
        FROM ranked_releases AS ar
            JOIN works AS w
            ON w.work_id=ar.work_id
            JOIN platforms AS p
            ON p.platform_id=ar.platform_id
            LEFT JOIN work_platforms AS wp
            ON wp.work_id = ar.work_id
            AND wp.platform_id = ar.platform_id
            AND wp.region_code = ar.region_code
            AND wp.media_type = ar.media_type
        WHERE ar.platform_rank = 1
        ORDER BY ar.scheduled_at_utc ASC
        `,
      [startUtc, endUtc],
    );
    res.json(rows);
  } catch (error) {
    console.error("取得今日新番失敗", error.message);
    res.status(500).json({
      message: "取得今日新番失敗",
    });
  }
});

module.exports = router;
