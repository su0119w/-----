import { Outlet } from "react-router";
import { Suspense } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumb from "./Breadcrumb";
import "../css/layout/AppLayout.css";
import ScrollTop from "./ScrollTo";

function Layout() {
  return (
    <div className="wrapper">
      <ScrollTop />
      <Header />

      <main className="content">
        <Breadcrumb />
        <Suspense
          fallback={
            <div className="page-loading" role="status" aria-live="polite">
              <span className="page-loading-spinner" aria-hidden="true" />
              <p>頁面載入中</p>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
export default Layout;
