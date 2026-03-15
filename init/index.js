const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing.js");

if(process.env.NODE_ENV!="production"){
    require("dotenv").config({path:"../.env"});
}

const URL_MONGOOSE=process.env.MONGO_ATLAS_URL;

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(URL_MONGOOSE);
}

const initDB=async()=>{
    await listing.deleteMany({});

    initData.data=initData.data.map((obj)=>({...obj,owner:"69abfea205cbbf172d4936c4"}));
    await listing.insertMany(initData.data);
    
    console.log("data was initialized");
}
initDB();