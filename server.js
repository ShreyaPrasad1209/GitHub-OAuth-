
let express = require('express'),
    app = express(),
    passport = require('passport');
    session = require('express-session');
let GithubStrategy = require('passport-github').Strategy;

/***************************************************************
 *********** Github Configuration setup...
 ***************************************************************/

passport.use(new GithubStrategy({
    clientID: "622384ff6dc0a60ea7dd",
    clientSecret: "e1f9e82ff630bc12403b041972631a77d9167169",
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // we will just use the profile object returned by GitHub
    return done(null, profile);
  }
));

// Express and Passport Session
app.use(session({
  secret: "jsonworldbestplaformforjsframeworks",
  proxy: true,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    // placeholder for custom user serialization
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    // placeholder for custom user deserialization.
    // maybe you are getoing to get the user from mongo by id?
    
    done(null, user); // null is for errors
});

// we will call this to start the GitHub Login process
app.get('/auth/github', passport.authenticate('github'));

// GitHub will call this URL
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
      res.redirect('/');
  });

app.get('/', function (req, res) {
    var html = "";

    // dump the user for debugging
    if (req.isAuthenticated()) {
      html += "<ul>\
            <li><a href='/logout'>logout</a></li>\
          </ul>";
      html += "<p>authenticated as user:</p>"
      html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
    }
    else{
      html += "<ul>\
      <li><a href='/auth/github'>Login with GitHub</a></li>\
    </ul>";
    }

    res.send(html);
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//  Use this route middleware on any resource that needs to be protected.  If
//  the request is authenticated (typically via a persistent login session),
//  the request will proceed.  Otherwise, the user will be redirected to the login page.

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
}

app.get('/protected', ensureAuthenticated, function(req, res) {
    res.send("acess granted");
});

app.listen(3000, function () {
    console.log('App listening at port: 3000');
});
