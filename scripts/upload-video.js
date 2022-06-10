const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const uploadVideo = async ({ accessToken, videoFolder, fromDate, toDate, type }) => {
  const videoFilePath = path.resolve(__dirname, `../static/videos/${videoFolder}/${type}.mp4`);

  const service = google.youtube('v3')

  console.log('Uploading video', videoFolder, type)

  const dateString = fromDate === toDate ? fromDate : `${fromDate} to ${toDate}`;

  const res = await service.videos.insert({
    access_token: accessToken,
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title: `Glastonbury ${type.charAt(0).toUpperCase()}${type.substring(1)} Timelapse - ${dateString}`,
        description: 'Timelapse of glastonbury festival site generated from the BBC webcam feed',
        tags: ['glastonbury', 'festival', 'timelapse'],
      },
      status: {
         // We're still able to do this because we've got a really old project - new projects can't so might lose it at some point
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: fs.createReadStream(videoFilePath),
    },
  });

  console.log('Done!', videoFolder, type);

  return res.id;
}

module.exports = uploadVideo;
