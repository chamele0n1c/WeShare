let controller = require('../../controllers/listings/deleteListing.js');

module.exports = function (app, globals) 
{
    app.get('/deleteListing', controller.getDeleteListing);
    app.post('/deleteListing', controller.postDeleteListing);
};