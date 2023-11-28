const express = require("express")
const app = express()
const port = 8080
const path = require("path")
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');


app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.use(methodOverride('_method'));

app.set("views",path.join(__dirname,"views"))

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

app.patch("/post/:id",(req,res)=> {
    let {id}=req.params;
    let newContent=req.body.content;
    let post = posts.find((p)=>id===p.id)
    post.content = newContent;
    res.redirect("/post")
})

app.get("/post/:id/edit",(req,res)=> {
    let {id}=req.params;
    let post = posts.find((p)=> id===p.id);
    res.render("edit",{post})
})

app.delete("/post/:id",(req,res)=> {
    let {id}=req.params;
    posts = posts.filter((p)=> id!==p.id);
    res.redirect("/post")

})