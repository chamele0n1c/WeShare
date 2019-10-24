//imports
//Brcypt Salt Hash Security
const r = require('rethinkdb');
//RethinkDB Remote DB
const bcrypt = require('bcryptjs');

let connection = null;
r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
});


//Gen Unique Listing ID
module.exports.makelid = async function(length) 
{
    console.log('make lid ()');
    return new Promise((resolve, reject) =>
    {
        let str             = '';
        const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) 
        {
            str += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        console.log(str);
        r.table('posts').filter(r.row('data')('lid').eq(str)).run(connection, (err, cursor) => 
        {
            console.log('db lookup lid');
            if (err)
            {
                resolve(false);
            }
            else
            {
                console.log('else no err');
                cursor.toArray((err, result) =>
                {
                    if (JSON.stringify(result) === JSON.stringify([]))
                    {
                        console.log('pass');
                        console.log(result);
                        resolve(str);
                    }
                    else
                    {
                        console.log(result);
                        console.log('else found');
                        str             = '';
                        for ( var i = 0; i < length; i++ ) 
                        {
                            str += characters.charAt(Math.floor(Math.random() * charactersLength));
                        }
                        r.table('posts').filter(r.row('data')('lid').eq(result)).run(connection, (err, cursor) => 
                        {
                            if (err)
                            {
                                resolve(false);
                            }
                            else
                            {
                                cursor.toArray((err, result) =>
                                {
                                    if (result === [])
                                    {
                                        resolve(str);
                                    }

                                })
                            }       
                        }
                        )
                    }
                }
                )
            }   
        });
    });
    
}

//Check User Existent / Non-Existent
module.exports.userExists = async function checkUserExists ( Usr ) 
{
    return new Promise ((resolve, reject) => {
        r.table('usrs').filter(r.row("username").eq(Usr)).run(connection, (err, cursor) => {
            if (err) {
                reject(err);
                throw err;
            }
            cursor.toArray(function (err, result) {
                if (err)
                {
                    reject(err);
                    throw err;
                }
                if (JSON.stringify(result) == JSON.stringify([])) {
                    console.log('user not existent');
                    resolve(false);
                }
                if (JSON.stringify(result) != JSON.stringify([])) {
                    console.log('user existent');
                    resolve(true);
                } 
                
            });
        });
    });
}

//Verify salt Bcrypt hash user login
module.exports.passCheck = async function (Usr, Pass) 
{
    return new Promise ((resolve, reject) => {
        r.table('usrs').filter(r.row("username").eq(Usr)).run(connection, (err, cursor) => 
        {
            if (err) {
                reject(err);
                throw err;
            }
            cursor.toArray(function (err, result) 
            {
                if (err)
                {
                    reject(err);
                    throw err;
                }
                else
                if (JSON.stringify(result) == JSON.stringify([])) {
                    console.log('user not existent');
                    resolve(false);
                } else {
                    if (result) {
                        console.log(result[0]);
                        bcrypt.compare(Pass, result[0].data.passHash).then((x) =>
                        {
                            if (x) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        });
                        
                }
                }
                
            });
        });
    });
}

//Stats Total DB User members
module.exports.totalUsers = async function ( ) 
{
    return new Promise ((resolve, reject) =>
    {
    console.log("chkttlusr");

    resolve(r.table('usrs').count().run(connection));

    });
}

//Emailexistent true/false bool
module.exports.emailExists = async function( email ) 
{
    return new Promise ((resolve, reject) => 
    {
    console.log(email);
    let resp;
    r.table("usrs").filter(r.row("data")("email").eq(email)).
        run(connection, (err, cursor) => {
            if (err) 
            {
                reject(err);
                throw err;
            }
            cursor.toArray((err, result) => 
            {
                if (err)
                {
                    reject(err);
                    throw err;
                }
                if (JSON.stringify(result) == JSON.stringify([])) {
                    console.log("email not existent");
                     resp = false;
                }
                if (JSON.stringify(result) != JSON.stringify([])) {
                    console.log("email existent");
                     resp = true;
                } resolve(resp);
            });
        });
    });
}

//new member db call
module.exports.addUser = async function( usr )
{
    return new Promise ((resolve, reject) => 
    {
        console.log('adduser');
        let status;
        r.table('usrs').insert(usr).run(connection, (err, result) => {
            
            if (err) {
                console.log(err);
                status = false;
                reject(err);
            } else {
                console.log(result);
                if (result.inserted == 1) 
                {
                    status = true;
                    resolve(status)
                } 
            }
            
        })
    });
}

//verify members email db call 2fa?
module.exports.verifyUser = async function (pid)
{
        return new Promise ((resolve, reject) => {
            r.table('usrs').filter(r.row('data')('eVext').eq(pid)).run(connection, (err, cursor) =>
            {
                if (err)
                {
                    resolve(false);
                } 
                else 
                {
                    if (cursor)
                    {
                        cursor.toArray((err, result) => 
                        {
                            if (err)
                            {
                                resolve(false);
                                throw err;
                            } 
                            else 
                            {
                                if (result)
                                {
                                    if (JSON.stringify(result) == JSON.stringify([]))
                                    {
                                        resolve(false);
                                    } 
                                    else 
                                    {
                                        console.log(result);
                                        if (JSON.stringify(result[0].data.eVext) == JSON.stringify(pid))
                                        {
                                            console.log('usr found')
                                            r.table('usrs').filter(r.row('data')('eVext').eq(pid)).update({'data' : {'emailVerified' : true}}).run(connection, (err, cursor) =>
                                            {
                                                if (err) {resolve(false);}
                                                r.table('usrs').filter(r.row('data')('eVext').eq(pid)).update({'data' : {'eVext' : ''}}).run(connection, (err, cursor) =>
                                                {
                                                    if (err) {resolve(false);}
                                                    console.log(result[0].username);
                                                    resolve(result[0].username);
                                                });
                                                
                                            });
                                        }
                                    }
                                } 
                                else 
                                {
                                    resolve(false);
                                }
                                
                                
                            }
                        });
                    }
                    else
                    {
                        resolve(false);
                    }
                }
            });
        });
}

//Verified user yes / no
module.exports.userVerified = async function  ( usr ) 
{

    return new Promise((resolve, reject) =>
    {
        r.table("usrs").filter(r.row("username").eq(usr)).
        run(connection, (err, cursor) => {
            if (err) 
            {
                resolve(false);
            }
            console.log(cursor);
            cursor.toArray((err, result) => {
                console.log(result);
                if (err)
                {
                    throw err;
                }
                if (JSON.stringify(result) == JSON.stringify([])) 
                {
                    resolve(false);
                }
                if (JSON.stringify(result) != JSON.stringify([])) 
                {
                    if (result[0].data.emailVerified == true)
                    {
                        resolve(true);
                    }
                    else
                    {
                        resolve(false);
                    }

                }
            });
        }); 
        });
}

//Bcrypt Async Hash
module.exports.hash = async function (pass)
{
        return new Promise ((resolve, reject) =>
        {
            if (pass.length < 8)
            {
                resolve(false);
            }
            else
            {
                bcrypt.genSalt(15).then((res) =>
                {
                    bcrypt.hash(pass, res).then((res) =>
                    {
                        resolve(res);
                    });
                });
            }
        });
}

//DB Log last login
module.exports.userLogedIn = async function (usr)
{
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date+' '+time;
    return new Promise ((resolve, reject) =>
    {
        r.table('usrs').filter(r.row('username').eq(usr)).update({'data': {"lastLogin": dateTime}}).run(connection,(err, result) =>
            {
                if (err)
                {
                    throw(err);
                }
                else
                {
                    resolve(true);
                }
            })
    });
    
}

//Get API Key from user ?Sensitive DB call
module.exports.getKey = async function (usr)
{
    return new Promise ((resolve, reject) =>
    {   
        r.table('usrs').filter(r.row('username').eq(usr)).run(connection, 
            (err, cursor) =>
            {
                if (err) {
                    throw err;
                } 
                else 
                {
                    cursor.toArray((err, result) =>
                    {
                        if (err)
                        {
                            throw err;
                        } 
                        else 
                        {
                            resolve(result[0].data.apiKey);
                        }
                    });
                }
            });
    });
}

// Check the user Key
module.exports.checkKey = async function (key)
{
    return new Promise ((resolve, reject) =>
    {   
        r.table('usrs').filter(r.row('data')('apiKey').eq(key)).run(connection, 
            (err, res) =>
            {
                if (err) 
                {
                    resolve(false);
                } 
                else 
                {
                    res.toArray((err, result) =>
                    {
                        if (err || JSON.stringify(result) === JSON.stringify([]))
                        {
                            resolve(false);
                        } 
                        else 
                        {
                            console.log(result);
                            if (result[0].data.apiKey === key)
                            {
                                resolve(true);
                            }
                            else
                            {
                                resolve(false);
                            }
                        }
                    });
                }
            });
    });
}

module.exports.newListing = async function (listing)
{
    console.log("new listing()")
    return new Promise ((resolve, reject) =>
    {   
        console.log("new listing() promise");
        r.table('posts').insert(listing).run(connection, 
            (err, res) =>
            {
                if (err)
                {
                    console.log(err);
                    throw err;
                }
                else
                {
                    if (res.inserted == 1)
                    {
                        resolve(true)
                    }
                    else
                    {
                        resolve(false);
                    }
                                
                }
            }
        );
    });
}

module.exports.getAuthor = async function (api)
{
    return new Promise (
        (resolve, reject) =>
        {
            r.table('usrs').filter(r.row('data')('apiKey').eq(api)).run(connection, (err, cursor) =>
            {
                if (err)
                {
                    throw err;
                }
                else
                {
                    cursor.toArray((err, res)=>
                    {
                        if (err || res === [])
                        {
                            resolve(false);
                        }
                        else
                        {
                            if (res[0].data.apiKey === api)
                            {
                                resolve(res[0].username)
                            }
                        }
                    })
                }
            })
        });
}


module.exports.checkPostCreds = async function (lid, apiKey)
{
    return new Promise((resoleve, reject) =>
    {   

        r.table('posts').filter(r.row('lid').eq(lid)).run(connection, 
        (err, cursor) =>
        {
            if (err) resolve(false);
            cursor.toArray((err, res) =>
            {
                if (err || res === [])
                {
                    resolve(false)
                }
                else
                {
                    if (res[0].lid == lid)
                    {
                        this.getAuthor(apiKey).then((x) =>
                        {
                            if (x == res[0].author)
                            {
                                resolve(true);
                            }
                        });
                    }
                }
            });
        });

    });
}
