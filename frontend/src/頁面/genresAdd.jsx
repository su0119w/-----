import { useState, useEffect } from "react";
import "../css/pages/Genres.css";
import apiRequest from "../工具/api";


function GenresAddPage() {
  const [genres, setGenres] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "新增類型";
    apiRequest("/api/genres")
      .then((data) => {
        setGenres(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      const data = await apiRequest(`/api/genres`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setGenres((previousGenres) => [
        ...previousGenres,
        {
          genre_id: data.genre_id,
          name: data.name,
        },
      ]);
      setMessage(data.message);
      setFormData({ name: "" });
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleButton(id) {
    setMessage("");
    setError("");
    try {
      const data = await apiRequest(`/api/genres/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setGenres((previousGenres) =>
        previousGenres.filter((genre) => genre.genre_id !== id),
      );
      setMessage(data.message);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <section>
        <h2>新增類型</h2>
        <div className="genres-flex">
          {genres.map((genre) => (
            <div className="genres-card" key={genre.genre_id}>
              <p>{genre.name}</p>
              <button
                type="button"
                className="genre-delete-button"
                onDoubleClick={() => handleButton(genre.genre_id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <form className="series-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">類型名稱</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p role="alert">{error}</p>}
          {message && <p role="status">{message}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "新增中..." : "新增類型"}
          </button>
        </form>
      </section>
    </>
  );
}
export default GenresAddPage;
