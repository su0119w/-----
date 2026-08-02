import "./App.css";
import { useState, useEffect } from "react";
import Header from "./元件/Header";

function App() {
  const [loading, setLoading] = useState(true);
  const [seriesList, setSeriesList] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("http://localhost:4000/api/series")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("取得動畫系列失敗");
        }
      })
      .then((data) => {
        setSeriesList(data);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
    <Header />
    <main className="glass-panel">
      <h1>動畫資訊站</h1>
      {loading && <p>載入中...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <p>目前共有 {seriesList.length} 個動畫系列</p>
      )}
      <div>
        {seriesList.map((item) => (
          <article key={item.series_id}>
            <h2>{item.title_zh}</h2>
            <p>{item.title_jp}</p>
            <p>作者:{item.author}</p>
            {item.description && <p>簡介：{item.description}</p>}
            <p>{item.status}</p>
          </article>
        ))}
      </div>
    </main>
    </>
  );
}

export default App;
