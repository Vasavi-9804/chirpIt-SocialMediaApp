const mongoose = require("mongoose");
module.exports ={
    connectToDb : async ()=>{
        try{
            mongoose.connect('mongodb://localhost:27017/socialMediaApp',
                {
                    dbName : "socialMediaApp",
                }
            );
            console.log("connected to mongodb");
        }catch(err){
            console.error("Error connecting to MongoDB",err.message);
        }
       
    }
}

