const express = require("express");
const bodyParser = require("body-parser");
const endpoint = express();
require("dotenv").config();
const connection = require("./connect.js");

endpoint.use(bodyParser.urlencoded({extended: true}));
endpoint.use(bodyParser.json());

endpoint.get('/', (req ,res) => {
    res.send("Welcome to mysql endpoint");
});

// insert endpoint
endpoint.post('/add', (req, res) => {
    const {name, password } = req.body;
    const sql = "INSERT INTO mysql(name, password) VALUES(? , ?)";
    connection.query(sql, [name, password], (err) => {
        if(err) throw err;
        res.status(201).json({message: "User saved"});
    });
});

// select endpoint
endpoint.get('/user', (req, res) => {
    const sqlSelect = "SELECT * FROM mysql";
    connection.query(sqlSelect, (err, result) => {
        if (err) throw err;
        res.status(200).json({user: result});
    });
});

// update endpoint
endpoint.put('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const {name, password} = req.body;
    const sqlUpd = `UPDATE mysql SET name = ?, password = ? WHERE id = ${id}`;
    connection.query(sqlUpd, [name, password], (err) => {
        if (err) throw err;
        res.status(200).json({message: "User updated"})
    })
});

// delete endpoint
endpoint.delete('/user/:id', (req ,res) => {

    const id = parseInt(req.params.id);
    const sqlDlt = "DELETE FROM mysql WHERE id = ?";
    connection.query(sqlDlt, id, (err) => {
        if (err) res.status(404).json({error: err.message})
    });
});
const PORT = process.env.PORT;

endpoint.listen(PORT, () => console.log(`http://localhost:${PORT}`));