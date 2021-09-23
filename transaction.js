const server = require("./server");
const express = require("express");
let router = express.Router();

// Add transaction after user register for the course
router.post("/transaction/add/by-uid-cid", (req, res) => {
  const sqlInsert = 
      `insert into transaction (signup,user,course) values (now(),'${req.body.params.uid}','${req.body.params.cid}')`;

  server.db.query(sqlInsert,
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

// Get completed transactions
router.get("/transaction/status/by-user-complete", (req, res) => {
  server.db.query(
    `select * from transaction as t inner join course as c ON t.course = c.id where t.user = '${req.query.uid}' and t.completed != "0000-00-00 00:00:00"`,
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

// Get incomplete transactions
router.get("/transaction/status/by-user-incomplete", (req, res) => {
  server.db.query(
    `select * from transaction where user = '${req.query.uid}' and completed = "0000-00-00 00:00:00"`,
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
router.get("/transaction/all/by-uid", (req, res) => {
server.db.query(
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


// Update transaction completion timestamp by user id and course id after completing quiz
router.put("/transaction/update/by-uid-cid", (req, res) => {
  const sqlUpdate = 
      `update transaction set completed = now() where user = '${req.body.params.uid}' and course = '${req.body.params.cid}'`;

  server.db.query(sqlUpdate,
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


module.exports = { router };