"use strict";

import * as MALDownloader from "./MALDownloader";
import { DEBUG } from "./config";

var run_counter = 2;
var return_code = 0;

/**
 * Handles successfull list download operation.
 * @param {string} _listType List type that succeeded.
 */
function runEnded(_listType) {
  --run_counter;
  if (run_counter <= 0) process.exit(return_code);
}

function onFailure(_err, _listType) {
  return_code = 1;
  if (DEBUG) console.log(_err);
  runEnded(_listType);
}

// Download manga list.
MALDownloader.download(MALDownloader.MANGA, runEnded).catch(err => {
  onFailure(err, MALDownloader.MANGA);
});
// Download anime list.
MALDownloader.download(MALDownloader.ANIME, runEnded).catch(err => {
  onFailure(err, MALDownloader.ANIME);
});
