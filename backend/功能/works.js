// 統一作品功能：動畫、漫畫、小說與輕小說的列表、詳細資料和 CRUD。
const express = require("express");
const pool = require("../db/database");

const router = express.Router();
const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const mediaArray = ["anime", "manga", "novel", "light_novel"];
const statusArray = ["upcoming", "ongoing", "finished", "hiatus", "cancelled"];

//GET /api/works：取得作品
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM works WHERE deleted_at IS NULL ORDER BY updated_at DESC",
    );
    res.json(rows);
  } catch (error) {
    console.error("取得作品失敗：", error.message);
    res.status(500).json({
      message: "取得作品失敗",
    });
  }
});
//GET /api/works/:id：取得單一作品
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM works WHERE work_id = ? AND deleted_at IS NULL ",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        message: "找不到此作品",
      });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("取得作品失敗：", error.message);
    res.status(500).json({
      message: "取得作品失敗",
    });
  }
});
//POST /api/works
router.post("/", async (req, res) => {
  const {
    series_id,
    media_type,
    slug,
    title_zh,
    title_jp,
    title_romaji,
    description,
    cover_image_url,
    status,
    start_date,
    end_date,
    official_url,
    wiki_url,
    source_url,
  } = req.body;
  try {
    if (!series_id || !media_type || !slug || !title_jp || !status) {
      return res.status(400).json({
        message: "動畫系列編號、媒體類型、網址名稱、日文名稱、狀態必須填寫",
      });
    }
    if (!slugPattern.test(slug)) {
      return res.status(400).json({
        message: "slug 只能使用小寫英文、數字與連字號",
      });
    }
    if (!mediaArray.includes(media_type)) {
      return res.status(400).json({
        message: "媒體類型只能是anime、manga、novel、light_novel",
      });
    }
    if (!statusArray.includes(status)) {
      return res.status(400).json({
        message: "狀態只能是upcoming、ongoing、finished、hiatus、cancelled",
      });
    }
    const [result] = await pool.query(
      `
        INSERT INTO works (
            series_id,
            media_type,
            slug,
            title_zh,
            title_jp,
            title_romaji,
            description,
            cover_image_url,
            status,
            start_date,
            end_date,
            official_url,
            wiki_url,
            source_url
        )VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `,
      [
        series_id,
        media_type,
        slug,
        title_zh ?? null,
        title_jp,
        title_romaji ?? null,
        description ?? null,
        cover_image_url ?? null,
        status,
        start_date ?? null,
        end_date ?? null,
        official_url ?? null,
        wiki_url ?? null,
        source_url ?? null,
      ],
    );
    res.status(201).json({
      message: `新增成功(作品名稱:${title_zh})`,
      work_id: result.insertId,
    });
  } catch (error) {
    console.error("新增作品失敗：", error.message);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "slug 已經被使用",
      });
    }
    res.status(500).json({
      message: "新增作品失敗",
    });
  }
});
//PATCH /api/works/:id
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    series_id,
    media_type,
    slug,
    title_zh,
    title_jp,
    title_romaji,
    description,
    cover_image_url,
    status,
    start_date,
    end_date,
    official_url,
    wiki_url,
    source_url,
  } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM works WHERE work_id = ? AND deleted_at IS NULL",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        message: "找不到此作品",
      });
    }
    if (slug !== undefined && !slugPattern.test(slug)) {
      return res.status(400).json({
        message: "slug 只能使用小寫英文、數字與連字號",
      });
    }
    if (status !== undefined && !statusArray.includes(status)) {
      return res.status(400).json({
        message: "狀態只能是upcoming、ongoing、finished、hiatus、cancelled",
      });
    }
    if (media_type && media_type !== rows[0].media_type) {
      return res.status(400).json({
        message: "作品建立後不能修改媒體類型",
      });
    }
    const [result] = await pool.query(
      `UPDATE works
        SET series_id = ?,
            slug = ?,
            title_zh = ?,
            title_jp = ?,
            title_romaji = ?,
            description = ?,
            cover_image_url = ?,
            status = ?,
            start_date = ?,
            end_date = ?,
            official_url = ?,
            wiki_url = ?,
            source_url  = ?
        WHERE work_id = ?`,
      [
        series_id ?? rows[0].series_id,
        slug ?? rows[0].slug,
        title_zh ?? rows[0].title_zh,
        title_jp ?? rows[0].title_jp,
        title_romaji ?? rows[0].title_romaji,
        description ?? rows[0].description,
        cover_image_url ?? rows[0].cover_image_url,
        status ?? rows[0].status,
        start_date ?? rows[0].start_date,
        end_date ?? rows[0].end_date,
        official_url ?? rows[0].official_url,
        wiki_url ?? rows[0].wiki_url,
        source_url ?? rows[0].source_url,
        id,
      ],
    );

    res.status(200).json({
      message: `${rows[0].title_zh}作品修改成功`,
      work_id: id,
    });
  } catch (error) {
    console.error("修改作品失敗：", error.message);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "slug 已經被使用",
      });
    }
    res.status(500).json({
      message: "修改作品失敗",
    });
  }
});
//DELETE /api/works/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "UPDATE works SET deleted_at = CURRENT_TIMESTAMP  WHERE work_id = ? AND deleted_at IS NULL",
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
    console.error("刪除作品失敗:", error.message);
    res.status(500).json({
      message: "刪除作品失敗",
    });
  }
});
module.exports = router;
