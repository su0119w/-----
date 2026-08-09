const express = require("express");
const seriesRoutes = require("./功能/series");
const worksRoutes=require("./功能/works");
const cors=require("cors");
const app = express();

const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use("/api/series", seriesRoutes);
app.use("/api/works",worksRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "動畫資訊正式版後端啟動成功",
  });
});

app.listen(PORT, () => {
  console.log(`後端伺服器啟動：http://localhost:${PORT}`);
});
