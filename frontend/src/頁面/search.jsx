import { useEffect } from "react";
function SearchPage() {
  useEffect(() => {
    document.title = "本季新番";
  }, []);
  return(
    <>
    <section>
        <h1>本季新番</h1>
    </section>
    </>
  )
}

export default SearchPage;