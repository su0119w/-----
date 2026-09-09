import { useEffect } from "react";
function TimeSearch() {
  useEffect(() => {
    document.title = "新番時刻表";
  }, []);
  return (
    <>
      <section>
        <h1>新番時刻表</h1>
      </section>
    </>
  );
}
export default TimeSearch;
