let controller = require('../controllers/promote');

module.exports = function (app) 
{
    app.get('/promote', controller.getPromote);
    app.post('/promote', controller.postPromote);
};
