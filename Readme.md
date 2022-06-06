# Gif of glasto webcam

## TODO - MVP
- Do tabs reload the page?
- google tracking
- Get a real url glastolapse.com?
- Build each day at the end of the day + commit it + update the full timelapse

## TODO - Fix skipped problems
- Tabs for other dates, not just yesterday
- We're downloading ALL the images every build which is madness
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

## Ideas
- timelapse of "Today so far" + build hourly
- On the full render watermark the date or T -10 etc. onto it
- Panorama could automatically pan across the site throughout the day - might miss stuff tho
- Tent detection + zoomed footage of erection
- ???
