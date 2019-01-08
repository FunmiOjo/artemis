const Sequelize = require("sequelize");
const db = require("../db");

const Episode = db.define("episode", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  date: {
    type: Sequelize.DATE
  },
  imageURL: {
    type: Sequelize.STRING,
    defaultValue:
      "https://cdn.pixabay.com/photo/2016/04/11/14/59/podcast-icon-1322239_1280.png"
  },
  audioURL: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  length: {
    type: Sequelize.INTEGER
  },
  description: {
    type: Sequelize.TEXT
  }
});

module.exports = Episode;
