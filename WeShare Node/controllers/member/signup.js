const Sqrl = require('squirrelly');
const Request = require("request");
const pubKey = , privKey = ;
const nodemailer = require('nodemailer');
const db = require('../db');

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

function getVerificationLink(usrObj)
{
    return "https://cyberbazaar.tk/member/verify/" + usrObj.data.eVext;
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user:"0bl1v10n.devops@gmail.com",
           pass:""
       }
   });
function sendVerifyEmail(usrObj)
{
    const htmlVar = Sqrl.renderFile('./views/member/eVtemplate.html', {link : getVerificationLink(usrObj)});
    const mailOptions = {
        from: '0bl1v10n.devops@gmail.com',
        to:   usrObj.data.email,
        subject: 'Verify CyberBazaar Email',
        html: htmlVar
    };


    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
        {
            console.log(err);
            console.log("mail failed");
        }
        else
        {
            console.log(info);
            console.log("mail sent");
        }
     });



}

module.exports.getSignUp = function (req, res, next)
{
    res.send(Sqrl.renderFile('./views/member/signup.html', {
        title: "Signup", sitekey: pubKey
    }));
};

module.exports.postSignup = function (req, res)
{
    if (!req.body["g-recaptcha-response"] || req.body["g-recaptcha-response"] == undefined)
    {
        const errVal = "err no captcha - 500";
        console.log('POST /signup reCAPTCHA Invalid Response');
        res.send(Sqrl.renderFile("./views/error.html" , {error: errVal}));
        return;
    } else {
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
            console.log('POST /signup reCAPTCHA response valid.');
            const Usr = req.body.user.replace(/[&\/\\#,+()$~%.'":*?<>{}] /g, '');
            const Email = req.body.email;
            const Pass = req.body.pass;
            db.hash(Pass).then((x) =>
            {
                if (x == false)
                {
                    const errVal = 'Password too Short';
                    console.log(errVal);
                    res.send(Sqrl.renderFile('./views/error.html', {error: errVal, redirect: req.headers.referer}))
                }
                else
                {
                    const Hash = x;
                    db.userExists( Usr ).then((x) => {
                        if (x)
                        {
                            const errVal = 'User Already Exists';
                            console.log(errVal);
                            res.send(Sqrl.renderFile('./views/error.html', {error: errVal, redirect : req.headers.referer}));
                            return;

                        } else {
                            if (!validateEmail(Email))
                            {
                                const errVal = 'You have entered an Invalid Email Address!';
                                console.log(errVal);
                                res.send(Sqrl.renderFile('./views/error.html', {error: errVal, redirect: req.headers.referer}));
                                return;
                            } else {
                                db.emailExists( Email ).then((x) => {
                                    if (x)
                                    {
                                        const errVal = 'Email Already Used';
                                        console.log(errVal);
                                        res.send(Sqrl.renderFile('./views/error.html', {error: errVal, redirect : req.headers.referer}));
                                        return;
                                    } else {
                                        /* CHECK USERNAME */
                                        if (Usr.length > 13)
                                        {
                                            const errVal = 'Username Too Long'
                                            console.log(errVal);
                                            res.send(Sqrl.renderFile('./views/error.html', {error: errVal, redirect : req.headers.referer}));
                                            return;
                                        } else {
                                                db.totalUsers().then((result) => {
                                                    console.log(result);
                                                    const today = new Date();
                                                    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                                                    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                                                    const dateTime = date+' '+time;
                                                    const usrObj =
                                                    {
                                                        'username' :  Usr,
                                                        'data' : {
                                                            'passHash': Hash,
                                                            'id' : result + 1,
                                                            'email' : Email,
                                                            'totalPosts' : 0,
                                                            'lastPost' : "",
                                                            'registerStamp' : dateTime,
                                                            'registerIP' : ip,
                                                            'emailVerified' :  false,
                                                            'eVext' :  makeid(5),
                                                            'apiKey' : makeid(17)
                                                    }    };
                                                    console.dir(usrObj);
                                                    console.log("Writing to DB");
                                                    db.addUser( usrObj ).then((x) => {
                                                        if (x) {
                                                            console.log("DB Write finished");
                                                            res.send(Sqrl.renderFile('./views/member/signupcomp.html', { usr : Usr, api : usrObj.data.apiKey }));
                                                            console.log(usrObj[0]);
                                                            console.log("Registered");
                                                            sendVerifyEmail(usrObj);
                                                            } else {
                                                                console.log("DB Write fail");
                                                                res.send(Sqrl.renderFile('./views/error.html', { error : "Failed to register user: " + Usr, redirect : req.headers.referer}));
                                                                console.log(usrObj[0]);
                                                                console.log("Registered");
                                                                sendVerifyEmail(usrObj);
                                                                return;
                                                            }});});}}});}}});};});}}}











module.exports.getVerify = function (req, res)
{
    res.send(Sqrl.renderFile('./views/member/eV.html', {
        title: "Verify Email", sitekey: pubKey
    }));

};

module.exports.postVerify = function (req, res)
{


    if (!req.body["g-recaptcha-response"] || req.body["g-recaptcha-response"] == undefined)
    {
        const errVal = "err no captcha - 500";
        console.log('POST /signup reCAPTCHA Invalid Response');
        res.send(Sqrl.renderFile("./views/error.html" , {error: errVal}));
        return;
    } else
    {
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
            console.log('POST /verify reCAPTCHA response valid.');
            const pid = req.params.id;
            if (pid)
            {
                console.log(pid);
                db.verifyUser(pid).then((x) => {
                if (x == false)
                {
                    console.log(false)
                    const errVal = "failed to verfify ext: " + pid;
                    console.log(errVal);
                    res.send(Sqrl.renderFile('./views/error.html',{error : errVal, redirect : req.headers.referer}));
                    return;
                }
                console.log(x);
                res.send(Sqrl.renderFile('./views/info.html', {info : 'user ' + x + ' verified' , redirect : 'https://cyberbazaar.tk/dashboard' }));
                return;
                });
            }
            else
            {
                const errVal = "no pid";
                console.log(errVal);
                res.send(Sqrl.renderFile('./views/error.html',{error : errVal, redirect : req.headers.referer}));
                return;
            }
        }
    }
}


function validateEmail(mail)
{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    {
         return (true);
    }
    return (false);
}
