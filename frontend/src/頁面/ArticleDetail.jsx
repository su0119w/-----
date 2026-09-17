import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  const previousArticle = articleData?.previous_article;
  const nextArticle = articleData?.next_article;
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

  const isArticleUpdated =
    articleData?.updated_at &&
    articleData?.published_at &&
    new Date(articleData.updated_at).getTime() >
      new Date(articleData.published_at).getTime();

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
const articleId = articleData?.article_id;
  useEffect(() => {
    if (!articleId || error) {
      return;
    }
    const timerId = window.setTimeout(() => {
      fetch(`${API_BASE_URL}/api/articles/${slug}/view`, {
        method: "POST",
      }).catch((error) => {
        console.log("新增文章瀏覽數失敗", error);
      });
    }, 10000);
    return () => {
      window.clearTimeout(timerId);
    };
  }, [slug, articleId, error]);

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
                {isArticleUpdated && (
                  <time dateTime={articleData.updated_at}>
                    更新/{formatArticleDate(articleData.updated_at)}
                  </time>
                )}
                <span>撰文／{articleData.author_name}</span>
              </div>
              {articleData.summary && (
                <p className="article-summary">{articleData.summary}</p>
              )}
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
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {articleData.content}
                  </ReactMarkdown>
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
            {(previousArticle || nextArticle) && (
              <nav className="article-navigation" aria-label="上下篇文章">
                {previousArticle && (
                  <Link
                    className="article-navigation-link article-navigation-previous"
                    to={`/article/${previousArticle.slug}`}
                  >
                    <span>← 上一篇</span>
                    <strong>{previousArticle.title}</strong>
                  </Link>
                )}

                {nextArticle && (
                  <Link
                    className="article-navigation-link article-navigation-next"
                    to={`/article/${nextArticle.slug}`}
                  >
                    <span>下一篇 →</span>
                    <strong>{nextArticle.title}</strong>
                  </Link>
                )}
              </nav>
            )}
          </div>
        </>
      )}
    </section>
  );
}
export default ArticleDetailPage;
