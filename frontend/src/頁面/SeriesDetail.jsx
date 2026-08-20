import { useParams } from "react-router";
import { useState, useEffect } from "react";
import "../css/SeriesDetail.css";
function SeriesDetailPage() {
  const { slug } = useParams();
  const [seriesData, setSeriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seriesWorks, setSeriesWorks] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:4000/api/series/slug/${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("取得系列資料失敗");
        }
        return res.json();
      })
      .then((data) => {
        setSeriesData(data);
        return fetch(
          `http://localhost:4000/api/works?series_id=${data.series_id}`,
        );
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error("取得系列作品失敗");
        }

        return res.json();
      })
      .then((works) => {
        setSeriesWorks(works);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  return (
    <>
      <main>
        {loading && <p>載入中...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && seriesData && (
          <section className="seriesData">
            <div className="seriesData-left">
              <img src="/image/2.webp" />
            </div>
            <div className="seriesData-middle">
              <h1>{seriesData.title_zh || seriesData.title_jp}</h1>
              <p>日文名稱:{seriesData.title_jp}</p>
              <p>羅馬字:{seriesData.title_romaji}</p>
              <p className="series-description">{seriesData.description}</p>
              <div className="seriesData-works">
                <h4>系列作品</h4>
                {seriesWorks.length === 0 ? (
                  <p>這個系列目前沒有作品資料</p>
                ) : (
                  <div className="seriesWorks-list">
                    {seriesWorks.map((work) => (
                      <article key={work.work_id} className="seriesWorks-card">
                        <img
                          src={work.cover_image_url || "/image/2.webp"}
                          alt={work.title_zh || work.title_jp}
                        />
                        <h3>{work.title_zh || work.title_jp}</h3>
                        <p>{work.media_type}</p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="seriesData-right">
              <div className="seriesData-right-button">
                <h4>追蹤這部系列</h4>
                <div className="right-button">
                  <button>
                    <svg className="favorite-icon" aria-hidden="true">
                      <use href="/icons.svg#favorite-icon" />
                    </svg>
                    <span>收藏</span>
                  </button>
                </div>
              </div>
              <div className="seriesData-recommendations">
                <h4>推薦系列</h4>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
export default SeriesDetailPage;
