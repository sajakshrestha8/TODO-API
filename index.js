const express = require("express");
const sequelize = require("./utils/database");
const todo = require("./models/todo_list");
const sequilize = require("./utils/database");
const { where } = require("sequelize");
const { FORCE } = require("sequelize/lib/index-hints");
const morgan = require("morgan");
const rateimit = require("express-rate-limit");

let id;
let Status;

const app = express();
const Port = 8000;

app.use(morgan("dev"));
app.use(express.json());

const limiter = rateimit.rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
});

app.use(limiter);

app.post("/addtask", (req, res) => {
  let { id, Title, Expiry_Date, Created_Date, Updated_Date, Status } = req.body;
  sequelize.sync().then(() => {
    todo
      .create({
        id,
        Title: Title,
        Expiry_Date: Expiry_Date,
        Created_Date,
        Updated_Date,
        Status,
      })
      .then((task) => {
        res.send("Task added successfully");
        console.log(task.id);
      })
      .catch((err) => {
        res.send(err);
      });
  });
});

app.get("/viewtask", (req, res) => {
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

app.delete("/deletetask", (req, res) => {
  let { reqid } = req.body;
  console.log(reqid);

  sequelize.sync().then(() => {
    return todo
      .destroy({
        where: {
          id: reqid,
        },
      })
      .then((data) => {
        res.send(" Deleted successfully");
      })
      .catch((er) => {
        res.send(er);
      });
  });
});

app.put("/updatetask", (req, res) => {
  let { id, Title, checkbox } = req.body;
  Status = checkbox ? "completed" : "pending";
  sequelize.sync().then(() => {
    return todo.update(
      { Title: Title, checkbox: checkbox, Status: Status },
      {
        where: {
          id: id,
        },
      }
    );
  });
  res.send(Status);
});

app.listen(Port, () => console.log("Server is running in port", Port));
