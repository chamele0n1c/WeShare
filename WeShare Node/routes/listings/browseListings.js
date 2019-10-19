let controller = require('../../controllers/listings/browseListings.js');

module.exports = function(app, globals) {
    app.get('/browseListings', controller.getBrowseListings);
};
