import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import "../css/SeriesDetail.css";

const bookTypeLabels = {
  manga: "漫畫",
  novel: "小說",
  light_novel: "輕小說",
};

const workStatusLabels = {
  upcoming: "即將推出",
  ongoing: "連載中",
  finished: "已完結",
  hiatus: "休刊中",
  cancelled: "已取消",
};

function WorkSection({ title, works, emptyText }) {
  return (
    <section className="seriesData-works">
      <div className="seriesWorks-heading">
        <h2>{title}</h2>
        <span>{works.length} 部</span>
      </div>

      {works.length === 0 ? (
        <p className="seriesWorks-empty">{emptyText}</p>
      ) : (
        <div className="seriesWorks-list">
          {works.map((work) => (
            <Link to={`/works/${work.work_id}`} key={work.work_id}>
              <article className="seriesWorks-card ">
                <img
                  src={work.cover_image_url || "/image/2.webp"}
                  alt={work.title_zh || work.title_jp}
                />
                <div className="seriesWorks-card-content">
                  <h3>{work.title_zh || work.title_jp}</h3>
                  <div className="seriesWorks-type">
                    {work.media_type === "anime" ? (
                      <div className="seriesWorks-type-botton">
                        <p>年份:{work.release_year}</p>

                        <p>{work.episodes}集</p>
                      </div>
                    ) : (
                      <p>總冊數:{work.total_volumes}</p>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function BookSection({ title, works, emptyText }) {
  return (
    <section className="book-section">
      <div className="book-heading">
        <h2>{title}</h2>
        <span>{works.length} 部</span>
      </div>

      {works.length === 0 ? (
        <p className="book-empty">{emptyText}</p>
      ) : (
        <div className="book-list">
          {works.map((work) => (
            <Link
              className="book-card"
              key={work.work_id}
              to={`/works/${work.work_id}`}
            >
              <div className="book-cover">
                <img
                  src={work.cover_image_url || "/image/2.webp"}
                  alt={work.title_zh || work.title_jp}
                />
              </div>
              <div className="book-card-content">
                <span className="book-type">
                  {bookTypeLabels[work.media_type] || work.media_type}
                </span>
                <h3>{work.title_zh || work.title_jp}</h3>
                <div className="book-meta">
                  <span>
                    {work.total_volumes == null
                      ? "冊數未定"
                      : `共 ${work.total_volumes} 冊`}
                  </span>
                  <span>{workStatusLabels[work.status] || work.status}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function SeriesDetailPage() {
  const { slug } = useParams();
  const [seriesData, setSeriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seriesWorks, setSeriesWorks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [recommend, setRecommend] = useState([]);
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
          throw new Error("取得系列資料失敗");
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
  const seriesId = seriesData?.series_id;
  useEffect(() => {
    if (!seriesId) {
      return;
    }
    fetch(`http://localhost:4000/api/series/${seriesId}/genres`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("取得系列類型資料失敗");
        }
        return res.json();
      })
      .then((data) => {
        setGenres(data);
      })
      .catch((error) => {
        setError(error.message);
      });
    fetch(`http://localhost:4000/api/series/${seriesId}/recommendations`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("取得系列類型資料失敗");
        }
        return res.json();
      })
      .then((data) => {
        setRecommend(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [seriesId]);

  const animeWorks = seriesWorks.filter((work) => work.media_type === "anime");
  const mangaWorks = seriesWorks.filter((work) => work.media_type === "manga");
  const novelWorks = seriesWorks.filter(
    (work) => work.media_type === "novel" || work.media_type === "light_novel",
  );
  return (
    <section>
      {loading && <p>載入中...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && seriesData && (
        <section className="seriesData">
          <div className="seriesData-left">
            <img
              src={seriesData.cover_image_url || "/image/2.webp"}
              alt={seriesData.title_zh || seriesData.title_jp}
            />
            <div className="seriesData-genres">
              <h2>類型</h2>
              <div className="genres-display">
                {genres.length === 0 ? (
                  <p>尚未設定類型</p>
                ) : (
                  genres.map((genre) => (
                    <div key={genre.genre_id}>
                      <p>{genre.name}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="seriesData-middle">
            <h1>{seriesData.title_zh || seriesData.title_jp}</h1>
            <p>日文名稱：{seriesData.title_jp}</p>
            <p>羅馬字：{seriesData.title_romaji}</p>
            <p className="series-description">{seriesData.description}</p>
            <div className="seriesWorks">
              <div className="seriesWorks-title">
                <h2>系列作品</h2>
                <p>依照媒體類型整理這個系列包含的作品</p>
              </div>
              <WorkSection
                title="動畫作品"
                works={animeWorks}
                emptyText="這個系列目前沒有動畫作品"
              />
              <div className="work-book">
                <BookSection
                  title="漫畫作品"
                  works={mangaWorks}
                  emptyText="這個系列目前沒有漫畫作品"
                />
                <BookSection
                  title="小說作品"
                  works={novelWorks}
                  emptyText="這個系列目前沒有小說作品"
                />
              </div>
            </div>
          </div>
          <div className="seriesData-right">
            <div className="seriesData-right-button">
              <h4>追蹤這部系列</h4>
              <div className="right-button">
                <button type="button">
                  <svg className="favorite-icon" aria-hidden="true">
                    <use href="/icons.svg#favorite-icon" />
                  </svg>
                  <span>收藏</span>
                </button>
              </div>
            </div>
            <div className="seriesData-recommendations">
              <h4>推薦系列</h4>
              {recommend.length === 0 ? (
                <p>目前沒有推薦資料</p>
              ) : (
                <div className="recommend-list">
                  {recommend.map((item) => (
                    <Link
                      className="recommend-card"
                      to={`/series/${item.slug}`}
                      key={item.series_id}
                    >
                      <div className="recommend-left">
                        <img
                          src={item.cover_image_url || "/image/2.webp"}
                          alt={item.title_zh || item.title_jp}
                        />
                      </div>
                      <div className="recommend-right">
                        <h3>{item.title_zh || item.title_jp}</h3>
                        <span className="recommend-match">
                          共同 {item.matching_genre_count} 個類型
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="seriesData-edit-link">
              <Link to={`/series/${slug}/edit`}>修改系列</Link>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
export default SeriesDetailPage;
