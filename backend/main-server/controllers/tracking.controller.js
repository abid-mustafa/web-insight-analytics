const trackingService = require("../services/tracking.service")
const DeviceDetector = require('device-detector-js')
const deviceDetector = new DeviceDetector()
const geoip = require('geoip-lite')
const countries = require("i18n-iso-countries")
const { getWebsiteIdFromUid, getSessionIdFromUid } = require("../utils/idFromUid.utils")

countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

function parseUserAgent(uaString) {
    const parsed = deviceDetector.parse(uaString) || {}
    return {
        device_category: parsed.device?.type || null,
        browser: parsed.client?.name || null,
        operating_system: parsed.os?.name || null,
    }
}

function getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress
}

function getLocation(ip, fallbackIp) {
    let location = geoip.lookup(ip)
    if (!location && fallbackIp) location = geoip.lookup(fallbackIp)
    return location || {}
}

function getCountryName(code) {
    if (!code) return null
    return countries.getName(code, "en") || null
}

module.exports.trackSession = async (req, res, next) => {
    try {
        const { website_uid, session_uid, visitor_uid, medium, source, campaign, client_ip } = req.body

        console.log(req.body);

        if (!website_uid || !session_uid || !visitor_uid || !client_ip) {
            const err = new Error('Missing required fields: website_uid, session_uid, visitor_uid, or client_ip')
            err.statusCode = 400
            return next(err)
        }

        const website_id = await getWebsiteIdFromUid(website_uid)

        if (!website_id) {
            const error = new Error('Website not found')
            error.statusCode = 400
            return next(error)
        }

        const ipAddress = getClientIp(req)

        const { device_category, browser, operating_system } = parseUserAgent(req.headers['user-agent'])

        const location = ipAddress === '127.0.0.1' ? getLocation(client_ip, null) : getLocation(ipAddress, client_ip)

        const country = location.country || null
        const city = location.city || null
        const countryName = getCountryName(country)

        // Save to database
        const session_id = await trackingService.insertSession(website_id, session_uid, visitor_uid, countryName, city,
            device_category, browser, operating_system)

        if (medium || source || campaign) {
            await trackingService.insertTraffic(website_id, session_id, source || null, medium || null, campaign || null)
        }

        res.status(201).json({ success: true, message: 'Session tracked successfuly' })
    } catch (error) {
        return next(error)
    }
}

module.exports.trackPageview = async (req, res, next) => {
    try {
        const { website_uid, session_uid, page_title, page_url, referrer } = req.body
        if (!website_uid || !session_uid || !page_url) {
            const err = new Error('Missing required fields: website_uid, session_uid or page_url')
            err.statusCode = 400
            return next(err)
        }

        const website_id = await getWebsiteIdFromUid(website_uid)
        const session_id = await getSessionIdFromUid(session_uid)
        if (!website_id || !session_id) {
            const error = new Error('Website or session not found')
            error.statusCode = 400
            return next(error)
        }

        await trackingService.insertPageview(website_id, session_id, page_title, page_url, referrer)
        res.status(201).json({ success: true, message: 'Pageview tracked successfuly' })
    } catch (error) {
        return next(error)
    }
}

module.exports.trackEvent = async (req, res, next) => {
    try {
        const { website_uid, session_uid, event_name, page_url } = req.body
        console.log(req.body)

        if (!website_uid || !session_uid || !event_name || !page_url) {
            const err = new Error('Missing required fields: website_uid, session_uid, event_name or page_url')
            err.statusCode = 400
            return next(err)
        }

        const website_id = await getWebsiteIdFromUid(website_uid)
        const session_id = await getSessionIdFromUid(session_uid)
        if (!website_id || !session_id) {
            const error = new Error('Website or session not found')
            error.statusCode = 400
            return next(error)
        }

        await trackingService.insertEvent(website_id, session_id, event_name, page_url)
        res.status(201).json({ success: true, message: 'Event tracked successfuly' })
    } catch (error) {
        return next(error)
    }
}