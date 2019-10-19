const Sqrl = require('squirrelly');

module.exports.getIndex = function(req, res, next)
{
  //send rendered index page GET
  res.send(Sqrl.renderFile('./views/index.html', {title: "Index"}));
};
