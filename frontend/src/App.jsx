import { Routes, Route } from "react-router";
import "./App.css";
import Header from "./元件/Header";
import Footer from "./元件/Footer";
import SeriesPage from "./頁面/Series";
import AccountPage from "./頁面/Account";
import SeriesDetailPage from "./頁面/SeriesDetail";
import Home from "./頁面/Home";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/series/:slug" element={<SeriesDetailPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
