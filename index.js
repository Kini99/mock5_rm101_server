const express=require("express");
const {connection} =require("./db");
const { UserModel } = require("./model/user.model");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const cors=require("cors");
const { employeeRouter } = require("./routes/employee.routes");

const app=express();
app.use(cors())
app.use(express.json());

app.post("/signup", async(req,res)=>{
    const {email,password}=req.body;
    try{
        const existing=await UserModel.findOne({email});
        if(existing){
            return res.status(200).json({msg:"User already Exists! Please login!"});
        }
        bcrypt.hash(password,5, async(err,hash)=>{
            if(err){
                res.json({err:err.message});
            }else{
                const user=new UserModel({email,password:hash});
                await user.save();
                res.status(200).json({msg:"User signup successful! Kindly Login!"})
            }
        })
    }catch(err){
        res.status(400).json({error:err.message});
    }
})

app.post("/login", async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password, user.password,(err,result)=>{
                if(result){
                    let token=jwt.sign({userId:user._id, email:user.email}, "secretkey",{expiresIn:"7d"});
                    res.status(200).json({msg:"Logged in Successfully", token})
                }else{
                    res.status(400).json({error:err.message, msg:"Invalid Credentials!"});
                }
            })
        }else{
            res.status(400).json({msg:"User not found, please signup!"})
        }
    }catch(err){
        res.status(400).json({error:err.message});
    }
})

app.use("/employees", employeeRouter);

app.listen(8080, async()=>{
try{
    await connection;
    console.log("Server running, DB connected");
}catch(err){
    console.log(err);
}
})