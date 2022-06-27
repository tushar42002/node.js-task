
//-----------------complesory-----------------

require('dotenv').config();

const express = require("express");
const path =  require("path");   
const app = express();
const hbs = require('hbs');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

//------------------connecting mongodb and connecting schema------------------
require("./db/conn"); 
const Register = require("./models/registers");
const res = require("express/lib/response"); 
const { cookie } = require('express/lib/response');


//-------------------complesory and important--------------
const port = process.env.PORT || 3000;

//conecting foldere with HTML CSS file -------------

const  static_path = path.join(__dirname, "../public");

// const  partials_path = path.join (__dirname, "../partials");

//------------------ showing undefined----------------------




app.use(express.urlencoded({extended:false})); 


app.use(express.static(static_path ));

app.set("view engine", "hbs");
app.set("views") ;
// hbs.registerPartials(partials_path);
 

//------------grtting index page or main page--------------

app.get("/", (req, res) => {
        res.render("index")
});

//----------------getting register page ---------------------

app.get("/register", (req, res)  => {
         res.render("register");
})


// create a new user in our database
app.post("/register", async (req, res)  => {
      try{      


// ---------------------------data storing in mongo method------------ 



        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password === cpassword){

                const  registerUser = new Register({
                        firstname : req.body.firstname,  
                        lastname : req.body.lastname,  
                        gender : req.body.gender,
                        phone : req.body.phone,
                        email : req.body.email,
                        password : password,
                        confirmpassword : cpassword
                })



                const token = await  registerUser.generateAuthToken();

               


                  res.cookie("jwt", token, {
                          expires : new Date(Date.now()+30000),
                          httpOnly: true
                  });


                const registered = await  registerUser.save();
                res.status(201).render("index");

        }else{
                res.send("password not match");
        }

      }  catch (  error ){
              res.status(400).send(error);
      }
})

app.get("/login", (req, res) => {
        res.render("login");
}) 

// login process

app.post("/login", async (req, res) =>{

         // matching phone and password for log in ;
            
        try {
                const phone  = req.body.phone;
                const password  = req.body.password;

                const userphone = await   Register.findOne({phone: phone});

                //-------comparing password for log in from database

                const isMatch = await bcrypt.compare(password, userphone.password)

                const token = await userphone.generateAuthToken();
                console.log("token "+token)

                res.cookie("jwt", token, {
                        expires : new Date(Date.now()+30000),
                        httpOnly: true
                });

                 
                if(isMatch){
                        res.status(201).render("index");
                }else{
                        res.send("Detail are not match");
                }

        } catch (error) {
                res.status(4000).send("invalid Detailsl")
        }
})

//-------------------------for showing surver is running or not ---------and on which port 


app.listen(port, () =>{
        console.log(`server is running at  port no ${port}`);
})