USE anime_site_db_v2;

START TRANSACTION;

-- The Ribbon Hero
INSERT INTO series (slug, title_zh, title_jp, title_romaji, cover_image_url)
VALUES (
    'the-ribbon-hero',
    'The Ribbon Hero',
    'リボンヒーロー',
    'THE RIBBON HERO',
    'https://static.animecorner.me/2026/04/1776945918-ba3d99b838df859d4026b82cfff74386.jpg'
)
ON DUPLICATE KEY UPDATE
    series_id = LAST_INSERT_ID(series_id),
    title_zh = VALUES(title_zh),
    title_jp = VALUES(title_jp),
    title_romaji = VALUES(title_romaji),
    cover_image_url = VALUES(cover_image_url),
    deleted_at = NULL;

SET @ribbon_hero_series_id = LAST_INSERT_ID();

INSERT INTO works (
    series_id, media_type, slug, title_zh, title_jp, title_romaji,
    cover_image_url, status, start_date, end_date, official_url, source_url
)
VALUES (
    @ribbon_hero_series_id, 'anime', 'the-ribbon-hero-ona', 'The Ribbon Hero',
    'リボンヒーロー', 'THE RIBBON HERO',
    'https://static.animecorner.me/2026/04/1776945918-ba3d99b838df859d4026b82cfff74386.jpg',
    'finished', '2026-08-08', '2026-08-08', 'https://www.theribbonhero.com/',
    'https://animecorner.me/db/anime/the-ribbon-hero'
)
ON DUPLICATE KEY UPDATE
    work_id = LAST_INSERT_ID(work_id), series_id = VALUES(series_id),
    title_zh = VALUES(title_zh), title_jp = VALUES(title_jp),
    title_romaji = VALUES(title_romaji), cover_image_url = VALUES(cover_image_url),
    status = VALUES(status), start_date = VALUES(start_date), end_date = VALUES(end_date),
    official_url = VALUES(official_url), source_url = VALUES(source_url), deleted_at = NULL;

SET @ribbon_hero_work_id = LAST_INSERT_ID();

INSERT INTO anime_details (
    work_id, media_type, anime_format, release_year, season, episodes
)
VALUES (@ribbon_hero_work_id, 'anime', 'ona', 2026, 'summer', 1)
ON DUPLICATE KEY UPDATE
    anime_format = VALUES(anime_format), release_year = VALUES(release_year),
    season = VALUES(season), episodes = VALUES(episodes);

-- 劇場版 魔法少女小圓〈瓦爾普吉斯之迴天〉
INSERT INTO series (slug, title_zh, title_jp, title_romaji, cover_image_url)
VALUES (
    'puella-magi-madoka-magica',
    '魔法少女小圓',
    '魔法少女まどか☆マギカ',
    'Mahou Shoujo Madoka Magica',
    'https://static.animecorner.me/2026/06/1782382125-1b1fc95eef19cd4e1cf76a3f13479c8f.jpg'
)
ON DUPLICATE KEY UPDATE
    series_id = LAST_INSERT_ID(series_id), title_zh = VALUES(title_zh),
    title_jp = VALUES(title_jp), title_romaji = VALUES(title_romaji),
    cover_image_url = VALUES(cover_image_url), deleted_at = NULL;

SET @madoka_series_id = LAST_INSERT_ID();

INSERT INTO works (
    series_id, media_type, slug, title_zh, title_jp, title_romaji,
    cover_image_url, status, start_date, official_url, source_url
)
VALUES (
    @madoka_series_id, 'anime', 'madoka-magica-walpurgisnacht-rising',
    '劇場版 魔法少女小圓〈瓦爾普吉斯之迴天〉',
    '劇場版 魔法少女まどか☆マギカ〈ワルプルギスの廻天〉',
    'Mahou Shoujo Madoka Magica Movie 4: Walpurgis no Kaiten',
    'https://static.animecorner.me/2026/06/1782382125-1b1fc95eef19cd4e1cf76a3f13479c8f.jpg',
    'upcoming', '2026-08-28', 'https://www.madoka-magica.com/',
    'https://animecorner.me/db/anime/puella-magi-madoka-magica-the-movie-walpurgisnacht-rising'
)
ON DUPLICATE KEY UPDATE
    work_id = LAST_INSERT_ID(work_id), series_id = VALUES(series_id),
    title_zh = VALUES(title_zh), title_jp = VALUES(title_jp),
    title_romaji = VALUES(title_romaji), cover_image_url = VALUES(cover_image_url),
    status = VALUES(status), start_date = VALUES(start_date),
    official_url = VALUES(official_url), source_url = VALUES(source_url), deleted_at = NULL;

SET @madoka_work_id = LAST_INSERT_ID();

INSERT INTO anime_details (
    work_id, media_type, anime_format, release_year, season, episodes
)
VALUES (@madoka_work_id, 'anime', 'movie', 2026, 'summer', 1)
ON DUPLICATE KEY UPDATE
    anime_format = VALUES(anime_format), release_year = VALUES(release_year),
    season = VALUES(season), episodes = VALUES(episodes);

-- Though I Am an Inept Villainess
INSERT INTO series (slug, title_zh, title_jp, title_romaji, cover_image_url)
VALUES (
    'though-i-am-an-inept-villainess',
    'Though I Am an Inept Villainess',
    'ふつつかな悪女ではございますが ～雛宮蝶鼠とりかえ伝～',
    'Futsutsuka na Akujo de wa Gozaimasu ga: Suuguu Chouso Torikae Den',
    'https://static.animecorner.me/2025/03/1742206140-981e417e7260afaed9f0f7a351054082.jpg'
)
ON DUPLICATE KEY UPDATE
    series_id = LAST_INSERT_ID(series_id), title_zh = VALUES(title_zh),
    title_jp = VALUES(title_jp), title_romaji = VALUES(title_romaji),
    cover_image_url = VALUES(cover_image_url), deleted_at = NULL;

SET @inept_villainess_series_id = LAST_INSERT_ID();

INSERT INTO works (
    series_id, media_type, slug, title_zh, title_jp, title_romaji,
    cover_image_url, status, start_date, official_url, source_url
)
VALUES (
    @inept_villainess_series_id, 'anime', 'though-i-am-an-inept-villainess-anime',
    'Though I Am an Inept Villainess',
    'ふつつかな悪女ではございますが ～雛宮蝶鼠とりかえ伝～',
    'Futsutsuka na Akujo de wa Gozaimasu ga: Suuguu Chouso Torikae Den',
    'https://static.animecorner.me/2025/03/1742206140-981e417e7260afaed9f0f7a351054082.jpg',
    'ongoing', '2026-07-12', 'https://futsutsuka.net/',
    'https://animecorner.me/db/anime/though-i-am-an-inept-villainess'
)
ON DUPLICATE KEY UPDATE
    work_id = LAST_INSERT_ID(work_id), series_id = VALUES(series_id),
    title_zh = VALUES(title_zh), title_jp = VALUES(title_jp),
    title_romaji = VALUES(title_romaji), cover_image_url = VALUES(cover_image_url),
    status = VALUES(status), start_date = VALUES(start_date),
    official_url = VALUES(official_url), source_url = VALUES(source_url), deleted_at = NULL;

SET @inept_villainess_work_id = LAST_INSERT_ID();

INSERT INTO anime_details (
    work_id, media_type, anime_format, release_year, season, episodes
)
VALUES (@inept_villainess_work_id, 'anime', 'tv', 2026, 'summer', 11)
ON DUPLICATE KEY UPDATE
    anime_format = VALUES(anime_format), release_year = VALUES(release_year),
    season = VALUES(season), episodes = VALUES(episodes);

-- Clevatess Season 2
INSERT INTO series (slug, title_zh, title_jp, title_romaji, cover_image_url)
VALUES (
    'clevatess',
    'Clevatess',
    'クレバテス',
    'Clevatess',
    'https://static.animecorner.me/2026/04/1777368976-f640c3b53811b6baaa4ec859f8f3f61c.jpg'
)
ON DUPLICATE KEY UPDATE
    series_id = LAST_INSERT_ID(series_id), title_zh = VALUES(title_zh),
    title_jp = VALUES(title_jp), title_romaji = VALUES(title_romaji),
    cover_image_url = VALUES(cover_image_url), deleted_at = NULL;

SET @clevatess_series_id = LAST_INSERT_ID();

INSERT INTO works (
    series_id, media_type, slug, title_zh, title_jp, title_romaji,
    cover_image_url, status, start_date, official_url, source_url
)
VALUES (
    @clevatess_series_id, 'anime', 'clevatess-season-2', 'Clevatess Season 2',
    'クレバテスⅡ-魔獣の王と偽りの勇者伝承-',
    'Clevatess II: Majuu no Ou to Itsuwari no Yuusha Denshou',
    'https://static.animecorner.me/2026/04/1777368976-f640c3b53811b6baaa4ec859f8f3f61c.jpg',
    'ongoing', '2026-07-08', 'https://clevatess.com/',
    'https://animecorner.me/db/anime/clevatess-season-ii'
)
ON DUPLICATE KEY UPDATE
    work_id = LAST_INSERT_ID(work_id), series_id = VALUES(series_id),
    title_zh = VALUES(title_zh), title_jp = VALUES(title_jp),
    title_romaji = VALUES(title_romaji), cover_image_url = VALUES(cover_image_url),
    status = VALUES(status), start_date = VALUES(start_date),
    official_url = VALUES(official_url), source_url = VALUES(source_url), deleted_at = NULL;

SET @clevatess_work_id = LAST_INSERT_ID();

INSERT INTO anime_details (
    work_id, media_type, anime_format, release_year, season, episodes
)
VALUES (@clevatess_work_id, 'anime', 'tv', 2026, 'summer', 13)
ON DUPLICATE KEY UPDATE
    anime_format = VALUES(anime_format), release_year = VALUES(release_year),
    season = VALUES(season), episodes = VALUES(episodes);

-- Red River
INSERT INTO series (slug, title_zh, title_jp, title_romaji, cover_image_url)
VALUES (
    'red-river',
    'Red River',
    '天は赤い河のほとり',
    'Sora wa Akai Kawa no Hotori',
    'https://static.animecorner.me/2026/02/1771167023-95f6813c127dbd26b9b6c8a073f9b415.jpg'
)
ON DUPLICATE KEY UPDATE
    series_id = LAST_INSERT_ID(series_id), title_zh = VALUES(title_zh),
    title_jp = VALUES(title_jp), title_romaji = VALUES(title_romaji),
    cover_image_url = VALUES(cover_image_url), deleted_at = NULL;

SET @red_river_series_id = LAST_INSERT_ID();

INSERT INTO works (
    series_id, media_type, slug, title_zh, title_jp, title_romaji,
    cover_image_url, status, start_date, official_url, source_url
)
VALUES (
    @red_river_series_id, 'anime', 'red-river-anime', 'Red River',
    '天は赤い河のほとり', 'Sora wa Akai Kawa no Hotori',
    'https://static.animecorner.me/2026/02/1771167023-95f6813c127dbd26b9b6c8a073f9b415.jpg',
    'ongoing', '2026-07-07', 'https://www.vap.co.jp/',
    'https://animecorner.me/db/anime/red-river'
)
ON DUPLICATE KEY UPDATE
    work_id = LAST_INSERT_ID(work_id), series_id = VALUES(series_id),
    title_zh = VALUES(title_zh), title_jp = VALUES(title_jp),
    title_romaji = VALUES(title_romaji), cover_image_url = VALUES(cover_image_url),
    status = VALUES(status), start_date = VALUES(start_date),
    official_url = VALUES(official_url), source_url = VALUES(source_url), deleted_at = NULL;

SET @red_river_work_id = LAST_INSERT_ID();

INSERT INTO anime_details (
    work_id, media_type, anime_format, release_year, season, episodes
)
VALUES (@red_river_work_id, 'anime', 'tv', 2026, 'summer', 24)
ON DUPLICATE KEY UPDATE
    anime_format = VALUES(anime_format), release_year = VALUES(release_year),
    season = VALUES(season), episodes = VALUES(episodes);

COMMIT;
