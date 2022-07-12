//EXPRESS
const express=require('express');
const app=express();
const port=80;

app.use('/public',express.static('static'));
app.use(express.urlencoded());

//MONGODB
const mongo=require('mongoose');

main().catch(err => {console.log(err)});

async function main() {
  await mongo.connect('mongodb://localhost:27017/Ak_Test');
  console.log('connected to database :)');

}

//CORS
const cors=require("cors");
const corsOptions ={
   origin:'http://localhost:3000', 
   credentials:true,     
}

app.use(cors(corsOptions))                                                     // Use this after the variable declaration

//SCHEMA
const userSchema=new mongo.Schema({
    email:{
        type: String,
        unique: [true,'Email already available']
    } ,
    name: String,
    password: String
});

const user=mongo.model('user',userSchema);

//TEST USER (how a user can be created)
        // const test_user=user({
        //     email:'test@test.com',
        //     name:'Aaaaa',
        //     password:'sfss3t3f6xA@412@'
        // });

        // console.log(test_user);


//ROUTES

app.get('/', (req, res) => {

    res.status(200).send('logged');
});


//sign up request
app.post('/signup', (req, res) => {
    const new_user=user(req.body);                                          //creating user
      
    user.find({email:new_user.email},(err,userfound)=>{
        if(err){
            res.send(500);
            return null;
        }

        if(userfound.email!=null){
            console.log(userfound);
            res.status(200).redirect('http://localhost:3000/signup');
        }
        else{
                new_user.save();                                            //saving user
                res.status(200).redirect('http://localhost:3000/');
            }
    });

});

//login request
app.post('/login',(req,res)=>{

    const check_user=req.headers;

    user.findOne({email:check_user.email},(err,userfound)=>{
        if(err){
            res.send(500);
        }
        
        if(userfound!=null&&userfound.email==check_user.email){
            if(userfound.password==check_user.password){
                console.log("password confirmed");
                
                const sentparameters={
                    msg:'user found',
                    email: userfound.email,
                    name: userfound.name,
                    login: true
                };
                
                res.status(200).json(sentparameters);
                // res.status(200).end();
            }
            else{
                const sentparameters={
                    msg:'user found',
                    email: userfound.email,
                    name: userfound.name,
                    login: false
                };
                res.status(200).json(sentparameters);
            }
        }
        else{
            res.json({msg:"user not found"});
        }
    });

});

//test request
app.post('/test',(req,res)=>
{
    console.log(req);
    res.status(200).json([{
        msg:'user found',
        email: 'test@test.com',
        name: 'test name'
    }]);
})

//LISTENING TO THE SERVER

app.listen(port, ()=>{
    console.log("server running");
})