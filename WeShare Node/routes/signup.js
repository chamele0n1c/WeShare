let controller = require('../controllers/signup');

module.exports = function (app) 
{
    app.get('/signup', controller.getSignUp);
    app.post('/signup', controller.postSignup);
};
