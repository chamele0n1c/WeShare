let controller = require('../controllers/browseListings');

module.exports = function(app) {
    app.get('/browseListings', controller.getBrowseListings);
};
