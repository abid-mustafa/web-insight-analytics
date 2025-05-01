module.exports = function authenticateUser(req, res, next) {
    if (req.session.user) {
        return next()
    }
    res.status(401).json({ message: 'Not authenticated' })
}