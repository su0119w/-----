import { useEffect, useState } from "react";
import { useParams } from "react-router";

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
    <section>
      {loading && <p>載入中...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && workData && (
        <div>
          <div>
            <img
              src={workData.cover_image_url || "/image/2.webp"}
              alt={workData.title_zh || workData.title_jp}
            />
          </div>
        </div>
      )}
    </section>
  );
}
export default WorkDetailPage;
