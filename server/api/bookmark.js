const router = require("express").Router();

const {Bookmark} = require("../db/models");

router.get("/", async (req, res, next) => {
  try {
    const user = req.user;
    const bookmarks = await Bookmark.findAll({
      where: {
        userId: user.id
      }
    });

    res.status(200).send(bookmarks);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let bookmarkObj = req.body;
    bookmarkObj.userId = req.user.id;
    const newBookmark = await Bookmark.findOrCreate({
      where: bookmarkObj
    });
    res.status(200).send(newBookmark);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
