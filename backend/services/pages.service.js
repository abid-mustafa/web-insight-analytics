const db = require('../database')
const { getWebsiteIdFromUid } = require("../utils/website.utils")

exports.getPagesGrouped = async (websiteUid, groupBy, groupByColumn, offset, startDate, endDate) => {
    const websiteId = await getWebsiteIdFromUid(websiteUid)

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
        SELECT COUNT(DISTINCT ${groupBy}) AS total
        FROM page_views p
        JOIN sessions s ON p.session_id = s.id
        WHERE s.website_id = ? AND p.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return { values, total }
}