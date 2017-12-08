var express = require("express"),
    passport = require("passport"),
    User = require("../models/user"),
    router = express.Router();

router.get("/", function (req, res) {
    res.render("landing")
});

// AUTH ROUTES
// show register form
router.get("/register", function (req, res) {
    res.render("register");
});

//handle signup logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp, " + user.username);
            res.redirect("/campgrounds");
        })
    });
})

//show login form
router.get("/login", function (req, res) {
    res.render("login");
})

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) {

    });

// logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "You are now logged out!");
    res.redirect("/campgrounds");
})

module.exports = router;