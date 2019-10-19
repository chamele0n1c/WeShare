let controller = require('../controllers/newListing');

module.exports = function (app) 
{
    app.get('/newListing', controller.getNewListing);
    app.post('/newListing', controller.postNewListing);
};
