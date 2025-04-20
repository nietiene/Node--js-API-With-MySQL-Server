const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
require("dotenv").config();
const connection = require("./queries.js");
const App = express();

App.use(bodyParser.json());

// Insert EndPoint

App.get('/', (req, res) => res.send("Welcome to our App"));
App.post('/user', (req, res) => {

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

// GET endpoint

App.get('/user', (req, res) => {

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

const PORT = process.env.PORT;
App.listen(PORT, () =>  console.log(`http://localhost:${PORT}`));

//  I'll perform validation next time



