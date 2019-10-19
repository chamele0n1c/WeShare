const Sqrl = require('squirrelly');

module.exports.getViewListing = function(err, req, res, next)
{
  res.send(Sqrl.renderFile('./views/listings/viewListing.sqrl', {title: "Hello World Its a Website!"}));
}
