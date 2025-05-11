const db = require('../database')
const { getWebsiteIdFromUid } = require("../util/website-utils")

exports.getSessionsBySource = async (websiteUid, offset, startDate, endDate) => {
    const websiteId = await getWebsiteIdFromUid(websiteUid)

    const [values] = await db.query(`
        SELECT 
            ts.source,
            COUNT(DISTINCT ts.session_id) AS sessions
        FROM traffic_sources ts
        JOIN sessions s ON ts.session_id = s.id
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?
        GROUP BY ts.source
        ORDER BY sessions DESC
        LIMIT 5 OFFSET ?;
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(DISTINCT ts.source) AS total
        FROM traffic_sources ts
        JOIN sessions s ON ts.session_id = s.id
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return { values, total }
}

exports.getSessionsByMedium = async (websiteUid, offset, startDate, endDate) => {
    const websiteId = await getWebsiteIdFromUid(websiteUid)

    const [values] = await db.query(`
        SELECT 
            ts.medium, 
            COUNT(DISTINCT ts.session_id) AS sessions
        FROM traffic_sources ts
        JOIN sessions s ON ts.session_id = s.id
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?
        GROUP BY ts.medium
        ORDER BY sessions DESC
        LIMIT 5 OFFSET ?;
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(DISTINCT ts.medium) AS total
        FROM traffic_sources ts
        JOIN sessions s ON ts.session_id = s.id
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return { values, total }
}

exports.getSessionsByCampaign = async (websiteUid, offset, startDate, endDate) => {
    const websiteId = await getWebsiteIdFromUid(websiteUid)

    const [values] = await db.query(`
        SELECT 
            ts.campaign, 
            COUNT(DISTINCT ts.session_id) AS sessions
        FROM traffic_sources ts
        JOIN sessions s ON ts.session_id = s.id
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?
        GROUP BY ts.campaign
        ORDER BY sessions DESC
        LIMIT 5 OFFSET ?;
    `, [websiteId, startDate, endDate, offset])

    const [[{ total }]] = await db.query(`
        SELECT COUNT(DISTINCT ts.campaign) AS total
        FROM traffic_sources ts
        JOIN sessions s ON ts.session_id = s.id
        WHERE s.website_id = ? AND s.created_at BETWEEN ? AND ?;
    `, [websiteId, startDate, endDate])

    return { values, total }
}