const db = require('../database')

module.exports.getViewsByTitle = async (offset, startDate, endDate) => {
    const [result] = await db.query(`
        SELECT 
            page_title, COUNT(*) AS views
        FROM
            page_views
        WHERE created_at BETWEEN ? AND ?
        GROUP BY page_title
        ORDER BY views DESC
        LIMIT 5 OFFSET ?; 
        `, [startDate, endDate, offset])

    return result
}