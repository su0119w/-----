//文章CRUD路由
const express = require("express");
const pool = require("../db/database");

const router = express.Router();

//GET /api/articles/new :取得最新文章
router.get("/latest", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        a.article_id,
        a.slug,
        a.title,
        a.summary,
        COALESCE(a.hero_image_url, a.cover_image_url) AS hero_image_url,
        COALESCE(a.hero_image_alt, a.cover_image_alt) AS hero_image_alt,
        a.published_at,
        u.username AS author_name,
        ac.name AS category_name,
        ac.slug AS category_slug
      FROM articles AS a
      INNER JOIN article_categories AS ac
      ON a.article_category_id = ac.article_category_id
      INNER JOIN users AS u
      ON a.author_user_id = u.user_id
      WHERE a.deleted_at IS NULL
        AND a.status = 'published'
      ORDER BY a.published_at DESC, a.article_id DESC
      LIMIT 8
      `);
    res.json(rows);
  } catch (error) {
    console.error("取得文章失敗", error.message);
    res.status(500).json({
      message: "取得文章失敗",
    });
  }
});

//GET /api/articles/featured :大型焦點文章
router.get("/featured", async (req, res) => {
  try {
    const [rows] = await pool.query(`
    SELECT 
        a.article_id,
        a.slug,
        a.title,
        a.summary,
        COALESCE(a.hero_image_url, a.cover_image_url) AS hero_image_url,
        COALESCE(a.hero_image_alt, a.cover_image_alt) AS hero_image_alt,
        a.published_at,
        a.author_user_id,
        u.username AS author_name,
        ac.name AS category_name,
        ac.slug AS category_slug,
        hfa.display_order
    FROM homepage_featured_articles AS hfa
    INNER JOIN articles AS a
     ON hfa.article_id = a.article_id
    INNER JOIN article_categories AS ac
     ON a.article_category_id = ac.article_category_id
    INNER JOIN users AS u
     ON a.author_user_id = u.user_id
    WHERE a.status = 'published'
        AND a.deleted_at IS NULL
        AND hfa.starts_at <= NOW()
        AND (
            hfa.ends_at IS NULL
            OR hfa.ends_at > NOW()
            )
    ORDER BY hfa.display_order ASC, hfa.created_at DESC
    LIMIT 8
    `);

    res.json(rows);
  } catch (error) {
    console.error("取得焦點文章失敗", error.message);
    res.status(500).json({
      message: "取得焦點文章失敗",
    });
  }
});

//GET /api/articles/popular :熱門文章
router.get("/popular", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        a.article_id,
        a.slug,
        a.title,
        COALESCE(SUM(ads.view_count), 0) AS views_last_7_days
      FROM articles AS a
      LEFT JOIN article_daily_stats AS ads
        ON ads.article_id = a.article_id
        AND ads.stat_date >= CURDATE() - INTERVAL 6 DAY
      WHERE a.deleted_at IS NULL
        AND a.status = 'published'
      GROUP BY a.article_id, a.slug, a.title, a.published_at
      ORDER BY views_last_7_days DESC, a.published_at DESC
      LIMIT 5`);

    res.json(rows);
  } catch (error) {
    console.error("取的熱門文章失敗", error.message);
    res.status(500).json({
      message: "取得熱門文章失敗",
    });
  }
});

//GET /api/articles/:slug :取得單一文章
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query(
      `
      SELECT
        a.article_id,
        a.slug,
        a.title,
        a.summary,
        a.content,
        a.hero_image_url,
        a.hero_image_alt,
        a.published_at,
        a.updated_at,
        u.username AS author_name,
        ac.name AS category_name,
        ac.slug AS category_slug
      FROM articles AS a
      JOIN users AS u
       ON a.author_user_id = u.user_id
      JOIN article_categories AS ac
       ON a.article_category_id=ac.article_category_id
      WHERE a.slug = ?
      AND a.deleted_at IS NULL
      AND a.status = 'published'
      `,
      [slug],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        message: "找不到此文章",
      });
    }

    const [series] = await pool.query(
      `
      SELECT 
      s.series_id,
      s.slug,
      s.title_zh,
      s.title_jp,
      s.title_romaji,
      s.cover_image_url
      FROM article_series AS ars
       JOIN series AS s
        ON ars.series_id = s.series_id
      WHERE ars.article_id = ?
      `,
      [rows[0].article_id],
    );
    const [works] = await pool.query(
      `
       SELECT 
        w.work_id,
        w.slug,
        w.title_zh,
        w.title_jp,
        w.title_romaji,
        w.media_type,
        w.cover_image_url
        FROM article_works AS arw
        JOIN works AS w
          ON arw.work_id = w.work_id
        WHERE arw.article_id = ?
      `,
      [rows[0].article_id],
    );
    const [previous] = await pool.query(
      `
       SELECT 
        article_id,
        slug,
        title
        FROM articles 
        WHERE published_at < ?
        AND deleted_at IS NULL
        AND status = 'published'
        ORDER BY published_at DESC
        LIMIT 1
      `,
      [rows[0].published_at],
    );
    const [next] = await pool.query(
      `
       SELECT 
        article_id,
        slug,
        title
        FROM articles 
        WHERE published_at > ?
        AND deleted_at IS NULL
        AND status = 'published'
        ORDER BY published_at ASC
        LIMIT 1
      `,
      [rows[0].published_at],
    );

    res.json({
      ...rows[0],
      related_series: series,
      related_works: works,
      previous_article: previous[0] ?? null,
      next_article: next[0] ?? null,
    });
  } catch (error) {
    console.error("取得單一文章失敗", error.message);
    res.status(500).json({
      message: "取得單一文章失敗",
    });
  }
});

//GET /api/articles/:id/series :取得系列相關文章
router.get("/:id/series", async (req, res) => {
  const { id } = req.params;
  try {
    const seriesId = Number(id);

    if (!Number.isInteger(seriesId) || seriesId <= 0) {
      return res.status(400).json({
        message: "series_id 必須是大於 0 的整數",
      });
    }
    const [rows] = await pool.query(
      `
      SELECT
        a.article_id,
        a.title,
        a.slug,
        a.summary,
        a.published_at,
        COALESCE(a.hero_image_url, a.cover_image_url) AS hero_image_url,
        COALESCE(a.hero_image_alt, a.cover_image_alt) AS hero_image_alt,
        ac.name AS category_name
      FROM article_series AS ars
      JOIN articles AS a
        ON a.article_id = ars.article_id
      JOIN article_categories AS ac
        ON a.article_category_id = ac.article_category_id
      WHERE ars.series_id = ?
      AND a.deleted_at IS NULL
      AND a.status = 'published'
      ORDER BY a.published_at DESC, a.article_id DESC
      `,
      [seriesId],
    );
    res.json(rows);
  } catch (error) {
    console.error("取得系列相關文章失敗", error.message);
    res.status(500).json({
      message: "取得系列相關文章失敗",
    });
  }
});

//POST /api/articles/:slug/view :新增熱門文章點擊率
router.post("/:slug/view", async (req, res) => {
  const { slug } = req.params;
  try {
    if (!slug) {
      return res.status(404);
    }
    const [articles] = await pool.query(`
        SELECT article_id
        FROM articles
        WHERE slug = ?
          AND deleted_at IS NULL
          AND status = 'published'
        `,
      [slug],
    );

    if (articles.length === 0) {
      return res.status(404).json({
        message: "找不到此文章",
      });
    }
    await pool.query(
      `
      INSERT INTO article_daily_stats (
        article_id,
        stat_date,
        view_count
      )
      VALUES (?, CURDATE(), 1)
      ON DUPLICATE KEY UPDATE
        view_count = view_count + 1`,
      [articles[0].article_id],
    );

    return res.status(204).send();
  } catch (error) {
    console.error("新增熱門文章點擊率失敗", error.message);
    res.status(500).json({
      message: "新增熱門文章點擊率失敗",
    });
  }
});
module.exports = router;
