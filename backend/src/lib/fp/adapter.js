/* eslint-disable class-methods-use-this */
const lodashPick = require('lodash/pick');

class FpAdapter {
  pick(object, pickList = []) {
    return lodashPick(object, pickList);
  }
}

module.exports = FpAdapter;
