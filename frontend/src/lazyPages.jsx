import { lazy } from "react";
const HomePage=lazy(()=>import("./頁面/Home"));
const SeriesPage=lazy(()=>import("./頁面/Series"));
const AccountPage=lazy(()=>import("./頁面/Account"));
const SeriesDetailPage=lazy(()=>import("./頁面/SeriesDetail"));
const SeriesCreatePage=lazy(()=>import("./頁面/SeriesCreate"));
const SeriesEditPage=lazy(()=>import("./頁面/SeriesEdit"));
const GenresAddPage=lazy(()=>import("./頁面/genresAdd"));
const GenresEditPage=lazy(()=>import("./頁面/genresEdit"));
const WorkDetailPage=lazy(()=>import("./頁面/workDetail"));
const ArticlesPage=lazy(()=>import("./頁面/Articles"));
const WorksPage=lazy(()=>import("./頁面/Works"));
const ArticleDetailPage=lazy(()=>import("./頁面/ArticleDetail"));
const SearchPage=lazy(()=>import("./頁面/search"));
const SeasonSchedulePage=lazy(()=>import("./頁面/SeasonSchedule"));
const FooterInfoPage=lazy(()=>import("./頁面/FooterInfo"));
const RouteError=lazy(()=>import("./頁面/RouteError"));
const NotFoundPage=lazy(()=>import("./頁面/NotFoundPage"));
export {
  HomePage,
  SeriesPage,
  AccountPage,
  SeriesDetailPage,
  SeriesCreatePage,
  SeriesEditPage,
  GenresAddPage,
  GenresEditPage,
  WorkDetailPage,
  ArticlesPage,
  WorksPage,
  ArticleDetailPage,
  SearchPage,
  SeasonSchedulePage,
  FooterInfoPage,
  RouteError,
  NotFoundPage,
};