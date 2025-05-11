const db = require('../database')
const { getWebsiteIdFromUid } = require("../util/website-utils")

exports.getCountByName = async (websiteUid, offset, startDate, endDate) => {
    const websiteId = await getWebsiteIdFromUid(websiteUid)

    const [values] = await db.query(`
        SELECT 
            event_name, COUNT(*) AS event_count
        FROM events ev
        JOIN sessions s ON ev.session_id = s.id
        WHERE s.website_id = ? AND ev.created_at BETWEEN ? AND ?
        GROUP BY ev.event_name
        ORDER BY event_count DESC
        LIMIT 5 OFFSET ?; 
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(DISTINCT event_name) AS total
        FROM events ev
        JOIN sessions s ON ev.session_id = s.id
        WHERE s.website_id = ? AND ev.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return { values, total }
}