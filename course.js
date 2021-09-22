const express = require("express");
const server = require("./server");
let router = express.Router();

// Get all courses at explore page
router.get('/course/all', (req, res) => {
  server.db.query("SELECT * FROM course;", (err,result)=>{
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
router.get('/course/by-cid', (req, res) => {
  server.db.query(`SELECT * FROM course where id = '${req.query.cid}'`, (err,result)=>{
      if(err){
          console.log(err);
          res.status(500).send("cid error occurred");
      }
      else{
          res.status(200).send(result);
      }    
  });
});

// Get completed courses by user id
router.get("/transaction/completed/by-uid", (req, res) => {
  server.db.query(
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


module.exports = { router };