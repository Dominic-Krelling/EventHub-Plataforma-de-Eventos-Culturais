const searchServices = require('./searchServices');
const { success } = require('../../middlewares/apiResponse');

exports.search = ( req, res) => {
    const query = req.query.q || '';
    let searchResults = { events: [], users: [] };

    if (query) {
        searchResults = searchServices.globalSearch(query);
    }

    return success(res, {query, ...searchResults});
};