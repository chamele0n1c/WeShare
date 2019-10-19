let controller = require('../controllers/deleteListing');

module.exports = function (app) 
{
    app.get('/deleteListing', controller.getDeleteListing);
    app.post('/deleteListing', controller.postDeleteListing);
};