const router = require("express").Router();
const {ChannelVector} = require("../../recommendations/utilities");

const {
  Channel,
  Genre,
  Episode,
  ChannelEpisode,
  ChannelTag
} = require("../db/models");

router.get("/", async (req, res, next) => {
  try {
    if (req.query) {
      const channels = await Channel.findAll({
        where: req.query,
        include: [
          {
            model: Episode,
            through: ChannelEpisode
          }
        ]
      });
      res.status(200).send(channels);
    } else {
      const channels = await Channel.findAll({});
      res.status(200).send(channels);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/user", async (req, res, next) => {
  const userId = req.session.passport.user;
  try {
    const channels = await Channel.findAll({
      where: {
        userId
      }
    });
    res.status(200).send(channels);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/episodes", async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id, {
      include: [{model: Episode}]
    });
    res.send(channel.episodes);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const channel = await Channel.findById(id, {
      include: [
        {
          model: ChannelTag
        },
        {
          model: Episode,
          through: ChannelEpisode
        },
        {
          model: Genre
        }
      ]
    });
    res.status(200).send(channel);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let channelObj = req.body;
    channelObj.userId = req.user.id;
    const newChannel = await Channel.create(channelObj);
    res.status(200).send(newChannel);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const channel = await Channel.findById(id, {
      include: [
        {
          model: ChannelTag
        },
        {
          model: Genre
        }
      ]
    });
    const newVectorValue = new ChannelVector(channel.channelTags);
    const updatedChannel = await Channel.update(
      {vector: newVectorValue},
      {
        where: {
          id: id
        }
      }
    );
    res.status(200).send(updatedChannel);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/tags", async (req, res, next) => {
  try {
    const id = req.params.id;
    const tags = await ChannelTag.findAll({
      where: {
        channelId: id
      }
    });
    res.status(200).send(tags);
  } catch (err) {
    next(err);
  }
});

router.put("/:id/tags", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const method = req.body.method;
    const tagNames = req.body.tags;
    const episode = req.body.episode;
    let chan = await Channel.findById(id);
    let chanEp = await ChannelEpisode.find({
      where: {
        episodeId: episode.id,
        channelId: id
      }
    });
    if (method === "like") {
      chan.incrementScore(tagNames);
      await chanEp.update({
        liked: true
      });
    }
    if (method === "dislike") {
      chan.decrementScore(tagNames);
      await chanEp.update({
        liked: false
      });
    }

    res.status(200).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
