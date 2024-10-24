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
  let { id, Title, Expiry_Date, Created_Date, Updated_Date, Status } = req.body;
  sqlconnection.query(
    `INSERT INTO todo_list (id, Title, Expiry__Date, Created_Date, Updated_Date, Status) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, Title, Expiry_Date, Created_Date, Updated_Date, Status],
    (err, result) => {
      if (result) {
        res.send(result);
      } else {
        res.send(err);
      }
    }
  );
});

app.post("/viewtask", (req, res) => {
  sqlconnection.query("SELECT * FROM todo_list", (err, result) => {
    if (result) {
      res.send(result);
    } else {
      res.send(err);
    }
  });
});

app.listen(Port, () => console.log("Server is running in port", Port));
