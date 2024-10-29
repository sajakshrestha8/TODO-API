const express = require("express");
const jwt = require("jsonwebtoken");
const sequelize = require("./utils/database");
const todo = require("./models/todo_list");
const user = require("./models/User_list.js");
const verifyToken = require("./middleware/Tokenverification");
const { where } = require("sequelize");
const { FORCE } = require("sequelize/lib/index-hints");
const morgan = require("morgan");
const rateimit = require("express-rate-limit");
const sequilize = require("./utils/database");
const app = express();
const Port = 8000;

//rate limmiter
const limiter = rateimit.rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: "Too many request send, wait for few minutes",
});

//variables
let id;
let Status;

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(limiter);

//One-Many Relation
user.hasMany(todo);

//Request for adding the task
app.post("/addtask", verifyToken, (req, res) => {
  let { id, Title, Expiry_Date, Created_Date, Updated_Date, Status, UserId } =
    req.body;
  sequelize.sync().then(() => {
    todo
      .create({
        id,
        Title: Title,
        Expiry_Date: Expiry_Date,
        Created_Date,
        Updated_Date,
        Status,
        UserId: req.userId,
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

//Request for viewing the task
app.get("/viewusertask", verifyToken, (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return todo.findAll({
        attributes: ["id", "Title"],
        where: {
          UserId: req.userId,
        },
      });
    })
    .then((table) => {
      res.json(table);
    })
    .catch((err) => {
      res.send(err);
    });
});

//Request for deleting the task
app.delete("/deletetask", verifyToken, (req, res) => {
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

//Request for updadting the task
app.put("/updatetask", verifyToken, (req, res) => {
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

//route for register
app.post("/register", (req, res) => {
  let { User, password } = req.body;
  sequelize.sync().then(() => {
    return user
      .create({
        User: User,
        password: password,
      })
      .then(() => {
        res.send("La hai user add huna parxa aba");
      })
      .catch((err) => {
        res.send(err);
      });
  });
});

//route to view all task
app.get("/viewalltask", (req, res) => {
  sequilize.sync().then(() => {
    return combinedTable
      .findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((er) => {
        res.send(er);
      });
  });
});

//route for login
app.post("/login", async (req, res) => {
  let { username, password } = req.body;
  let auth = await user.findOne({
    where: {
      User: username,
      password: password,
    },
  });
  try {
    if (auth) {
      const token = jwt.sign({ User: auth.id }, "sajak", {
        expiresIn: "1h",
      });
      res.json({
        message: "Login successfull",
        token: token,
      });
    } else {
      res.send("login vayena hai sathi");
    }
  } catch (error) {
    res.send(err);
  }
});

app.listen(Port, () => console.log("Server is running in port", Port));
