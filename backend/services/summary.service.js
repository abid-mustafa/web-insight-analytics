const db = require('../database')
const { getWebsiteIdFromUid } = require("../util/website.utils")

// exports.getOverviewMetrics = async (endDate) => {
//     const startDate = new Date(endDate)
//     startDate.setDate(endDate.getDate() - 6)

//     const [[result]] = await db.query(`
//         SELECT
//             (SELECT COUNT(DISTINCT(visitor_id)) FROM sessions WHERE created_at BETWEEN ? AND ?) AS users,
//             (SELECT COUNT(*) FROM page_views WHERE created_at BETWEEN ? AND ?) AS views,
//             (SELECT COUNT(*) FROM events WHERE created_at BETWEEN ? AND ?) AS events,
//             (SELECT COUNT(*) FROM sessions WHERE created_at BETWEEN ? AND ?) AS sessions
//     `, [startDate, endDate, startDate, endDate, startDate, endDate, startDate, endDate])

//     return result
// }

exports.getOverviewMetricsByDay = async (websiteUid, endDate) => {
    const websiteId = await getWebsiteIdFromUid(websiteUid)

    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - 6)

    const [users] = await db.query(`
            SELECT
                DATE(created_at) AS day,
                COUNT(DISTINCT(visitor_id)) AS users
            FROM
                sessions
            WHERE website_id = ? AND created_at BETWEEN ? AND ?
            GROUP BY day;
        `, [websiteId, startDate, endDate])

    const [views] = await db.query(`
            SELECT
                DATE(pv.created_at) AS day,
                COUNT(*) AS views
            FROM
                page_views pv
            JOIN sessions s ON pv.session_id = s.id
            WHERE s.website_id = ? AND pv.created_at BETWEEN ? AND ?
            GROUP BY day;
        `, [websiteId, startDate, endDate])

    const [events] = await db.query(`
            SELECT
                DATE(ev.created_at) AS day,
                COUNT(*) AS events
            FROM
                events ev
            JOIN sessions s ON ev.session_id = s.id
            WHERE s.website_id = ? AND ev.created_at BETWEEN ? AND ?
            GROUP BY day;
        `, [websiteId, startDate, endDate])

    const [sessions] = await db.query(`
            SELECT
                DATE(created_at) AS day,
                COUNT(*) AS sessions
            FROM
                sessions
            WHERE website_id = ? AND created_at BETWEEN ? AND ?
            GROUP BY day;
        `, [websiteId, startDate, endDate])

    const result = {
        users,
        views,
        events,
        sessions
    }

    return result
}
