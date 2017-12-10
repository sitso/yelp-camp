var express = require("express"),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    router = express.Router();


// display all campgrounds
router.get("/", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, page: "campgrounds"});
        }
    });
});

// dispaly new campground form
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});


// show more info about a campground
router.get("/:id", function (req, res) {
    // find campground with the specific id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
})

// add a new campground
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function(err, data){
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = { name: name, image: image, description: desc, price: price, author: author, location: location, lat: lat, lng: lng};
        Campground.create(newCampground, function (err, newlyCreated) {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/campgrounds");
            }
        });
    });
});

// edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

// update
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    geocoder.geocode(req.body.location, function(err, data){
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
        Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function (err, updatedCampground) {
            if (err) {
                res.redirect("/campgrounds");
            }
            else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });  
});

// delete
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    });

});


module.exports = router;