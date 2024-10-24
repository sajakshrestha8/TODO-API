const Sequelize = require("sequelize");

const sequilize = new Sequelize("todo api", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequilize;
