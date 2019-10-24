//modules imports

const Sqrl = require('squirrelly');
const pubKey = , privKey = ;
const Request = require("request");
const db = require('../db');

//GET Login Page 
module.exports.getLogin = function(req, res, next)
{
  res.send(Sqrl.renderFile('./views/member/login.html', {title: "Login", sitekey: pubKey}));
};

//POST Login Page AUTH USER WITH COOKIES
module.exports.postLogin = function (req, res, next)
{
  /* CAPTCHA CODE */
  if (!req.body["g-recaptcha-response"] || req.body["g-recaptcha-response"] == undefined)
    {
        const errVal = "err no captcha - 500";
        console.log('POST /signup reCAPTCHA Invalid Response');
        res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
        return;
    } else {
        let recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
        recaptcha_url += "secret=" + privKey + "&";
        recaptcha_url += "response=" + req.body["g-recaptcha-response"] + "&";
        recaptcha_url += "remoteip=" + req.connection.remoteAddress;
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
            console.log('POST /login reCAPTCHA response valid.');
            const Usr = req.body.user.replace(/[&\/\\#,+()$~%.'":*?<>{}] /g, '');
            const Pass = req.body.pass;
            db.userExists(Usr).then((x) => {
                if (x) 
                {
                    db.passCheck(Usr, Pass).then((y) => {
                        if (y) 
                        {
                            console.log(Usr);
                            console.log("Loged in");
                            db.userVerified(Usr).then((z) =>
                            {
                                db.userLogedIn(Usr).then((logged) =>{
                                    if (logged)
                                    {
                                        db.getKey(Usr).then((key) =>
                                        {
                                            if (z)
                                            {
                                                const data = "True";
                                                res.send(Sqrl.renderFile('./views/member/logincomp.html', {api : key, ev : data, redirect: "https://cyberbazaar.tk/dashboard", usr : Usr}));
                                                return;
                                            }
                                            else 
                                            {
                                                const data = "False";
                                                res.send(Sqrl.renderFile('./views/member/logincomp.html', {api : key, ev : data, redirect: "https://cyberbazaar.tk/dashboard", usr : Usr}));
                                                return;
                                            }
                                            
                                        });
                                        
                                    }
                                    else
                                    {
                                        const data = "Unexpected Login Failure";
                                        res.send(Sqrl.renderFile('./views/error.html', {info : data, redirect: req.headers.referer}));
                                        return;
                                    }
                                });
                                
                            });
                            
                            return;
                        } else {
                            const errVal = "Invalid Password";
                            console.log('Failed Login %s' % Usr);
                            res.send(Sqrl.renderFile("./views/error.html" , {error: errVal, redirect : req.headers.referer}));
                            return;
                        }
                    });
                } else {
                    const errVal = 'User Not Found';
                    res.send(Sqrl.renderFile('./views/error.html', {error: errVal}));
                    return;
                }
            });
        }
    }
} 





