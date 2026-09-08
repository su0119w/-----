import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import "../css/pages/Home.css";

function HomePage() {
  const [series, setSeries] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState("");
  const [articlesLatest, setArticlesLatest] = useState([]);
  const [latestLoading, setLatestLoading] = useState(true);
  const [latestError, setLatestError] = useState("");
  const [currentSeason, setCurrentSeason] = useState({
    year: null,
    month: null,
    season: "",
    works: [],
  });
  const [seasonLoading, setSeasonLoading] = useState(true);
  const [seasonError, setSeasonError] = useState("");
  const [animeReleases, setAnimeReleases] = useState([]);
  const [releasesLoading, setReleasesLoading] = useState(true);
  const [releasesError, setReleasesError] = useState("");
  const currentSeasonSectionRef = useRef(null);
  const [todayAiringHeight, setTodayAiringHeight] = useState(null);

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
    fetch("http://localhost:4000/api/works/current-season")
      .then((res) => {
        if (!res.ok) {
          throw new Error("取得本季動畫失敗");
        }
        return res.json();
      })
      .then((data) => {
        setCurrentSeason(data);
      })
      .catch((error) => {
        setSeasonError(error.message);
      })
      .finally(() => {
        setSeasonLoading(false);
      });
    fetch("http://localhost:4000/api/anime-releases/today")
      .then((res) => {
        if (!res.ok) {
          throw new Error("取得今日新番動畫失敗");
        }
        return res.json();
      })
      .then((data) => {
        setAnimeReleases(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        setReleasesError(error.message);
      })
      .finally(() => {
        setReleasesLoading(false);
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

  useEffect(() => {
    const currentSeasonElement = currentSeasonSectionRef.current;
    const desktopQuery = window.matchMedia("(min-width: 701px)");

    if (!currentSeasonElement) {
      return undefined;
    }

    function updateTodayAiringHeight() {
      if (!desktopQuery.matches) {
        setTodayAiringHeight(null);
        return;
      }

      setTodayAiringHeight(currentSeasonElement.getBoundingClientRect().height);
    }

    const resizeObserver = new ResizeObserver(updateTodayAiringHeight);
    resizeObserver.observe(currentSeasonElement);
    desktopQuery.addEventListener("change", updateTodayAiringHeight);
    updateTodayAiringHeight();

    return () => {
      resizeObserver.disconnect();
      desktopQuery.removeEventListener("change", updateTodayAiringHeight);
    };
  }, [seasonLoading, seasonError, currentSeason.works.length]);

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

  function formatAiringTime(scheduledAtUtc) {
    if (!scheduledAtUtc) {
      return "時間未定";
    }

    return new Intl.DateTimeFormat("zh-TW", {
      timeZone: "Asia/Taipei",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(scheduledAtUtc));
  }

  const seasonLabels = {
    winter: "冬季",
    spring: "春季",
    summer: "夏季",
    fall: "秋季",
  };

  const animeFormatLabels = {
    tv: "TV",
    movie: "劇場版",
    ova: "OVA",
    ona: "ONA",
    special: "特別篇",
  };

  const statusLabels = {
    upcoming: "即將播出",
    ongoing: "播出中",
    finished: "已完結",
    hiatus: "暫停中",
    cancelled: "已取消",
  };

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
          <div className="section-heading-actions">
            <p>掌握近期動漫作品與活動消息</p>
            <Link className="section-more-link" to="/articles">
              查看完整 →
            </Link>
          </div>
        </div>

        {latestLoading && <p className="latest-message">最新文章載入中...</p>}

        {!latestLoading && latestError && (
          <p className="latest-message latest-error">{latestError}</p>
        )}

        {!latestLoading && !latestError && articlesLatest.length === 0 && (
          <p className="latest-message">目前沒有最新文章</p>
        )}

        {articlesLatest.length > 0 && (
          <div className="latest-grid">
            {articlesLatest.slice(0, 8).map((article) => (
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

      <section className="seasonal-home-section">
        <div className="seasonal-home-layout">
          <section
            ref={currentSeasonSectionRef}
            className="current-season-section"
            aria-labelledby="current-season-title"
          >
            <div className="current-season-heading">
              <div className="current-season-title-block">
                <span>SEASONAL ANIME</span>
                <div className="current-season-title-row">
                  <h2 id="current-season-title">
                    {currentSeason.season
                      ? `${seasonLabels[currentSeason.season]}新番`
                      : "本季新番"}
                  </h2>
                  {currentSeason.year && currentSeason.season && (
                    <span className="current-season-badge">
                      {currentSeason.year} {seasonLabels[currentSeason.season]}
                    </span>
                  )}
                </div>
              </div>
              <div className="section-heading-actions">
                <p>依台灣日期自動更新</p>
                <Link
                  className="section-more-link"
                  to="/works?media_type=anime&season=current"
                >
                  查看完整 →
                </Link>
              </div>
            </div>

            {seasonLoading && (
              <p className="current-season-message">本季新番載入中...</p>
            )}

            {!seasonLoading && seasonError && (
              <p className="current-season-message current-season-error">
                {seasonError}
              </p>
            )}

            {!seasonLoading &&
              !seasonError &&
              currentSeason.works.length === 0 && (
                <p className="current-season-message">目前沒有本季新番</p>
              )}

            {!seasonLoading &&
              !seasonError &&
              currentSeason.works.length > 0 && (
                <div className="current-season-grid">
                  {currentSeason.works.slice(0, 10).map((work) => (
                    <Link
                      className="current-season-card-link"
                      to={`/works/${work.work_id}`}
                      key={work.work_id}
                    >
                      <article className="current-season-card">
                        <img
                          src={work.cover_image_url || "/image/1.jpg"}
                          alt={`${work.title_zh || work.title_jp}封面`}
                          loading="lazy"
                        />

                        <div className="current-season-card-content">
                          <div className="current-season-card-meta">
                            <span>
                              {animeFormatLabels[work.anime_format] ||
                                work.anime_format}
                            </span>
                            <span className={`status-${work.status}`}>
                              {statusLabels[work.status] || work.status}
                            </span>
                          </div>
                          <h3>{work.title_zh || work.title_jp}</h3>
                          {work.title_zh && <p>{work.title_jp}</p>}
                          {work.episodes && (
                            <small>全 {work.episodes} 集</small>
                          )}
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
          </section>

          <aside
            className="today-airing-section"
            aria-labelledby="today-airing-title"
            style={
              todayAiringHeight
                ? { height: `${todayAiringHeight}px` }
                : undefined
            }
          >
            <div className="today-airing-heading">
              <span>ON AIR TODAY</span>
              <div className="today-airing-title-row">
                <h2 id="today-airing-title">今天播出</h2>
                <Link
                  className="section-more-link"
                  to="/works?media_type=anime&date=today"
                >
                  查看完整 →
                </Link>
              </div>
              <p>台灣時間</p>
            </div>

            {releasesLoading && (
              <p className="today-airing-message">播出資訊載入中...</p>
            )}

            {!releasesLoading && releasesError && (
              <p className="today-airing-message today-airing-error">
                {releasesError}
              </p>
            )}

            {!releasesLoading &&
              !releasesError &&
              animeReleases.length === 0 && (
                <p className="today-airing-message">今天沒有播出資訊</p>
              )}

            {!releasesLoading && !releasesError && animeReleases.length > 0 && (
              <div className="today-airing-list">
                {animeReleases.map((release) => (
                  <Link
                    className="today-airing-item"
                    to={`/works/${release.work_id}`}
                    key={release.release_id}
                  >
                    <time dateTime={release.scheduled_at_utc}>
                      {formatAiringTime(release.scheduled_at_utc)}
                    </time>
                    <div className="today-airing-cover">
                      <img
                        src={release.cover_image_url || "/image/1.jpg"}
                        alt={`${release.title_zh || release.title_jp}封面`}
                        loading="lazy"
                      />
                    </div>
                    <div className="today-airing-item-content">
                      <h3>{release.title_zh || release.title_jp}</h3>
                        <p>
                          第 {release.episode_number} 集・
                          {release.platform_name}
                        </p>
                        {Boolean(release.is_exclusive) && (
                          <span className="today-airing-exclusive">
                            平台獨占
                          </span>
                        )}
                      </div>

                    <span
                      className={`today-airing-status status-${release.status}`}
                    >
                      {release.status === "released" ? "已播出" : "即將播出"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="section-work">
        <div className="series">
          <div className="series-heading">
            <h2>新收錄系列</h2>
            <Link className="section-more-link" to="/series">
              查看完整 →
            </Link>
          </div>
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
