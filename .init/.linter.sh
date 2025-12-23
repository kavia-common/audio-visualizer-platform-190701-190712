#!/bin/bash
cd /home/kavia/workspace/code-generation/audio-visualizer-platform-190701-190712/audio_visualizer_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

