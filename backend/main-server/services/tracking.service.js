const db = require('../db');

exports.insertPageview = async (session_id, page_title, page_url, referrer, website_id) => {
    try {
        const query = `
            INSERT INTO page_views (session_id, page_title, page_url, referrer)
            SELECT ?, ?, ?, ? FROM websites WHERE id = ?;
        `;
        await db.query(query, [session_id, page_title, page_url, referrer, website_id]);
    } catch (error) {
        throw error;
    }
};

exports.insertEvent = async (session_id, event_name, page_url, website_id) => {
    try {
        const query = `
            INSERT INTO events (session_id, event_name, page_url)
            SELECT ?, ?, ? FROM websites WHERE id = ?;
        `;
        await db.query(query, [session_id, event_name, page_url, website_id]);
    } catch (error) {
        throw error;
    }
};

exports.insertVisitor = async (visitor_id, website_id) => {
    try {
        const query = `
            INSERT INTO visitors (visitor_id)
            SELECT ? FROM websites WHERE id = ?;
        `;
        await db.query(query, [visitor_id, website_id]);
    } catch (error) {
        throw error;
    }
};

exports.insertSession = async (website_id, visitor_id, session_uuid, country, city, device, os, browser) => {
    try {
        const query = `
            INSERT INTO sessions (website_id, visitor_id, session_id, country, city, device, os, browser)
            SELECT ?, ?, ?, ?, ?, ?, ?, ? FROM websites WHERE id = ?;
        `;
        await db.query(query, [
            website_id,
            visitor_id,
            session_uuid,
            country,
            city,
            device,
            os,
            browser,
            website_id
        ]);
    } catch (error) {
        throw error;
    }
};

exports.insertTraffic = async (session_id, source, medium, campaign, website_id) => {
    try {
        const query = `
            INSERT INTO traffic_sources (session_id, source, medium, campaign)
            SELECT ?, ?, ?, ? FROM websites WHERE id = ?;
        `;
        await db.query(query, [session_id, source, medium, campaign, website_id]);
    } catch (error) {
        throw error;
    }
};