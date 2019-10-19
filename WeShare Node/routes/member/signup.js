let controller = require('../../controllers/member/signup.js');

module.exports = function (app)
{
    app.get('/member/signup', controller.getSignUp);
    app.post('/member/signup', controller.postSignup);
    app.get('/member/verify/:id', controller.getVerify);
    app.post('/member/verify/:id', controller.postVerify);
};
