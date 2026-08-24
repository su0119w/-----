// 作品類型功能：類型列表、新增、修改與刪除。
const express = require("express");
const pool = require("../db/database");

const router = express.Router();

//GET /api/genres :取得類型
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT genre_id, name FROM genres ORDER BY name ASC",
    );
    res.json(rows);
  } catch (error) {
    console.error("取得類型失敗：", error.message);
    res.status(500).json({
      message: "取得類型失敗",
    });
  }
});
//POST /api/genres :新增類型
router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        message: "類型名稱必須是非空白字串",
      });
    }
    const cleanName = name.trim();
    const [result] = await pool.query(`INSERT INTO genres(name)VALUES(?)`, [
      cleanName,
    ]);

    res.status(201).json({
      message: "新增成功",
      genre_id: result.insertId,
      name: cleanName,
    });
  } catch (error) {
    console.error("新增作品類型失敗:", error.message);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "此類型名稱已經被使用",
      });
    }
    res.status(500).json({
      message: "新增作品類型失敗",
    });
  }
});
//PATCH /api/genres/:id :類型修改
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const genreId = Number(id);

    if (!Number.isInteger(genreId) || genreId <= 0) {
      return res.status(400).json({
        message: "id必須是整數和大於0",
      });
    }

    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        message: "類型名稱必須是非空白字串",
      });
    }

    const cleanName = name.trim();

    const [result] = await pool.query(
      " UPDATE genres SET name = ? WHERE genre_id = ?",
      [cleanName, genreId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "此類型不存在",
      });
    }

    res.status(200).json({
      message: "類型修改成功",
      genre_id: genreId,
    });
  } catch (error) {
    console.error("類型修改失敗", error.message);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "名稱已經被使用",
      });
    }
    res.status(500).json({
      message: "類型修改失敗",
    });
  }
});
//DELETE /api/genres/:id :刪除類型
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const genreId = Number(id);
    if (!Number.isInteger(genreId) || genreId <= 0) {
      return res.status(400).json({
        message: "id必須是整數和大於0",
      });
    }
    const [result] = await pool.query(
      "DELETE FROM genres WHERE genre_id = ?",
      [genreId],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "此類型不存在",
      });
    }
    res.status(200).json({
      message: "刪除成功",
      genre_id: genreId,
    });
  } catch (error) {
    console.error("刪除類型失敗:", error.message);
    res.status(500).json({
      message: "刪除類型失敗",
    });
  }
});
module.exports = router;
