const Sequelize = require("sequelize");
const db = require("../db");
const Tag = require("../index");

const Channel = db.define("channel", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

Channel.prototype.incrementScore = async function(epTags) {
  const INCREMENTER = 0.1;

  let chanTags = await this.getTags();
  chanTags.forEach(chanTag => {
    if (epTags.includes(chanTag.name)) {
      let score = chanTag.score || 0.5;
      this.addTag(chanTag, {
        through: {
          score: score * INCREMENTER + score
        }
      });
    }
  });
};

Channel.prototype.decrementScore = async function(epTags) {
  const DECREMENTER = 0.2;

  let chanTags = await this.getTags();
  chanTags.forEach(chanTag => {
    if (epTags.includes(chanTag.name)) {
      let score = chanTag.score || 0.5;
      this.addTag(chanTag, {
        through: {
          score: score - score * DECREMENTER
        }
      });
    }
  });
};

module.exports = Channel;
