// 作品系列 CRUD 路由。
const express = require("express");
const pool = require("../db/database");
const { Connection } = require("mysql2/promise");

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

// GET /api/series/recent：取得最近 7 天新建立的系列
router.get("/recent", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        series_id,
        slug,
        title_zh,
        title_jp,
        title_romaji,
        cover_image_url,
        created_at
      FROM series
      WHERE deleted_at IS NULL
        AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY created_at DESC, series_id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("取得最近新收錄系列失敗：", error.message);
    res.status(500).json({
      message: "取得最近新收錄系列失敗",
    });
  }
});

//  GET /api/series/slug/:slug：slug取得單一動畫系列
router.get("/slug/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM series WHERE slug = ? and deleted_at IS NULL",
      [slug],
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
// GET /api/series/:id/genres :取得類型
router.get("/:id/genres", async (req, res) => {
  const { id } = req.params;
  try {
    const seriesId = Number(id);
    if (!Number.isInteger(seriesId) || seriesId <= 0) {
      return res.status(400).json({
        message: "id必須是整數和大於0",
      });
    }
    const [rows] = await pool.query(
      "SELECT * FROM series WHERE series_id = ? AND deleted_at IS NULL",
      [seriesId],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        message: "找不到此系列",
      });
    }
    const [result] = await pool.query(
      `SELECT g.genre_id, g.name
        FROM series_genres AS sg
        INNER JOIN genres AS g
          ON sg.genre_id = g.genre_id
        WHERE sg.series_id = ?
        ORDER BY g.name ASC`,
      [seriesId],
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("取得系列類型失敗：", error.message);
    res.status(500).json({
      message: "取得系列類型失敗",
    });
  }
});
// PUT /api/series/:id/genres :請求設定某個系列的全部類型
router.put("/:id/genres", async (req, res) => {
  const { id } = req.params;
  const { genre_ids } = req.body;
  let connection;
  try {
    const seriesId = Number(id);
    if (!Number.isInteger(seriesId) || seriesId <= 0) {
      return res.status(400).json({
        message: "id必須是整數和大於0",
      });
    }
    if (!Array.isArray(genre_ids)) {
      return res.status(400).json({
        message: "genre_ids必須是陣列",
      });
    }
    if (
      !genre_ids.every((genre_Id) => Number.isInteger(genre_Id) && genre_Id > 0)
    ) {
      return res.status(400).json({
        message: "每個編號必須是整數和大於0",
      });
    }
    const uniqueGenreIds = [...new Set(genre_ids)];
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const [seriesRows] = await connection.query(
      `SELECT series_id 
      FROM series WHERE series_id = ? AND deleted_at IS NULL`,
      [seriesId],
    );

    if (seriesRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        message: "找不到此系列",
      });
    }
    if (uniqueGenreIds.length > 0) {
      const [genreRows] = await connection.query(
        `SELECT genre_id
          FROM genres
          WHERE genre_id IN (?)`,
        [uniqueGenreIds],
      );
      if (genreRows.length !== uniqueGenreIds.length) {
        await connection.rollback();
        return res.status(400).json({
          message: "包含不存在的類型編號",
        });
      }
    }
    await connection.query(
      `
      DELETE FROM series_genres
      WHERE series_id = ?`,
      [seriesId],
    );
    if (uniqueGenreIds.length > 0) {
      const genreValues = uniqueGenreIds.map((genreId) => [seriesId, genreId]);
      await connection.query(
        `
        INSERT INTO series_genres (series_id,genre_id)
        VALUES ? `,
        [genreValues],
      );
    }
    await connection.commit();
    res.status(200).json({
      message: "系列類型設定成功",
      series_id: seriesId,
      genre_ids: uniqueGenreIds,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("設定系列類型失敗", error.message);
    res.status(500).json({
      message: "設定系列類型失敗",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});
// GET /api/series/:id/recommendations：推薦系列
router.get("/:id/recommendations", async (req, res) => {
  const { id } = req.params;
  try {
    const seriesId = Number(id);
    if (!Number.isInteger(seriesId) || seriesId <= 0) {
      return res.status(400).json({
        message: "id必須是整數和大於0",
      });
    }
    const [seriesRows] = await pool.query(
      `SELECT series_id 
      FROM series WHERE series_id = ? AND deleted_at IS NULL`,
      [seriesId],
    );

    if (seriesRows.length === 0) {
      return res.status(404).json({
        message: "找不到此系列",
      });
    }

    const [rows] = await pool.query(`
        SELECT
            candidate_series.series_id,
            candidate_series.slug,
            candidate_series.title_zh,
            candidate_series.title_jp,
            candidate_series.title_romaji,
            candidate_series.cover_image_url,
            COUNT(DISTINCT candidate_genre.genre_id) AS matching_genre_count
        FROM series_genres AS current_genre
        INNER JOIN series_genres AS candidate_genre
            ON candidate_genre.genre_id = current_genre.genre_id
        INNER JOIN series AS candidate_series
            ON candidate_series.series_id = candidate_genre.series_id
        WHERE current_genre.series_id = ?
          AND candidate_series.series_id <> ?
          AND candidate_series.deleted_at IS NULL
        GROUP BY candidate_series.series_id
        ORDER BY
            matching_genre_count DESC,
            candidate_series.updated_at DESC
        LIMIT 10
      `,[seriesId, seriesId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error("取得推薦系列失敗", error.message);
    res.status(500).json({
      message: "取得推薦系列失敗",
    });
  }
});

// GET /api/series/:id：id取得單一動畫系列
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
    if (!slugPattern.test(slug)) {
      return res.status(400).json({
        message: "slug 只能使用小寫英文、數字與連字號",
      });
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
      series_id: result.insertId,
    });
  } catch (error) {
    console.error("新增動畫系列失敗：", error.message);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "slug 已經被使用",
      });
    }
    res.status(500).json({
      message: "新增動畫系列失敗",
    });
  }
});
// PATCH /api/series/:id :修改動畫系列
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
    if (slug !== undefined && !slugPattern.test(slug)) {
      return res.status(400).json({
        message: "slug 只能使用小寫英文、數字與連字號",
      });
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
      series_id: id,
    });
  } catch (error) {
    console.error("修改動畫系列失敗:", error.message);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "slug 已經被使用",
      });
    }
    res.status(500).json({
      message: "修改動畫系列失敗",
    });
  }
});
// DELETE /api/series/:id :刪除動畫系列
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
