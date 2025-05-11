const db = require('../database')

exports.getWebsitesByUserid = async (userid) => {
    const [result] = await db.query(`
        SELECT 
            website_id, name
        FROM
            websites
        WHERE user_id = ? OR user_id = 'demo'; 
        `, [userid])

    return result
}