const express = require("express");
const bodyParser = require("body-parser");
// const mysql = require("mysql2");
const cors = require("cors")
require("dotenv").config();
const session = require("express-session")
const connection = require("./queries.js");
const App = express();

const PORT = process.env.PORT;
App.use(bodyParser.json());
App.use(cors({
    origin:`http://localhost:${PORT}`,
    credentials: true
}));
App.use(session({
    secret:'factorise',
    resave: false,
    saveUninitialized:true,
    cookie:{
        secure:false,
        httpOnly: true,
        maxAge: 1000 * 60 *  60 * 24
    }   
}))
// Insert EndPoint
App.get('/', (req, res) => res.send("Welcome to our App"));

App.post('/register', (req, res) => {

    const {name, password} = req.body;
    const sql = "INSERT INTO user(name, password) VALUES(?, ?)";
    connection.query(sql, [name, password], (err) => {

        if (err) {
            res.status(201).json({message:"Data Not Inserted", error: err.message});
        } else {
            res.status(201).json("Data inserted successfully");
        }
    });
});

App.get('/login', (req, res) => {
    const {name, password} = req.body;
    const sql = "SELECT * FROM user WHERE name= ? , password = ?";
    connection.query(sql, [name, password], (err, result) => {
        if(err || result.length === 0) return res.status(404).send("User not found");
        req.session.user = {id: result[0].id,
            name: result[0].name, password: result[0].password
        };
    })
})
App.get('/user', (req, res) => {
    if (req.session.user) {
        res.json({user: req.session.user});
    } else {
        res.json({message: "Not logged in"})
    }
});

App.post('/logout', (req ,res) => {
    req.session.destroy((err) => {
        if(err) {
            return res.status(500).json({error: err.message})
        }
        res.status(200).json({message: "logged out successfullly"});
    });
});
// GET endpoint

App.get('/list', (req, res) => {
   if(!req.session.user) return res.status(404).json("Unauthorized")
    const sqlSelect = "SELECT * FROM `node-js-app`.user";
    connection.query(sqlSelect, (err, data) => {
        if (err) {
            res.status(404).json({message:"Data Not Found", error: err.message});
        } else {
            res.status(200).json(data);
        }
    });
});

// Update Based On specified In
App.put('/user/:id', (req, res) => {
    if(!req.session.user) return res.status(404).json("Unauthorized")
    const id = parseInt(req.params.id);
    const {name, password} = req.body;
    const sqlUpdate = `UPDATE user SET name = ?, password = ? WHERE id = ${id}`;

    connection.query(sqlUpdate, [name, password], (err, result) => {
        
        if (err) {
            res.status(404).json({message: "User Not found", error: err.message});
        } else {
            res.status(200).json("data updated successfully", result);
        }
    });

});

App.delete('/user/:id', (req, res) => {
    if(!req.session.user) return res.status(404).json("Unauthorized")
   const id = parseInt(req.params.id);
   const sqlDelete = `DELETE FROM user  WHERE id = ${id}`;

   connection.query(sqlDelete, (err) => {
    
    if (err) {
        res.status(404).json("User not found", err);
    } else {
        res.status(200).json("user deleted");
    }
   })
})

App.listen(PORT, () =>  console.log(`http://localhost:${PORT}`));

//  I'll perform validation next time
