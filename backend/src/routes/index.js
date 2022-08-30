const Router = require('@koa/router');
const { pick } = require('../lib/fp');

const { User } = require('../models/User');

const router = new Router();

router.get('/', (ctx) => {
  ctx.body = `GET${ctx.request.path}`;
});

router.post('/register', async (ctx) => {
  const user = new User(ctx.request.body);
  // 공부할 부분, save 콜백함수 먹이면 원하는 동작이 잘 안나옴.. 이유는 promise라..
  try {
    await user.save();
    ctx.body = {
      success: true,
      save: pick(user, ['name', 'email']),
    };
  } catch (error) {
    ctx.thorw(500, error);
  }
});

module.exports = router;
