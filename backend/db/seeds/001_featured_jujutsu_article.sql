USE anime_site_db_v2;

SET @article_slug = 'jujutsu-kaisen-yuta-rika-final-exhibition-art';
SET @hero_image_url = 'https://static.animecorner.me/2026/08/1788081866-a7703891cc712f78695a21d4fb54dcd6.png';

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
    '《咒術迴戰》芥見下下繪製乙骨憂太與里香全新插圖',
    NULL,
    '',
    @hero_image_url,
    '《咒術迴戰》乙骨憂太與里香新插圖',
    @hero_image_url,
    '《咒術迴戰》乙骨憂太與里香新插圖',
    'published',
    '2026-08-30 17:27:01'
)
ON DUPLICATE KEY UPDATE
    article_id = LAST_INSERT_ID(article_id),
    title = '《咒術迴戰》芥見下下繪製乙骨憂太與里香全新插圖',
    summary = NULL,
    content = '',
    cover_image_url = @hero_image_url,
    cover_image_alt = '《咒術迴戰》乙骨憂太與里香新插圖',
    hero_image_url = @hero_image_url,
    hero_image_alt = '《咒術迴戰》乙骨憂太與里香新插圖',
    status = 'published',
    published_at = '2026-08-30 17:27:01',
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
    1,
    NOW(),
    NULL,
    @author_user_id
)
ON DUPLICATE KEY UPDATE
    display_order = 1,
    starts_at = NOW(),
    ends_at = NULL,
    created_by_user_id = @author_user_id;
