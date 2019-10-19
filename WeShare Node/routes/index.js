let controller = require('../controllers/index.js');

module.exports = function (app, globals) 
{
    app.get('/', controller.getIndex);
    app.get('/index', controller.getIndex);
};
