import "../css/layout/Header.css";
import { Link, NavLink, useLocation } from "react-router";
function Header() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mediaType = searchParams.get("media_type");
  return (
    <header className="site-header">
      <nav className="site-nav">
        <div className="nav-left">
          <Link to="/" aria-label="前往動漫資訊站首頁">
            <h2>Anime</h2>
          </Link>
          <NavLink to="/seasons">
            <p>季度作品</p>
          </NavLink>
          <Link
            to="/works?media_type=manga"
            className={
              location.pathname === "/works" && mediaType === "manga"
                ? "active"
                : ""
            }
          >
            <p>漫畫小說</p>
          </Link>
          <NavLink to="/series">
            <p>動畫系列</p>
          </NavLink>
          <Link
            to="/works?media_type=anime"
            className={
              location.pathname === "/works" && mediaType === "anime"
                ? "active"
                : ""
            }
          >
            <p>動畫作品</p>
          </Link>
          <NavLink to="/platforms">
            <p>串流平台</p>
          </NavLink>
        </div>

        <div className="nav-right">
          <NavLink to="/search">
            <p>搜尋</p>
          </NavLink>
          <NavLink to="/rankings">
            <p>排名</p>
          </NavLink>

          <div className="nav-item">
            會員(後面是會放頭像)
            <div className="dropdown-icons">
              <NavLink to="/login">
                <div>登入</div>
              </NavLink>
              <NavLink to="/register">
                <div>註冊</div>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
