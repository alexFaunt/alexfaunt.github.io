const { execSync } = require('child_process')
const path = require('path');

const { extractDateString, ONE_DAY } = require('../src/helpers');

const shellOptions = {
  cwd: path.resolve(__dirname, '../'),
}

const DAY_TYPES = {
  yesterday: new Date(Date.now() - ONE_DAY),
  today: new Date(),
}

const run = async (videoType, dayType) => {
  const targetDay = extractDateString(DAY_TYPES[dayType]).replace(/-/g, '/');

  console.log(`===== Processing ${targetDay} ${videoType} video =====`)

  execSync(`./scripts/process-day.sh ${videoType} ${targetDay}`, shellOptions);
}

run(...process.argv.slice(2));
