const express = require("express");
const sequelize = require("./utils/database");
const todo = require("./models/todo_list");
const sequilize = require("./utils/database");

const app = express();
const Port = 8000;

app.use(express.json());

app.post("/addtask", (req, res) => {
  let { Title, Expiry_Date, Created_Date, Updated_Date, Status } = req.body;
  sequelize.sync().then(() => {
    todo
      .create({
        Title: Title,
        Expiry_Date: Expiry_Date,
        Created_Date: Created_Date,
        Updated_Date: Updated_Date,
        Status,
      })
      .then((task) => {
        res.send("Task added Succcessfully", task);
      })
      .catch((err) => {
        res.send(err);
      });
  });
});

app.listen(Port, () => console.log("Server is running in port", Port));
