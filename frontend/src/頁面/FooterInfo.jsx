import { useEffect } from "react";
import { useLocation } from "react-router";

const pageContent = {
  "/about": {
    title: "關於本站",
    text: "Anime 資訊站以台灣使用者的需求為出發點，整理動畫、漫畫、小說、正版觀看與出版資訊。",
  },
  "/terms": {
    title: "帳號使用條款",
    text: "帳號功能與完整使用條款仍在規劃中，正式開放會員系統前會在此公布完整內容。",
  },
};

function FooterInfoPage() {
  const { pathname } = useLocation();
  const page = pageContent[pathname] || pageContent["/about"];

  useEffect(() => {
    document.title = `${page.title}｜Anime 資訊站`;
  }, [page.title]);

  return (
    <section className="footer-info-page">
      <h1>{page.title}</h1>
      <p>{page.text}</p>
    </section>
  );
}

export default FooterInfoPage;
