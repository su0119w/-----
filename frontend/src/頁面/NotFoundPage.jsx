import { Link } from "react-router";
import "../css/pages/RouteError.css";

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <p className="route-error-kicker">404 · PAGE NOT FOUND</p>
        <p className="not-found-code" aria-hidden="true">
          404
        </p>
        <h1>找不到這個頁面</h1>
        <p className="route-error-message">
          你輸入的網址不存在，或頁面已被移動。
        </p>
        <p className="route-error-hint">
          你可以回到首頁繼續探索其他動漫資訊。
        </p>
        <Link className="route-error-home-link" to="/">
          回到首頁
        </Link>
      </section>
    </main>
  );
}
export default NotFoundPage;
