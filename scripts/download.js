const { ONE_DAY, extractDateString } = require('../src/helpers');

const downloadDay = require('./download-day');

const yesterday = extractDateString(new Date(Date.now() - ONE_DAY));

const run = async () => {
  await downloadDay({ dateString: yesterday, type: 'panorama' });
  await downloadDay({ dateString: yesterday, type: 'pyramid' });
}

run();
