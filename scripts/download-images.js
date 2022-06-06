const https = require('https');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { promisify } = require('util');
const { joinImages } = require('join-images');

const HOST = 'https://panodata7.panomax.com';
const CAM_PATH = 'cams/879';
const IMAGE_DIR = path.resolve(__dirname, '../static/images');
const IMAGE_FILES = {
  panorama: ['default.jpg'],
  pyramid: ['full_0_0.jpg', 'full_1_0.jpg', 'full_2_0.jpg'],
};

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
    if (!!error && !!error.response && error.response.status === 404) {
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

const downloadImageIfExists = async ({ localFilePath, remoteFilePath }) => {
  const url = `${HOST}/${CAM_PATH}/${remoteFilePath}`;

  // console.debug('fetching', url);
  // TODO bring back cache hits?
  const response = await fetch(url);

  // File doesn't exist
  if (!response) {
    console.debug('no image', url);
    return null;
  }

  const writer = fs.createWriteStream(localFilePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      console.debug('success', url);
      resolve(localFilePath);
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


const downloadImages = async (date, type = 'panorama') => {
  if (!Object.keys(IMAGE_FILES).includes(type)) {
    throw new Error(`Invalid type: ${type}`)
  }

  const { dateString, timeString } = formatDate(date);

  const localFolder = path.join(IMAGE_DIR, dateString, type);
  await ensureDirs(localFolder);

  const requiredFiles = IMAGE_FILES[type];

  const localFiles = await Promise.all(requiredFiles.map(async (imageFile) => {
    const fileName = `${timeString}_${imageFile}`;

    const remoteFilePath = `${dateString}/${fileName}`;
    const localFilePath = path.join(localFolder, fileName);

    try {
      const exists = await access(localFilePath);
      console.debug('skipping', url);
      return localFilePath;
    } catch (error) {
      // ... ignore
    }

    const file = await downloadImageIfExists({ localFilePath, remoteFilePath })

    return file;
  }));

  const existingFiles = localFiles.filter((img) => img !== null);

  // If we don't have an image for this one, skip
  if (!existingFiles.length) {
    return;
  }

  // one image - nothing to stitch, we're done
  if (requiredFiles.length === 1) {
    return;
  }

  // we wanted 3, we got 2, can't successfully stitch that
  // TODO - do we just skip these?
  if (requiredFiles.length !== existingFiles.length) {
    throw new Error(`only some files downloaded for: ${localFiles.join(', ')}`);
  }

  // stitch images together
  const combined = await joinImages(existingFiles, { direction: 'horizontal' });
  await combined.toFile(path.join(localFolder, `${timeString}.jpg`));

  // remove originals
  await Promise.all(existingFiles.map((tempFile) => rm(tempFile)));
}

module.exports = downloadImages;
