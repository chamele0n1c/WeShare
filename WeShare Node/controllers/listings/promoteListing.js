const Sqrl = require('squirrelly');

module.exports.getPromote = function(err, req, res, next)
{
  res.send(Sqrl.renderFile('./views/promote.sqrl', {title: "Hello World Its a Website!"}));
};

module.exports.postPromote = function (err, req, res, next)
{
  //todo
  res.send("POST");
};
