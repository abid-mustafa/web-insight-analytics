const db = require('../database')

exports.getVisitorsByCountry = async (offset, startDate, endDate) => {
    const [result] = await db.query(`
        SELECT 
            country AS country,
            COUNT(DISTINCT(visitor_id)) AS visitors
        FROM
            sessions
        WHERE
            created_at BETWEEN ? AND ?
        GROUP BY country
        ORDER BY visitors DESC
        LIMIT 5 OFFSET ?;
        `, [startDate, endDate, offset])

    const [[total]] = await db.query(`
            SELECT COUNT(DISTINCT(country)) AS total
            FROM sessions
            WHERE created_at BETWEEN ? AND ?;
        `, [startDate, endDate])

    return { result, total }
}