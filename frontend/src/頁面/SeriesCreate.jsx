import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../css/pages/SeriesForm.css";

function SeriesCreatePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    slug: "",
    title_zh: "",
    title_jp: "",
    title_romaji: "",
    description: "",
    cover_image_url: "",
  });
  const [genres, setGenres] = useState([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "新增系列";
    fetch("http://localhost:4000/api/genres")
      .then((res) => {
        if (!res.ok) {
          throw new Error("取得類型資料失敗");
        }
        return res.json();
      })
      .then((data) => {
        setGenres(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  }

  function handleGenreChange(genreId) {
    setSelectedGenreIds((previousGenreIds) => {
      if (previousGenreIds.includes(genreId)) {
        return previousGenreIds.filter((id) => id !== genreId);
      }

      return [...previousGenreIds, genreId];
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/api/series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "新增系列失敗");
      }

      const genreResponse = await fetch(
        `http://localhost:4000/api/series/${data.series_id}/genres`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            genre_ids: selectedGenreIds,
          }),
        },
      );

      const genreData = await genreResponse.json();

      if (!genreResponse.ok) {
        throw new Error(genreData.message || "設定系列類型失敗");
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
      <section className="series-form-panel">
        <header className="series-form-heading">
          <p>COLLECTION</p>
          <h1>新增系列</h1>
          <span>建立系列基本資料，之後再加入動畫、漫畫或小說作品。</span>
        </header>
        <form className="series-form" onSubmit={handleSubmit}>
          <div className="series-form-layout">
            <div className="series-form-fields">
              <div className="form-field form-field-wide">
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
              <div className="form-field form-field-wide">
            <label htmlFor="title_romaji">羅馬字名稱</label>
            <input
              id="title_romaji"
              name="title_romaji"
              type="text"
              value={formData.title_romaji}
              onChange={handleChange}
            />
              </div>
              <div className="form-field form-field-wide">
            <label htmlFor="description">系列簡介</label>
            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
            />
              </div>
              <div className="form-field form-field-wide">
            <label htmlFor="cover_image_url">封面圖片網址</label>
            <input
              id="cover_image_url"
              name="cover_image_url"
              type="url"
              value={formData.cover_image_url}
              onChange={handleChange}
            />
              </div>
              <div className="form-field form-field-wide">
            <label htmlFor="genre">類型</label>
            <div className="genre-flex">
              {genres.map((item) => (
                <label key={item.genre_id} className="genre-option">
                  <input
                    type="checkbox"
                    value={item.genre_id}
                    checked={selectedGenreIds.includes(item.genre_id)}
                    onChange={() => handleGenreChange(item.genre_id)}
                  />
                  <span>{item.name}</span>
                </label>
              ))}
            </div>
              </div>
            </div>

            <aside className="series-cover-preview" aria-label="系列封面預覽">
              <div className="series-cover-preview-heading">
                <span>LIVE PREVIEW</span>
                <p>系列封面</p>
              </div>

              {formData.cover_image_url ? (
                <img
                  src={formData.cover_image_url}
                  alt={formData.title_zh || formData.title_jp || "系列封面預覽"}
                  className="form-img"
                />
              ) : (
                <div className="form-img-placeholder">
                  <span>IMAGE</span>
                  <p>輸入封面圖片網址後，會顯示在這裡。</p>
                </div>
              )}

              <div className="series-cover-preview-copy">
                <h2>{formData.title_zh || "系列中文名稱"}</h2>
                <p>{formData.title_jp || "シリーズタイトル"}</p>
              </div>
            </aside>
          </div>
          
          {error && <p role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "新增中..." : "新增系列"}
          </button>
        </form>
      </section>
    </>
  );
}

export default SeriesCreatePage;
