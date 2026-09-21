import { Link, useMatches } from "react-router";
import "../css/components/Breadcrumb.css";

function Breadcrumb() {
  const matches = useMatches();
  const breadcrumbs = matches.filter((match) => match.handle?.breadcrumb);
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <>
      <nav className="breadcrumb" aria-label="麵包屑導覽">
        <ol>
          {breadcrumbs.map((match, index) => {
            const breadcrumbTo = match.handle.breadcrumbTo ?? match.pathname;
            const rawBreadcrumb = match.handle.breadcrumb;
            const breadcrumbLabel =
              typeof rawBreadcrumb === "function"
                ? rawBreadcrumb(match)
                : rawBreadcrumb;
            const isLast = index === breadcrumbs.length - 1;
            return (
              <li key={match.id}>
                {isLast ? (
                  <span aria-current="page">{breadcrumbLabel}</span>
                ) : (
                  <Link to={breadcrumbTo}>{breadcrumbLabel}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
export default Breadcrumb;
