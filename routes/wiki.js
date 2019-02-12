// Express framework
const express = require('express');
const router = express.Router();

// Views
const { addPage, wikiPage, main, editPage } = require('../views/');

// Database
const { Page, User } = require('../models');

router.get('/', (req, res, next) => {
  Page.findAll()
    .then(pages => {
      //   console.log(pages);
      res.send(main(pages));
    })
    .catch(e => next(e));
});

router.post('/', (req, res, next) => {
  const { title, content, name, email, status } = req.body;

  const page = new Page({
    title,
    content,
    status,
  });

  User.findOrCreate({ where: { name, email } })
    .then(data => {
      const userInstance = data[0];
      page.setAuthor(userInstance);

      page
        .save()
        .then(() => {
          res.redirect(`/wiki/${page.slug}`);
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));
});

router.get('/add', (req, res, next) => {
  res.send(addPage());
});

router.get('/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug,
      },
    });

    const author = await page.getAuthor();
    res.send(wikiPage(page, author));
  } catch (e) {
    res.send(404);
  }
});

router.get('/:slug/edit', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug,
      },
    });

    const author = await page.getAuthor();
    res.send(editPage(page, author));
  } catch (e) {
    res.send(404);
  }
});

module.exports = router;
