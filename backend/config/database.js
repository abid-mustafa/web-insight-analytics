const { development } = require('./config.json')

const Sequelize = require('sequelize')
module.exports = new Sequelize(development.database, development.username, development.password, {
    host: development.host,
    dialect: development.dialect,
    timezone: '+00:00'
})