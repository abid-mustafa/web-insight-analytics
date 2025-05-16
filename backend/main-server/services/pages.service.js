const db = require('../database')

exports.getPagesGrouped = async (websiteId, groupBy, groupByColumn, offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            ${groupByColumn} AS \`${groupBy}\`, COUNT(*) AS views
        FROM page_views p
        JOIN sessions s ON p.session_id = s.id
        WHERE s.website_id = ? AND p.created_at BETWEEN ? AND ?
        GROUP BY ${groupBy}
        ORDER BY views DESC
        LIMIT 5 OFFSET ?; 
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(DISTINCT ${groupByColumn}) AS total
        FROM page_views p
        JOIN sessions s ON p.session_id = s.id
        WHERE s.website_id = ? AND p.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return { values, total }
}

exports.getUniquePageViews = async (websiteId, startDate, endDate) => {
    const [[{ unique_page_views }]] = await db.query(`
      SELECT COUNT(DISTINCT CONCAT(p.session_id, '-', page_url)) AS unique_page_views
      FROM page_views p
      JOIN sessions s ON p.session_id = s.id
      WHERE s.website_id = ? AND p.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return unique_page_views
}

exports.getAvgViewsPerSession = async (websiteId, startDate, endDate) => {
    const [[{ avg_page_views_per_session }]] = await db.query(`
      SELECT ROUND(COUNT(*) / COUNT(DISTINCT p.session_id), 2) AS avg_page_views_per_session
      FROM page_views p
      JOIN sessions s ON p.session_id = s.id
      WHERE s.website_id = ? AND p.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return avg_page_views_per_session
}

exports.getAvgTimeOnPage = async (websiteId, startDate, endDate) => {
    const [[{ avg_time_on_page_seconds }]] = await db.query(`
    SELECT ROUND(AVG(time_spent), 2) AS avg_time_on_page_seconds
    FROM (
        SELECT p.session_id, p.page_url,
            TIMESTAMPDIFF(SECOND, p.created_at, LEAD(p.created_at) OVER (PARTITION BY p.session_id ORDER BY p.created_at)) AS time_spent
        FROM page_views p
        JOIN sessions s ON p.session_id = s.id
        WHERE s.website_id = ? 
        AND p.created_at BETWEEN ? AND ?
    ) AS page_durations
    WHERE time_spent IS NOT NULL;
    `, [websiteId, startDate, endDate])

    return avg_time_on_page_seconds
}

exports.getTopLandingPages = async (websiteId, offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            pv.page_url AS page, COUNT(*) AS first_page_count
        FROM (
            SELECT s.id AS session_id, MIN(p.created_at) AS first_view
            FROM page_views p
            JOIN sessions s ON p.session_id = s.id
            WHERE s.website_id = ? AND p.created_at BETWEEN ? AND ?
            GROUP BY s.id
        ) AS first_pages
        JOIN page_views pv
            ON pv.session_id = first_pages.session_id 
            AND pv.created_at = first_pages.first_view
        GROUP BY pv.page_url
        ORDER BY first_page_count DESC
        LIMIT 5 OFFSET ?;
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(DISTINCT pv.page_url) AS total
        FROM (
            SELECT s.id AS session_id, MIN(p.created_at) AS first_view
            FROM page_views p
            JOIN sessions s ON p.session_id = s.id
            WHERE s.website_id = ? AND p.created_at BETWEEN ? AND ?
            GROUP BY s.id
        ) AS first_pages
        JOIN page_views pv
            ON pv.session_id = first_pages.session_id 
            AND pv.created_at = first_pages.first_view;
    `, [websiteId, startDate, endDate])

    return { values, total }
}

exports.getTopExitPages = async (websiteId, offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            pv.page_url AS page, COUNT(*) AS exit_count
        FROM (
            SELECT s.id AS session_id, MAX(p.created_at) AS last_view
            FROM page_views p
            JOIN sessions s ON p.session_id = s.id
            WHERE s.website_id = ? AND p.created_at BETWEEN ? AND ?
            GROUP BY s.id
        ) AS last_pages
        JOIN page_views pv
            ON pv.session_id = last_pages.session_id 
            AND pv.created_at = last_pages.last_view
        GROUP BY pv.page_url
        ORDER BY exit_count DESC
        LIMIT 5 OFFSET ?;
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(DISTINCT pv.page_url) AS total
        FROM (
            SELECT s.id AS session_id, MAX(p.created_at) AS last_view
            FROM page_views p
            JOIN sessions s ON p.session_id = s.id
            WHERE s.website_id = ? AND p.created_at BETWEEN ? AND ?
            GROUP BY s.id
        ) AS last_pages
        JOIN page_views pv
            ON pv.session_id = last_pages.session_id 
            AND pv.created_at = last_pages.last_view;
    `, [websiteId, startDate, endDate])

    return { values, total }
}

exports.getBounceRateByTitle = async (websiteId, offset, startDate, endDate) => {
    const [values] = await db.query(`
        WITH session_counts AS (
            SELECT p.session_id, COUNT(*) AS session_page_count
            FROM page_views p
            JOIN sessions s ON p.session_id = s.id
            WHERE s.website_id = ? AND p.created_at BETWEEN ? AND ?
            GROUP BY p.session_id
        )
        SELECT 
            pv.page_title,
            COUNT(DISTINCT s.id) AS total_sessions,
            COUNT(DISTINCT CASE WHEN sc.session_page_count = 1 THEN s.id END) AS bounced_sessions,
            ROUND(
                (COUNT(DISTINCT CASE WHEN sc.session_page_count = 1 THEN s.id END) 
                / COUNT(DISTINCT s.id)) * 100, 2
            ) AS bounce_rate
        FROM page_views pv
        JOIN sessions s ON pv.session_id = s.id
        JOIN session_counts sc ON pv.session_id = sc.session_id
        WHERE s.website_id = ? AND pv.created_at BETWEEN ? AND ?
        GROUP BY pv.page_title
        ORDER BY bounce_rate DESC
        LIMIT 5 OFFSET ?;
    `, [websiteId, startDate, endDate, websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(DISTINCT pv.page_title) AS total
        FROM page_views pv
        JOIN sessions s ON pv.session_id = s.id
        WHERE s.website_id = ? AND pv.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return { values, total }
}

exports.getBounceRate = async (websiteId, startDate, endDate) => {
    const [[{ value }]] = await db.query(`
        SELECT ROUND(
            (COUNT(DISTINCT CASE WHEN sc.session_page_count = 1 THEN s.id END) 
            / COUNT(DISTINCT s.id)) * 100, 2
        ) AS value
        FROM page_views pv
        JOIN sessions s ON pv.session_id = s.id
        JOIN (
            SELECT p.session_id, COUNT(*) AS session_page_count
            FROM page_views p
            JOIN sessions s ON p.session_id = s.id
            WHERE s.website_id = ? AND p.created_at BETWEEN ? AND ?
            GROUP BY p.session_id
        ) AS sc ON pv.session_id = sc.session_id
        WHERE s.website_id = ? AND pv.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate, websiteId, startDate, endDate])

    return value
}