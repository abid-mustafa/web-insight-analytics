const bcrypt = require('bcrypt')
const db = require('../database.js')
const service = require('../services/auth.service.js')

module.exports.login = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Missing email or password' })
    }

    try {
        const user = await service.login(email)

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' })
        }

        req.session.user = { email, id: user.id }
        req.session.save(() => {
            return res.status(200).json({ success: true, user: req.session.user })
        })

    } catch (error) {
        next(error)
    }
}

module.exports.register = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Missing email or password' })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        await service.register(email, hashedPassword)

        return res.status(201).json({ success: true, message: 'Registered successfully' })
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'This email is already registered' })
        }
        next(error)
    }
}

module.exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Could not log out' })
        }

        res.clearCookie('connect.sid')
        res.json({ success: true, message: 'Logged out successfully' })
    })
}