module.exports = (err, req, res, next) => {
    const error = {
        statusCode: err.statusCode || 500,
        message: err.message
    }
    console.error(error)
    res.status(error.statusCode).send('Something went wrong!')
}