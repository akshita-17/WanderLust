
    require("dotenv").config();


const DB_URL = process.env.ATLASDB_URL;

const express=require("express");
const app=express();
const mongoose=require("mongoose");

//set up ejs
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//css files
app.use(express.static(path.join(__dirname,"public")));

 // Fix: ignore favicon requests so they don't trigger 404 crash
// app.get("/favicon.ico",(req,res)=>res.status(204).end());

//parse req data
app.use(express.urlencoded({extended:true}));

//method override
const methodOverride=require("method-override");
app.use(methodOverride("_method"));

//import wrapAsync
const wrapAsync=require("./utils/wrapAsync.js");

//import ExpressError class
const ExpressError=require("./utils/ExpressError.js");

//express sessions
const session=require("express-session");
const MongoStore = require("connect-mongo");

//connect-flash
const flash=require("connect-flash");

//passport-authentication
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

//ejs-mate
const ejs_mate=require("ejs-mate");
app.engine("ejs", ejs_mate);

//express router
const listingRouter=require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");

//connecting to database
main().then(()=>{
    console.log("db is working");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(DB_URL);
}

//Mongo Store 
const store = MongoStore.create({
    mongoUrl: DB_URL,
    touchAfter : 24 * 60 * 60,
})

store.on("error", (error)=>{
    console.log("Error in the MONGO SESSION STORE",error);

});


// creating session
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires : Date.now() +  1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
};



app.use(session(sessionOption));
app.use(flash());

//passport
app.use(passport.initialize()); 
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for flash
app.use((req,res,next)=>{
   
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

//listings
app.use("/listings",listingRouter);

//reviews
app.use("/listings/:id/reviews",reviewRouter);

//sign up
app.use("/",userRouter);

// 404 handler
app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

// error handling middleware with guard against double response
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    if(res.headersSent) return next(err);
    return res.status(statusCode).render("error.ejs",{err});
});

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});