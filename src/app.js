"use strict";

import * as MALDownloader from "./MALDownloader";
var success_counter = 2;

/**
 * Handles successfull list download operation.
 * @param {string} _listType List type that succeeded.
 */
function onSuccess(_listType) {
  --success_counter;
  if (success_counter <= 0) process.exit(0);
}

(async () => {
  try {
    // Download manga list.
    MALDownloader.download(MALDownloader.MANGA, onSuccess);
    // Download anime list.
    MALDownloader.download(MALDownloader.ANIME, onSuccess);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
