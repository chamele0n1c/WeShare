const Sqrl = require('squirrelly');
const cloudinary = require('cloudinary');
const db = require('../db.js');
/*GET IMGUPLOAD PAGE HTML*/
module.exports.getImgUp = function (err, req, res, next)
{
  const lid = req.params.lid;
  const apiKey = req.params.apiKey;
  db.checkPostCreds(lid, apiKey).then((x) =>
  {
    if (x)
    {
      res.send(Sqrl.renderFile('./views/listings/handler/imgUp.html'))

    }
    else
    {
      const errVal = "401 UnAuthorized"
      res.send(Sqrl.renderFile('./views/error.html', {error: errVal, redirect: "https://cyberbazaar.tk/"}))
    }
  })
}
/* Handle Image Uploads*/
module.exports.postImgUp = function (err, req, res, next)
{
  // TODO
}