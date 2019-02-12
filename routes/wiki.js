// Express framework
const express = require('express');
const router = express.Router();

// Views
const { addPage, wikiPage, main } = require('../views/');

// Database
const { Page } = require('../models');

router.get('/', (req, res, next) => {
  Page.findAll()
    .then(pages => {
      console.log(pages);
      res.send(main(pages));
    })
    .catch(e => next(e));
});

router.post('/', (req, res, next) => {
  const { title, content } = req.body;

  const page = new Page({
    title,
    content,
  });

  page
    .save()
    .then(() => {
      //   console.log(page);
      res.redirect(`/wiki/${page.slug}`);
    })
    .catch(e => next(e));
});

router.get('/add', (req, res, next) => {
  res.send(addPage());
});

router.get('/:slug', (req, res, next) => {
  Page.findOne({
    where: {
      slug: req.params.slug,
    },
  })
    .then(data => res.send(wikiPage(data)))
    .catch(e => next(e));
});

module.exports = router;
