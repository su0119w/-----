USE anime_site_db_v2;

START TRANSACTION;

-- 首頁時刻表排版用測試資料：全部安排在台灣時間 2026-10-01 晚間。
INSERT INTO series (slug, title_zh, title_jp, title_romaji, cover_image_url)
VALUES
  ('midnight-observatory-test', '零時觀測站（測試）', '零時観測所（テスト）', 'Midnight Observatory', '/image/1.jpg'),
  ('rainy-night-post-office-test', '雨夜郵局（測試）', '雨夜郵便局（テスト）', 'Rainy Night Post Office', '/image/2.webp'),
  ('echoes-of-the-deep-test', '深海的迴聲（測試）', '深海の残響（テスト）', 'Echoes of the Deep', '/image/1.jpg'),
  ('late-summer-star-map-test', '夏末星圖（測試）', '夏の終わりの星図（テスト）', 'Late Summer Star Map', '/image/2.webp'),
  ('galaxy-repair-shop-test', '銀河修理店（測試）', '銀河修理店（テスト）', 'Galaxy Repair Shop', '/image/1.jpg'),
  ('forest-signal-test', '森林訊號（測試）', '森のシグナル（テスト）', 'Forest Signal', '/image/2.webp')
ON DUPLICATE KEY UPDATE
  title_zh = VALUES(title_zh),
  title_jp = VALUES(title_jp),
  title_romaji = VALUES(title_romaji),
  cover_image_url = VALUES(cover_image_url),
  deleted_at = NULL;

INSERT INTO works (
  series_id, media_type, slug, title_zh, title_jp, title_romaji,
  cover_image_url, status, start_date
)
SELECT
  series_id,
  'anime',
  CONCAT(slug, '-anime'),
  title_zh,
  title_jp,
  title_romaji,
  cover_image_url,
  'ongoing',
  '2026-10-01'
FROM series
WHERE slug IN (
  'midnight-observatory-test',
  'rainy-night-post-office-test',
  'echoes-of-the-deep-test',
  'late-summer-star-map-test',
  'galaxy-repair-shop-test',
  'forest-signal-test'
)
ON DUPLICATE KEY UPDATE
  title_zh = VALUES(title_zh),
  title_jp = VALUES(title_jp),
  title_romaji = VALUES(title_romaji),
  cover_image_url = VALUES(cover_image_url),
  status = VALUES(status),
  start_date = VALUES(start_date),
  end_date = NULL,
  deleted_at = NULL;

INSERT INTO anime_details (
  work_id, media_type, anime_format, release_year, season, episodes
)
SELECT work_id, 'anime', 'tv', 2026, 'fall', 12
FROM works
WHERE slug IN (
  'midnight-observatory-test-anime',
  'rainy-night-post-office-test-anime',
  'echoes-of-the-deep-test-anime',
  'late-summer-star-map-test-anime',
  'galaxy-repair-shop-test-anime',
  'forest-signal-test-anime'
)
ON DUPLICATE KEY UPDATE
  anime_format = VALUES(anime_format),
  release_year = VALUES(release_year),
  season = VALUES(season),
  episodes = VALUES(episodes);

INSERT INTO anime_episode_releases (
  work_id, media_type, platform_id, region_code, episode_number,
  version_type, language_code, original_scheduled_at_utc,
  scheduled_at_utc, status
)
SELECT
  w.work_id,
  'anime',
  1,
  'TW',
  1,
  'sub',
  'zh-TW',
  schedule.scheduled_at_utc,
  schedule.scheduled_at_utc,
  'scheduled'
FROM works AS w
JOIN (
  SELECT 'midnight-observatory-test-anime' AS slug, '2026-10-01 11:30:00' AS scheduled_at_utc
  UNION ALL SELECT 'rainy-night-post-office-test-anime', '2026-10-01 12:00:00'
  UNION ALL SELECT 'echoes-of-the-deep-test-anime', '2026-10-01 12:30:00'
  UNION ALL SELECT 'late-summer-star-map-test-anime', '2026-10-01 14:00:00'
  UNION ALL SELECT 'galaxy-repair-shop-test-anime', '2026-10-01 14:30:00'
  UNION ALL SELECT 'forest-signal-test-anime', '2026-10-01 15:00:00'
) AS schedule
  ON schedule.slug = w.slug
ON DUPLICATE KEY UPDATE
  original_scheduled_at_utc = VALUES(original_scheduled_at_utc),
  scheduled_at_utc = VALUES(scheduled_at_utc),
  status = VALUES(status),
  change_reason = NULL;

COMMIT;
