import { useEffect, useState } from "react";
import { Link } from "react-router";
import "../css/home.css";

function HomePage() {
  const [series, setSeries] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState("");
  const [articlesLatest, setArticlesLatest] = useState([]);
  const [latestLoading, setLatestLoading] = useState(true);
  const [latestError, setLatestError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/series")
      .then((res) => res.json())
      .then((data) => {
        setSeries(data);
      });
    fetch("http://localhost:4000/api/articles/featured")
      .then((res) => {
        if (!res.ok) {
          throw new Error("取得焦點文章失敗");
        }

        return res.json();
      })
      .then((data) => {
        setArticles(Array.isArray(data) ? data : []);
        setActiveArticleIndex(0);
      })
      .catch((error) => {
        setArticlesError(error.message);
      })
      .finally(() => {
        setArticlesLoading(false);
      });
    fetch("http://localhost:4000/api/articles/latest")
      .then((res) => {
        if (!res.ok) {
          throw new Error("取得最新文章失敗");
        }
        return res.json();
      })
      .then((data) => {
        setArticlesLatest(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        setLatestError(error.message);
      })
      .finally(() => {
        setLatestLoading(false);
      });
  }, []);

  useEffect(() => {
    if (articles.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveArticleIndex(
        (previousIndex) => (previousIndex + 1) % articles.length,
      );
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [articles.length]);

  const activeArticle = articles[activeArticleIndex];

  function showPreviousArticle() {
    setActiveArticleIndex(
      (previousIndex) =>
        (previousIndex - 1 + articles.length) % articles.length,
    );
  }

  function showNextArticle() {
    setActiveArticleIndex(
      (previousIndex) => (previousIndex + 1) % articles.length,
    );
  }

  function formatPublishedDate(publishedAt) {
    if (!publishedAt) {
      return "";
    }

    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(publishedAt));
  }

  return (
    <>
      <section className="featured-section" aria-label="焦點文章">
        {articlesLoading && (
          <p className="featured-message">焦點文章載入中...</p>
        )}

        {!articlesLoading && articlesError && (
          <p className="featured-message featured-error">{articlesError}</p>
        )}

        {!articlesLoading && !articlesError && !activeArticle && (
          <p className="featured-message">目前沒有焦點文章</p>
        )}

        {activeArticle && (
          <div className="featured-carousel">
            <article
              className="featured-article"
              key={activeArticle.article_id}
            >
              <img
                className="featured-image"
                src={activeArticle.hero_image_url}
                alt={activeArticle.hero_image_alt || activeArticle.title}
              />
              <div className="featured-overlay" />

              <div className="featured-content">
                <span className="featured-category">
                  {activeArticle.category_name}
                </span>
                <h1>{activeArticle.title}</h1>
                {activeArticle.summary && <p>{activeArticle.summary}</p>}
              </div>

              {articles.length > 1 && (
                <div className="featured-arrows">
                  <button
                    type="button"
                    onClick={showPreviousArticle}
                    aria-label="上一篇焦點文章"
                  >
                    <p>‹</p>
                  </button>
                  <button
                    type="button"
                    onClick={showNextArticle}
                    aria-label="下一篇焦點文章"
                  >
                    <p>›</p>
                  </button>
                </div>
              )}
            </article>

            {articles.length > 1 && (
              <div className="featured-dots" aria-label="選擇焦點文章">
                {articles.map((article, index) => (
                  <button
                    type="button"
                    className={index === activeArticleIndex ? "active" : ""}
                    onClick={() => setActiveArticleIndex(index)}
                    aria-label={`顯示第 ${index + 1} 篇：${article.title}`}
                    aria-current={
                      index === activeArticleIndex ? "true" : undefined
                    }
                    key={article.article_id}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
      <section className="latest-section" aria-labelledby="latest-title">
        <div className="latest-heading">
          <div>
            <span>NEWS</span>
            <h2 id="latest-title">最新文章</h2>
          </div>
          <p>掌握近期動漫作品與活動消息</p>
        </div>

        {latestLoading && (
          <p className="latest-message">最新文章載入中...</p>
        )}

        {!latestLoading && latestError && (
          <p className="latest-message latest-error">{latestError}</p>
        )}

        {!latestLoading && !latestError && articlesLatest.length === 0 && (
          <p className="latest-message">目前沒有最新文章</p>
        )}

        {articlesLatest.length > 0 && (
          <div className="latest-grid">
            {articlesLatest.map((article) => (
              <article className="latest-card" key={article.article_id}>
                <div className="latest-image-wrap">
                  <img
                    src={article.hero_image_url}
                    alt={article.hero_image_alt || article.title}
                    loading="lazy"
                  />
                  <span>{article.category_name}</span>
                </div>

                <div className="latest-card-content">
                  <time dateTime={article.published_at}>
                    {formatPublishedDate(article.published_at)}
                  </time>
                  <h3>{article.title}</h3>
                  {article.summary && <p>{article.summary}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section-work">
        <div className="series">
          <h2>新番</h2>
          <Link to="/series/new">新增系列</Link>
          <Link to="/genres/new">新增類型</Link>

          <div className="series-display">
            {series.map((item) => (
              <Link
                className="series-card-link"
                to={`/series/${item.slug}`}
                key={item.series_id}
              >
                <article className="series-card">
                  <div className="series-left">
                    <img
                      src={item.cover_image_url || "/image/1.jpg"}
                      alt={`${item.title_zh || item.title_jp}封面`}
                    />
                  </div>
                  <div className="series-right">
                    <h3>{item.title_zh || item.title_jp}</h3>
                    <p>{item.title_jp}</p>
                    {item.title_romaji && <small>{item.title_romaji}</small>}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
