let controller = require('../../controllers/member/viewUser.js');

module.exports = function (app)
{
    app.get('/member/viewUser/:user', controller.getViewUser);
    app.get('/member/viewUser/:user/data', controller.getUserData);

}
