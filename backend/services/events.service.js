const { events } = require('../models')
const { Sequelize, Op } = require('sequelize')

module.exports.getCountByName = async (offset, startDate, endDate) => {
    try {
        const result = await events.findAll({
            attributes: [
                ['event_name', 'Event Name'],
                [Sequelize.fn('COUNT', Sequelize.col('event_name')), 'Count']
            ],
            where: {
                timestamp: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: ['event_name'],
            order: [[Sequelize.literal('Count'), 'DESC']],
            limit: 5,
            offset: offset,
        })
        return result
    } catch (error) {
        throw error
    }
}