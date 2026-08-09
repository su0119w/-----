// 作品系列 CRUD 路由。
const express = require("express");
const pool = require("../db/database");

const router = express.Router();
const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// GET /api/series：取得全部動畫系列
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM series WHERE deleted_at IS NULL ORDER BY updated_at DESC",
    );
    res.json(rows);
  } catch (error) {
    console.error("取得動畫系列失敗：", error.message);
    res.status(500).json({
      message: "取得動畫系列失敗",
    });
  }
});

//  GET /api/series/:id：取得單一動畫系列
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM series WHERE series_id = ? and deleted_at IS NULL",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "找不到此動畫系列",
      });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("取得單一動畫系列失敗：", error.message);
    res.status(500).json({
      message: "取得單一動畫系列失敗",
    });
  }
});

// POST /api/series :新增動畫系列
router.post("/", async (req, res) => {
  const {
    slug,
    title_zh,
    title_jp,
    title_romaji,
    description,
    cover_image_url,
  } = req.body;
 
  try {
    if (!slug || !title_jp) {
      return res.status(400).json({
        message: "日文名稱和網址名稱必須填寫",
      });
    }
    if(!slugPattern.test(slug)){
      return res.status(400).json({
        message:"slug 只能使用小寫英文、數字與連字號"
      })
    }
    const [result] = await pool.query(
      "INSERT INTO series (slug,title_zh,title_jp,title_romaji,description,cover_image_url) VALUES(?,?,?,?,?,?)",
      [
        slug,
        title_zh ?? null,
        title_jp,
        title_romaji ?? null,
        description ?? null,
        cover_image_url ?? null,
      ],
    );

    res.status(201).json({
      message: `新增成功(動畫名稱:${title_zh})`,
      id: result.insertId,
    });
  } catch (error) {
    console.error("新增動畫系列失敗：", error.message);
    if(error.code==="ER_DUP_ENTRY"){
      return res.status(409).json({
        message:"slug 已經被使用"
      })
    }
    res.status(500).json({
      message: "新增動畫系列失敗",
    });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    slug,
    title_zh,
    title_jp,
    title_romaji,
    description,
    cover_image_url,
  } = req.body;
  
  try {
    const [rows] = await pool.query(
      "SELECT * FROM series WHERE series_id = ? AND deleted_at IS NULL",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        message: "找不到此動畫系列",
      });
    }
    if(slug!==undefined &&!slugPattern.test(slug)){
      return res.status(400).json({
        message:"slug 只能使用小寫英文、數字與連字號"
      })
    }
    const [result] = await pool.query(
      `UPDATE series
      SET slug = ?, title_zh = ?, title_jp = ?, title_romaji = ?, description = ?, cover_image_url = ?
      WHERE series_id = ? `,
      [
        slug ?? rows[0].slug,
        title_zh ?? rows[0].title_zh,
        title_jp ?? rows[0].title_jp,
        title_romaji ?? rows[0].title_romaji,
        description ?? rows[0].description,
        cover_image_url ?? rows[0].cover_image_url,
        id,
      ],
    );
    res.status(200).json({
      message: `${rows[0].title_zh}系列修改成功`,
      id: id,
    });
  } catch (error) {
    console.error("修改動畫系列失敗:", error.message);
     if(error.code==="ER_DUP_ENTRY"){
      return res.status(409).json({
        message:"slug 已經被使用"
      })
    }
    res.status(500).json({
      message: "修改動畫系列失敗",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "UPDATE series SET deleted_at = CURRENT_TIMESTAMP  WHERE series_id = ? AND deleted_at IS NULL",
      [id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "刪除失敗",
      });
    }
    res.status(200).json({
      message: "刪除成功",
      id: id,
    });
  } catch (error) {
    console.error("刪除動畫系列失敗:", error.message);
    res.status(500).json({
      message: "刪除動畫系列失敗",
    });
  }
});
module.exports = router;
