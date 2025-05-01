const db = require('../database')

module.exports.getVisitorsByCountry = async (offset, startDate, endDate) => {
    // const dbConnection = await db.getConnection()

    const [result] = await db.query(`
        SELECT 
            country AS country,
            COUNT(DISTINCT (visitor_id)) AS visitors
        FROM
            sessions
        WHERE
            created_at BETWEEN ? AND ?
        GROUP BY country
        ORDER BY visitors DESC
        LIMIT 5 OFFSET ?;
        `, [startDate, endDate, offset])

    return result
}