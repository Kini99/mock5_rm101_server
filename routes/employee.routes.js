const express=require("express");
const { EmployeeModel } = require("../model/employee.model");

const employeeRouter=express.Router();

employeeRouter.post("/", async(req,res)=>{
    try{
        const employee=new EmployeeModel(req.body);
        await employee.save();
        res.status(200).json({msg:"New Employee Added", employee:req.body});
    }catch(err){
        res.status(400).json({error:err.message});
    }
})

employeeRouter.get("/", async(req,res)=>{
    const page=Number(req.query.page)||1;
    try{
        const employees=await EmployeeModel.find()
        .limit(5)
        .skip((page-1)*5);
        res.status(200).send(employees);
    }catch(err){
        res.status(400).json({error:err.message});
    }
})

employeeRouter.get("/", async(req,res)=>{
    const page=Number(req.query.page)||1;
    try{
        const employees=await EmployeeModel.find()
        .limit(5)
        .skip((page-1)*5);
        res.status(200).send(employees);
    }catch(err){
        res.status(400).json({error:err.message});
    }
})

employeeRouter.put("/update/:id", async(req,res)=>{
    const {id}=req.params;
    try{
       await EmployeeModel.findByIdAndUpdate({_id:id}, req.body);
       res.status(200).json({msg:"Employee details updated", employee:req.body})
    }catch(err){
        res.status(400).json({error:err.message});
    }
})

employeeRouter.delete("/delete/:id", async(req,res)=>{
    const {id}=req.params;
    try{
       await EmployeeModel.findByIdAndDelete({_id:id});
       res.status(200).json({msg:"Employee details deleted"})
    }catch(err){
        res.status(400).json({error:err.message});
    }
})

module.exports={
    employeeRouter
}