const express = require("express");
const sequelize = require("./utils/database");
const todo = require("./models/todo_list");
const sequilize = require("./utils/database");
const uuid = require("uuid");
const { where } = require("sequelize");
let id;
let Title;

const app = express();
const Port = 8000;
// console.log(uuid.v6());

app.use(express.json());

app.post("/addtask", (req, res) => {
  let {
    id = id,
    Title = Title,
    Expiry_Date,
    Created_Date,
    Updated_Date,
    Status,
  } = req.body;
  sequelize.sync().then(() => {
    todo
      .create({
        id: uuid.v4(),
        Title: Title,
        Expiry_Date: Expiry_Date,
        Created_Date,
        Updated_Date,
        Status,
      })
      .then((task) => {
        res.send("Task added Succcessfully");
      })
      .catch((err) => {
        res.send(err);
      });
  });
});

app.post("/viewtask", (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return todo.findAll({
        attributes: ["id", "Title"],
        where: id,
      });
    })
    .then((table) => {
      res.json(table);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(Port, () => console.log("Server is running in port", Port));
