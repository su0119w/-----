import { createBrowserRouter, Outlet } from "react-router";
import Layout from "./元件/Layout";
import HomePage from "./頁面/Home";
import SeriesPage from "./頁面/Series";
import AccountPage from "./頁面/Account";
import SeriesDetailPage from "./頁面/SeriesDetail";
import SeriesCreatePage from "./頁面/SeriesCreate";
import SeriesEditPage from "./頁面/SeriesEdit";
import GenresAddPage from "./頁面/genresAdd";
import GenresEditPage from "./頁面/genresEdit";
import WorkDetailPage from "./頁面/workDetail";
import ArticlesPage from "./頁面/Articles";
import WorksPage from "./頁面/Works";
import ArticleDetailPage from "./頁面/ArticleDetail";
import SearchPage from "./頁面/search";
import SeasonSchedulePage from "./頁面/SeasonSchedule";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
async function seriesLoader({ params }) {
  const response = await fetch(
    `${API_BASE_URL}/api/series/slug/${params.slug}`,
  );
  if (!response.ok) {
    throw new Error("取得系列資料失敗");
  }
  return response.json();
}
async function articleLoader({ params }) {
  const response = await fetch(`
    ${API_BASE_URL}/api/articles/${params.slug}
    `);
  if (!response.ok) {
    throw new Error("取得文章資料失敗");
  }
  return response.json();
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    handle: { breadcrumb: "首頁" },
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
            path: ":id",
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
            element: <ArticleDetailPage />,
            loader: articleLoader,
            handle: {
              breadcrumb: (match) =>
                match.loaderData?.title || "文章詳細",
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
    ],
  },
]);
