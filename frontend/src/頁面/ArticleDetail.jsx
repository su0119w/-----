import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import "../css/pages/ArticleDetail.css";

function ArticleDetailPage() {
  const { slug } = useParams();
  const [articleData, setArticleData] = useState(null);
  const [articleDataloading, setArticleDataLoading] = useState(true);
  const [error, setError] = useState("");
  const relatedSeries = articleData?.related_series ?? [];
  const relatedWorks = articleData?.related_works ?? [];
  const mediaTypeLabels = {
    anime: "動畫",
    manga: "漫畫",
    novel: "小說",
    light_novel: "輕小說",
  };
  const relatedItems = [
    ...relatedSeries.map((item) => ({
      ...item,
      key: `series-${item.series_id}`,
      type_label: "系列",
      to: `/series/${item.slug}`,
    })),
    ...relatedWorks.map((item) => ({
      ...item,
      key: `work-${item.work_id}`,
      type_label: mediaTypeLabels[item.media_type] || "作品",
      to: `/works/${item.work_id}`,
    })),
  ];
  const hasRelatedContent = relatedItems.length > 0;

  function formatArticleDate(dateValue) {
    if (!dateValue) {
      return "發布時間未定";
    }

    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateValue));
  }

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/articles/${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("取得文章失敗");
        }
        return res.json();
      })
      .then((data) => {
        document.title = `${data.title} | 文章`;
        setArticleData(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setArticleDataLoading(false);
      });
  }, [slug]);
  return (
    <section className="article-detail-page">
      {articleDataloading && (
        <p className="article-detail-message">文章載入中...</p>
      )}

      {!articleDataloading && error && (
        <p className="article-detail-message article-detail-error" role="alert">
          {error}
        </p>
      )}

      {!articleDataloading && !error && articleData && (
        <>
          <div className="article-detail-shell">
            <div className="article-top">
              <h1>{articleData.title}</h1>
              <div className="article-meta">
                <span className="article-category">
                  {articleData.category_name}
                </span>
                <time dateTime={articleData.published_at}>
                  {formatArticleDate(articleData.published_at)}
                </time>
                <span>撰文／{articleData.author_name}</span>
              </div>
            </div>
            <div
              className={`article-grid${hasRelatedContent ? "" : " article-grid-no-sidebar"}`}
            >
              <article className="article-main">
                <div className="article-header">
                  <img
                    src={articleData.hero_image_url || "/image/1.jpg"}
                    alt={articleData.hero_image_alt || articleData.title}
                  />
                </div>
                <div className="article-content">
                  {articleData.content}
                </div>
              </article>
              {hasRelatedContent && (
                <aside className="article-sidebar" aria-label="文章相關資料">
                  <section className="article-related-section">
                    <div className="article-related-heading">
                      <div>
                        <span>EXPLORE</span>
                        <h2>相關內容</h2>
                      </div>
                      <span className="article-related-count">
                        {relatedItems.length}
                      </span>
                    </div>

                    <div className="article-related-list">
                      {relatedItems.map((item) => (
                        <Link
                          className="article-related-card"
                          to={item.to}
                          key={item.key}
                        >
                          <img
                            src={item.cover_image_url || "/image/2.webp"}
                            alt={`${item.title_zh || item.title_jp}封面`}
                          />
                          <div>
                            <span className="article-related-type">
                              {item.type_label}
                            </span>
                            <h3>{item.title_zh || item.title_jp}</h3>
                            {item.title_zh && <p>{item.title_jp}</p>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                </aside>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
export default ArticleDetailPage;
