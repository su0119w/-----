USE anime_site_db_v2;

START TRANSACTION;

-- 首頁「本季新番」的 2026 秋季測試資料。
UPDATE anime_details
SET release_year = 2026,
    season = 'fall'
WHERE work_id IN (14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24);

-- 作品狀態與開播日要和秋季時刻表一致。
UPDATE works
SET status = CASE work_id
    WHEN 15 THEN 'finished'
    WHEN 16 THEN 'upcoming'
    WHEN 17 THEN 'upcoming'
    WHEN 18 THEN 'upcoming'
    ELSE 'ongoing'
  END,
  start_date = CASE work_id
    WHEN 14 THEN '2026-09-28'
    WHEN 15 THEN '2026-09-29'
    WHEN 16 THEN '2026-10-05'
    WHEN 17 THEN '2026-10-09'
    WHEN 18 THEN '2026-10-04'
    WHEN 19 THEN '2026-09-30'
    WHEN 20 THEN '2026-10-01'
    WHEN 21 THEN '2026-10-02'
    WHEN 22 THEN '2026-09-28'
    WHEN 23 THEN '2026-09-29'
    WHEN 24 THEN '2026-10-03'
  END,
  end_date = CASE
    WHEN work_id = 15 THEN '2026-09-29'
    ELSE NULL
  END
WHERE work_id IN (14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24);

-- DATETIME 儲存 UTC；以下是台灣時間 9/28（一）至 10/4（日）的播出資料。
UPDATE anime_episode_releases
SET original_scheduled_at_utc = CASE release_id
      WHEN 7 THEN '2026-09-28 12:00:00'
      WHEN 8 THEN '2026-09-29 12:30:00'
      WHEN 4 THEN '2026-09-30 13:00:00'
      WHEN 5 THEN '2026-10-01 11:00:00'
      WHEN 1 THEN '2026-10-01 13:30:00'
      WHEN 6 THEN '2026-10-02 14:00:00'
      WHEN 9 THEN '2026-10-03 12:00:00'
      WHEN 3 THEN '2026-10-04 13:00:00'
    END,
    scheduled_at_utc = CASE release_id
      WHEN 7 THEN '2026-09-28 12:00:00'
      WHEN 8 THEN '2026-09-29 12:30:00'
      WHEN 4 THEN '2026-09-30 13:00:00'
      WHEN 5 THEN '2026-10-01 11:00:00'
      WHEN 1 THEN '2026-10-01 13:30:00'
      WHEN 6 THEN '2026-10-02 14:00:00'
      WHEN 9 THEN '2026-10-03 12:00:00'
      WHEN 3 THEN '2026-10-04 13:00:00'
    END,
    status = CASE
      WHEN release_id IN (7, 8, 4) THEN 'released'
      ELSE 'scheduled'
    END,
    change_reason = NULL
WHERE release_id IN (1, 3, 4, 5, 6, 7, 8, 9);

COMMIT;
