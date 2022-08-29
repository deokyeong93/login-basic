/* eslint-disable import/prefer-default-export */
const FpAdapter = require('./adapter');

const instance = new FpAdapter();

const pick = (object, pickList = []) => instance.pick(object, pickList);

module.exports = {
  pick,
};
