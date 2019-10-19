const Sqrl = require('squirrelly');
module.exports.getDeleteAcc = function (err, req, res, next)
{
  res.send(Sqrl.renderFile('./views/deleteAcc.html', {title: "Hello World Its a Website!"}));
};
module.exports.postDeleteAcc = function (err, req, res, next)
{
  // TODO
  req.send("POST");
};
