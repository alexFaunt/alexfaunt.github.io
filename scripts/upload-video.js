const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

/**
 * Upload the video file.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const uploadVideo = async ({ accessToken, targetDate, type }) => {
  const videoFilePath = path.resolve(__dirname, `../static/videos/${targetDate}/${type}.mp4`);

  const service = google.youtube('v3')

  console.log('Uploading video', targetDate, type)

  const res = await service.videos.insert({
    access_token: accessToken,
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title: `Glastonbury ${type} Timelapse - ${targetDate}`,
        description: `Timelapse of glastonbury festival site ${targetDate} generated from the BBC webcam feed`,
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

  console.log('RES', res)

  console.log('Done!', targetDate, type);

  return res.id;
}

module.exports = uploadVideo;

// uploadVideo(process.argv.slice(2));
