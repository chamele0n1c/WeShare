let controller = require('../../controllers/listings/promoteListing.js');

module.exports = function (app, globals) 
{
    app.get('/promote', controller.getPromote);
    app.post('/promote', controller.postPromote);
};
