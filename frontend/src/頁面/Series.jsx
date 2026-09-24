import { useEffect, useState } from "react";
import { Link, useRouteLoaderData } from "react-router";
import "../css/pages/Series.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SeriesPage() {
  const seriesData = useRouteLoaderData("seriesData");
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");
  const [load, setLoad] = useState(true);
  const [selectedGenreId, setSelectedGenreId] = useState(null);
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
          {error && <p className="series-filter-message series-filter-error">{error}</p>}
          {!load && !error && genres.length > 0 && (
            <div className="genre-filter-list">
              <button
                type="button"
                onClick={() => setSelectedGenreId(null)}
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
                  onClick={() => setSelectedGenreId(item.genre_id)}
                  className={
                    selectedGenreId === item.genre_id
                      ? "genre-filter-button active"
                      : "genre-filter-button"
                  }
                  aria-pressed={selectedGenreId === item.genre_id}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="series-filter-group series-sort-group">
          <h2>排序</h2>
          <div className="series-sort-list">
            <button className="series-sort-button" type="button">最新到最舊</button>
            <button className="series-sort-button" type="button">最舊到最新</button>
          </div>
        </div>
      </section>
      <section className="series-results"></section>
    </main>
  );
}

export default SeriesPage;
