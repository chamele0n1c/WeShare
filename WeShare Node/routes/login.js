const controller = require('../controllers/login');

module.exports = function (app) 
{
    app.get('/login', controller.getLogin);
    app.post('/login', controller.postLogin);
};
