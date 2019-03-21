# MALListDownloader

Downloads your [MyAnimeList](https://myanimelist.net/) manga and anime lists.

## Setup

1. Download [the latest code](https://github.com/SanteriHetekivi/mal_list_downloader/archive/master.zip).
1. Unzip the code.
1. Navigate to unzipped directory.
1. Install [Node.js](https://nodejs.org/en/download/).
1. Install dependencies from [package.json](https://github.com/SanteriHetekivi/mal_list_downloader/blob/master/package.json) file.
   ```Shell
   npm install
   ```
1. Copy [sample.env](https://github.com/SanteriHetekivi/mal_list_downloader/blob/master/sample.env) file.
1. Rename the copy to `.env`.
1. Replace `YOUR_MAL_USERNAME` with your [MyAnimeList](https://myanimelist.net/) username.
1. Replace `YOUR_MAL_PASSWORD` with your [MyAnimeList](https://myanimelist.net/) password.
1. Run the script.
   ```Shell
   node .
   ```

## ENV

| ENV           | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| USERNAME      | Your [MyAnimeList](https://myanimelist.net/) username.            |
| PASSWORD      | Your [MyAnimeList](https://myanimelist.net/) password.            |
| HEADLESS      | Run the script with headless Chromium.                            |
| DOWNLOAD_TIME | How long to wait for the download.                                |
| DEBUG         | Is debug mode on? If on output errors and save error screenshots. |
