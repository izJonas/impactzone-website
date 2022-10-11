#!/bin/bash

cd /opt/impactzone/impactzone-website
sass public/css/iz-styles.scss public/css/iz-styles.css
(npm run dev &) &
