
import { Link } from "react-router";
import "../css/layout/Footer.css";

const socialLinks = [
  { label: "Discord", href: "https://discord.com/", icon: "discord-icon" },
  { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram-icon" },
  { label: "X", href: "https://x.com/", icon: "x-icon" },
];

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <section className="footer-brand" aria-label="網站介紹">
            <Link className="footer-logo" to="/" aria-label="前往 Anime 資訊站首頁">
              <img src="/image/footer.png" alt="Anime 資訊站 Logo" />
              <strong>anime</strong>
            </Link>
            <p>
              為台灣使用者整理動畫、漫畫與小說資訊，探索作品、追蹤新番與正版觀看管道。
            </p>
          </section>

          <section className="footer-links" aria-labelledby="footer-explore-title">
            <h2 id="footer-explore-title">探索內容</h2>
            <Link to="/seasons">本季新番時刻表</Link>
            <Link to="/works?media_type=anime">動畫作品</Link>
            <Link to="/works?media_type=manga">漫畫・小說</Link>
            <Link to="/series">系列資料庫</Link>
            <Link to="/articles">文章</Link>
          </section>

          <section className="footer-links" aria-labelledby="footer-info-title">
            <h2 id="footer-info-title">網站資訊</h2>
            <Link to="/about">關於本站</Link>
            <Link to="/terms">帳號使用條款</Link>
            <Link to="/account">會員中心</Link>
          </section>

          <section className="footer-social" aria-labelledby="footer-social-title">
            <h2 id="footer-social-title">追蹤我們</h2>
            <p>新功能與網站消息會在社群公告。</p>
            <div className="footer-social-links">
              {socialLinks.map((social) => (
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`前往 ${social.label}`}
                  title={social.label}
                  key={social.label}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <use href={`/icons.svg#${social.icon}`} />
                  </svg>
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Anime 資訊站</p>
          <p>Anime, manga, novels, and the stories that connect them.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
