import Footer from "../元件/Footer";
import Header from "../元件/header";

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section>
            <div className="hero">
                <h2>日本動畫小說漫畫資訊站</h2>
                <p>搜尋日本動畫、小說、漫畫，可管理看過在看和想看的作品。可找到哪平台播出和漫畫小說的書商</p>
            </div>
        </section>
        <section>
            <div>
                <h3>最新動畫</h3>
            </div>
        </section>
        <section>
            <div>
                <h3>最新漫畫</h3>
            </div>
        </section>
        <section>
            <div>
                <h3>最新小說</h3>
            </div>
        </section>
        <section>
            <div>
                <h3>推薦作品</h3>
            </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
