const server = require("./server");
const express = require("express");
let router = express.Router();

// Get user details by specific id at profile page
router.get("/user/by-uid", (req, res) => {
  server.db.query(
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
router.post("/user/add", (req, res) => {
    const id= req.body.id;
    const name= req.body.name;
    const email= req.body.email;
    const signup= req.body.signup;
    const signup_timestamp = signup.substring(0, 10) + ' ' + signup.substring(11, 19);
    const verified= req.body.verified;

    const sqlInsert = 
        "insert into user (id,name,email,signup,verified,wallet) values (?,?,?,?,?,'0')";
  
    sever.db.query(sqlInsert, [id,name,email,signup_timestamp,verified],
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

// Add earnings to user's wallet by user id and course id after completing quiz
router.put("/user/wallet/update/by-uid-cid", (req, res) => {
  const sqlUpdate = 
      `update user as u
      inner join transaction as t ON u.id = t.user
      inner join course as c ON t.course = c.id
      set u.wallet = u.wallet + c.earnings
      where u.id = '${req.query.uid}' and c.id = '${req.query.cid}'`;

  server.db.query(sqlUpdate,
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

module.exports = { router };
