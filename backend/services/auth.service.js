const db = require('../database')

exports.login = async (email) => {
    const [[result]] = await db.query(
        `SELECT
            id, password_hash
        FROM users
        WHERE email = ?;
        `, [email])
    return result
}

exports.register = async (email, hashedPassword) => {
    const dbConnection = await db.getConnection()

    try {
        await dbConnection.query(
            `
            INSERT INTO users (email, password_hash)
            VALUES (?, ?);
            `, [email, hashedPassword])
    } catch (error) {
        throw error
    }
    finally {
        dbConnection.release()
    }
}