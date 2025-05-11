const db = require('../database')

exports.login = async (email) => {
    const [[result]] = await db.query(
        `SELECT
            email, id, name, password_hash
        FROM users
        WHERE email = ?;
        `, [email])
    return result
}

exports.register = async (name, email, hashedPassword) => {
    const [result] = await db.query(`
    INSERT INTO users (name, email, password_hash)
    VALUES (?, ?, ?)`, [name, email, hashedPassword])

    const insertedId = result.insertId

    const [[user]] = await db.query(`
    SELECT id, name, email
    FROM users
    WHERE id = ?`, [insertedId])

    return user
}