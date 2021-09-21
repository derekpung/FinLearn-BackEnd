// open another terminal and execute "npm run devStart" at the directory containing server.js
const express = require("express");
const user = require("./user"); //importing user.js
const account = require("./transaction"); //importing transaction.js
const user = require("./course"); //importing course.js


const app = express();
app.use(express.json());

// INSERT ROUTERS (3)


app.listen(3002, () => {
  console.log("running on port 3002");
});