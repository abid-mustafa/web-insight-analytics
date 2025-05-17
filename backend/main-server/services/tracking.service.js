const db = require('../database')

exports.insertPageview = async (website_id, session_id, page_title, page_url, referrer) => {
    const query = `
        INSERT INTO page_views (session_id, page_title, page_url, referrer)
        SELECT ?, ?, ?, ? FROM websites WHERE id = ?
    `
    await db.query(query, [session_id, page_title, page_url, referrer, website_id])
}

exports.insertEvent = async (website_id, session_id, event_name, page_url) => {
    const query = `
        INSERT INTO events (session_id, event_name, page_url)
        SELECT ?, ?, ? FROM websites WHERE id = ?
    `
    await db.query(query, [session_id, event_name, page_url, website_id])
}

exports.insertVisitor = async (website_id, visitor_uid) => {
    const checkQuery = `
        SELECT id FROM visitors WHERE visitor_id = ? AND website_id = ?
    `
    const [rows] = await db.query(checkQuery, [visitor_uid, website_id])
    if (rows.length === 0) {
        const insertQuery = `
        INSERT INTO visitors (visitor_id, website_id) VALUES (?, ?)
        `
        const [result] = await db.query(insertQuery, [visitor_uid, website_id])
        return result.insertId
    }

    return rows[0].id
}

exports.insertSession = async (website_id, session_uid, visitor_uid, country, city, device, os, browser) => {
    const visitor_id = await this.insertVisitor(website_id, visitor_uid)

    const query = `INSERT INTO sessions (website_id, session_id, visitor_id , country, city, device, os, browser)
        SELECT ?, ?, ?, ?, ?, ?, ?, ? FROM websites WHERE id = ?`

    const [result] = await db.query(query, [website_id, session_uid, visitor_id, country, city, device, os, browser, website_id])
    return result.insertId
}

exports.insertTraffic = async (website_id, session_id, source, medium, campaign) => {
    const query = `INSERT INTO traffic_sources (session_id, source, medium, campaign)
    SELECT ?, ?, ?, ? FROM websites WHERE id = ?
    `
    await db.query(query, [session_id, source, medium, campaign, website_id])
}