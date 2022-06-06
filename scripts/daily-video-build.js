const { execSync } = require('child_process')
const path = require('path');

const { ONE_DAY, extractDateString } = require('../src/helpers');

// Under normal circumstances we only need to download yesterday not all the days
// const downloadDay = require('./download-day');
const downloadYear = require('./download-year');

const yesterday = extractDateString(new Date(Date.now() - ONE_DAY));

const types = ['panorama', 'pyramid'];

const shellOptions = {
  cwd: path.resolve(__dirname, '../'),
}

const run = async () => {
  await downloadYear();

  for await (const type of types) {
    // Get yesterdays images for this type
    // await downloadDay({ dateString: yesterday, type });

    // Create yesterdays video for this type
    console.log('===== Processing yesterdays video =====')
    execSync(`./scripts/process-day.sh ${type} ${yesterday.replace(/-/g, '/')}`, shellOptions);

    // Create the video for the whole year
    // TODO - This is very slow - could probably just concat the new one to the old one to speed it up
    console.log('===== Processing full year video =====')
    execSync(`./scripts/process-year.sh ${type} ${yesterday.replace(/-.*$/, '')}`, shellOptions);
  }
}

run();
