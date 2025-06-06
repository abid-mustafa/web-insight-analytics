const db = require('../database')

const getWebsitesByUserid = async (userId) => {
    const [result] = await db.query(`
        SELECT website_id, name, domain FROM websites WHERE user_id = ?;
    `, [userId]);
    return result;
};

exports.getWebsitesByUserid = getWebsitesByUserid;

exports.addWebsite = async (userId, domain, websiteUid, name) => {
    const result = await getWebsitesByUserid(userId)

    if (result.length >= 3) {
        const err = new Error('You can only add up to 3 websites');
        err.code = 'LimitReached';
        throw err;
    }

    await db.query(`
        INSERT INTO websites(user_id, domain, website_id, name)
        VALUES(?, ?, ?, ?) 
        `, [userId, domain, websiteUid, name])
    return
}

exports.updateWebsite = async (userId, domain, websiteUid, name) => {
    await db.query(
        `UPDATE websites 
         SET domain = ?, name = ?
         WHERE user_id = ? AND website_id = ?`,
        [domain, name, userId, websiteUid]
    );
    return;
};

exports.deleteWebsite = async (userId, websiteUid) => {
    await db.query(
        `DELETE FROM websites 
         WHERE user_id = ? AND website_id = ?`,
        [userId, websiteUid]
    );
    return;
};