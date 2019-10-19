let controller = require('../controllers/imgUp');

module.exports = function (app)
{
    app.get('/imgUp', controller.getImgUp);
    app.post('/imgUp', controller.postImgUp);
};