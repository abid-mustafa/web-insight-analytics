const service = require('../services/ai.service')
const { isValid, parseISO } = require('date-fns')
const { getWebsiteIdFromUid } = require('../utils/website.utils')

exports.getSearchBarData = async (req, res, next) => {
    try {
        console.log('Request body:', req.body);
        const { websiteUid, text } = req.body
        const websiteId = await getWebsiteIdFromUid(websiteUid)
        const response = await fetch('http://localhost:8000/api/search-bar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ websiteId, text })
        })
        const { result } = await response.json()

        if (result.prompt_type === 'query') {
            const query = result.answer
            const values = await service.getSearchBarData(query)
            return res.status(200).json({ values, prompt_type: result.prompt_type })
        }
        else if (result.prompt_type === 'general_question') {
            const text = result.answer
            return res.status(200).json({ text, prompt_type: result.prompt_type })
        }
        else {
            return res.status(400).json({ message: result.prompt_type })
        }
    } catch (error) {
        console.error('Error fetching search bar data:', error)
        next(error)
    }
}

exports.getAiReportData = async (req, res, next) => {
    try {
        const { websiteUid, startDate, endDate } = req.body
        const email = req.session.user.email
        const websiteId = await getWebsiteIdFromUid(websiteUid)

        if (!websiteId || !startDate || !endDate || !email) {
            const error = new Error("Missing required fields: websiteUid, startDate, endDate, email")
            error.statusCode = 400
            return next(error)
        }

        const start = parseISO(startDate)
        const end = parseISO(endDate)

        if (!isValid(start) || !isValid(end) || start > end) {
            const error = new Error("Invalid startDate or endDate")
            error.statusCode = 400
            return next(error)
        }
        const response = await fetch('http://localhost:8000/api/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ websiteId, start, end, email })
        })
        const report = await response.json()
        return res.status(200).json(report)
    } catch (error) {
        console.error('Error fetching AI report data:', error)
        next(error)
    }
}
