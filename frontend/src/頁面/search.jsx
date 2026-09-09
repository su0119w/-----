import { useEffect } from "react";

function SearchPage() {
  useEffect(() => {
    document.title = "搜尋｜Anime 資訊站";
  }, []);

  return (
    <section>
      <h1>搜尋</h1>
    </section>
  );
}

export default SearchPage;
