

//------------------connecting mongodb with node js ------------------



const  mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_PATH,  {
         useNewUrlParser:true,
         useUnifiedTopology:true, 
}).then(( ) =>   {
        console.log(`connection successfull`);
}).catch((e)=>  { 
        console.log(`no connection`);
});