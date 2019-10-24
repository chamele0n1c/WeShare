#Layout

WeShare Node/
  -/controllers
    -/member
      -/Login.js
        -GET POST LOGIN
      -/Signup.js
        -GET POST SIGNUP EMAIL_VERIFY
    -/listings
      -/newListing
        -GET POST NEW LISTING W/O IMGS TO RETHINKDB
  -app.js
    -ROUTING to views/ => controllers/
    -HTTPS SSL Routing base Http if dev mode
