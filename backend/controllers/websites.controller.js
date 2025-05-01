const websiteService = require('../services/websites.service')

exports.getWebsitesByUserid = async (req, res, next) => {
    try {
        const userid = req.params.userid

        if (!userid) {
            const error = new Error("Missing userid")
            error.statusCode = 400
            return next(error)
        }

        const data = await websiteService.getWebsitesByUserid(userid)
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}