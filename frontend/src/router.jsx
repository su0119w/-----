import { createBrowserRouter, Outlet } from "react-router";
import Layout from "./元件/Layout";
import {
  AccountPage,
  ArticleDetailPage,
  ArticlesPage,
  FooterInfoPage,
  GenresAddPage,
  GenresEditPage,
  HomePage,
  NotFoundPage,
  RouteError,
  SearchPage,
  SeasonSchedulePage,
  SeriesCreatePage,
  SeriesDetailPage,
  SeriesEditPage,
  SeriesPage,
  WorkDetailPage,
  WorksPage,
} from "./lazyPages";
import apiRequest from "./工具/api";

async function seriesLoader({ params }) {
  return apiRequest(`/api/series/slug/${params.slug}`);
}

async function workData({ params }) {
  return apiRequest(`/api/works/${params.id}`);
}

async function seriesData({ request }) {
  const url = new URL(request.url);
  const genreId = url.searchParams.get("genre_id");
  const query = genreId ? `?genre_id=${encodeURIComponent(genreId)}` : "";

  return apiRequest(`/api/series${query}`);
}

async function articleLoader({ params }) {
  return apiRequest(`/api/articles/${params.slug}`);
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    handle: { breadcrumb: "首頁" },
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "series",
        element: <Outlet />,
        handle: { breadcrumb: "全部系列" },
        children: [
          {
            id: "seriesData",
            loader: seriesData,
            index: true,
            element: <SeriesPage />,
          },
          {
            path: "new",
            element: <SeriesCreatePage />,
            handle: { breadcrumb: "新增系列" },
          },
          {
            id: "series-detail",
            path: ":slug",
            element: <Outlet />,
            loader: seriesLoader,
            handle: {
              breadcrumb: (match) =>
                match.loaderData?.title_zh ||
                match.loaderData?.title_jp ||
                "系列詳細",
            },
            children: [
              {
                index: true,
                element: <SeriesDetailPage />,
              },
              {
                path: "edit",
                element: <SeriesEditPage />,
                handle: { breadcrumb: "修改系列" },
              },
            ],
          },
        ],
      },
      {
        path: "genres",
        element: <Outlet />,
        handle: { breadcrumb: "類型" },
        children: [
          {
            path: "new",
            element: <GenresAddPage />,
            handle: { breadcrumb: "新增類型" },
          },
          {
            path: ":id",
            element: <Outlet />,
            children: [
              {
                path: "edit",
                element: <GenresEditPage />,
                handle: { breadcrumb: "修改類型" },
              },
            ],
          },
        ],
      },

      {
        path: "works",
        element: <Outlet />,
        handle: { breadcrumb: "全部作品" },
        children: [
          {
            index: true,
            element: <WorksPage />,
          },
          {
            id: "work-data",
            path: ":id",
            loader: workData,
            element: <WorkDetailPage />,
            handle: { breadcrumb: "作品詳細" },
          },
        ],
      },
      {
        path: "articles",
        element: <Outlet />,
        handle: { breadcrumb: "文章" },
        children: [
          {
            index: true,
            element: <ArticlesPage />,
          },
        ],
      },

      {
        path: "article",
        element: <Outlet />,
        handle: { breadcrumb: "文章", breadcrumbTo: "/articles" },
        children: [
          {
            id: "article-detail",
            path: ":slug",
            loader: articleLoader,
            element: <ArticleDetailPage />,
            handle: {
              breadcrumb: (match) => match.loaderData?.title || "文章詳細",
            },
          },
        ],
      },

      {
        path: "seasons",
        element: <SeasonSchedulePage />,
        handle: { breadcrumb: "季度作品" },
      },
      {
        path: "search",
        element: <SearchPage />,
        handle: { breadcrumb: "搜尋" },
      },

      {
        path: "account",
        element: <AccountPage />,
        handle: { breadcrumb: "會員中心" },
      },
      {
        path: "about",
        element: <FooterInfoPage />,
        handle: { breadcrumb: "關於本站" },
      },
      {
        path: "terms",
        element: <FooterInfoPage />,
        handle: { breadcrumb: "帳號使用條款" },
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
