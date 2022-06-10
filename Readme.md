# Gif of glasto webcam

## How to use
- Go to https://glastolapse.com/youtube-request
- Authorize glastolapse to act on your behalf
- copy the command you wish to run
  - today = run after sunset before midnight - it will download todays images + make todays video (and the full one)
  - yesterday = run after midnight - it will download yesterdays images + make yesterdays video (and the full one)

If you need to backfill all the images - do the above, but edit scripts/index.js to download the full year (it's commented out)

## TODO - Fix skipped problems
- gatsby query params are fucked
- Upload timed out - need to break down the script / sync requests
- cloudflare cache
- Video compression / resolutions / just swapping to 265 doesn't work
- Tabs for other dates, not just yesterday
- We're downloading ALL the images every build which is madness
  - just concat todays video onto yesterdays
  - github action cache ?
  - Host the videos somewhere else? github is not a good place for that
  - (maybe keep one day video statically, and the full one for hosting, and push the archive to youtube)
  - Also different resolutions
- Backup all the images somewhere else? or just delete them? they're not ours and it's not that important to go back and process, can just do in future
- Merge download-year and download - should be one script that accepts a --from and --to with defaults
- Can't remove the syntax to replace "${INPUT_GLOB}" with $INPUT_GLOB or similar, dno if we can but it looks dumb
- For the daily build we could just concat the new video to the old video other wise we're repeating + it's reeeeaally slow
- Actually styling / design / styling library
- UPDATE the colours ???
  - check video against live cam to see if we've washed it out by processing
  - may need to boost brightness or something to compensate for the overlaying smoothing
  - https://ffmpeg.org/ffmpeg-filters.html#eq
- make the video zoomable

## Ideas
- maybe just do 7 days?
- timelapse of "Today so far" + build hourly
- On the full render watermark the date or T -10 etc. onto it
- Panorama could automatically pan across the site throughout the day - might miss stuff tho
- Tent detection + zoomed footage of erection
- ???
