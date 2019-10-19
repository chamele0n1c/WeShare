const controller = require('../../controllers/member/deleteAcc.js');

module.exports = function (app, globals) 
{
    app.get("/member/deleteAcc", controller.getDeleteAcc);
    app.post("/member/deleteAcc", controller.postDeleteAcc);
};