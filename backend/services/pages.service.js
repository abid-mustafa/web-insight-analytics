const db = require('../database')
const { getWebsiteIdFromUid } = require("../util/website-utils")

exports.getViewsByTitle = async (websiteUid, offset, startDate, endDate) => {
    const websiteId = await getWebsiteIdFromUid(websiteUid)

    const [values] = await db.query(`
        SELECT 
            page_title, COUNT(*) AS views
        FROM page_views pv
        JOIN sessions s ON pv.session_id = s.id
        WHERE s.website_id = ? AND pv.created_at BETWEEN ? AND ?
        GROUP BY pv.page_title
        ORDER BY views DESC
        LIMIT 5 OFFSET ?; 
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(DISTINCT page_title) AS total
        FROM page_views pv
        JOIN sessions s ON pv.session_id = s.id
        WHERE s.website_id = ? AND pv.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return { values, total }
}