const express=require("express");
const mongoose =require("mongoose");
const cors =require( "cors");
const bodyParser =require( "body-parser");
const dotenv = require("dotenv")
dotenv.config()
const path=require('path');
const app=express();

mongoose.connect(process.env.DB_URI);

const KeeperSchema= {
    title:String,
    content:String
};
const Note=mongoose.model("Note",KeeperSchema);


app.set("view engine","ejs");
app.use(express.urlencoded());
app.use(express.json());

app.use(cors());
app.get("/api/getAll",function(req,res){
 Note.find({},(err,notes)=>{
     if(err){
         console.log(err);
     }else{
         res.status(200).send(notes);
     }
 })
});
app.post("/api/add",function(req,res){
   const {title,content}=req.body;
   const keeperObj=new Note({
       title: title,
       content: content
   })
   console.log(keeperObj);
   keeperObj.save(err=>{
       if(err){
           console.log(err);
       }
       Note.find({},(err,notes)=>{
        if(err){
            console.log(err);
        }else{
            res.status(200).send(notes);
        }
    })
   })
});
app.post("/api/delete",function(req,res){
    const {id}=req.body;
    Note.deleteOne({_id:id},()=>{
    Note.find({},(err,notes)=>{
        if(err){
            console.log(err);
        }else{
            res.status(200).send(notes);
        }
    })
  });
});
app.use(express.static(path.join(__dirname,'./myapp/build')))
app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,"./myapp/build/index.html"),
    function(err){
        res.status(500).send(err);
    })
})
const PORT=process.env.PORT||3001;
app.listen(PORT,function(){
    console.log("server is running on the port"+PORT+".");
})