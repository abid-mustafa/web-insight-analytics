const db = require('../database')

exports.getItemCountByName = async (offset, startDate, endDate) => {
    const [result] = await db.query(`
        SELECT 
            i.item_name,
            SUM(i.quantity) AS total_sold
        FROM 
            items i
        JOIN 
            transactions t ON i.transaction_id = t.id
        WHERE 
            t.created_at BETWEEN ? AND ?
        GROUP BY 
            i.item_name
        ORDER BY 
            total_sold DESC
        LIMIT 5 OFFSET ?;
        `, [startDate, endDate, offset])

    const [[total]] = await db.query(`
            SELECT 
                COUNT(DISTINCT(i.item_name)) as item_name
            FROM 
                items i
            JOIN 
            transactions t ON i.transaction_id = t.id
            WHERE t.created_at BETWEEN ? AND ?;
        `, [startDate, endDate])

    return { result, total }

    return result
}