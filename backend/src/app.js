const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const dotenv = require('dotenv');

dotenv.config();

const mongoose = require('mongoose');

const router = require('./routes');

const App = new Koa();

const { PORT, MONGO_URI } = process.env;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch((error) => console.log(error));

App.use(cors())
  .use(bodyParser({}))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(PORT, () => {
    console.log(`🚀 ${PORT}에 연결중입니다. 🚀`);
  });
