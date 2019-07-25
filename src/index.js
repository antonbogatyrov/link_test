const axios = require('axios');
const ora = require('ora');
require('colors');

const config = require('./config');

const total = config.length;
const failed = [];

const onSuccess = (spiner) => () => {
  spiner.succeed();
};

const onError = (spiner, link) => (e) => {
  failed.push(link);
  spiner.fail();
};

const promises = config.map(({ link }) => {
  const spiner = ora(`Loading ${link}`).start();
  return axios
    .get(link)
    .then(onSuccess(spiner))
    .catch(onError(spiner, link));
});

Promise.all(promises).then(() => {
  if (!failed.length) {
    return console.log('Done without Errors'.green, 'for', `${total}`.green, 'links');
  }
  console.log('failed'.red, 'for', `${failed.length}`.red, `/${total} links`);
  process.exit(1);
});
