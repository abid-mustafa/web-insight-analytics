const express = require('express')
const router = express.Router()
const websiteService = require('../services/websites.service')

router.get('/websites-by-userid/:userid', async (req, res, next) => {
    try {
        const userid = req.params.userid

        if (!userid) {
            const error = new Error("Missing userid")
            error.status = 400
            return next(error)
        }

        const data = await websiteService.getWebsitesByUserid(userid)
        res.status(200).send({
            data
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router