const db = require('../database')

exports.getSearchBarData = async (query) => {
    const [values] = await db.query(query)
    return values
}