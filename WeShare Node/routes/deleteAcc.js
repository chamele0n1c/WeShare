const controller = require('../controllers/deleteAcc');

module.exports = fucntion (app) 
{
    app.get("/deleteAcc", controller.getDeleteAcc);
    app.post("/deleteAcc", controller.postDeleteAcc);
};