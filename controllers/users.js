const User=require("../models/user.js");

module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res,next)=>{ 
     try{
        const {username,email,password} = req.body;
        const user = new User({
            email : email,
            username : username,
        });
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }else{
                req.flash("success","Welcome to wanderlust!");
                res.redirect("/listings");
            }
        })
        
        console.log(registeredUser);
        
    }catch(err){
        next(err);
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
     try{
        req.flash("success","welcome to Wanderlust");
        // let t = res.locals.redirectUrl||"/listings";
        res.redirect("/listings");

    }catch(err){
        next(err);
    }
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        else{
        req.flash("success","you are logged out successfully!");
        res.redirect("/listings");
        }
    });
};
