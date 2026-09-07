//文章CRUD路由
const express = require("express");
const pool = require("../db/database");

const router = express.Router();




//GET /api/articles/new :取得最新文章
router.get("/latest", async (req, res) => {
  try {
    const [rows]=await pool.query(`
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
      LIMIT 6
      `)
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

//GET /api/articles/:slug :取得單一文章
router.get("/:glug",async(req,res)=>{
  const {slug}=req.body
  try{
    const [rows]=pool.query("")
  }catch(error){
    console.error("取得單一文章失敗",error.message);
    res.status(500).json({
      message:"取得單一文章失敗"
    })
  }
})


module.exports = router;
