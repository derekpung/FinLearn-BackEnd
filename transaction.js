





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
