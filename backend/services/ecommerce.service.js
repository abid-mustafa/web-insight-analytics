const db = require('../database')
const { getWebsiteIdFromUid } = require("../util/website.utils")

exports.getItemCountByName = async (websiteUid, offset, startDate, endDate) => {
    const websiteId = await getWebsiteIdFromUid(websiteUid)

    const [values] = await db.query(`
        SELECT 
            i.item_name,
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
            i.item_name
        ORDER BY 
            total_sold DESC
        LIMIT 5 OFFSET ?;
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT 
            COUNT(DISTINCT(i.item_name)) AS total
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