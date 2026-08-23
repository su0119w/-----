import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import "../css/SeriesForm.css";
function SeriesEditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    slug: "",
    title_zh: "",
    title_jp: "",
    title_romaji: "",
    description: "",
    cover_image_url: "",
  });

  const [series, setSeries] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:4000/api/series/slug/${slug}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("取得系列資料失敗");
        }
        return response.json();
      })
      .then((data) => {
        setSeries(data);

        setFormData({
          slug: data.slug ?? "",
          title_zh: data.title_zh ?? "",
          title_jp: data.title_jp ?? "",
          title_romaji: data.title_romaji ?? "",
          description: data.description ?? "",
          cover_image_url: data.cover_image_url ?? "",
        });
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!series) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:4000/api/series/${series.series_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "修改系列失敗");
      }

      navigate(`/series/${formData.slug}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <main className="series-form-page">
  <section className="series-form-panel">
        <h2>修改系列</h2>
        {loading && <p>載入中...</p>}

{error && !series && <p role="alert">{error}</p>}

{!loading && series && (
        <form className="series-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="slug">網址名稱</label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              placeholder="例如：sousou-no-frieren"
            />
          </div>
          <div className="form-field">
            <label htmlFor="title_zh">中文名稱</label>
            <input
              id="title_zh"
              name="title_zh"
              type="text"
              value={formData.title_zh}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="title_jp">日文名稱</label>
            <input
              id="title_jp"
              name="title_jp"
              type="text"
              value={formData.title_jp}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="title_romaji">羅馬字名稱</label>
            <input
              id="title_romaji"
              name="title_romaji"
              type="text"
              value={formData.title_romaji}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="description">系列簡介</label>
            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="cover_image_url">封面圖片網址</label>
            <input
              id="cover_image_url"
              name="cover_image_url"
              type="url"
              value={formData.cover_image_url}
              onChange={handleChange}
            />
          </div>
          {error && <p role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "儲存中..." : "儲存修改"}
          </button>
        </form>)}
        </section>
      </main>
    </>
  );
}

export default SeriesEditPage;
