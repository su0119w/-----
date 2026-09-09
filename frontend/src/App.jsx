import { Routes, Route, Link } from "react-router";
import "./css/layout/AppLayout.css";
import Header from "./元件/Header";
import Footer from "./元件/Footer";
import SeriesPage from "./頁面/Series";
import AccountPage from "./頁面/Account";
import SeriesDetailPage from "./頁面/SeriesDetail";
import Home from "./頁面/Home";
import SeriesCreatePage from "./頁面/SeriesCreate";
import SeriesEditPage from "./頁面/SeriesEdit";
import GenresAddPage from "./頁面/genresAdd";
import GenresEditPage from "./頁面/genresEdit";
import WorkDetailPage from "./頁面/workDetail";
import ArticlesPage from "./頁面/Articles";
import WorksPage from "./頁面/Works";
function App() {
  return (
    <div className="wrapper">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/series/:slug" element={<SeriesDetailPage />} />
          <Route path="/series/new" element={<SeriesCreatePage />} />
          <Route path="/series/:slug/edit" element={<SeriesEditPage />} />
          <Route path="/genres/new" element={<GenresAddPage />} />
          <Route path="/genres/:id/edit" element={<GenresEditPage />} />
          <Route path="/works/:id" element={<WorkDetailPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/works" element={<WorksPage />} />
        </Routes>
        <Link className="random">
        <img src="./image/random.png" alt="random"/>
        </Link>
      </main>
      <Footer />
    </div>
  );
}

export default App;
