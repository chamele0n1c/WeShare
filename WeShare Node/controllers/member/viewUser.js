const Sqrl = require('squirrelly');


module.exports.getViewUser = function(err, req, res, next)
{
      res.send(Sqrl.renderFile('./views/viewUser.sqrl', { title: "Hello World Its a Website!" }));
}
module.exports.getUserData = function(err, req, res, next)
{
      res.send(Sqrl.renderFile('./views/viewUser.sqrl', { title: "Hello World Its a Website!" }));
}


