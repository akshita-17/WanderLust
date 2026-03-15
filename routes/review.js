const express=require("express");
const router=express.Router({mergeParams:true});
//import wrapAsync
const wrapAsync=require("../utils/wrapAsync.js");
//import model
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

const {validateReview ,isLoggedIn,isAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");



//Post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
//delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;