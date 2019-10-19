const r = require('rethinkdb');

r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
    initdb(conn);
})
function initdb (connection)
{
    if (connection) {
        r.tableCreate('admin').run(connection, function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
            r.table('admin').run(connection, function(err, cursor) {
                if (err) throw err;
                cursor.toArray(function(err, result) {
                    if (err) throw err;
                    console.log(JSON.stringify(result, null, 2));
                });
            });
        });
        
        
        r.tableCreate('usrs').run(connection, function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
            r.table('usrs').run(connection, function(err, cursor) {
                if (err) throw err;
                cursor.toArray(function(err, result) {
                    if (err) throw err;
                    console.log(JSON.stringify(result, null, 2));
                });
            });
        });
        
        
        r.tableCreate('posts').run(connection, function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
            r.table('posts').run(connection, function(err, cursor) {
                if (err) throw err;
                cursor.toArray(function(err, result) {
                    if (err) throw err;
                    console.log(JSON.stringify(result, null, 2));
                });
            });
        });
        
        
        r.tableCreate('stats').run(connection, function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
            r.table('stats').run(connection, function(err, cursor) {
                if (err) throw err;
                cursor.toArray(function(err, result) {
                    if (err) throw err;
                    console.log(JSON.stringify(result, null, 2));
                });
            });
        });
        
        
        console.log("Db init");
    }
}



