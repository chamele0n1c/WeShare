let controller = require('../controllers/viewUser');

module.exports = function (app)
{
    app.get('/viewUser', controller.getViewUser);
};
