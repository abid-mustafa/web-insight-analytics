const bcrypt = require('bcrypt')
const service = require('../services/auth.service')
const validator = require('validator')

exports.login = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !validator.isEmail(email) || !password) {
        return res.status(400).json({ success: false, message: 'Invalid or missing email/password' })
    }

    try {
        const user = await service.login(email)

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        req.session.user = { id: user.id, name: user.name, email: user.email }
        req.session.save(() => {
            return res.status(200).json({
                success: true, user: { name: user.name, email: user.email }
            })
        })

    } catch (error) {
        next(error)
    }
}

exports.register = async (req, res, next) => {
    const { name, email, password } = req.body

    if (!email || !validator.isEmail(email) || !name || !password) {
        return res.status(400).json({ success: false, message: 'Invalid or missing email, password, or name' })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await service.register(name, email, hashedPassword)

        req.session.user = { id: newUser.id, name: newUser.name, email: newUser.email }

        req.session.save(() => {
            return res.status(201).json({
                success: true,
                user: { name: newUser.name, email: newUser.email }
            })
        })
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'This email is already registered' })
        }
        next(error)
    }
}

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Could not log out' })
        }

        res.clearCookie('connect.sid')
        res.json({ success: true, message: 'Logged out successfully' })
    })
}