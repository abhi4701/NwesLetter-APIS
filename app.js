const { dir } = require("console");
const { KeyObject } = require("crypto");
const express =require("express");
const https= require("https");
const {api,key}=require("./api.js");
const app=express();

console.log(api);
console.log(key);
app.use(express.json());  // to parse input from client to server side
app.use(express.urlencoded({extended: true}));

app.use(express.static("public"))  //Use for static file the directory like css/image etc..


app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})
 

app.post("/", (req,res)=>{
    const first=req.body.first;
    const last=req.body.last;
    const email=req.body.email;
    
    const data={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: first,
                    LNAME: last
                }
            }
        ]
    }

    const jsonData=JSON.stringify(data);
    const url="https://us1.api.mailchimp.com/3.0/lists/"+key;
      console.log(url);
    const options={
        method:"POST",
        auth: "abhishek:"+api
        
    }
    const request=https.request(url,options,(response)=>{
          if(response.statusCode===200){
              res.sendFile(__dirname+"/success.html");
          } else{
              res.sendFile(__dirname+"/failure.html");
          }
        // response.on("data",(data)=>{
        //       console.log(JSON.parse(data));
        //   })
    })
   
  request.write(jsonData);
  request.end();
    
})



app.post("/failure",(req,res)=>{
    res.redirect("/")
})




app.listen(3000, ()=>{
   console.log("Server is running on port: 3000");
})

//

//