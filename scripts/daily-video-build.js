const { execSync } = require('child_process')
const path = require('path');

const { extractDateString, ONE_DAY } = require('../src/helpers');

// Under normal circumstances we only need to download targetDay not all the days
const downloadDay = require('./download-day');
const downloadYear = require('./download-year');

// TOOD - accept args instead of guessing

const targetDay = new Date().getHours() >= 23
  ? extractDateString(new Date())
  : extractDateString(new Date(Date.now() - ONE_DAY));

const types = ['panorama', 'pyramid'];

const shellOptions = {
  cwd: path.resolve(__dirname, '../'),
}

const run = async () => {
  // Download everything because we've not sorted out the caching yet
  await downloadYear();

  for await (const type of types) {
    // Get targetDays images for this type
    // await downloadDay({ dateString: targetDay, type });

    // Create targetDays video for this type
    console.log('===== Processing targetDays video =====')
    execSync(`./scripts/process-day.sh ${type} ${targetDay.replace(/-/g, '/')}`, shellOptions);

    // Create the video for the whole year
    // TODO - This is very slow - could probably just concat the new one to the old one to speed it up
    console.log('===== Processing full year video =====')
    execSync(`./scripts/process-year.sh ${type} ${targetDay.replace(/-.*$/, '')}`, shellOptions);
  }
}

run();
