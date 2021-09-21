// open another terminal and execute "npm run devStart" at the directory containing server.js
const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const dotenv = require("dotenv").config();

const db = mysql.createPool({
    host: `${process.env.DBHOST}`,
    port: process.env.DBPORT,
    user: `${process.env.DBUSER}`,
    password: `${process.env.DBPASSWD}`,
    database: `${process.env.DBNAME}`,
});

app.use(cors());
app.use(express.json());

// Get all courses at explore page
app.get('/course/all', (req, res) => {
    db.query("SELECT * FROM course;", (err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send("get all courses error occurred");
        }
        else{
            res.status(200).send(result);
        }    
    });
});

// Get course details by id
app.get('/course/by-cid', (req, res) => {
    db.query(`SELECT * FROM course where id = '${req.query.cid}'`, (err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send("cid error occurred");
        }
        else{
            res.status(200).send(result);
        }    
    });
});

// Get user details by specific id at profile page
app.get("/user/by-uid", (req, res) => {
  db.query(
    `select * from user where id = '${req.query.uid}'`,
    (errors, results) => {
      if (errors) {
        console.log(errors);
        res.status(500).send("uid error occurred");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

// Add new user at profile page
app.post("/user/add", (req, res) => {
    const id= req.body.id;
    const name= req.body.name;
    const email= req.body.email;
    const signup= req.body.signup;
    const signup_timestamp = signup.substring(0, 10) + ' ' + signup.substring(11, 19);
    const verified= req.body.verified;

    const sqlInsert = 
        "insert into user (id,name,email,signup,verified,wallet) values (?,?,?,?,?,'0')";
  
    db.query(sqlInsert, [id,name,email,signup_timestamp,verified],
        (errors, results) => {
            if (errors) {
                console.log(errors);
                res.status(500).send("Some internal error occurred");
            } else {
                res.status(200).send("Successfully added the new user");
            }
        }
    );
});

// Add transaction after user register for the course
app.post("/transaction/add/by-uid-cid", (req, res) => {
    const sqlInsert = 
        `insert into transaction (signup,user,course) values (now(),'${req.query.uid}','${req.query.cid}')`;
  
    db.query(sqlInsert,
        (errors, results) => {
            if (errors) {
                console.log(errors);
                res.status(500).send("Some internal error occurred");
            } else {
                res.status(200).send("Successfully added the transaction");
            }
        }
    );
});

// Get transaction completion status by user id and course id
app.get("/transaction/status/by-uid-cid", (req, res) => {
  db.query(
    `select completed from transaction where user = '${req.query.uid}' and course = '${req.query.cid}'`,
    (errors, results) => {
      if (errors) {
        console.log(errors);
        res.status(500).send("Error occurred for get transaction completion");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

// Get all transactions by user id
app.get("/transaction/all/by-uid", (req, res) => {
  db.query(
    `select * from transaction where user = '${req.query.uid}'`,
    (errors, results) => {
      if (errors) {
        console.log(errors);
        res.status(500).send("Error occurred for get transaction completion");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

// Get completed courses by user id
app.get("/transaction/completed/by-uid", (req, res) => {
  db.query(
    `select course 
    from transaction 
    where user = '${req.query.uid}' AND completed != '0000-00-00 00:00:00'`,
    (errors, results) => {
      if (errors) {
        console.log(errors);
        res.status(500).send("Error occurred for get completed courses");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

// Update transaction completion timestamp by user id and course id after completing quiz
app.put("/transaction/update/by-uid-cid", (req, res) => {
    const sqlUpdate = 
        `update transaction set completed = now() where user = '${req.query.uid}' and course = '${req.query.cid}'`;

    db.query(sqlUpdate,
        (errors, results) => {
            if (errors) {
                console.log(errors);
                res.status(500).send("Error occurred for updating transaction completion timestamp");
            } else {
                res.status(200).send("Successfully updated transaction completion");
            }
        }
    );
});

// Add earnings to user's wallet by user id and course id after completing quiz
app.put("/user/wallet/update/by-uid-cid", (req, res) => {
    const sqlUpdate = 
        `update user as u
        inner join transaction as t ON u.id = t.user
        inner join course as c ON t.course = c.id
        set u.wallet = u.wallet + c.earnings
        where u.id = '${req.query.uid}' and c.id = '${req.query.cid}'`;

    db.query(sqlUpdate,
        (errors, results) => {
            if (errors) {
                console.log(errors);
                res.status(500).send("Error occurred for adding earnings to wallet");
            } else {
                res.status(200).send("Successfully updated user wallet");
            }
        }
    );
});

app.listen(3002, () => {
    console.log("running on port 3002");
});