const downloadDay = require('./download-day');
const { ONE_DAY, extractDateString } = require('../src/helpers');

// TODO - when do we want to _stop_ running this? like 2 days after or later?
// How does this play with github daily actions

// TODO accept args

const START_DATES = {
  2022: '2022-06-01',
}

const TARGET_DAYS = {
  yesterday: new Date(Date.now() - ONE_DAY),
  today: new Date(),
}
const validDayTypes = Object.keys(TARGET_DAYS);

const downloadYear = async (targetDay) => {
  if (!validDayTypes.includes(targetDay)) {
    throw new Error(`Supply a target end day ${validDayTypes.join(', ')}`)
  }

  const startDate = new Date(START_DATES[new Date().getUTCFullYear()])
  const endDate = new Date(extractDateString(TARGET_DAYS[targetDay])); // yesterday
  const days = ((endDate.getTime() - startDate.getTime()) / ONE_DAY) + 1; // plus one for inclusive

  const allDays = Array
    .from({ length: days })
    .map((_, i) => extractDateString(new Date(Date.now() - (ONE_DAY * (i + 1)))));

  for await (const dateString of allDays) {
    console.log('fetching day', dateString);
    await downloadDay({ dateString, type: 'panorama' });
    await downloadDay({ dateString, type: 'pyramid' });
  }

  console.log('Fetched days', allDays.join(', '))
}

// TODO - see if we're running from CLI or not - if we are need to invoke
// downloadYear(...process.argv.slice(2));

module.exports = downloadYear;
