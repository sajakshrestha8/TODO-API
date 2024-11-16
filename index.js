const express = require("express");
const jwt = require("jsonwebtoken");
const sequelize = require("./utils/database");
const todo = require("./models/todo_list");
const user = require("./models/User_list.js");
const verifyToken = require("./middleware/Tokenverification");
const { Op, where } = require("sequelize");
const morgan = require("morgan");
const cron = require("node-cron");
const rateimit = require("express-rate-limit");
const sequilize = require("./utils/database");
const { messaging } = require("firebase-admin");
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
let expiredTasks = [];
let activeClients = [];

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(limiter);

//One-Many Relation
user.hasMany(todo);

//testing the node-cron
cron.schedule("* * * * *", async () => {
  console.log("Checking if there is any task that is expired");
  try {
    let updatedTask = await todo.update(
      {
        Status: "expired",
      },
      {
        where: {
          Expiry_Date: {
            [Op.lt]: new Date(),
          },
          Status: "pending",
        },
      }
    );

    const notification = {
      message: "Task expired vako xa hai",
    };

    activeClients.forEach((client) =>
      client.write(`data: ${JSON.stringify(notification)}\n\n`)
    );

    console.log(notification);
  } catch (err) {
    console.log(err);
  }
});

//creating a SSE server
app.get("/sseevents", async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });
  activeClients.push(res);

  req.on("close", () => {
    const index = activeClients.indexOf(res);
    if (index !== -1) activeClients.splice(index, 1);
  });
});

//Request for adding the task
app.post("/addtask", verifyToken, (req, res) => {
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
    try {
      return todo
        .destroy({
          where: {
            id: reqid,
            UserId: req.userId,
          },
        })
        .then((data) => {
          res.send("Deleted successfully");
        });
    } catch (error) {
      res.send(error);
    }
  });
});

//Request for updadting the task
app.put("/updatetask", verifyToken, (req, res) => {
  let { id, Title, checkbox } = req.body;
  Status = checkbox ? "completed" : "pending";
  sequelize
    .sync()
    .then(() => {
      return todo.update(
        { Title: Title, checkbox: checkbox, Status: Status },
        {
          where: {
            id: id,
            UserId: req.userId,
          },
        }
      );
    })
    .then((result) => {
      console.log(result);
      if (result[0] === 0) {
        res
          .status(401)
          .send(
            "Either the task is not found or the user doesn't own the task"
          );
      } else {
        res.status(200).send("Task updated successfully");
      }
    });
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
    return todo
      .findAll({
        where: {
          Status: ["pending", "completed"],
        },
      })
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
        message:
          expiredTasks.length > 0
            ? "You have some expired Task"
            : "You have no any expired task",
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

module.exports = app;
