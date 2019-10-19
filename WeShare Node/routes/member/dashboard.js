const controller = require('../../controllers/member/dashboard.js');
module.exports = 
function(app)
{
    app.get('/member/dashboard', controller.getDashboard);
}
