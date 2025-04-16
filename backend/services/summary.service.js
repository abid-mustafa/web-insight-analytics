const db = require('../database')

module.exports.getOverviewMetrics = async (endDate) => {
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - 6)

    const dbConnection = await db.getConnection()

    const [[{ users }]] = await dbConnection.query(`
        SELECT 
            COUNT(DISTINCT (visitor_id)) AS users
        FROM
            sessions
        WHERE created_at BETWEEN ? AND ?
        `, [startDate, endDate])

    const [[{ views }]] = await dbConnection.query(`
        SELECT 
            COUNT(*) AS views
        FROM
            page_views
        WHERE created_at BETWEEN ? AND ?
        `, [startDate, endDate])

    const [[{ events }]] = await dbConnection.query(`
        SELECT 
            COUNT(*) AS events
        FROM
            events
        WHERE created_at BETWEEN ? AND ?
        `, [startDate, endDate])

    const [[{ sessions }]] = await dbConnection.query(`
        SELECT 
            COUNT(*) AS sessions
        FROM
            sessions
        WHERE created_at BETWEEN ? AND ?
        `, [startDate, endDate])

    const result = {
        users,
        views,
        events,
        sessions
    }

    return result
}

module.exports.getOverviewMetricsByDay = async (endDate) => {
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - 6)

    const dbConnection = await db.getConnection()

    const [users] = await dbConnection.query(`
        SELECT
            DATE(created_at) AS day,
            COUNT(DISTINCT (visitor_id)) AS users
        FROM
            sessions
        WHERE created_at BETWEEN ? AND ?
        GROUP BY day;
        `, [startDate, endDate])

    const [views] = await dbConnection.query(`
        SELECT
            DATE(created_at) AS day,
            COUNT(*) AS views
        FROM
            page_views
        WHERE created_at BETWEEN ? AND ?
        GROUP BY day;
        `, [startDate, endDate])

    const [events] = await dbConnection.query(`
        SELECT
            DATE(created_at) AS day,
            COUNT(*) AS events
        FROM
            events
        WHERE created_at BETWEEN ? AND ?
        GROUP BY day;
        `, [startDate, endDate])

    const [sessions] = await dbConnection.query(`
        SELECT
            DATE(created_at) AS day,
            COUNT(*) AS sessions
        FROM
            sessions
        WHERE created_at BETWEEN ? AND ?
        GROUP BY day;
        `, [startDate, endDate])

    const result = {
        users,
        views,
        events,
        sessions
    }

    return result
}