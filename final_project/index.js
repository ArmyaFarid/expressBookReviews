const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const auth_routes = require('./router/auth_users.js').authenticated;
const app = express();
const jwtSecretKey = 'your-jwt-secret-key';

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
// console.log(req.session)
req.session.token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkZhcmlkIiwiaWF0IjoxNjk4MDE3NjM3fQ.UAKYS7CoTv6UVdEHVg5doGDxwkQN7sJG9T8ZvJ5fcEI";
if(req.session.token) { //get the authorization object stored in the session
    token = req.session.token; //retrieve the token from authorization object
    console.log(token);
    console.log("****")
    jwt.verify(token, jwtSecretKey,(err,user)=>{ //Use JWT to verify token
        if(!err){
            req.user = user;
            console.log(user)
            next();
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }

});
 
const PORT =3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);
// app.use('/', auth_routes);


app.listen(PORT,()=>console.log("Server is running"));
