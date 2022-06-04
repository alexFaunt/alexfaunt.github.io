const https = require('https');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { promisify } = require('util');

const HOST = 'https://panodata7.panomax.com';
const CAM_PATH = '/cams/879';
const IMAGE_FILE = 'default.jpg';
const IMAGE_DIR = path.resolve(__dirname, '../static/images');

const access = promisify(fs.access);
const mkdir = promisify(fs.mkdir);
const rm = promisify(fs.rm);

// returns format 2022/06/04/08-15-00
const formatDate = (date) => {
  const fullString = date.toISOString();

  const dateString = fullString.replace(/T.*$/, '').replace(/-/g, '/');
  const timeString = fullString.replace(/^.*T/, '').replace(/\.\d*Z/, '').replace(/:/g, '-')

  return {
    dateString,
    timeString,
  };
};

const fetch = async (url, retriesRemaining = 1) => {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    return response;
  } catch (error) {
    // This image doesn't exist for some reason
    if (error.response.status === 404) {
      return null;
    }

    // Any other error, we try again, but if that fails we give up and throw
    if (retriesRemaining > 0) {
      return fetch(url, retriesRemaining - 1);
    }

    throw new Error(`failed ${url} - ${error.message}`);
  }
}

const ensureDirs = (localFolder) => mkdir(localFolder, { recursive: true }).catch(() => {});

const downloadImageIfExists = async (date) => {
  const { dateString, timeString } = formatDate(date);

  const fileName = `${timeString}_${IMAGE_FILE}`;
  const remoteFilePath = `${dateString}/${fileName}`;

  const localFolder = path.join(IMAGE_DIR, dateString);
  const localFilePath = path.join(localFolder, fileName);

  await ensureDirs(localFolder);

  const url = `${HOST}/${CAM_PATH}/${remoteFilePath}`;

  try {
    const exists = await access(localFilePath);
    // console.debug('skipping', url);
    return;
  } catch (error) {
    // ... ignore
  }


  const response = await fetch(url);

  // File doesn't exist
  if (!response) {
    // console.debug('no image', url);
    return;
  }

  // console.debug('fetching', url);

  const writer = fs.createWriteStream(localFilePath);
  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      // console.debug('success', url);
      resolve();
    })
    writer.on('error', async () => {
      console.error('failed', url);
      await rm(localFilePath).catch(() => {
        console.error('Failed fo remove corrupt file', localFilePath);
      });
      reject();
    })
  })
}

module.exports = downloadImageIfExists;
