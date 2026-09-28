import { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router";
import "../css/pages/WorkDetail.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const workImageTypeLabels = {
  key_visual: "主視覺",
  gallery: "宣傳圖",
  character: "角色圖",
  screenshot: "場景圖",
};

const mediaTypeLabels = {
  anime: "動畫",
  manga: "漫畫",
  novel: "小說",
  light_novel: "輕小說",
};

const workStatusLabels = {
  upcoming: "尚未開始",
  ongoing: "連載／播出中",
  finished: "已完結",
  hiatus: "暫停中",
  cancelled: "已取消",
};

const animeFormatLabels = {
  tv: "電視動畫",
  movie: "劇場版",
  ova: "OVA",
  ona: "ONA",
  special: "特別篇",
};

const seasonLabels = {
  winter: "冬季",
  spring: "春季",
  summer: "夏季",
  fall: "秋季",
};

function formatWorkDate(value) {
  if (!value) {
    return "尚未公布";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "尚未公布";
  }

  return new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "medium",
    timeZone: "Asia/Taipei",
  }).format(date);
}

function WorkDetailPage() {
  const workData = useRouteLoaderData("work-data");

  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [workImages, setWorkImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [previewImageId, setPreviewImageId] = useState(null);
  const [galleryPage, setGalleryPage] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [imagesError, setImagesError] = useState("");

  const trailerAutoplayUrl = workData.trailer_embed_url
    ? `${workData.trailer_embed_url}?autoplay=1`
    : null;
  const selectedImage =
    workImages.find((image) => image.work_image_id === selectedImageId) ||
    workImages[0];
  const previewImage = workImages.find(
    (image) => image.work_image_id === previewImageId,
  );
  const galleryPageSize = 2;
  const galleryPageCount = Math.ceil(workImages.length / galleryPageSize);
  const visibleGalleryImages = workImages.slice(
    galleryPage * galleryPageSize,
    (galleryPage + 1) * galleryPageSize,
  );
  const commonFacts = [
    {
      label: "媒體類型",
      value: mediaTypeLabels[workData.media_type] || workData.media_type,
    },
    {
      label: "作品狀態",
      value: workStatusLabels[workData.status] || "尚未公布",
    },
    { label: "開始日期", value: formatWorkDate(workData.start_date) },
    {
      label: "結束日期",
      value: workData.end_date
        ? formatWorkDate(workData.end_date)
        : workData.status === "finished"
          ? "尚未公布"
          : "持續中",
    },
  ];
  const formatFacts =
    workData.media_type === "anime"
      ? [
          {
            label: "動畫形式",
            value: animeFormatLabels[workData.anime_format] || "尚未公布",
          },
          {
            label: "播出季度",
            value: workData.release_year
              ? `${workData.release_year} ${seasonLabels[workData.season] || ""}`.trim()
              : "尚未公布",
          },
          {
            label: "集數",
            value: workData.episodes ? `${workData.episodes} 話` : "尚未公布",
          },
          {
            label: "每集長度",
            value: workData.duration_minutes
              ? `約 ${workData.duration_minutes} 分鐘`
              : "尚未公布",
          },
        ]
      : [
          {
            label: "總冊數",
            value: workData.total_volumes
              ? `${workData.total_volumes} 冊`
              : "尚未公布",
          },
        ];
  const externalLinks = [
    { label: "官方網站", href: workData.official_url },
    { label: "資料來源", href: workData.source_url },
    { label: "百科資料", href: workData.wiki_url },
  ].filter((link) => link.href);

  function showAdjacentImage(direction) {
    const currentIndex = workImages.findIndex(
      (image) => image.work_image_id === selectedImage?.work_image_id,
    );
    const nextIndex = (currentIndex + direction + workImages.length) % workImages.length;

    setSelectedImageId(workImages[nextIndex].work_image_id);
  }

  function showGalleryPage(direction) {
    setGalleryPage(
      (previousPage) =>
        (previousPage + direction + galleryPageCount) % galleryPageCount,
    );
    setPreviewImageId(null);
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    document.title = workData.title_zh || workData.title_jp;
  }, [workData]);

  useEffect(() => {
    const controller = new AbortController();

    async function getWorkImages() {
      try {
        setImagesLoading(true);
        setImagesError("");

        const response = await fetch(
          `${API_BASE_URL}/api/works/${workData.work_id}/images`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("取得作品視覺圖失敗");
        }

        const data = await response.json();
        const images = Array.isArray(data) ? data : [];

        setWorkImages(images);
        setSelectedImageId(images[0]?.work_image_id ?? null);
        setPreviewImageId(null);
        setGalleryPage(0);
      } catch (error) {
        if (error.name !== "AbortError") {
          setImagesError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setImagesLoading(false);
        }
      }
    }

    getWorkImages();

    return () => controller.abort();
  }, [workData.work_id]);

  useEffect(() => {
    if (!isTrailerOpen && !isImageOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsTrailerOpen(false);
        setIsImageOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTrailerOpen, isImageOpen]);

  return (
    <section className="work-section">
      {workData && (
        <div className="work-detail">
          <header className="work-header">
            <div className="work-title-group">
              <p className="work-media-type">{workData.media_type}</p>
              <h1>{workData.title_zh || workData.title_jp}</h1>
              <p className="work-title-jp">{workData.title_jp}</p>
              {workData.title_romaji && (
                <p className="work-title-romaji">{workData.title_romaji}</p>
              )}
            </div>
            <aside className="work-actions" aria-label="作品操作">
              <div className="work-rating">
                <p>評分</p>
                <strong>—</strong>
                <span>登入後可評分</span>
              </div>
              <div className="work-action-buttons">
                <button type="button">收藏</button>
                <button type="button">已觀看</button>
              </div>
            </aside>
          </header>

          <div className="work-media">
            <div className="work-poster">
              <div className="work-poster-cover">
                <img
                  key={previewImage?.work_image_id || "work-cover"}
                  src={
                    previewImage?.image_url ||
                    workData.cover_image_url ||
                    "/image/2.webp"
                  }
                  alt={
                    previewImage?.alt_text ||
                    `${workData.title_zh || workData.title_jp} 封面`
                  }
                />
              </div>

              {imagesLoading && (
                <p className="work-images-loading">載入視覺圖中…</p>
              )}

              {imagesError && (
                <p className="work-images-error">{imagesError}</p>
              )}

              {workImages.length > 0 && (
                <section className="work-images" aria-labelledby="work-images-title">
                  <header className="work-images-heading">
                    <p id="work-images-title">作品視覺圖</p>
                    <span>
                      {galleryPage + 1} / {galleryPageCount} 頁
                    </span>
                  </header>

                  <div className="work-images-carousel">
                    <button
                      className="work-images-carousel-button"
                      type="button"
                      aria-label="顯示上一頁視覺圖"
                      disabled={galleryPageCount < 2}
                      onClick={() => showGalleryPage(-1)}
                    >
                      ‹
                    </button>

                    <div
                      className="work-images-thumbnails"
                      aria-label="作品視覺圖"
                      onMouseLeave={() => setPreviewImageId(null)}
                    >
                      {visibleGalleryImages.map((image) => (
                        <button
                          type="button"
                          key={image.work_image_id}
                          aria-label={`放大檢視：${image.alt_text || "作品視覺圖"}（${workImageTypeLabels[image.image_type] || "圖片"}）`}
                          onMouseEnter={() => setPreviewImageId(image.work_image_id)}
                          onFocus={() => setPreviewImageId(image.work_image_id)}
                          onClick={() => {
                            setSelectedImageId(image.work_image_id);
                            setIsImageOpen(true);
                          }}
                        >
                          <img src={image.image_url} alt="" />
                          <span>
                            {workImageTypeLabels[image.image_type] || "圖片"}
                          </span>
                        </button>
                      ))}
                    </div>

                    <button
                      className="work-images-carousel-button"
                      type="button"
                      aria-label="顯示下一頁視覺圖"
                      disabled={galleryPageCount < 2}
                      onClick={() => showGalleryPage(1)}
                    >
                      ›
                    </button>
                  </div>
                </section>
              )}

              {!imagesLoading && !imagesError && workImages.length === 0 && (
                <section
                  className="work-images work-images--empty"
                  aria-labelledby="work-images-empty-title"
                >
                  <header className="work-images-heading">
                    <p id="work-images-empty-title">作品視覺圖</p>
                    <span>0 張</span>
                  </header>
                  <p>目前尚未新增作品視覺圖。</p>
                </section>
              )}
            </div>
            <div className="work-trailer">
              {workData.trailer_embed_url ? (
                <button
                  type="button"
                  aria-label={`播放《${workData.title_zh || workData.title_jp}》預告片`}
                  onClick={() => setIsTrailerOpen(true)}
                >
                  <img
                    src={
                      workData.trailer_thumbnail_url ||
                      workData.cover_image_url ||
                      "/image/2.webp"
                    }
                    alt=""
                  />
                </button>
              ) : (
                <div className="work-trailer-empty">
                  <span className="work-trailer-empty-icon" aria-hidden="true">
                    ▶
                  </span>
                  <p>尚未提供預告片</p>
                  <span>預告公開後會顯示在這裡。</span>
                </div>
              )}
            </div>
            <aside className="work-platforms">
              <p className="work-platforms-label">觀看平台</p>
              <strong>平台資訊準備中</strong>
              <span>之後會顯示台灣可觀看的平台與連結。</span>
            </aside>
          </div>

          <div className="work-content-layout">
            <main className="work-content-main">
              <section className="work-content-section work-description">
                <header className="work-content-heading">
                  <p>作品簡介</p>
                  <h2>關於這部作品</h2>
                </header>
                <p className="work-description-copy">
                  {workData.description || "目前尚未提供作品簡介。"}
                </p>
              </section>

              <section className="work-content-section">
                <header className="work-content-heading">
                  <p>基本資料</p>
                  <h2>作品資訊</h2>
                </header>
                <dl className="work-facts">
                  {[...commonFacts, ...formatFacts].map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="work-content-section">
                <header className="work-content-heading">
                  <p>作品關聯</p>
                  <h2>改編、續作與前作</h2>
                </header>
                <p className="work-empty-state">
                  之後會在這裡顯示原作、改編作品、前傳、續作與外傳。
                </p>
              </section>
            </main>

            <aside className="work-content-aside">
              <section className="work-aside-section">
                <header className="work-aside-heading">
                  <p>延伸資訊</p>
                  <h2>外部連結</h2>
                </header>
                {externalLinks.length > 0 ? (
                  <nav className="work-external-links" aria-label="外部連結">
                    {externalLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>{link.label}</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </nav>
                ) : (
                  <p className="work-aside-empty">尚未提供連結。</p>
                )}
              </section>

              <section className="work-aside-section">
                <header className="work-aside-heading">
                  <p>製作資訊</p>
                  <h2>創作者與公司</h2>
                </header>
                <p className="work-aside-empty">
                  之後會顯示作者、導演、動畫公司與出版社。
                </p>
              </section>
            </aside>
          </div>

          <section className="work-content-section work-related-articles">
            <header className="work-content-heading">
              <p>相關文章</p>
              <h2>更多作品消息</h2>
            </header>
            <p className="work-empty-state">
              之後會顯示與此作品相關的新聞、專訪與公告。
            </p>
          </section>

          {isTrailerOpen && trailerAutoplayUrl && (
            <div
              className="work-media-modal"
              role="presentation"
              onClick={() => setIsTrailerOpen(false)}
            >
              <div
                className="work-media-modal-dialog work-media-modal-dialog--trailer"
                role="dialog"
                aria-modal="true"
                aria-label={`${workData.title_zh || workData.title_jp} 預告片`}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  className="work-media-modal-close"
                  type="button"
                  aria-label="關閉預告片"
                  onClick={() => setIsTrailerOpen(false)}
                >
                  ×
                </button>
                <iframe
                  src={trailerAutoplayUrl}
                  title={`${workData.title_zh || workData.title_jp} 預告片`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          )}

          {isImageOpen && selectedImage && (
            <div
              className="work-media-modal"
              role="presentation"
              onClick={() => setIsImageOpen(false)}
            >
              <div
                className="work-media-modal-dialog work-media-modal-dialog--image"
                role="dialog"
                aria-modal="true"
                aria-label={selectedImage.alt_text || "作品視覺圖"}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  className="work-media-modal-close"
                  type="button"
                  aria-label="關閉圖片"
                  onClick={() => setIsImageOpen(false)}
                >
                  ×
                </button>
                {workImages.length > 1 && (
                  <>
                    <button
                      className="work-media-modal-image-nav work-media-modal-image-nav--previous"
                      type="button"
                      aria-label="查看上一張圖片"
                      onClick={() => showAdjacentImage(-1)}
                    >
                      ‹
                    </button>
                    <button
                      className="work-media-modal-image-nav work-media-modal-image-nav--next"
                      type="button"
                      aria-label="查看下一張圖片"
                      onClick={() => showAdjacentImage(1)}
                    >
                      ›
                    </button>
                    <p className="work-media-modal-image-count">
                      {workImages.findIndex(
                        (image) => image.work_image_id === selectedImage.work_image_id,
                      ) + 1} / {workImages.length}
                    </p>
                  </>
                )}
                <p className="work-media-modal-image-type">
                  {workImageTypeLabels[selectedImage.image_type] || "圖片"}
                </p>
                <img src={selectedImage.image_url} alt={selectedImage.alt_text || "作品視覺圖"} />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
export default WorkDetailPage;
