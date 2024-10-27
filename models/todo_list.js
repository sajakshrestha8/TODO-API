const Sequelize = require("sequelize");
const sequilize = require("../utils/database");

const todo = sequilize.define("tests", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  Title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Expiry_Date: {
    type: Sequelize.DATE,
    timestampes: true,
    allowNull: false,
  },
  Created_Date: {
    type: Sequelize.DATE,
    timestampes: true,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  Updated_Date: {
    type: Sequelize.DATE,
    timestampes: true,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  checkbox: {
    type: Sequelize.BOOLEAN,
  },
  Status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "pending",
  },
});

module.exports = todo;
