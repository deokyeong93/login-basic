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

router.post('/login', async (ctx) => {
  try {
    const userInfo = await User.findOne({ email: ctx.request.body.email });
    if (!userInfo) {
      ctx.body = {
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      };
      return;
    }

    const isMatched = await userInfo.comparePassword(ctx.request.body.password);
    if (!isMatched) {
      if (!userInfo) {
        ctx.body = {
          loginSuccess: false,
          message: '비밀번호가 일치하지 않습니다.',
        };
        return;
      }
    }

    // JWT 토큰 발급하기
  } catch (error) {
    ctx.throw(500, error);
  }
});

module.exports = router;
