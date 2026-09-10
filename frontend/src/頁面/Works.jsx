import { useEffect } from "react";
import { useLocation } from "react-router";

const pageTitles = {
  anime: "動畫作品",
  manga: "漫畫・小說",
  novel: "漫畫・小說",
  light_novel: "漫畫・小說",
};

function WorksPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mediaType = searchParams.get("media_type");
  const pageTitle = pageTitles[mediaType] || "作品資訊";

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <main>
      <h1>{pageTitle}</h1>
    </main>
  );
}

export default WorksPage;
