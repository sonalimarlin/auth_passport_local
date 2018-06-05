var express = require("express"),
    app = express(),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    User = require("./models/user");

mongoose.connect("mongodb://localhost/auth_demo_2");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
  secret: "This is the code sentence used by express session",
  resave: false,
  saveUninitialized: false
}));
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// SETUP DEFAULT OR ROOT ROUTE
app.get("/", function(req, res){
  res.render("home");
});

// SETUP SECRET ROUTE
app.get("/secret", isLoggedIn, function(req, res){
  res.render("secret");
});

// SETUP REGISTER ROUTES TO CREATE NEW AUTHENTICATED USER
// "/register" will render sign up form
app.get("/register", function(req, res){
  res.render("register");
});

// Post request to "/register" will sign up new user into db
app.post("/register", function(req, res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, newUser){
    if(err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
    res.redirect("/secret");
    });
  });
});

// SETUP LOGIN ROUTE FOR EXISTING USERS
// "/login" will render sign up form
app.get("/login", function(req, res){
  res.render("login");
});

// SETUP Post ROUTE for LOGIN
app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}), function (req, res){
  console.log("Successfully logged in!");
});

// SETUP LOGOUT ROUTE
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, function() {
  console.log("The auth server has started.....");
});




