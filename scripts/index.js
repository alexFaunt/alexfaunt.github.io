const downloadYear = require('./download-year');
const downloadDay = require('./download-day');
const uploadVideo = require('./upload-video');

const child_process = require('child_process')
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const { START_DATES } = require('./config');

const { extractDateString, ONE_DAY } = require('../src/helpers');

const exec = promisify(child_process.exec);

const shellOptions = {
  cwd: path.resolve(__dirname, '../'),
}

const TARGET_DAYS = {
  yesterday: new Date(Date.now() - ONE_DAY),
  today: new Date(),
}

const run = async (targetDay, accessToken, skipDownload, skipCreate) => {
  // TODO change this - download all images we don't have e.g. find the last folder we do have and download-day from there
  // Or add back caching

  if (!skipDownload) {
    // await downloadYear(targetDay);
    await downloadDay({ dateString: extractDateString(TARGET_DAYS[targetDay]), type: 'panorama' });
    await downloadDay({ dateString: extractDateString(TARGET_DAYS[targetDay]), type: 'pyramid' });
  }

  const targetDateString = extractDateString(TARGET_DAYS[targetDay]).replace(/-/g, '/');
  const targetYearString = targetDateString.replace(/\/.*/, '');

  if (!skipCreate) {
    // create the videos for yesterday + full year
    console.log('creating videos')
    await Promise.all([
      exec(`./scripts/process-day.sh panorama ${targetDateString}`, shellOptions),
      exec(`./scripts/process-day.sh pyramid ${targetDateString}`, shellOptions),
      // exec(`./scripts/process-year.sh panorama ${targetYearString}`, shellOptions),
      // exec(`./scripts/process-year.sh pyramid ${targetYearString}`, shellOptions),
    ]);
  }

  // upload-video for each
  const videoIds = await Promise.all([
    uploadVideo({ accessToken, videoFolder: targetDateString, fromDate: targetDateString, toDate: targetDateString, type: 'panorama' }),
    uploadVideo({ accessToken, videoFolder: targetDateString, fromDate: targetDateString, toDate: targetDateString, type: 'pyramid' }),
    // uploadVideo({ accessToken, videoFolder: targetYearString, fromDate: START_DATES[targetYearString].replace(/-/g, '/'), toDate: targetDateString, type: 'panorama' }),
    // uploadVideo({ accessToken, videoFolder: targetYearString, fromDate: START_DATES[targetYearString].replace(/-/g, '/'), toDate: targetDateString, type: 'pyramid' }),
  ]);

  console.log('replacing ids', videoIds.join(', '));

  const indexPage = path.resolve(__dirname, '../src/pages/index.jsx');
  const content = fs.readFileSync(indexPage, 'utf-8')
    .replace(/const DAY_PANORAMA_ID = '(\w*)';/, `const DAY_PANORAMA_ID = '${videoIds[0]}';`)
    .replace(/const DAY_PYRAMID_ID = '(\w*)';/, `const DAY_PYRAMID_ID = '${videoIds[1]}';`)
    // .replace(/const FULL_PANORAMA_ID = '(\w*)';/, `const FULL_PANORAMA_ID = '${videoIds[2]}';`)
    // .replace(/const FULL_PYRAMID_ID = '(\w*)';/, `const FULL_PYRAMID_ID = '${videoIds[3]}';`);

  fs.writeFileSync(indexPage, content, 'utf-8');

  console.log('pushing new ids!');

  await exec('git add ./src/pages/index.jsx');
  await exec(`git commit -m 'update video ids'`);
  await exec('git push');

  console.log('done!');

  // TODO unpublish old full timelapse videos?
}

const [targetDay, token, skipDownloadStr, skipCreateStr] = process.argv.slice(2);
run(targetDay, token, skipDownloadStr === 'true', skipCreateStr === 'true');
