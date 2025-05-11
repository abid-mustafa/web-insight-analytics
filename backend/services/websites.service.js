const db = require('../database')

exports.getWebsitesByUserid = async (userId) => {
    const [result] = await db.query(`
        SELECT 
            website_id, name
        FROM
            websites
        WHERE user_id = ?; 
        `, [userId])

    return result
}

exports.addWebsite = async (userId, domain, websiteUid, name) => {
    await db.query(`
        INSERT INTO websites(user_id, domain, website_id, name)
        VALUES(?, ?, ?, ?) 
        `, [userId, domain, websiteUid, name])
    return
}