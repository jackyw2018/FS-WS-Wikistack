const express = require('express');
const morgan = require('morgan');

const app = express();

// external middlewares
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

// route-handlers middlewares
const userRouter = require('./routes/user');
const wikiRouter = require('./routes/wiki');

// database
const models = require('./models');

models.db.authenticate().then(() => {
  console.log('connected to the database');
});

app.use('/wiki', wikiRouter);

app.get('/', (req, res, next) => {
  res.redirect('/wiki');
});

const init = async () => {
  await models.db.sync({ force: true });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`App listening in port ${PORT}`);
  });
};

init();
