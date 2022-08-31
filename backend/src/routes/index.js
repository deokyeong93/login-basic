const Router = require('@koa/router');
const { pick } = require('../lib/fp');
const auth = require('../middleware/auth');

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
      ctx.body = {
        loginSuccess: false,
        message: '비밀번호가 일치하지 않습니다.',
      };
      return;
    }

    // JWT 토큰 발급하기
    const token = userInfo.generateJWT();
    userInfo.token = token;
    await userInfo.save();

    ctx.cookies.set('x_auth', token);
    ctx.status = 200;
    ctx.body = {
      loginSuccess: true,
      userId: userInfo._id,
    };
  } catch (error) {
    ctx.throw(500, error);
  }
});

router.get('/auth', auth, (ctx) => {
  ctx.status = 200;
  ctx.body = {
    isAdmin: ctx.req.user.role !== 0,
    isAuth: true,
    ...pick(
      ctx.req.user,
      ['_id', 'email', 'name', 'lastname', 'role', 'image'],
    ),
  };
});

router.get('/logout', auth, async (ctx) => {
  try {
    const user = await User.findOneAndUpdate(
      { id: ctx.req.user._id },
      { token: '' },
    );

    if (!user) {
      ctx.body = {
        success: false,
      };
    }

    ctx.body = {
      success: true,
    };
  } catch (error) {
    ctx.throw(500);
  }
});

module.exports = router;
