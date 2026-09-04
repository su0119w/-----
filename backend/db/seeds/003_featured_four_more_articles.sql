USE anime_site_db_v2;

SET @author_user_id = (
    SELECT user_id
    FROM users
    WHERE primary_email = 'content-admin@anime-site.local'
    LIMIT 1
);

SET @article_category_id = (
    SELECT article_category_id
    FROM article_categories
    WHERE slug = 'anime-news'
    LIMIT 1
);

SET @article_slug = 'jujutsu-kaisen-season-4-new-teaser-visual';
SET @hero_image_url = 'https://static.animecorner.me/2026/07/1783019594-9febf163d2a2faa3bcb6f5bdd83dd080.png';

INSERT INTO articles (
    author_user_id, article_category_id, slug, title, summary, content,
    cover_image_url, cover_image_alt, hero_image_url, hero_image_alt,
    status, published_at
)
VALUES (
    @author_user_id,
    @article_category_id,
    @article_slug,
    '《咒術迴戰》第四季公開全新前導視覺，死滅洄游篇 Part 2 再掀話題',
    NULL,
    '',
    @hero_image_url,
    '《咒術迴戰》第四季全新前導視覺',
    @hero_image_url,
    '《咒術迴戰》第四季全新前導視覺',
    'published',
    '2026-08-29 17:26:07'
)
ON DUPLICATE KEY UPDATE
    article_id = LAST_INSERT_ID(article_id),
    title = '《咒術迴戰》第四季公開全新前導視覺，死滅洄游篇 Part 2 再掀話題',
    summary = NULL,
    content = '',
    cover_image_url = @hero_image_url,
    cover_image_alt = '《咒術迴戰》第四季全新前導視覺',
    hero_image_url = @hero_image_url,
    hero_image_alt = '《咒術迴戰》第四季全新前導視覺',
    status = 'published',
    published_at = '2026-08-29 17:26:07',
    deleted_at = NULL;

SET @article_id = LAST_INSERT_ID();

INSERT INTO homepage_featured_articles (
    article_id, display_order, starts_at, ends_at, created_by_user_id
)
VALUES (@article_id, 3, NOW(), NULL, @author_user_id)
ON DUPLICATE KEY UPDATE
    display_order = 3,
    starts_at = NOW(),
    ends_at = NULL,
    created_by_user_id = @author_user_id;

SET @article_slug = 'kagurabachi-author-draws-sukuna';
SET @hero_image_url = 'https://static.animecorner.me/2026/08/1786376431-8880fec33497235e1fbb8b855d430ad1.png';

INSERT INTO articles (
    author_user_id, article_category_id, slug, title, summary, content,
    cover_image_url, cover_image_alt, hero_image_url, hero_image_alt,
    status, published_at
)
VALUES (
    @author_user_id,
    @article_category_id,
    @article_slug,
    '《神樂鉢》作者外薗健繪製《咒術迴戰》宿儺特別插圖',
    NULL,
    '',
    @hero_image_url,
    '外薗健繪製的《咒術迴戰》宿儺特別插圖',
    @hero_image_url,
    '外薗健繪製的《咒術迴戰》宿儺特別插圖',
    'published',
    '2026-08-10 23:46:07'
)
ON DUPLICATE KEY UPDATE
    article_id = LAST_INSERT_ID(article_id),
    title = '《神樂鉢》作者外薗健繪製《咒術迴戰》宿儺特別插圖',
    summary = NULL,
    content = '',
    cover_image_url = @hero_image_url,
    cover_image_alt = '外薗健繪製的《咒術迴戰》宿儺特別插圖',
    hero_image_url = @hero_image_url,
    hero_image_alt = '外薗健繪製的《咒術迴戰》宿儺特別插圖',
    status = 'published',
    published_at = '2026-08-10 23:46:07',
    deleted_at = NULL;

SET @article_id = LAST_INSERT_ID();

INSERT INTO homepage_featured_articles (
    article_id, display_order, starts_at, ends_at, created_by_user_id
)
VALUES (@article_id, 4, NOW(), NULL, @author_user_id)
ON DUPLICATE KEY UPDATE
    display_order = 4,
    starts_at = NOW(),
    ends_at = NULL,
    created_by_user_id = @author_user_id;

SET @article_slug = 'mappa-new-illustrations-before-15th-anniversary-expo';
SET @hero_image_url = 'https://static.animecorner.me/2026/08/1785588928-7fea0f35e1529c6300683191afc6fb2c-1024x576.png';

INSERT INTO articles (
    author_user_id, article_category_id, slug, title, summary, content,
    cover_image_url, cover_image_alt, hero_image_url, hero_image_alt,
    status, published_at
)
VALUES (
    @author_user_id,
    @article_category_id,
    @article_slug,
    'MAPPA 15 週年前夕公開《咒術迴戰》《鏈鋸人》《進擊的巨人》新插圖',
    NULL,
    '',
    @hero_image_url,
    'MAPPA 15 週年作品新插圖',
    @hero_image_url,
    'MAPPA 15 週年作品新插圖',
    'published',
    '2026-08-01 20:59:36'
)
ON DUPLICATE KEY UPDATE
    article_id = LAST_INSERT_ID(article_id),
    title = 'MAPPA 15 週年前夕公開《咒術迴戰》《鏈鋸人》《進擊的巨人》新插圖',
    summary = NULL,
    content = '',
    cover_image_url = @hero_image_url,
    cover_image_alt = 'MAPPA 15 週年作品新插圖',
    hero_image_url = @hero_image_url,
    hero_image_alt = 'MAPPA 15 週年作品新插圖',
    status = 'published',
    published_at = '2026-08-01 20:59:36',
    deleted_at = NULL;

SET @article_id = LAST_INSERT_ID();

INSERT INTO homepage_featured_articles (
    article_id, display_order, starts_at, ends_at, created_by_user_id
)
VALUES (@article_id, 5, NOW(), NULL, @author_user_id)
ON DUPLICATE KEY UPDATE
    display_order = 5,
    starts_at = NOW(),
    ends_at = NULL,
    created_by_user_id = @author_user_id;

SET @article_slug = 'jujutsu-kaisen-season-3-netflix-july-22';
SET @hero_image_url = 'https://static.animecorner.me/2026/07/1782983909-234d2b1021e715bccf7160f771a3b9e8.png';

INSERT INTO articles (
    author_user_id, article_category_id, slug, title, summary, content,
    cover_image_url, cover_image_alt, hero_image_url, hero_image_alt,
    status, published_at
)
VALUES (
    @author_user_id,
    @article_category_id,
    @article_slug,
    '《咒術迴戰》第三季 7 月 22 日全球上架 Netflix',
    NULL,
    '',
    @hero_image_url,
    '《咒術迴戰》第三季 Netflix 上架視覺',
    @hero_image_url,
    '《咒術迴戰》第三季 Netflix 上架視覺',
    'published',
    '2026-07-02 17:18:48'
)
ON DUPLICATE KEY UPDATE
    article_id = LAST_INSERT_ID(article_id),
    title = '《咒術迴戰》第三季 7 月 22 日全球上架 Netflix',
    summary = NULL,
    content = '',
    cover_image_url = @hero_image_url,
    cover_image_alt = '《咒術迴戰》第三季 Netflix 上架視覺',
    hero_image_url = @hero_image_url,
    hero_image_alt = '《咒術迴戰》第三季 Netflix 上架視覺',
    status = 'published',
    published_at = '2026-07-02 17:18:48',
    deleted_at = NULL;

SET @article_id = LAST_INSERT_ID();

INSERT INTO homepage_featured_articles (
    article_id, display_order, starts_at, ends_at, created_by_user_id
)
VALUES (@article_id, 6, NOW(), NULL, @author_user_id)
ON DUPLICATE KEY UPDATE
    display_order = 6,
    starts_at = NOW(),
    ends_at = NULL,
    created_by_user_id = @author_user_id;
