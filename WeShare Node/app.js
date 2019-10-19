//init app express setup
const express = require('express');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const app = express();
const rateLimit = require("express-rate-limit");
const morgan = require('morgan');

const httpPort = 80;
const sslPort = 443;
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000
  });

app.use(apiLimiter);
app.use(morgan(':method :url :status :date[web] :remote-addr :remote-user  HTTP/:http-version :res[content-length] - :response-time ms :res[content-length] ":referrer" ":user-agent"', { stream: accessLogStream }))
app.use(morgan(':method :url :status :date[web] :remote-addr :remote-user  HTTP/:http-version :res[content-length] - :response-time ms :res[content-length] ":referrer" ":user-agent"'));

// view engine + app/server setup
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(urlencodedParser);

app.set('view engine', 'squirrelly');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || httpPort);



//Routing Base
const index = require('./routes/index.js')(app);
const login = require('./routes/member/login.js')(app);
const signup = require('./routes/member/signup.js')(app);
const promote = require('./routes/listings/promoteListing.js')(app);
const imgUp = require('./routes/handler/imgUp.js')(app);
const viewListing = require('./routes/listings/viewListing.js')(app);
const newListing = require('./routes/listings/newListing.js')(app);
const browseListings = require('./routes/listings/browseListings.js')(app);
const deleteListing = require('./routes/listings/deleteListing.js')(app);
const viewUser = require('./routes/member/viewUser.js')(app);
const reportUser = require('./routes/member/reportUser.js')(app);
const deleteAcc = require('./routes/member/deleteAcc.js')(app);
const dashboard = require('./routes/member/dashboard.js')(app);



//Starting Sever and set ENV val for the port

/*DEV HTTP LEGACY 
const server = app.listen(app.get('port'), function () {
console.log('Express server listening on port ' + server.address().port);
}); 
*/

/* PRODUCTION READY */
const privateKey  = fs.readFileSync('ssl/private.key', 'utf8');
const certificate = fs.readFileSync('ssl/cert.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(sslPort, () => {console.log(`Node Server (SSL) listening on port ${sslPort}`)});
