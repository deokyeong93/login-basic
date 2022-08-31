/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config/index');

const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre('save', async function (next) {
  // 공부할 부분, bcrypt methods들에 콜백함수 먹이면 원하는 동작이 잘 안나옴.. 이유는 promise라..
  const user = this;

  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const plainPassword = user.password;

      const hash = await bcrypt.hash(plainPassword, salt);

      user.password = hash;
    } catch (error) {
      await next(error);
    }
  }

  await next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
  const { password } = this;

  const isMatched = await bcrypt.compare(plainPassword, password);
  return isMatched;
};

userSchema.methods.generateJWT = function () {
  const { _id } = this;

  return jwt.sign(_id.toHexString(), SECRET_KEY);
};

userSchema.statics.findByToken = async function (token) {
  const user = this;

  const decoded = jwt.verify(token, SECRET_KEY);
  const result = await user.findOne({ _id: decoded, token });

  return result;
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
