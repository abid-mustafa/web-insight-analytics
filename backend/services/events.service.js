const { events } = require('../models')
const { Sequelize, Op } = require('sequelize');

module.exports.countByName = async (offset, startDate, endDate) => {
    try {
        const result = await events.findAll({
            attributes: [
                'event_name',
                [Sequelize.fn('COUNT', Sequelize.col('event_name')), 'event_count']
            ],
            where: {
                timestamp: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                }
            },
            group: ['event_name'],
            order: [[Sequelize.literal('event_count'), 'DESC']],
            limit: 5,
            offset,
        })
        return result
    } catch (error) {
        throw error
    }
}