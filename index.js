import express from "express"
import axios from "axios";
import bodyparser from "body-parser";
import JokeAPI from "sv443-joke-api"
import { dirname,join } from "path";
import { fileURLToPath } from "url";
import { error } from "console";

const app = express();
const port = 3000;
const __dirname=dirname(fileURLToPath(import.meta.url))

app.set("view engine","ejs");
app.set("views",join(__dirname,"views"));

app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.render("index.ejs",{
    content: "Choose your joke preferences 😄",
    selected: {
      category: "",
      type: "",
      flags: "",
      language: ""
    }
});
})

app.post("/get-joke",async(req,res)=>{
    const { category, type, flags, language} = req.body; // value from the dropdown
    try{
    const response=await axios.get(`https://v2.jokeapi.dev/joke/${category}`,{
        params:{
            lang: language,
            blacklistFlags: flags,
            type: type,
       }
      
    })
     let joke;
       if(response.data.type ==="single"){
        joke = response.data.joke
       }else{
        joke = `${response.data.setup} - ${response.data.delivery}`
       }
             res.render("index.ejs", { 
                content: joke,
                selected: { category, type, flags, language },
             });
    }catch(error){
        console.error("Error:",error.message)
         res.render("index.ejs", {  content: "Error fetching joke 😢" });
    }
    
})



app.listen(port,()=>{
    console.log(`server is listetning on port ${port}`)
})