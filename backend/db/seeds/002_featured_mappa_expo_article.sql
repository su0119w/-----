USE anime_site_db_v2;

SET @article_slug = 'mappa-expo-15th-anniversary-highlights';
SET @hero_image_url = 'https://static.animecorner.me/2026/08/1785922211-e4caa9d80b3f578742fc0d74c4f65b36.jpg';

INSERT INTO users (username, primary_email)
VALUES ('內容管理員', 'content-admin@anime-site.local')
ON DUPLICATE KEY UPDATE
    user_id = LAST_INSERT_ID(user_id),
    username = '內容管理員';

SET @author_user_id = LAST_INSERT_ID();

INSERT INTO article_categories (name, slug)
VALUES ('動畫消息', 'anime-news')
ON DUPLICATE KEY UPDATE
    article_category_id = LAST_INSERT_ID(article_category_id),
    name = '動畫消息';

SET @article_category_id = LAST_INSERT_ID();

INSERT INTO articles (
    author_user_id,
    article_category_id,
    slug,
    title,
    summary,
    content,
    cover_image_url,
    cover_image_alt,
    hero_image_url,
    hero_image_alt,
    status,
    published_at
)
VALUES (
    @author_user_id,
    @article_category_id,
    @article_slug,
    'MAPPA EXPO 15 週年公開《鏈鋸人》《進擊的巨人》《咒術迴戰》等展區亮點',
    NULL,
    '',
    @hero_image_url,
    'MAPPA EXPO 15 週年展覽主視覺',
    @hero_image_url,
    'MAPPA EXPO 15 週年展覽主視覺',
    'published',
    '2026-08-05 17:37:08'
)
ON DUPLICATE KEY UPDATE
    article_id = LAST_INSERT_ID(article_id),
    title = 'MAPPA EXPO 15 週年公開《鏈鋸人》《進擊的巨人》《咒術迴戰》等展區亮點',
    summary = NULL,
    content = '',
    cover_image_url = @hero_image_url,
    cover_image_alt = 'MAPPA EXPO 15 週年展覽主視覺',
    hero_image_url = @hero_image_url,
    hero_image_alt = 'MAPPA EXPO 15 週年展覽主視覺',
    status = 'published',
    published_at = '2026-08-05 17:37:08',
    deleted_at = NULL;

SET @article_id = LAST_INSERT_ID();

INSERT INTO homepage_featured_articles (
    article_id,
    display_order,
    starts_at,
    ends_at,
    created_by_user_id
)
VALUES (
    @article_id,
    2,
    NOW(),
    NULL,
    @author_user_id
)
ON DUPLICATE KEY UPDATE
    display_order = 2,
    starts_at = NOW(),
    ends_at = NULL,
    created_by_user_id = @author_user_id;
