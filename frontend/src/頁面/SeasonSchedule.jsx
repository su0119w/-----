import { useEffect } from "react";

function SeasonSchedulePage() {
  useEffect(() => {
    document.title = "本季新番時刻表｜Anime 資訊站";
  }, []);

  return (
    <section>
      <h1>本季新番時刻表</h1>
    </section>
  );
}

export default SeasonSchedulePage;
