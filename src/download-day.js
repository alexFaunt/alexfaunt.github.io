const downloadImage = require('./download-image');
const { ONE_DAY, extractDateString } = require('./helpers');

const yesterday = extractDateString(new Date(Date.now() - ONE_DAY));

const downloadDay = async (targetDate = yesterday) => {
  const windowStart = new Date(`${targetDate}T00:00:00Z`);
  const windowEnd = new Date(`${targetDate}T23:50:00Z`);

  const INTERVAL_MS = 5 * 60 * 1000;

  const imageCount = ((windowEnd - windowStart) / INTERVAL_MS) + 1;
  const timeIntervals = Array.from({ length: imageCount });

  await Promise.all(timeIntervals.map(async (_, i) => {
    const targetTime = windowStart.getTime() + (i * INTERVAL_MS)

    await downloadImage(new Date(targetTime));
  }));
};

module.exports = downloadDay;
