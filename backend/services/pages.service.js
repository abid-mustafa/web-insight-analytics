const { page_views } = require('../models')
const { Sequelize, Op } = require('sequelize')

module.exports.getViewsByTitle = async (offset, startDate, endDate) => {
    try {
        const result = await page_views.findAll({
            attributes: [
                ['page_title', 'Page Title'],
                [Sequelize.fn('COUNT', Sequelize.col('page_title')), 'Views']
            ],
            where: {
                timestamp: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: ['page_title'],
            order: [[Sequelize.literal('Views'), 'DESC']],
            limit: 5,
            offset: offset,
        })
        return result
    } catch (error) {
        throw error
    }
}