const express=require("express");
const router=express.Router();
//import wrapAsync
const wrapAsync=require("../utils/wrapAsync.js");
//import model
const Listing=require("../models/listing.js");

const {isLoggedIn}=require("../middleware.js");
const {isOwner ,validateListing}=require("../middleware.js");




//Index route
router.get("/",wrapAsync(async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
   
}));


//New route
router.get("/new",isLoggedIn,(req,res)=>{
   

    res.render("listings/new.ejs");
   
});
//Create
//first validateSchema middle ware called then async function executed
router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res,next)=>{
    // let{title,description,image,price,location,country}=req.body;
     const newListing=new Listing(req.body.listing);
     newListing.owner=req.user._id;
     await newListing.save();
     req.flash("success","new listing added");
    res.redirect("/listings");} 
));



//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    //reviews + owner info with listing using populate
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","listing you requested for does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}));



//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//update
router.put("/:id",isLoggedIn,isOwner,validateListing ,wrapAsync(async (req, res) => {
      
  const { id } = req.params;
  let listing=await Listing.findById(id);
  if(req.body.listing.image === ""){
        delete req.body.listing.image;
    }
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
}));



//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
}));

module.exports=router;