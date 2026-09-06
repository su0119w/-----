USE anime_site_db_v2;

START TRANSACTION;

-- 2026 夏季動畫 1：BLACK TORCH
INSERT INTO series (
    slug,
    title_zh,
    title_jp,
    title_romaji,
    description,
    cover_image_url
)
VALUES (
    'black-torch',
    'BLACK TORCH',
    'ブラックトーチ',
    'BLACK TORCH',
    '能與動物溝通的少年我妻彌次郎，因為與神祕黑貓融合而獲得力量，並被捲入人類與妖怪之間的衝突。',
    'https://static.animecorner.me/2026/06/1780651734-5504b82446c18e7b5e41d682352dbb15.jpg'
)
ON DUPLICATE KEY UPDATE
    series_id = LAST_INSERT_ID(series_id),
    title_zh = VALUES(title_zh),
    title_jp = VALUES(title_jp),
    title_romaji = VALUES(title_romaji),
    description = VALUES(description),
    cover_image_url = VALUES(cover_image_url),
    deleted_at = NULL;

SET @black_torch_series_id = LAST_INSERT_ID();

INSERT INTO works (
    series_id,
    media_type,
    slug,
    title_zh,
    title_jp,
    title_romaji,
    description,
    cover_image_url,
    status,
    start_date,
    end_date,
    official_url,
    wiki_url,
    source_url
)
VALUES (
    @black_torch_series_id,
    'anime',
    'black-torch-anime',
    'BLACK TORCH',
    'ブラックトーチ',
    'BLACK TORCH',
    '能與動物溝通的少年我妻彌次郎，因為與神祕黑貓融合而獲得力量，並被捲入人類與妖怪之間的衝突。',
    'https://static.animecorner.me/2026/06/1780651734-5504b82446c18e7b5e41d682352dbb15.jpg',
    'ongoing',
    '2026-07-04',
    NULL,
    'https://blacktorch-anime.com/',
    NULL,
    'https://animecorner.me/db/anime/black-torch'
)
ON DUPLICATE KEY UPDATE
    work_id = LAST_INSERT_ID(work_id),
    series_id = VALUES(series_id),
    title_zh = VALUES(title_zh),
    title_jp = VALUES(title_jp),
    title_romaji = VALUES(title_romaji),
    description = VALUES(description),
    cover_image_url = VALUES(cover_image_url),
    status = VALUES(status),
    start_date = VALUES(start_date),
    end_date = VALUES(end_date),
    official_url = VALUES(official_url),
    source_url = VALUES(source_url),
    deleted_at = NULL;

SET @black_torch_work_id = LAST_INSERT_ID();

INSERT INTO anime_details (
    work_id,
    media_type,
    anime_format,
    release_year,
    season,
    episodes,
    duration_minutes
)
VALUES (
    @black_torch_work_id,
    'anime',
    'tv',
    2026,
    'summer',
    NULL,
    NULL
)
ON DUPLICATE KEY UPDATE
    anime_format = VALUES(anime_format),
    release_year = VALUES(release_year),
    season = VALUES(season),
    episodes = VALUES(episodes),
    duration_minutes = VALUES(duration_minutes);

-- 2026 夏季動畫 2：We Are Aliens
INSERT INTO series (
    slug,
    title_zh,
    title_jp,
    title_romaji,
    description,
    cover_image_url
)
VALUES (
    'we-are-aliens',
    'We Are Aliens',
    '我々は宇宙人',
    'Wareware wa Uchuujin',
    NULL,
    'https://static.animecorner.me/2026/08/1787232591-33076239a4aa253640ecad7beaafccba.jpg'
)
ON DUPLICATE KEY UPDATE
    series_id = LAST_INSERT_ID(series_id),
    title_zh = VALUES(title_zh),
    title_jp = VALUES(title_jp),
    title_romaji = VALUES(title_romaji),
    description = VALUES(description),
    cover_image_url = VALUES(cover_image_url),
    deleted_at = NULL;

SET @we_are_aliens_series_id = LAST_INSERT_ID();

INSERT INTO works (
    series_id,
    media_type,
    slug,
    title_zh,
    title_jp,
    title_romaji,
    description,
    cover_image_url,
    status,
    start_date,
    end_date,
    official_url,
    wiki_url,
    source_url
)
VALUES (
    @we_are_aliens_series_id,
    'anime',
    'we-are-aliens-movie',
    'We Are Aliens',
    '我々は宇宙人',
    'Wareware wa Uchuujin',
    NULL,
    'https://static.animecorner.me/2026/08/1787232591-33076239a4aa253640ecad7beaafccba.jpg',
    'upcoming',
    '2026-09-24',
    NULL,
    'https://nothingnew.film/',
    NULL,
    'https://animecorner.me/db/anime/we-are-aliens'
)
ON DUPLICATE KEY UPDATE
    work_id = LAST_INSERT_ID(work_id),
    series_id = VALUES(series_id),
    title_zh = VALUES(title_zh),
    title_jp = VALUES(title_jp),
    title_romaji = VALUES(title_romaji),
    description = VALUES(description),
    cover_image_url = VALUES(cover_image_url),
    status = VALUES(status),
    start_date = VALUES(start_date),
    end_date = VALUES(end_date),
    official_url = VALUES(official_url),
    source_url = VALUES(source_url),
    deleted_at = NULL;

SET @we_are_aliens_work_id = LAST_INSERT_ID();

INSERT INTO anime_details (
    work_id,
    media_type,
    anime_format,
    release_year,
    season,
    episodes,
    duration_minutes
)
VALUES (
    @we_are_aliens_work_id,
    'anime',
    'movie',
    2026,
    'summer',
    1,
    NULL
)
ON DUPLICATE KEY UPDATE
    anime_format = VALUES(anime_format),
    release_year = VALUES(release_year),
    season = VALUES(season),
    episodes = VALUES(episodes),
    duration_minutes = VALUES(duration_minutes);

COMMIT;
