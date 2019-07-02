"use strict";

import * as CONF from "./config";

import Debug from "debug";

const puppeteer = require("puppeteer");
const ElementHandle = require("puppeteer/lib/JSHandle").ElementHandle;

/**
 * Gets element from the page with a query.
 * Throws Error if element is not found.
 * @param {Page} _page Page from the puppeteer.
 * @param {string} _query Query to find a element to click.
 */
async function getElement(_page, _query) {
  const element = await _page.$(_query);
  // Element must be ElementHandle object.
  if (element instanceof ElementHandle) return element;
  // Otherwise error has happened.
  else throw new Error("Element " + _query + " not found!");
}

/**
 * Clicks on the element from given page and matching query.
 * @param {Page} _page Page from the puppeteer.
 * @param {string} _query Query to find a element to click.
 */
async function click(_page, _query) {
  await (await getElement(_page, _query)).click();
}

/**
 * Types the given text to given field.
 * @param {Page} _page Page from the puppeteer.
 * @param {string} _query Query to find field to type on.
 * @param {string} _text Text to type.
 */
async function type(_page, _query, _text) {
  await (await getElement(_page, _query)).type(_text);
}

/**
 * Clear page of any info popups.
 * @param {Page} _page Page to clear.
 */
async function clearNewPage(_page) {
  var buttons = null;
  const XPATHS = [
    "//span[contains(text(), 'Got')]/parent::button",
    "//button[contains(text(), 'OK')]"
  ];
  var i;
  var x;
  var button;
  var buttons;
  for (i = 0; i < XPATHS.length; i++) {
    buttons = await _page.$x(XPATHS[i]);
    for (x = 0; x < buttons.length; x++) {
      button = buttons[x];
      try {
        await button.click();
      } catch (err) {
        // Ignore errors that contain text visible, because element could be invisible.
        if (!err.message.includes("visible")) throw err;
      }
    }
  }
}

/**
 * CONST for different list types.
 */
export const ANIME = "1";
export const MANGA = "2";

/**
 * Downloads MAL list.
 * @param {string} _listType List type to download.
 * @param {function} _onSuccess Function to call when download finnished.
 */
export async function download(_listType, _onSuccess) {
  const debug = new Debug(
    "MALDownloader::" +
      (_listType === MANGA
        ? "Manga"
        : _listType === ANIME
        ? "Anime"
        : "Unknown")
  );
  // Launch browser with or without the head.
  debug("Launch browser with or without the head.");
  var args = [];
  if (CONF.DOCKER) {
    args = [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage"
    ];
  }
  const browser = await puppeteer.launch({
    headless: CONF.HEADLESS,
    args: args
  });
  // Initialize new page.
  debug("Initialize new page.");
  const page = await browser.newPage();
  try {
    // Navigate to export page.
    debug("Navigate to export page.");
    await page.goto("https://myanimelist.net/panel.php?go=export");
    await clearNewPage(page);
    // Insert username
    debug("Insert username");
    await type(page, "#loginUserName", CONF.USERNAME);
    // and password.
    debug("and password.");
    await type(page, "#login-password", CONF.PASSWORD);
    // Press enter to submit the form.
    debug("Press enter to submit the form.");
    await page.keyboard.press("Enter");
    // Wait for the new page.
    debug("Wait for the new page.");
    await page.waitForNavigation();
    await clearNewPage(page);
    // Set wanted list type.
    debug("Set wanted list type.");
    await page.select('div.spaceit > select[name="type"]', _listType);
    // Set listener for the dialog.
    var dialog_open = false;
    debug("Set listener for the dialog.");
    await page.on("dialog", async dialog => {
      // Mark dialog open.
      debug("Dialog is open.");
      dialog_open = true;
      // Accept the dialog.
      debug("Accept the dialog.");
      await dialog.accept();
      // Wait for the new page.
      debug("Wait for the new page.");
      await page.waitForNavigation();
      await clearNewPage(page);
      // Set download behavior to save files to downloads folder.
      debug("Set download behavior to save files to downloads folder.");
      await page._client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: CONF.path.resolve(__dirname, "../data/downloads")
      });
      // Click link to download export.
      debug("Click link to download export.");
      await click(page, 'a[href*="/export/download"]');
      // Wait for download to finnish.
      debug("Wait for download to finnish.");
      await page.waitFor(parseInt(CONF.DOWNLOAD_TIME));
      // Close browser
      debug("Close browser");
      await browser.close();
      // and call the callback.
      debug("and call the callback.");
      _onSuccess(_listType);
    });
    // Click export button.
    debug("Click export button.");
    await click(page, "input[name=subexport]");
    // Waiting max 1 minute for dialog to open...
    debug("Waiting max 1 minute for dialog to open...");
    await page.waitFor(60 * 1000);
    if (!dialog_open) throw new Error("No dialog for 1 minute!");
    // Handel error.
  } catch (e) {
    if (CONF.DEBUG) {
      // Save screenshot of the error.
      debug("Save screenshot of the error.");
      await page.screenshot({
        path:
          CONF.path.resolve(__dirname, "../data/errors/error_") +
          (new Date().toISOString() + e.message + ".png").replace(/ /g, "_")
      });
    }
    // Close browser
    debug("Close browser");
    await browser.close();
    // and throw the error.
    debug("and throw the error.");
    throw e;
  }
}
