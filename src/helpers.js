const extractDateString = (date) => date.toISOString().replace(/T.*$/, '');

const ONE_DAY = 24 * 60 * 60 * 1000;

module.exports = {
  ONE_DAY,
  extractDateString,
}
