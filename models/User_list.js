const sequelize = require("sequelize");
const sequelizeconn = require("../utils/database");

const user = sequelizeconn.define("Users", {
  Uid: {
    type: sequelize.INTEGER,
    allowNull: false,
  },
  User: {
    type: sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: sequelize.STRING,
    allowNull: false,
  },
});

module.exports = user;
