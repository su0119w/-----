const express = require("express");
const pool = require("../db/database");
const router = express.Router();
//GET /api/anime-releases/today :取得今日新番
router.get("/today", async (req, res) => {
  try {
    const taipeiToday = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const startUtcDate = new Date(`${taipeiToday}T00:00:00+08:00`);

    const startUtc = startUtcDate.toISOString().slice(0, 19).replace("T", " ");

    const endUtcDate = new Date(startUtcDate.getTime() + 24 * 60 * 60 * 1000);

    const endUtc = endUtcDate.toISOString().slice(0, 19).replace("T", " ");

    const [rows] = await pool.query(`
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
        `, [startUtc, endUtc]);
    res.json(rows);
  } catch (error) {
    console.error("取得今日新番失敗", error.message);
    res.status(500).json({
      message: "取得今日新番失敗",
    });
  }
});

module.exports = router;
