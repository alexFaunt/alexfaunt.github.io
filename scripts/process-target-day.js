const { execSync } = require('child_process')
const path = require('path');

const { extractDateString, ONE_DAY } = require('../src/helpers');

const shellOptions = {
  cwd: path.resolve(__dirname, '../'),
}

const TARGET_DAYS = {
  yesterday: new Date(Date.now() - ONE_DAY),
  today: new Date(),
}

const validDayTypes = Object.keys(TARGET_DAYS);

const run = async (videoType, targetDay) => {
  if (!validDayTypes.includes(targetDay)) {
    throw new Error(`Supply a target end day ${validDayTypes.join(', ')}`)
  }

  const targetDateString = extractDateString(TARGET_DAYS[targetDay]).replace(/-/g, '/');

  console.log(`===== Processing ${videoType} ${targetDateString} video =====`)

  execSync(`./scripts/process-day.sh ${videoType} ${targetDateString}`, shellOptions);
}

run(...process.argv.slice(2));
