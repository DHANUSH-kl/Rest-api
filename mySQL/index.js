const mysql = require('mysql2');
const { faker } = require('@faker-js/faker');
const express = require("express");
const app = express();
const path = require("path")
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');



app.use(express.urlencoded({extended:true}))
app.set("views",path.join(__dirname,"views"))
app.use(methodOverride('_method'));

app.set("view engine", "ejs")


const port = 8080;


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'DELTA_APP',
    password:"root-123",
});

getRandomUser = () => {
    return[
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
};



app.listen(port,(req,res)=> {
    console.log(`server is listening to ${port}`)
})




app.get("/",(req,res)=> {
    let q = "select count(*) from  user";
    connection.query(q,(err, result) => {
    if (err) {
        console.error(err);
    } else {
        console.log(result[0]["count(*)"]);
        }
});

})

app.get("/user",(req,res)=>{
    let q=`select * from user`;
    connection.query(q,(err, users) => {
        if (err) {
            console.error(err);
        } else {
            res.render("show.ejs",{users})
            }
    });
})

app.get("/user/:id/edit",(req,res)=>{

    let {id}=req.params;
    let q=`select * from user where id="${id}"`;
    connection.query(q,(err, result) => {
        if (err) {
            console.error(err);
        } else {
            let user = result[0];
            res.render("edit.ejs",{user});
            console.log(result[0])
            }
    });

})

app.patch("/user/:id",(req,res)=> {
    let {id}=req.params;

    let q=`select * from user where id="${id}"`;
    let {password:formPassword , username:newUsername}=req.body;
    connection.query(q,(err, result) => {

        let user = result[0];

        if (formPassword != user.password) {
            res.send("wrong password");
        } else {
            let q2 = `update user set username="${newUsername}" where id="${user.id}"`;

            connection.query(q2,(err,result) => {
                res.redirect("/user");
            })
        }
    });

})

app.get("/user/new", (req, res) => {
    res.render("new.ejs");
  });

app.post("/user/new",(req,res)=> {
    let id = uuidv4();
    let {username,email,password}=req.body;
    let q=`insert into user (id,username,email,password) values ('${id}','${username}','${email}','${password}')`;
    try {
        connection.query(q, (err, result) => {
          if (err) throw err;
          console.log("added new user");
          res.redirect("/user");
        });
      } catch (err) {
        res.send("some error occurred");
      }
})


app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
        res.render("delete.ejs", { user });
      });
    } catch (err) {
      res.send("some error with DB");
    }
  });


  app.delete("/user/:id/", (req, res) => {
    let { id } = req.params;
    let { password } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
  
        if (user.password != password) {
          res.send("WRONG Password entered!");
        } else {
          let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
          connection.query(q2, (err, result) => {
            if (err) throw err;
            else {
              console.log(result);
              console.log("deleted!");
              res.redirect("/user");
            }
          });
        }
      });
    } catch (err) {
      res.send("some error with DB");
    }
  });
  