const express=require("express");
const app=express();
const mongoose=require("mongoose");
//set up ejs
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
//css files
app.use(express.static(path.join(__dirname,"public")));
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

URL_MONGOOSE='mongodb://127.0.0.1:27017/wanderlust';

//connecting to data base
main().then(()=>{
    console.log("db is working");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(URL_MONGOOSE);
}




//basic route
app.get("/",(req,res)=>{
    res.send("hey I am working");
});


const sessionOptions={
    secret:"mycode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        //in milli sec
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        //for security
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());
//passport
app.use(passport.initialize()); 
app.use (passport.session());

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

// app.get("/demo", async(req,res)=>{
//     let fakeUser=new User({
//         email:"fakeUser@gmail.com",
//         username:"fakeUser",
    
//     });

//    let registeredUser=await User.register(fakeUser,"password");
//    res.send(registeredUser);
// });

//listings
app.use("/listings",listingRouter);

//reviews
app.use("/listings/:id/reviews",reviewRouter);
//sign up
app.use("/",userRouter);
//404 handler middleware
app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
//error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});
app.listen(8080,(req,res)=>{
    console.log("server is listening on port 8080");
});
