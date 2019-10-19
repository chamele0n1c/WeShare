const Sqrl = require('squirrelly');

module.exports.getBrowseListings = function (err, req, res, next)
{
      res.send(Sqrl.renderFile('./views/browseListings.sqrl', { title: "Hello World Its a Website!" }));
};
