USE anime_site_db_v2;

CREATE TABLE IF NOT EXISTS article_categories (
    article_category_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(80) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_article_categories_name UNIQUE (name),
    CONSTRAINT uq_article_categories_slug UNIQUE (slug),
    CONSTRAINT chk_article_categories_slug
        CHECK (REGEXP_LIKE(slug, '^[a-z0-9]+(-[a-z0-9]+)*$', 'c'))
);

CREATE TABLE IF NOT EXISTS articles (
    article_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    author_user_id INT UNSIGNED NOT NULL,
    article_category_id INT UNSIGNED NOT NULL,
    slug VARCHAR(160) NOT NULL,
    title VARCHAR(200) NOT NULL,
    summary TEXT NULL,
    content LONGTEXT NOT NULL,
    content_format VARCHAR(20) NOT NULL DEFAULT 'markdown',
    cover_image_url VARCHAR(2048) NULL,
    cover_image_alt VARCHAR(255) NULL,
    hero_image_url VARCHAR(2048) NULL,
    hero_image_alt VARCHAR(255) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at DATETIME NULL DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL DEFAULT NULL,
    CONSTRAINT uq_articles_slug UNIQUE (slug),
    CONSTRAINT fk_articles_author
        FOREIGN KEY (author_user_id) REFERENCES users(user_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_articles_category
        FOREIGN KEY (article_category_id) REFERENCES article_categories(article_category_id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_articles_slug
        CHECK (REGEXP_LIKE(slug, '^[a-z0-9]+(-[a-z0-9]+)*$', 'c')),
    CONSTRAINT chk_articles_content_format
        CHECK (content_format = 'markdown'),
    CONSTRAINT chk_articles_status
        CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT chk_articles_published_at
        CHECK (
            (status = 'draft' AND published_at IS NULL)
            OR
            (status IN ('published', 'archived') AND published_at IS NOT NULL)
        ),
    INDEX idx_articles_category_status_published
        (article_category_id, status, published_at),
    INDEX idx_articles_author (author_user_id)
);

CREATE TABLE IF NOT EXISTS article_series (
    article_id INT UNSIGNED NOT NULL,
    series_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (article_id, series_id),
    CONSTRAINT fk_article_series_article
        FOREIGN KEY (article_id) REFERENCES articles(article_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_article_series_series
        FOREIGN KEY (series_id) REFERENCES series(series_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS article_works (
    article_id INT UNSIGNED NOT NULL,
    work_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (article_id, work_id),
    CONSTRAINT fk_article_works_article
        FOREIGN KEY (article_id) REFERENCES articles(article_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_article_works_work
        FOREIGN KEY (work_id) REFERENCES works(work_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS article_media (
    article_media_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    article_id INT UNSIGNED NOT NULL,
    uploaded_by_user_id INT UNSIGNED NOT NULL,
    media_type VARCHAR(20) NOT NULL DEFAULT 'image',
    file_url VARCHAR(2048) NOT NULL,
    alt_text VARCHAR(255) NULL,
    caption VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_article_media_article
        FOREIGN KEY (article_id) REFERENCES articles(article_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_article_media_uploader
        FOREIGN KEY (uploaded_by_user_id) REFERENCES users(user_id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_article_media_type
        CHECK (media_type = 'image'),
    INDEX idx_article_media_article_created (article_id, created_at)
);

CREATE TABLE IF NOT EXISTS article_sources (
    article_source_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    article_id INT UNSIGNED NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    source_url VARCHAR(2048) NOT NULL,
    display_order SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_article_sources_article_url
        (article_id, source_url(512)),
    CONSTRAINT fk_article_sources_article
        FOREIGN KEY (article_id) REFERENCES articles(article_id)
        ON DELETE CASCADE,
    CONSTRAINT chk_article_sources_display_order
        CHECK (display_order > 0),
    INDEX idx_article_sources_article_order (article_id, display_order)
);

CREATE TABLE IF NOT EXISTS homepage_featured_articles (
    homepage_featured_article_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    article_id INT UNSIGNED NOT NULL,
    display_order SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    starts_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ends_at DATETIME NULL DEFAULT NULL,
    created_by_user_id INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_homepage_featured_article UNIQUE (article_id),
    CONSTRAINT fk_homepage_featured_article
        FOREIGN KEY (article_id) REFERENCES articles(article_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_homepage_featured_creator
        FOREIGN KEY (created_by_user_id) REFERENCES users(user_id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_homepage_featured_order
        CHECK (display_order > 0),
    CONSTRAINT chk_homepage_featured_dates
        CHECK (ends_at IS NULL OR ends_at > starts_at),
    INDEX idx_homepage_featured_schedule
        (starts_at, ends_at, display_order)
);

CREATE TABLE IF NOT EXISTS article_daily_stats (
    article_id INT UNSIGNED NOT NULL,
    stat_date DATE NOT NULL,
    view_count INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (article_id, stat_date),
    CONSTRAINT fk_article_daily_stats_article
        FOREIGN KEY (article_id) REFERENCES articles(article_id)
        ON DELETE CASCADE,
    INDEX idx_article_daily_stats_date_views (stat_date, view_count)
);

CREATE TABLE IF NOT EXISTS polls (
    poll_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    creator_user_id INT UNSIGNED NULL,
    poll_type VARCHAR(20) NOT NULL,
    target_type VARCHAR(10) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    max_choices TINYINT UNSIGNED NOT NULL DEFAULT 1,
    visibility VARCHAR(20) NOT NULL DEFAULT 'public',
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_polls_creator
        FOREIGN KEY (creator_user_id) REFERENCES users(user_id)
        ON DELETE SET NULL,
    CONSTRAINT chk_polls_type
        CHECK (poll_type IN ('official_weekly', 'community')),
    CONSTRAINT chk_polls_target_type
        CHECK (target_type IN ('series', 'work')),
    CONSTRAINT chk_polls_max_choices
        CHECK (max_choices BETWEEN 1 AND 30),
    CONSTRAINT chk_polls_visibility
        CHECK (visibility IN ('public', 'unlisted')),
    CONSTRAINT chk_polls_status
        CHECK (status IN ('draft', 'open', 'closed', 'hidden')),
    CONSTRAINT chk_polls_dates
        CHECK (ends_at > starts_at),
    INDEX idx_polls_type_status_dates (poll_type, status, starts_at, ends_at),
    INDEX idx_polls_creator (creator_user_id)
);

CREATE TABLE IF NOT EXISTS poll_candidates (
    poll_candidate_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    poll_id INT UNSIGNED NOT NULL,
    series_id INT UNSIGNED NULL,
    work_id INT UNSIGNED NULL,
    display_order SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    CONSTRAINT uq_poll_candidates_poll_candidate
        UNIQUE (poll_id, poll_candidate_id),
    CONSTRAINT uq_poll_candidates_series
        UNIQUE (poll_id, series_id),
    CONSTRAINT uq_poll_candidates_work
        UNIQUE (poll_id, work_id),
    CONSTRAINT fk_poll_candidates_poll
        FOREIGN KEY (poll_id) REFERENCES polls(poll_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_poll_candidates_series
        FOREIGN KEY (series_id) REFERENCES series(series_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_poll_candidates_work
        FOREIGN KEY (work_id) REFERENCES works(work_id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_poll_candidates_target
        CHECK (
            (series_id IS NOT NULL AND work_id IS NULL)
            OR
            (series_id IS NULL AND work_id IS NOT NULL)
        ),
    CONSTRAINT chk_poll_candidates_display_order
        CHECK (display_order > 0),
    INDEX idx_poll_candidates_poll_order (poll_id, display_order)
);

CREATE TABLE IF NOT EXISTS poll_votes (
    poll_id INT UNSIGNED NOT NULL,
    poll_candidate_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (poll_id, poll_candidate_id, user_id),
    CONSTRAINT fk_poll_votes_candidate
        FOREIGN KEY (poll_id, poll_candidate_id)
        REFERENCES poll_candidates(poll_id, poll_candidate_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_poll_votes_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    INDEX idx_poll_votes_poll_user (poll_id, user_id),
    INDEX idx_poll_votes_candidate (poll_candidate_id)
);
