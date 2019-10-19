const controller = require('../../controllers/listings/newListing.js');

module.exports = function (app) 
{
    app.get('/listings/newListing', controller.getNewListing);
    app.post('/listings/newListing', controller.postNewListing);
};
