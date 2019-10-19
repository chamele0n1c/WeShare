const Sqrl = require('squirrelly');
module.exports.getDashboard = 
(req, res, next) =>
{
    res.send(Sqrl.renderFile('./views/member/dashboard.html', {}));
    next();
};