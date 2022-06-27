
//---------------creating schema for collecting data-------------------


const mongoose = require("mongoose");

const bcrypt = require ("bcryptjs");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");
const { stringify } = require("nodemon/lib/utils");

const userSchema = new mongoose.Schema({
        firstname : {
                type:String,
                required:true
        },
        gender : {
                type:String,
                required:true
        },
        lastname : {
                type:String,
                required:true
        },
        phone : {
                type:Number,
                required:true,
                unique:true
        },
        email : {
                type:String,
                required:true,
                unique:true
        },
        password : {
                type:String,
                required:true
        },
        confirmpassword : {
                type:String,
                required:true
        },
        tokens:[{
                token:{
                        type:String,
                        required: true
                }
        }]
        
})

//-----------jwt / jsonwebtoken create-------------

userSchema.methods.generateAuthToken = async function(){
        try {
                const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
                this.tokens = this.tokens.concat({token:token})
                await this.save();
                return token;
        } catch (error) {
                res.send("the error parts" + error);
                console.log("the error parts" + error);
        }
}






//                 adding bcrypt to secure password

userSchema.pre("save", async function(next){
        if(this.isModified("password")){        this.password = await bcrypt.hash(this.password, 10);
                this.confirmpassword = await bcrypt.hash(this.password, 10) ;
                
        }
})


//now we need to create collections


const Register = new mongoose.model("Register", userSchema);

module.exports = Register;