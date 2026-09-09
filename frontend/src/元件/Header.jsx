import "../css/layout/Header.css";
import { Link, NavLink, useLocation } from "react-router";
import { useState } from "react";
function Header() {
  const [theme, setTheme] = useState("dark");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mediaType = searchParams.get("media_type");

  function isWorksActive(type) {
    return location.pathname === "/works" && mediaType === type;
  }

  function handleThemeToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
  }
  function handleTOP(){
     window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
  }
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="主要導覽">
        <Link className="site-brand" to="/" aria-label="前往 Anime 資訊站首頁" onClick={handleTOP}>
          <span className="site-brand-copy">
            <img src="/image/logo.png" alt="Anime 資訊站 Logo" />
            <strong>anime</strong>
          </span>
        </Link>

        <ul className="site-nav-links">
          <li>
            <NavLink to="/" end>
              首頁
            </NavLink>
          </li>
          <li>
            <Link to="/#seasonal">本季新番</Link>
          </li>
          <li>
            <Link
              to="/works?media_type=anime"
              className={isWorksActive("anime") ? "active" : ""}
            >
              動畫作品
            </Link>
          </li>
          <li>
            <Link
              to="/works?media_type=manga"
              className={isWorksActive("manga") ? "active" : ""}
            >
              漫畫・小說
            </Link>
          </li>
          <li>
            <NavLink to="/series">系列</NavLink>
          </li>
          <li>
            <NavLink to="/articles">文章</NavLink>
          </li>
        </ul>

        <div className="site-nav-tools">
          <NavLink className="site-nav-tool" to="/search" aria-label="搜尋">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <span>搜尋</span>
          </NavLink>

          <button
            className="theme-toggle"
            type="button"
            onClick={handleThemeToggle}
            aria-label={theme === "dark" ? "切換為淺色模式" : "切換為深色模式"}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <use
                href={`/icons.svg#${theme === "dark" ? "sun-icon" : "moon-icon"}`}
              />
            </svg>
          </button>

          <NavLink className="site-nav-account" to="/account">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20c.8-3.3 3.1-5 7-5s6.2 1.7 7 5" />
            </svg>
            <span>會員</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Header;
