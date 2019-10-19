const controller = require('../../controllers/listings/handler/imgUp.js');

module.exports = fucntion (app)
{
    app.get('/listings/handler/addImgs/:lid/:apiKey', controller.getImgUp);
    app.post('/listings/handler/addImgs/:lid/:apiKey', controller.postImgUp);
}