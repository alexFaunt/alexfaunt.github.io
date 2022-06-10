#!/usr/bin/env bash

ARG_ERROR="Supply a target type (panorama | pyramid) and date in format 2022/06/02"
if [ -z "$1" ]
  then
    echo $ARG_ERROR
    exit 1
fi

if [ -z "$2" ]
  then
    echo $ARG_ERROR
    exit 1
fi

TYPE=$1
DATE=$2

# Paths are relative to where script is run from i.e. root dir
OUT_DIR=./static/videos/$DATE
OUT_FILE=$OUT_DIR/$TYPE.mp4
INPUT_GLOB=./static/images/$DATE/$TYPE/*.jpg

mkdir -p $OUT_DIR
rm -f $OUT_FILE

FRAMERATE=8
DELAY1=0.125 # 1 frame at 8 FPS
DELAY2=0.25 # 2 frame at 8 FPS

# Combine the images at 8 FPS
# Overlay a trailing and leading image at 0.2 opacity to smooth it
ffmpeg \
  -an \
  -framerate $FRAMERATE -pattern_type glob -i "${INPUT_GLOB}" \
  -itsoffset $DELAY1 -framerate $FRAMERATE -pattern_type glob -i "${INPUT_GLOB}" \
  -itsoffset $DELAY2 -framerate $FRAMERATE -pattern_type glob -i "${INPUT_GLOB}" \
  -filter_complex "[1:v]format=yuva420p,colorchannelmixer=aa=0.8[content]; [2:v]format=yuva420p,colorchannelmixer=aa=0.2[trailing]; [0:v][content]overlay[temp], [temp][trailing]overlay" \
  -vcodec libx264 \
  -pix_fmt yuv420p \
  -profile:v baseline \
  -level 3 \
  $OUT_FILE

# Below is a way to do it with a single overlay, or no overlay just so i don't have to figure it out again if needed

# ffmpeg \
#   -framerate $FRAMERATE -pattern_type glob -i "${INPUT_GLOB}" \
#   -itsoffset $DELAY1 -framerate $FRAMERATE -pattern_type glob -i "${INPUT_GLOB}" \
#   -filter_complex "[1:v]format=yuva420p,colorchannelmixer=aa=0.4[trailing]; [0:v][trailing]overlay" \
#   -c:v libx264 -pix_fmt yuv420p \
#   $OUT_DIR/single.mp4

# ffmpeg \
#   -framerate $FRAMERATE -pattern_type glob -i "${INPUT_GLOB}" \
#   -c:v libx264 -pix_fmt yuv420p \
#   $OUT_DIR/none.mp4
