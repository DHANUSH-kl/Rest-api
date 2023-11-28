const express = require("express")
const app = express()
const port = 8080
const path = require("path")
const { v4: uuidv4 } = require('uuid');
app.use(express.urlencoded({extended:true}))
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")))

app.set("view engine", "ejs")


let posts = [
    {
        id:uuidv4(),
        username : "Dhanush",
        content : "I Love Coding"
    },
    {
        id:uuidv4(),
        username : "Likith",
        content : "I Love UI/UX"
    },
]

app.listen(port, ()=> {
    console.log(`server is listening to the port ${port}`)
})

app.get("/",(req,res)=> {
    res.send("Server is working properly")
})

app.get("/post",(req,res)=> {
    res.render("index",{posts})
})

app.get("/post/new",(req,res)=> {
    res.render("new")
})

app.post("/post",(req,res)=> {
    let id=uuidv4();
    let {username,content}=req.body;
    posts.push({id,username,content})
    res.redirect("/post")
})

app.get("/post/:id",(req,res)=> {
    let {id} = req.params;
    let post=posts.find((p)=>id===p.id)
    res.render("show",{post})
})