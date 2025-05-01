const db = require('../database')

exports.getOverviewMetrics = async (endDate) => {
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - 6)

    const [[result]] = await db.query(`
        SELECT
            (SELECT COUNT(DISTINCT(visitor_id)) FROM sessions WHERE created_at BETWEEN ? AND ?) AS users,
            (SELECT COUNT(*) FROM page_views WHERE created_at BETWEEN ? AND ?) AS views,
            (SELECT COUNT(*) FROM events WHERE created_at BETWEEN ? AND ?) AS events,
            (SELECT COUNT(*) FROM sessions WHERE created_at BETWEEN ? AND ?) AS sessions
    `, [startDate, endDate, startDate, endDate, startDate, endDate, startDate, endDate])

    return result
}

exports.getOverviewMetricsByDay = async (endDate) => {
    const dbConnection = await db.getConnection()
    try {
        const startDate = new Date(endDate)
        startDate.setDate(endDate.getDate() - 6)


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
    catch (error) {
        // Handle error
        throw error
    } finally {
        dbConnection.release() // Always release the connection back to the pool
    }
}