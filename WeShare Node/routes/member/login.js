const controller = require('../../controllers/member/login.js');

module.exports = function (app) 
{
    app.get('/member/login', controller.getLogin);
    app.post('/member/login', controller.postLogin);
};
