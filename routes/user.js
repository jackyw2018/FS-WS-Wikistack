// Express framework
const express = require('express');
const router = express.Router();

// Views
const { userList, userPages } = require('../views/');

// Database
const { Page, User } = require('../models');

router.get('/', (req, res, next) => {
  User.findAll()
    .then(users => {
      res.send(userList(users));
    })
    .catch(e => next(e));
});

router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const pages = await Page.findAll({
      where: {
        authorId: req.params.userId,
      },
    });

    res.send(userPages(user, pages));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
