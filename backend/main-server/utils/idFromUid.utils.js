const db = require('../database')

async function getWebsiteIdFromUid(websiteUid) {
    const [[result]] = await db.query(`
    SELECT
        id
    FROM
        websites
    WHERE website_id = ?;
    `, [websiteUid])

    if (!result) {
        const error = new Error('Website not found')
        error.statusCode = 404
        throw error
    }

    return result.id
}

async function getSessionIdFromUid(sessionUid) {
    const [[result]] = await db.query(`
    SELECT
        id
    FROM
        Sessions
    WHERE session_id = ?;
    `, [sessionUid])

    if (!result) {
        const error = new Error('Session not found')
        error.statusCode = 404
        throw error
    }

    return result.id
}

module.exports = { getWebsiteIdFromUid, getSessionIdFromUid }