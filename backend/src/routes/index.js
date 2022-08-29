const Router = require('@koa/router');
const { User } = require('../models/User');

const router = new Router();

router.get('/', (ctx) => {
  ctx.body = `GET${ctx.request.path}`;
});

router.post('/register', async (ctx) => {
  const user = new User(ctx.request.body);

  try {
    await user.save();
    ctx.body = {
      success: true,
      save: user,
    };
  } catch (error) {
    ctx.thorw(500, error);
  }
});

module.exports = router;
