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
        error.status = 404
        throw error
    }

    return result.id
}

module.exports = { getWebsiteIdFromUid }