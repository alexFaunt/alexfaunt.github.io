const downloadImages = require('./download-images');

const downloadDay = async ({ dateString, type }) => {
  const windowStart = new Date(`${dateString}T00:00:00Z`);
  const windowEnd = new Date(`${dateString}T23:50:00Z`);

  const INTERVAL_MS = 5 * 60 * 1000;

  const imageCount = ((windowEnd - windowStart) / INTERVAL_MS) + 1;
  const timeIntervals = Array.from({ length: imageCount });

  await Promise.all(timeIntervals.map(async (_, i) => {
    const targetTime = windowStart.getTime() + (i * INTERVAL_MS)

    await downloadImages(new Date(targetTime), type);
  }));
};

module.exports = downloadDay;
