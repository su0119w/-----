import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumb from "./Breadcrumb";
import "../css/layout/AppLayout.css";

function Layout() {
  return (
    <div className="wrapper">
      <Header />

      <main className="content">
        <Breadcrumb />
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
export default Layout;
