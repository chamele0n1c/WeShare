let controller = require('../controllers/viewListing');

module.exports = function (app) 
{
    app.get('/viewListing', controller.getViewListing);
};
