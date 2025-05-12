const db = require('../database')

exports.getItemsGrouped = async (websiteId, groupBy, groupByColumn, offset, startDate, endDate) => {
    const [values] = await db.query(`
        SELECT 
            ${groupByColumn} AS ${groupBy},
            SUM(i.quantity) AS total_sold
        FROM 
            items i
        JOIN 
            transactions t ON i.transaction_id = t.id
        JOIN 
            sessions s ON t.session_id = s.id
        WHERE 
            s.website_id = ? AND t.created_at BETWEEN ? AND ?
        GROUP BY 
            ${groupByColumn}
        ORDER BY 
            total_sold DESC
        LIMIT 5 OFFSET ?;
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT 
            COUNT(DISTINCT(${groupByColumn})) AS total
        FROM 
            items i
        JOIN 
            transactions t ON i.transaction_id = t.id
        JOIN 
            sessions s ON t.session_id = s.id
        WHERE 
            s.website_id = ? AND t.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return { values, total }
}