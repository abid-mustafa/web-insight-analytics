const db = require('../database')

exports.getViewsByTitle = async (offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            page_title, COUNT(*) AS views
        FROM
            page_views
        WHERE created_at BETWEEN ? AND ?
        GROUP BY page_title
        ORDER BY views DESC
        LIMIT 5 OFFSET ?; 
        `, [startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
            SELECT COUNT(DISTINCT(page_title)) AS total
            FROM page_views
            WHERE created_at BETWEEN ? AND ?;
        `, [startDate, endDate])

    return { values, total }
}