const mongoose=require('mongoose');

const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("db connected");
        console.log("Database:", mongoose.connection.name);
        console.log("Host:", mongoose.connection.host);
    }catch(e){
        console.log("mongo connection failed,",e.message)
    }
}
module.exports=connectDB