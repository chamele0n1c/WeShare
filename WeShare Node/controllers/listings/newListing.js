const Sqrl = require('squirrelly');
const pubKey = , privKey = ;
const db = require('../db');
const Request = require("request");
function makeid(length) 
{
    let result             = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) 
    {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const categories = [
  "Antiques",
  "Appliances",
  "Arts & crafts",
  "Audio Equipment",
  "Auto parts",
  "Baby & kids",
  "Beauty & health",
  "Bicycles",
  "Boats & marine",
  "Books & magazines",
  "Business equipment",
  "Campers & RVs",
  "Cars & trucks",
  "CDs & DVDs",
  "Cell phones",
  "Clothing & shoes",
  "Collectibles",
  "Computer equipment",
  "Electronics",
  "Exercise",
  "Farming",
  "Furniture",
  "Games & toys",
  "Home & garden",
  "Household",
  "Jewelry & acessories",
  "Motorcycles",
  "Musical Instruments",
  "Pet Supplies",
  "Photography",
  "Software",
  "Sports & outdoors",
  "Tickets",
  "Tools & machinery",
  "TVs",
  "Video equipment",
  "Video games"
];

const sections =
[
  "For Sale -> By Owner",
  "For Lease -> By Owner",
  "For Trade -> By Owner",
  "Looking to Buy",
  "Looking to Lease",
  "Looking to Trade",
  "Services",
  "Jobs",
  "18+",
  "Free"
];

module.exports.getNewListing = function(req, res, next)
{
  res.send(Sqrl.renderFile('./views/listings/newListing.html', {title : "New Listing", sitekey: pubKey, sections : sections, categories : categories }));
};

module.exports.postNewListing = function(req, res, next)
{
  if (!req.body["g-recaptcha-response"] || req.body["g-recaptcha-response"] == undefined)
  {
    const errVal = "err no captcha - 500";
    console.log('POST /signup reCAPTCHA Invalid Response');
    res.send(Sqrl.renderFile("./views/error.html" , {error: errVal}));
    return;
  } 
  else 
  {
    const ip = req.connection.remoteAddress;
    let recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + privKey + "&";
    recaptcha_url += "response=" + req.body["g-recaptcha-response"] + "&";
    recaptcha_url += "remoteip=" + ip;
    const captcha = Request(recaptcha_url, function(error, resp, body) 
    {
      const jbody = JSON.parse(body);
      if(jbody.success == undefined && !jbody.success || error) 
      {
        const errVal = "Captcha validation failed";
        res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
        return false;
      } 
      if(jbody.success || !error)
      {
        return true;
      }
    });
    if (!captcha) 
    {
      return;
    } 
    else if (captcha)
    {
      /* CAPTCHA IS PASSED */
      console.log('POST /listings/newListing reCAPTCHA response valid.');
      const key = req.body.key;
      db.checkKey(key).then((x) =>
      {
        if (x)
          {
            const seclectedSection = req.body.section;
            if (sections.includes(seclectedSection))
            {
              console.log(seclectedSection);
              const selectedCategory = req.body.category;
              if (categories.includes(selectedCategory))
              {
                console.log(selectedCategory);
                const title = req.body.title.replace(/[&\/\\,+(#)$~%.'":*?<>{}] /g, '');
                if (title.length < 40)
                {
                  const avoidPriceCheck 
                  =
                  [
                    '18+',
                    'Free',
                    'Looking to Trade',
                    'For Trade -> By Owner'
                  ];
                  if (avoidPriceCheck.includes(selectedCategory))
                  {
                    console.log("avoid price check");
                    const longDesc= req.body.longdesc.replace(/[&\/\\,+(#)$~%.'":*?<>{}] /g, '');
                    const shortDesc = req.body.shortdesc.replace(/[&\/\\,+(#)$~%.'":*?<>{}] /g, '');
                    const title = req.body.title.replace(/[&\/\\,+(#)$~%.'":*?<>{}] /g, '');
                    if (title == null || title == undfeined || title == "")
                    {
                      const errVal = "Err No Title";
                      console.log(errVal);
                      res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                      return;
                    }
                    if (shortDesc == null || shortDesc == undefined || shortDesc == "")
                    {
                      console.log("no short desc")
                      if (longDesc == null || longDesc == undefined || longDesc == "" || longDesc.length < 100)
                      {
                        if (longDesc.length < 100)
                        {
                          const errVal = "Err Description not long enough";
                          console.log(errVal);
                          res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                          return;
                        }
                        else
                        {
                          const errVal = "Err Description";
                          console.log(errVal);
                          res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                          return;
                        }
                      }
                      else
                      {
                        //here
                        console.log("price check yes")
                        db.getAuthor(key).then(
                          (x)=>
                          {
                            if (x == undefined || x == null )
                            {
                              const errVal = "Err APIUser";
                              console.log(errVal);
                              res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                              return;
                            }
                            else
                            {
                              const today = new Date();
                              const date = today.getFullYear()+'-'+(today.getMonth())+'-'+today.getDate();
                              const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                              const dateTime = date+' '+time;
                              db.makelid(17).then((x) =>
                              {
                                console.log('make lid promise')
                                const post =
                                {
                                  'lid'         : x,
                                  'Author'      : res,
                                  'Title'       : title,
                                  'Category'    : selectedCategory,
                                  'Section'     : seclectedSection,
                                  'Description' : longDesc,
                                  'dateTime'    : dateTime,
                                  'data'        : {

                                  }
                                }
                                db.newListing(post).then((x) =>
                                {
                                  if (x)
                                  {
                                    const data = "Listing Created";
                                    console.log(data);
                                    res.send(Sqrl.renderFile("./views/info.html" , {info : data, redirect : req.headers.referer}));
                                    return;
                                  }
                                }
                                );
                              }
                              );
                            }
                          }
                        );
                      }
                    }
                    else
                    {
                      console.log('short desc yes');
                      if (longDesc == null || longDesc == undefined || longDesc == "" || longDesc.length < 100)
                      {
                        if (longDesc.length < 100)
                        {
                          const errVal = "Err Description not long enough";
                          console.log(errVal);
                          res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                          return;
                        }
                        else
                        {
                          const errVal = "Err Description";
                          console.log(errVal);
                          res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                          return;
                        }
                      }
                      else
                      {
                        //here
                        db.getAuthor(key).then(
                          (x)=>
                          {
                            if (x == undefined || x == null )
                            {
                              const errVal = "Err APIUser";
                              console.log(errVal);
                              res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                              return ;
                            }
                            else
                            {
                              const today = new Date();
                              const date = today.getFullYear()+'-'+(today.getMonth())+'-'+today.getDate();
                              const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                              const dateTime = date+' '+time;
                              db.makelid(17).then((x) =>
                              {
                                const post =
                                {
                                  'lid'         : x,
                                  'Author'      : res,
                                  'Title'       : title,
                                  'Category'    : selectedCategory,
                                  'Section'     : seclectedSection,
                                  'Headline'    : shortDesc,
                                  'Description' : longDesc,
                                  'dateTime'    : dateTime,
                                  'data'        : {

                                  }
                                }
                                db.newListing(post).then((x) =>
                                {
                                  if (x)
                                  {
                                    const data = "Listing Created";
                                    console.log(data);
                                    res.send(Sqrl.renderFile("./views/info.html" , {info : data, redirect : "https://cyberbazaar.tk/listings/handler/addImgs/" + post.lid + "/" + key}));
                                    return;
                                  }
                                }
                                );
                              }
                              );
                            }
                          }
                        );
                      } 
                    }
                  }
                  else
                  {
                    const title = req.body.title.replace(/[&\/\\,+(#)$~%.'":*?<>{}] /g, '');
                    if (title == null || title == undfeined || title == "")
                    {
                      const errVal = "Err No Title";
                      console.log(errVal);
                      res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                      return;
                    }
                    console.log('checking price')
                    const price = Math.floor(req.body.price);
                    if (price == null || price == undefined || typeof price != "number")
                    {
                      const errVal = "Couldnt get Price";
                      console.log(errVal);
                      res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                      return ;
                    }
                    else
                    {
                      console.log("got price");
                      const longDesc= req.body.longdesc.replace(/[&\/\\,+(#)$~%.'":*?<>{}] /g, '');
                      const shortDesc = req.body.shortdesc.replace(/[&\/\\,+(#)$~%.'":*?<>{}] /g, '');
                      if (shortDesc == null || shortDesc == undefined || shortDesc == "" || shortDesc.length > 40)
                      {
                        console.log('no short desc')
                        if (longDesc == null || longDesc == undefined || longDesc == "" || longDesc.length < 100)
                        {
                          if (longDesc.length < 100)
                          {
                            const errVal = "Err Description not long enough";
                            console.log(errVal);
                            res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                            return ;
                          }
                          else
                          {
                            const errVal = "Err Description";
                            console.log(errVal);
                            res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                            return;
                          }
                        }
                        else
                        {
                          db.getAuthor(key).then(
                            (x)=>
                            {
                              if (x == undefined || x == null )
                              {
                                const errVal = "Err APIUser";
                                console.log(errVal);
                                res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                                return;
                              }
                              else
                              {
                                const today = new Date();
                                const date = today.getFullYear()+'-'+(today.getMonth())+'-'+today.getDate();
                                const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                                const dateTime = date+' '+time;
                                db.makelid(17).then((x) =>
                                {
                                  console.log("make lid promise");
                                  const post =
                                  {
                                    'lid'         : x,
                                    'Author'      : res,
                                    'Title'       : title,
                                    'Price'       : price,
                                    'Category'    : selectedCategory,
                                    'Section'     : seclectedSection,
                                    'Description' : longDesc,
                                    'dateTime'    : dateTime,
                                    'data'        : {
  
                                    }
                                  }
                                  db.newListing(post).then((x) =>
                                  {
                                    if (x)
                                    {
                                      const data = "Listing Created";
                                      console.log(data);
                                      res.send(Sqrl.renderFile("./views/info.html" , {info : data, redirect : "https://cyberbazaar.tk/listings/handler/addImgs/" + post.lid + "/" + key}));
                                      return;
                                    }
                                  }
                                  );
                                }
                                );
                              }
                            }
                          );
                        }
                      }
                      else
                      {
                        console.log('short desc yes');
                        if (longDesc == null || longDesc == undefined || longDesc == "" || longDesc.length < 100)
                        {
                          console.log('no long description');
                          if (longDesc.length < 100)
                          {
                            const errVal = "Err Description not long enough";
                            console.log(errVal);
                            res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                            return;
                          }
                          else
                          {
                            const errVal = "Err Description";
                            console.log(errVal);
                            res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                            return;
                          }
                        }
                        else
                        {
                          console.log('has long desc');
                          db.getAuthor(key).then(
                            (x)=>
                            {
                              console.log('get author promise')
                                if (!x || x == false || x == null || x == undefined || typeof x !="string")
                                {
                                  const errVal = "Err APIUser";
                                  console.log(errVal);
                                  res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                                  return;
                                }
                                else
                                {
                                  const author = x;
                                  console.log('doing makelid()');
                                  db.makelid(17).then((x) =>
                                  { 
                                    if (x == false || typeof x != "string")
                                    {
                                      const errVal = "Err Gen Listing ID";
                                      console.log(errVal);
                                      res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                                      return;
                                    }
                                    else
                                    {
                                      console.log('make lid promise');
                                      const today = new Date();
                                      const date = today.getFullYear()+'-'+(today.getMonth())+'-'+today.getDate();
                                      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                                      const dateTime = date+' '+time;
                                      console.log(x);
                                      let post =
                                      {
                                        'lid'         : x,
                                        'Author'      : author,
                                        'Title'       : title,
                                        'Price'       : price,
                                        'Category'    : selectedCategory,
                                        'Section'     : seclectedSection,
                                        'Headline'    : shortDesc,
                                        'Description' : longDesc,          
                                        'dateTime'    : dateTime
                                      };
                                      db.newListing(post).then(
                                        (x) =>
                                        {
                                          if (x == true)
                                          {
                                            const data = "Listing Created";
                                            console.log(data);
                                            res.send(Sqrl.renderFile("./views/info.html" , {info : data, redirect : "https://cyberbazaar.tk/listings/handler/addImgs/" + post.lid + "/" + key}));
                                            return;
                                          }
                                          else
                                          {
                                            const errVal = "Failed Listing Creation";
                                            console.log(errVal);
                                            res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                                            return;
                                          }
                                      }
                                    );
                                    }
                                  }
                                  );
                                }
                              }
                          )
                        }
                      }
                    }
                  }
                }
                else
                {
                  const errVal = "Title too long max 40 char";
                  console.log(errVal);
                  res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                  return;
                }
              }
              else
              {
                const errVal = "Invalid Category";
                console.log(errVal);
                res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                return;
              }
            }
            else
            {
              const errVal = "invalid section";
              console.log(errVal);
              res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
              return;
            }
          }
          else
          {
            const errVal = "APIKey failed validation";
            console.log(errVal);
            res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
            return;
          }      
        }
      );
    }
  }
};
