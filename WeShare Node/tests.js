const r = require('rethinkdb');

let connection = null;
r.connect( {host: '10.0.0.58', port: 28015}, function(err, conn) {
    if (err) throw err;
    console.log(onConnect(conn));
});

function onConnect(connection)
{
    const Usr = 'SomeUser';
    if ( r.table('usrs').filter(r.row('username').eq(Usr)).
    run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            if (JSON.stringify(result, null, 2) === [] ) return false;
            if (JSON.stringify(result, null, 2) != [] ) return true;
        });
        
    })
    )
    {
        return "User Exists"
    }
    else
    {
        return "User Nonexistent"
    }
}
