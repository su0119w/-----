import { Link, useRouteError, isRouteErrorResponse } from "react-router";
import "../css/pages/RouteError.css";

function RouteError() {
  const error = useRouteError();
  const isRouteResponse = isRouteErrorResponse(error);
  let errorTitle = "頁面暫時無法顯示";
  let errorMessage = error?.message || "請稍後再試";
  if (isRouteResponse && error.status === 404) {
    errorTitle = "找不到此頁面";
    errorMessage = "這個系列、文章或網址可能不存在，或已被移除。";
  } else if (isRouteResponse && error.status >= 500) {
    errorTitle = "伺服器暫時有問題";
    errorMessage = "我們正在處理問題，請稍後再試。";
  }

  return (
    <main className="route-error-page">
      <section className="route-error-card" role="alert">
        <p className="route-error-kicker">SOMETHING WENT WRONG</p>
        <div className="route-error-icon" aria-hidden="true">
          !
        </div>
        <h1>{errorTitle}</h1>
        <p className="route-error-message">{errorMessage}</p>

        <p className="route-error-hint">你可以回到首頁繼續探索其他動漫資訊。</p>
        <Link className="route-error-home-link" to="/">
          回到首頁
        </Link>
      </section>
    </main>
  );
}
export default RouteError;
