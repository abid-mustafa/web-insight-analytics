const { getWebsiteIdFromUid } = require("../utils/website.utils")

const websiteIdMiddleware = async (req, res, next) => {
    try {
        const { websiteUid } = req.query
        if (!websiteUid) {
            const error = new Error("Website UID is required")
            error.statusCode = 400
            return next(error)
        }
        req.websiteUid = websiteUid
        req.websiteId = await getWebsiteIdFromUid(websiteUid)
        next()
    } catch (error) {
        return next(error)
    }
}

module.exports = websiteIdMiddleware