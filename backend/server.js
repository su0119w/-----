const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "動畫資訊正式版後端啟動成功",
  });
});

app.listen(PORT, () => {
  console.log(`後端伺服器啟動：http://localhost:${PORT}`);
});