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
        throw { status: 404, message: 'Website not found' }
    }

    return result.id
}

module.exports = { getWebsiteIdFromUid }