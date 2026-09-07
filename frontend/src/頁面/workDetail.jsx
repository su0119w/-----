import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "../css/work.css"

function WorkDetailPage() {
  const { id } = useParams();
  const [workData, setWorkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`http://localhost:4000/api/works/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("取得作品資料失敗");
        }
        return res.json();
      })
      .then((data) => {
        setWorkData(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <section className="work-section">
      {loading && <p>載入中...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && workData && (
        <div className="work-grid">
          <div className="work-left">
            <img
              src={workData.cover_image_url || "/image/2.webp"}
              alt={workData.title_zh || workData.title_jp}
            />
          </div>
          <div>
          <h2>{workData.title_zh}</h2>
          <p>{workData.title_jp}</p>
          <p>{workData.title_romaji}</p>
          <p>{workData.description}</p>

          </div>
          <div>

          </div>
        </div>
      )}
    </section>
  );
}
export default WorkDetailPage;
