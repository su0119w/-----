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
module.exports = router;
