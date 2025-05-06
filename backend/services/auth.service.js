const db = require('../database')

exports.login = async (email) => {
    const [[result]] = await db.query(
        `SELECT
            id, name, password_hash
        FROM users
        WHERE email = ?;
        `, [email])
    return result
}

exports.register = async (name, email, hashedPassword) => {
    const dbConnection = await db.getConnection()

    try {
        await dbConnection.query(
            `
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?);
            `, [name, email, hashedPassword])
    } catch (error) {
        throw error
    }
    finally {
        dbConnection.release()
    }
}