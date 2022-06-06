const { execSync } = require('child_process')
const path = require('path');

const { extractDateString } = require('../src/helpers');

// Under normal circumstances we only need to download today not all the days
// const downloadDay = require('./download-day');
const downloadYear = require('./download-year');

const today = extractDateString(new Date(Date.now()));

const types = ['panorama', 'pyramid'];

const shellOptions = {
  cwd: path.resolve(__dirname, '../'),
}

const run = async () => {
  // Download everything because we've not sorted out the caching yet
  await downloadYear();

  for await (const type of types) {
    // Get todays images for this type
    // await downloadDay({ dateString: today, type });

    // Create todays video for this type
    console.log('===== Processing todays video =====')
    execSync(`./scripts/process-day.sh ${type} ${today.replace(/-/g, '/')}`, shellOptions);

    // Create the video for the whole year
    // TODO - This is very slow - could probably just concat the new one to the old one to speed it up
    console.log('===== Processing full year video =====')
    execSync(`./scripts/process-year.sh ${type} ${today.replace(/-.*$/, '')}`, shellOptions);
  }
}

run();
