import { useEffect, useState } from "react";
import "../css/home.css";

function HomePage() {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/series")
      .then((res) => res.json())
      .then((data) => {
        setSeries(data);
      });
  }, []);

  return (
    <main>
      <section className="glass-panel">
        <div className="hero">
          <h2>日本動畫・小說・漫畫</h2>
          <h2>台灣資料平台</h2>
          <p>
            搜尋日本動畫、小說、漫畫，可管理看過、在看和想看的作品。
            <br />
            查詢正版播放平台，以及漫畫小說的出版社與購買通路。
          </p>
        </div>
      </section>

      <section className="section-work">
        <div className="series">
          <h2>動畫系列</h2>
          <div className="series-display">
            {series.map((item) => (
              <article className="series-card" key={item.series_id}>
                <div className="series-left">
                  <img
                    src={item.cover_image_url || "/image/1.jpg"}
                    alt={`${item.title_zh || item.title_jp}封面`}
                  />
                </div>
                <div className="series-right">
                  <h3>{item.title_zh || item.title_jp}</h3>
                  <p>{item.title_jp}</p>
                  {item.title_romaji && <small>{item.title_romaji}</small>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
