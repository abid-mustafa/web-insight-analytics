module.exports = (err, req, res, next) => {
    console.error(err)

    const statusCode = err.statusCode || 500

    res.status(statusCode).json({
        originalUrl: res.originalUrl,
        success: false,
        message: err.message || 'Internal Server Error'
    })
    return
}