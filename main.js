// open another terminal and execute "npm run devStart" at the directory containing server.js
const express = require("express");
const user = require("./user"); //importing user.js
const transaction = require("./transaction"); //importing transaction.js
const course = require("./course"); //importing course.js
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//ROUTERS (3)
app.use(user.router);
app.use(transaction.router);
app.use(course.router);

app.listen(3002, () => {
  console.log("running on port 3002");
});