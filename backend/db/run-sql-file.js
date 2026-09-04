const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config({ quiet: true });

async function runSqlFile() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    throw new Error("請提供 SQL 檔案路徑");
  }

  const sqlPath = path.resolve(process.cwd(), inputPath);
  const sql = fs.readFileSync(sqlPath, "utf8");
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  try {
    await connection.query(sql);
    console.log(`SQL 執行成功：${sqlPath}`);
  } finally {
    await connection.end();
  }
}

runSqlFile().catch((error) => {
  console.error(`${error.code ? `${error.code}: ` : ""}${error.message}`);
  process.exit(1);
});
