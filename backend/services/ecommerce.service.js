const db = require('../database')

module.exports.getItemCountByName = async (offset, startDate, endDate) => {
    const dbConnection = await db.getConnection()

    const [result] = await dbConnection.query(`
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

    return result
}