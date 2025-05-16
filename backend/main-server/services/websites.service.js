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
    const result = await this.getWebsitesByUserid(userId)

    if (result.length >= 3) {
        throw new Error('You can only add upto 3 websites')
    }

    await db.query(`
        INSERT INTO websites(user_id, domain, website_id, name)
        VALUES(?, ?, ?, ?) 
        `, [userId, domain, websiteUid, name])
    return
}