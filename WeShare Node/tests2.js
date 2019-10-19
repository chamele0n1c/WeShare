const r = require('rethinkdb');

r.connect( {host: '10.0.0.58', port: 28015}, function(err, conn) {
    console.log("connected to db");
    if (err) {
        throw err;
    }
    if (conn) 
    {
        const usr ='someuser';
        console.log('conn');
        checkUserVerified(conn, usr).then( (x) => {
            console.log("callback");
            if (x) {
                console.log('usr %s' % usr);
                console.log('verified');
            } else {
                console.log('not verified');
            }
        });
        
    }
});

