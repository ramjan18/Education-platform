const mongoose = require('mongoose');

require('dotenv').config();

const dbConnect = ()=>{
    mongoose.connect(process.env.MOGODB_URL , {
        useNewUrlParser : true,
        useUnifiedTopology : true
    }).then(()=>{
        console.log("Connection successful");
    }).catch((error)=>{
        console.log("Connection failed " , error);
        process.exit(1);
    })
}

module.exports = dbConnect;