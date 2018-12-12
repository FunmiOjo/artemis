const router = require("express").Router();
const {User, Bookmark} = require("../db/models");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    if (req.query) {
      const users = await User.findAll({
        attributes: ["id"],
        where: req.query,
        include: [
          {
            model: Bookmark
          }
        ]
      });
      res.status(200).send(users);
    } else {
      const users = await User.findAll({
        attributes: ["id"]
      });
      res.json(users);
    }
  } catch (err) {
    next(err);
  }
});
