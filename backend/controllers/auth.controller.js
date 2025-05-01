const bcrypt = require('bcrypt')
const db = require('../database.js')
const service = require('../services/auth.service.js')

module.exports.login = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        return res.status(400).send('Missing email or password')
    }

    try {
        const user = await service.login(email)

        const match = user && await bcrypt.compare(password, user.password_hash)
        if (!match) {
            res.status(401).send('Invalid Credentials')
        } else {
            req.session.user = { email: email }

            res.status(200).send('Login Successful')
        }

    } catch (error) {
        next(error)
    }
}

module.exports.register = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        return res.status(400).send('Missing email or password')
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        await service.register(email, hashedPassword)

        res.status(201).send('Registered Successfuly')
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'This email is already registered.' })
        }
        next(error)
    }
}

module.exports.logout = (req, res, next) => {
    try {
        req.session.destroy(err => {
            if (err) return res.status(500).json({ message: 'Could not log out' })
            res.clearCookie('connect.sid')
            res.json({ message: 'Logged out' })
        })
    } catch (error) {
        next(error)
    }
}