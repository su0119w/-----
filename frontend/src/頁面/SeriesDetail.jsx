import { useParams } from "react-router";
import { useState, useEffect } from "react";
function SeriesDetailPage() {
  const { slug } = useParams();
  const [seriesData, setSeriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
          <section>
            <h1>{seriesData.title_zh || seriesData.title_jp}</h1>
            <p>{seriesData.title_jp}</p>
            <p>{seriesData.title_romaji}</p>
            <p>{seriesData.description}</p>
          </section>
        )}
      </main>
    </>
  );
}
export default SeriesDetailPage;
