const express=require("express");
const router=express.Router();
//import wrapAsync
const wrapAsync=require("../utils/wrapAsync.js");
//import model
const Listing=require("../models/listing.js");

const {isLoggedIn}=require("../middleware.js");
const {isOwner ,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js");
const listing = require("../models/listing.js");
//image parsing
const multer = require("multer");

const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/") // index route
.get(wrapAsync(listingController.index)) // Create
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    
    wrapAsync(listingController.createListing)
);

//New route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
//show route
.get(wrapAsync(listingController.showListings))
//update
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing ,wrapAsync(listingController.updateListing))
//destroy 
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));



module.exports=router;