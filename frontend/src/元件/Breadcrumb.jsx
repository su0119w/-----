import { Link, useLocation } from "react-router";
import "../css/components/Breadcrumb.css";

function getBreadcrumbItems(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const items = [{ label: "首頁", to: "/" }];

  if (segments.length === 0) {
    return [];
  }

  const [section, detail, action] = segments;

  if (section === "series") {
    items.push({ label: "系列", to: "/series" });
    if (detail === "new") items.push({ label: "新增系列" });
    if (detail && detail !== "new") items.push({ label: "系列詳細" });
    if (action === "edit") items.push({ label: "修改系列" });
  } else if (section === "works") {
    items.push({ label: "作品", to: "/works" });
    if (detail) items.push({ label: "作品詳細" });
  } else if (section === "articles") {
    items.push({ label: "文章" });
  } else if (section === "article") {
    items.push({ label: "文章", to: "/articles" });
    items.push({ label: "文章詳細" });
  } else if (section === "seasons") {
    items.push({ label: "本季新番時刻表" });
  } else if (section === "search") {
    items.push({ label: "搜尋" });
  } else if (section === "account") {
    items.push({ label: "會員中心" });
  } else if (section === "genres") {
    items.push({ label: "類型" });
    items.push({ label: detail === "new" ? "新增類型" : "修改類型" });
  }

  return items;
}

function Breadcrumb() {
  const { pathname } = useLocation();
  const items = getBreadcrumbItems(pathname);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="breadcrumb" aria-label="麵包屑導覽">
      <ol>
        {items.map((item, index) => {
          const isCurrentPage = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`}>
              {isCurrentPage || !item.to ? (
                <span aria-current={isCurrentPage ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.to}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
