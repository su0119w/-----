const express = require("express");
const 動畫系列路由 = require("./功能/動畫系列");
const app = express();

const PORT = 4000;

app.use(express.json());
app.use("/api/series", 動畫系列路由);

app.get("/", (req, res) => {
  res.json({
    message: "動畫資訊正式版後端啟動成功",
  });
});

app.listen(PORT, () => {
  console.log(`後端伺服器啟動：http://localhost:${PORT}`);
});
