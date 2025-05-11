const db = require('../database')
const { v4 } = require('uuid')


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
    const userid = v4()

    try {
        await dbConnection.query(
            `
            INSERT INTO users (user_id, name, email, password_hash)
            VALUES (?, ?, ?, ?);
            `, [userid, name, email, hashedPassword])
    } catch (error) {
        throw error
    }
    finally {
        dbConnection.release()
    }
}