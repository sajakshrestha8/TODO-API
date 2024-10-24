const express = require("express");
const sequelize = require("./utils/database");
const todo = require("./models/todo_list");

const app = express();
const Port = 8000;

sequelize
  .sync()
  .then((result) => {
    todo
      .create({
        Title: "Ma aba yekxin ma sutxu",
        Expiry_Date: 2024 - 2,
        Created_Date: 2024 - 2,
        Updated_Date: 2024 - 2,
      })
      .then((data) => {
        console.log(data);
      });
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());

app.listen(Port, () => console.log("Server is running in port", Port));
