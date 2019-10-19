const Sqrl = require('squirrelly');

module.exports.getDeleteListing = function (req, res, next)
{
  res.send(Sqrl.renderFile('./views/deleteListing.sqrl', { title: "Hello World Its a Website!" }));
};
module.exports.postDeleteListing = function (err, req, res, next)
{
  //todo
  res.send("POST")
};
