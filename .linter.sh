#!/bin/bash
cd /home/kavia/workspace/code-generation/studymate-16277-f91992b6/study_mate_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

