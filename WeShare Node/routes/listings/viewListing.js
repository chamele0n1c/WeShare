let controller = require('../../controllers/listings//viewListing');

module.exports = function (app, globals) 
{
    app.get('/viewListing', controller.getViewListing);
};
