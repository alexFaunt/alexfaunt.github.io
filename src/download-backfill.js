const downloadDay = require('./download-day');
const { ONE_DAY, extractDateString } = require('./helpers');

const backfill = async () => {
  const backfillDays = Array
    .from({ length: 14 })
    .map((_, i) => extractDateString(new Date(Date.now() - (ONE_DAY * (i + 1)))));

  for await (const day of backfillDays) {
    console.log('fetching day', day);
    await downloadDay(day);
  }
}

backfill();
