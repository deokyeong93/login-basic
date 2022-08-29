const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const router = require('./routes');

const App = new Koa();

const port = 8000;

App.use(cors())
  .use(bodyParser({}))
  .use(router.routes())
  .listen(port, () => {
    console.log(`🚀 Server listening http://127.0.0.1:${port}/ 🚀`);
  });
