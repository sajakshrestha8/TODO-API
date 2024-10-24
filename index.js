const express = require("express");
const app = express();
const Port = 8000;

app.use(express.json());

const Mysql = require("mysql");
const sqlconnection = Mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todo api",
});

sqlconnection.connect((err) => {
  if (err) {
    console.log("DataBase connection failed:" + err);
  } else {
    console.log("Database connected successfully");
  }
});

app.post("/addtask", (req, res) => {
  let payload = req.body;
  res.send(payload);
});

app.listen(Port, () => console.log("Server is running in port", Port));
