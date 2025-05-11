const db = require('../database')
const { getWebsiteIdFromUid } = require("../util/website.utils")

exports.getVisitorsByCountry = async (websiteUid, offset, startDate, endDate) => {
    const websiteId = await getWebsiteIdFromUid(websiteUid)

    const [values] = await db.query(`
        SELECT 
            COALESCE(country, 'Unknown') AS country,
            COUNT(DISTINCT visitor_id) AS visitors
        FROM sessions
        WHERE website_id = ? AND created_at BETWEEN ? AND ?
        GROUP BY COALESCE(country, 'Unknown')
        ORDER BY visitors DESC
        LIMIT 5 OFFSET ?;
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(DISTINCT COALESCE(country, 'Unknown')) AS total
        FROM sessions
        WHERE website_id = ? AND created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return { values, total }
}