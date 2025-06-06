const service = require('../services/websites.service')
const validator = require('validator')
const { v4 } = require('uuid')

exports.getWebsitesByUserid = async (req, res, next) => {
    try {
        // Get the user ID from session
        const userId = req.session.user && req.session.user.id

        // Check if the user is logged in
        if (!userId) {
            const error = new Error("Not authenticated")
            error.statusCode = 401
            return next(error)
        }

        const data = await service.getWebsitesByUserid(userId)

        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        return next(error)
    }
}

exports.addWebsite = async (req, res, next) => {
    try {
        const { domain, name } = req.body

        // Check if all required fields are present
        if (!domain || !name) {
            const error = new Error("Missing domain or name")
            error.statusCode = 400
            return next(error)
        }

        // Get the user ID from session
        const userId = req.session.user && req.session.user.id

        // Check if the user is logged in
        if (!userId) {
            const error = new Error("Not authenticated")
            error.statusCode = 401
            return next(error)
        }

        if (!validator.isFQDN(domain)) {
            const error = new Error("Invalid domain format")
            error.statusCode = 400
            return next(error)
        }

        const websiteUid = v4()

        await service.addWebsite(userId, domain, websiteUid, name)

        res.status(201).json({
            success: true,
            message: "Website added successfully",
            websiteId: websiteUid
        })
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'This domain already exists' })
        }
        if (error.code === 'LimitReached') {
            return res.status(409).json({ code: 'LimitReached', message: 'You can only add up to 3 websites' });
        }
        return next(error)
    }
}

exports.updateWebsite = async (req, res, next) => {
    try {
        const { websiteUid, domain, name } = req.body

        // Check if all required fields are present
        if (!websiteUid || !domain || !name) {
            const error = new Error("Missing websiteUid or domain or name")
            error.statusCode = 400
            return next(error)
        }

        // Get the user ID from session
        const userId = req.session.user && req.session.user.id

        // Check if the user is logged in
        if (!userId) {
            const error = new Error("Not authenticated")
            error.statusCode = 401
            return next(error)
        }

        if (!validator.isFQDN(domain)) {
            const error = new Error("Invalid domain format")
            error.statusCode = 400
            return next(error)
        }

        await service.updateWebsite(userId, domain, websiteUid, name)

        res.status(200).json({
            success: true,
            message: "Website updated successfully",
            websiteUid
        })
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'This domain already exists' })
        }
        return next(error)
    }
}

exports.deleteWebsite = async (req, res, next) => {
    try {
        const { website_uid } = req.body

        if (!website_uid) {
            const error = new Error("Missing website_uid")
            error.statusCode = 400
            return next(error)
        }

        // Get the user ID from session
        const userId = req.session.user && req.session.user.id

        // Check if the user is logged in
        if (!userId) {
            const error = new Error("Not authenticated")
            error.statusCode = 401
            return next(error)
        }

        await service.deleteWebsite(userId, website_uid)

        res.status(200).json({
            success: true,
            message: "Website deleted successfully"
        })
    } catch (error) {
        return next(error)
    }
}