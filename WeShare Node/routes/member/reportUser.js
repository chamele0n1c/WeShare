const controller = require('../../controllers/member/reportUser.js')
module.exports = function (app, globals) 
{
    app.get('/member/reportUser', controller.getReportUser);
    app.post('/member/reportUser', controller.postReportUser);
};