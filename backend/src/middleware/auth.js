const { User } = require('../models/User');

const auth = async (ctx, next) => {
  try {
    const token = ctx.cookies.get('x_auth');

    const user = await User.findByToken(token);

    if (!user) {
      ctx.body = {
        isAuth: false,
        error: true,
      };
      return;
    }

    ctx.req.token = token;
    ctx.req.user = user;

    await next();
  } catch (error) {
    ctx.throw(500);
  }
};

module.exports = auth;
