import { useEffect, useState } from "react";
import { Link, useRouteLoaderData, useSearchParams } from "react-router";
import "../css/pages/Series.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SeriesPage() {
  const seriesData = useRouteLoaderData("seriesData");
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");
  const [load, setLoad] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedGenreId = searchParams.get("genre_id");
  useEffect(() => {
    document.title = "系列作品";
    fetch(`${API_BASE_URL}/api/genres`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("取得類型失敗");
        }
        return res.json();
      })
      .then((data) => {
        setGenres(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoad(false);
      });
  }, []);
  return (
    <main className="series-page">
      <section className="series-filter-panel">
        <div className="series-page-heading">
          <p>DATABASE</p>
          <h1>作品系列</h1>
        </div>

        <div className="series-filter-group">
          <h2>類型</h2>
          {load && <p className="series-filter-message">載入中...</p>}
          {error && (
            <p className="series-filter-message series-filter-error">{error}</p>
          )}
          {!load && !error && genres.length > 0 && (
            <div className="genre-filter-list">
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className={
                  selectedGenreId === null
                    ? "genre-filter-button active"
                    : "genre-filter-button"
                }
                aria-pressed={selectedGenreId === null}
              >
                全部
              </button>
              {genres.map((item) => (
                <button
                  type="button"
                  key={item.genre_id}
                  onClick={() => setSearchParams({ genre_id: item.genre_id })}
                  className={
                    selectedGenreId === String(item.genre_id)
                      ? "genre-filter-button active"
                      : "genre-filter-button"
                  }
                  aria-pressed={selectedGenreId === String(item.genre_id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="series-results">
        <div className="series-grid">
          {seriesData.length === 0 ? (
            <p className="series-empty-state">目前沒有此類型系列</p>
          ) : (
            seriesData.map((item) => (
              <Link
                className="series-list-card"
                key={item.series_id}
                to={`/series/${item.slug}`}
              >
                <article>
                  <img
                    src={item.cover_image_url}
                    alt={`${item.title_zh || item.title_jp} 封面`}
                  />
                  <div className="series-list-card-content">
                    <h2>{item.title_zh || item.title_jp}</h2>
                    <p>{item.title_jp}</p>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default SeriesPage;
