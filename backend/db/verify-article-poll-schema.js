const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config({ quiet: true });

const expectedTables = [
  "article_categories",
  "articles",
  "article_series",
  "article_works",
  "article_media",
  "article_sources",
  "homepage_featured_articles",
  "article_daily_stats",
  "polls",
  "poll_candidates",
  "poll_votes",
];

async function verifySchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  try {
    const migrationPath = path.join(
      __dirname,
      "migrations",
      "001_create_articles_and_polls.sql",
    );

    await connection.query(fs.readFileSync(migrationPath, "utf8"));

    const [tableRows] = await connection.query(
      `SELECT TABLE_NAME
       FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME IN (?)
       ORDER BY TABLE_NAME`,
      [expectedTables],
    );

    if (tableRows.length !== expectedTables.length) {
      throw new Error(
        `Expected ${expectedTables.length} tables, found ${tableRows.length}`,
      );
    }

    await connection.beginTransaction();

    try {
      const suffix = Date.now().toString();
      const [userResult] = await connection.execute(
        `INSERT INTO users (username, primary_email)
         VALUES (?, ?)`,
        [`Temporary ${suffix}`, `temporary-${suffix}@example.com`],
      );
      const [seriesResult] = await connection.execute(
        `INSERT INTO series (slug, title_jp)
         VALUES (?, ?)`,
        [`temporary-series-${suffix}`, "Temporary series"],
      );
      const [workResult] = await connection.execute(
        `INSERT INTO works
           (series_id, media_type, slug, title_jp, status)
         VALUES (?, 'anime', ?, ?, 'upcoming')`,
        [
          seriesResult.insertId,
          `temporary-work-${suffix}`,
          "Temporary work",
        ],
      );
      const user = { user_id: userResult.insertId };
      const series = { series_id: seriesResult.insertId };
      const work = { work_id: workResult.insertId };

      const [categoryResult] = await connection.execute(
        "INSERT INTO article_categories (name, slug) VALUES (?, ?)",
        [`Temporary ${suffix}`, `temporary-${suffix}`],
      );
      const [articleResult] = await connection.execute(
        `INSERT INTO articles
           (author_user_id, article_category_id, slug, title, content,
            status, published_at)
         VALUES (?, ?, ?, ?, ?, 'published', NOW())`,
        [
          user.user_id,
          categoryResult.insertId,
          `temporary-article-${suffix}`,
          "Temporary article",
          "## Test",
        ],
      );

      await connection.execute(
        "INSERT INTO article_series (article_id, series_id) VALUES (?, ?)",
        [articleResult.insertId, series.series_id],
      );
      await connection.execute(
        "INSERT INTO article_works (article_id, work_id) VALUES (?, ?)",
        [articleResult.insertId, work.work_id],
      );
      await connection.execute(
        `INSERT INTO article_media
           (article_id, uploaded_by_user_id, file_url)
         VALUES (?, ?, ?)`,
        [articleResult.insertId, user.user_id, "/uploads/test.jpg"],
      );
      await connection.execute(
        `INSERT INTO article_sources
           (article_id, source_name, source_url)
         VALUES (?, ?, ?)`,
        [
          articleResult.insertId,
          "Test source",
          `https://example.com/${suffix}`,
        ],
      );
      await connection.execute(
        `INSERT INTO homepage_featured_articles
           (article_id, created_by_user_id)
         VALUES (?, ?)`,
        [articleResult.insertId, user.user_id],
      );
      await connection.execute(
        `INSERT INTO article_daily_stats
           (article_id, stat_date, view_count)
         VALUES (?, CURRENT_DATE, 1)`,
        [articleResult.insertId],
      );

      const [pollResult] = await connection.execute(
        `INSERT INTO polls
           (creator_user_id, poll_type, target_type, title, max_choices,
            starts_at, ends_at)
         VALUES (?, 'community', 'work', ?, 1, NOW(),
                 DATE_ADD(NOW(), INTERVAL 7 DAY))`,
        [user.user_id, "Temporary poll"],
      );
      const [candidateResult] = await connection.execute(
        `INSERT INTO poll_candidates (poll_id, work_id)
         VALUES (?, ?)`,
        [pollResult.insertId, work.work_id],
      );
      await connection.execute(
        `INSERT INTO poll_votes (poll_id, poll_candidate_id, user_id)
         VALUES (?, ?, ?)`,
        [pollResult.insertId, candidateResult.insertId, user.user_id],
      );

      console.log(`Tables verified: ${tableRows.length}/${expectedTables.length}`);
      console.log("Transactional insert test: passed");
    } finally {
      await connection.rollback();
    }
  } finally {
    await connection.end();
  }
}

verifySchema().catch((error) => {
  console.error(`${error.code ? `${error.code}: ` : ""}${error.message}`);
  process.exit(1);
});
