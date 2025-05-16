const service = require('../services/ai.service')
const { isValid, parseISO } = require('date-fns')
const { getWebsiteIdFromUid } = require('../utils/website.utils')
const fetch = require('node-fetch')
const validator = require('validator')

exports.getSearchBarData = async (req, res, next) => {
    try {
        const { websiteUid, text } = req.body
        if (!websiteUid || typeof text !== 'string' || text.trim() === '') {
            throw new Error('Invalid or missing text or websiteUid')
        }

        const websiteId = await getWebsiteIdFromUid(websiteUid)

        const response = await fetch('http://localhost:8000/api/search-bar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ websiteId, text }),
        })

        if (!response.ok) {
            throw new Error('AI service failed')
        }

        const { result } = await response.json()
        if (!result || !result.prompt_type) {
            throw new Error('Malformed AI response')
        }

        if (result.prompt_type === 'query') {
            if (typeof result.answer !== 'string') {
                throw new Error('Invalid query from AI')
            }

            const values = await service.getSearchBarData(result.answer)
            return res.status(200).json({ values, prompt_type: result.prompt_type })
        }

        if (result.prompt_type === 'general_question') {
            return res.status(200).json({ text: result.answer, prompt_type: result.prompt_type })
        }

        const err = new Error(result.answer)
        err.statusCode = 400
        throw err
    } catch (error) {
        console.error('Error fetching search bar data:', error)
        next(error)
    }

}

exports.getAiReportData = async (req, res, next) => {
    try {
        const { websiteUid, startDate, endDate } = req.body
        const email = req.session?.user?.email
        const websiteId = await getWebsiteIdFromUid(websiteUid)

        if (!websiteUid || !startDate || !endDate || !email || !websiteId) {
            throw new Error('Missing required fields: websiteUid, startDate, endDate, email')
        }

        const start = parseISO(startDate)
        const end = parseISO(endDate)

        if (!isValid(start) || !isValid(end) || start > end || !validator.isEmail(email)) {
            throw new Error('Invalid startDate or endDate')
        }

        const response = await fetch('http://localhost:8000/api/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ websiteId, start, end, email }),
        })

        if (!response.ok) {
            throw new Error('AI report service failed')
        }

        const report = await response.json()
        return res.status(200).json(report)
    } catch (error) {
        console.error('Error fetching AI report data:', error)
        next(error)
    }
}