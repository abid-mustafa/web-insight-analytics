module.exports = function authenticateUser(req, res, next) {
    if (req.session !== undefined && req.session.user !== undefined) {
        return next()
    }
    res.status(401).json({ message: 'Not authenticated' })
}