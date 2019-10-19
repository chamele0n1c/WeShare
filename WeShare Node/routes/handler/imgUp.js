let controller = require('../../controllers/listings/handler/imgUp.js');

module.exports = function (app, globals)
{
    app.get('/imgUp', controller.getImgUp);
    app.post('/imgUp', controller.postImgUp);
};