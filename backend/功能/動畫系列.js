const express = require("express");
const pool = require("../db/database");

const router = express.Router();

// GET /api/series：取得全部動畫系列
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM series");
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
      "SELECT * FROM series WHERE series_id = ? ",
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
  const { title_zh, title_jp, author, description, image, status } = req.body;
  try {
    if (!title_jp || !title_zh || !author || !status) {
      return res.status(400).json({
        message: "中文名稱，日文名稱，作者，狀態必須填寫",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO series (title_zh, title_jp, author, description, image, status ) VALUES(?,?,?,?,?,?)",
      [title_zh, title_jp, author, description ?? null, image ?? null, status],
    );

    res.status(201).json({
      message: `新增成功(動畫名稱:${title_zh})`,
      id: result.insertId,
    });
  } catch (error) {
    console.error("新增動畫系列失敗：", error.message);

    res.status(500).json({
      message: "新增動畫系列失敗",
    });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title_zh, title_jp, author, description, image, status } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM series WHERE series_id = ? ",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        message: "找不到此動畫系列",
      });
    }
    const [result] = await pool.query(
      `UPDATE series
      SET title_zh = ?, title_jp = ?, author = ?, description = ?, image = ?, status = ?
      WHERE series_id = ? `,
      [
        title_zh ?? rows[0].title_zh,
        title_jp ?? rows[0].title_jp,
        author ?? rows[0].author,
        description ?? rows[0].description,
        image ?? rows[0].image,
        status ?? rows[0].status,
        id,
      ],
    );
    res.status(200).json({
      message: `${rows[0].title_zh}系列修改成功`,
      id: id,
    });
  } catch (error) {
    console.error("修改動畫系列失敗:", error.message);
    res.status(500).json({
      message: "修改動畫系列失敗",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "DELETE FROM series WHERE series_id = ? ",
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
