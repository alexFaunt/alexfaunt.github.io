#!/usr/bin/env bash

if [ -z "$1" ]
  then
    echo "Supply a target date in format 2022/06/02"
    exit 1
fi

# Paths are relative to where script is run from i.e. root dir
OUT_DIR=./static/videos/$1
OUT_FILE=$OUT_DIR/out.mp4
INPUT_DIR=./static/images/$1

mkdir -p $OUT_DIR
rm -f $OUT_FILE

FRAMERATE=12
DELAY1=0.08334 # 1 frame at 12 FPS
DELAY2=0.16667 # 2 frame at 12 FPS

# Combine the images at 12 FPS
# Overlay a trailing and leading image at 0.2 opacity to smooth it
ffmpeg \
  -framerate $FRAMERATE -pattern_type glob -i "${INPUT_DIR}/*.jpg" \
  -itsoffset $DELAY1 -framerate $FRAMERATE -pattern_type glob -i "${INPUT_DIR}/*.jpg" \
  -itsoffset $DELAY2 -framerate $FRAMERATE -pattern_type glob -i "${INPUT_DIR}/*.jpg" \
  -filter_complex "[1:v]format=yuva420p,colorchannelmixer=aa=0.8[content]; [2:v]format=yuva420p,colorchannelmixer=aa=0.2[trailing]; [0:v][content]overlay[temp], [temp][trailing]overlay" \
  -c:v libx264 -pix_fmt yuv420p \
  $OUT_FILE

# Below is a way to do it with a single overlay, or no overlay

# ffmpeg \
#   -framerate $FRAMERATE -pattern_type glob -i "${INPUT_DIR}/*.jpg" \
#   -itsoffset $DELAY1 -framerate $FRAMERATE -pattern_type glob -i "${INPUT_DIR}/*.jpg" \
#   -filter_complex "[1:v]format=yuva420p,colorchannelmixer=aa=0.4[trailing]; [0:v][trailing]overlay" \
#   -c:v libx264 -pix_fmt yuv420p \
#   $OUT_DIR/single.mp4

# ffmpeg \
#   -framerate $FRAMERATE -pattern_type glob -i "${INPUT_DIR}/*.jpg" \
#   -c:v libx264 -pix_fmt yuv420p \
#   $OUT_DIR/none.mp4
