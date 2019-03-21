"use strict";

const puppeteer = require("puppeteer");
const ElementHandle = require("puppeteer/lib/JSHandle").ElementHandle;
import * as CONF from "./config";

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
  // Launch browser with or without the head.
  const browser = await puppeteer.launch({ headless: CONF.HEADLESS });
  // Initializes new page.
  const page = await browser.newPage();
  try {
    // Navigate to export page.
    await page.goto("https://myanimelist.net/panel.php?go=export");
    // Click away popup.
    await click(page, "button");
    // Insert username
    await type(page, "#loginUserName", CONF.USERNAME);
    // and password.
    await type(page, "#login-password", CONF.PASSWORD);
    // Press enter to submit the form.
    await page.keyboard.press("Enter");
    // Wait for the new page.
    await page.waitForNavigation();
    // Set wanted list type.
    await page.select('div.spaceit > select[name="type"]', _listType);
    // Set listener for the dialog.
    await page.on("dialog", async dialog => {
      // Accept the dialog.
      await dialog.accept();
      // Wait for the new page.
      await page.waitForNavigation();
      // Set download behavior to save files to downloads folder.
      await page._client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: `downloads/`
      });
      // Click link to download export.
      await click(page, 'a[href*="/export/download"]');
      // Wait for download to finnish.
      await page.waitFor(parseInt(CONF.DOWNLOAD_TIME));
      // Close browser
      await browser.close();
      // and call the callback.
      _onSuccess(_listType);
    });
    // Click export button.
    await click(page, "input[name=subexport]");
    // Handel error.
  } catch (e) {
    // Save screenshot of the error.
    await page.screenshot({
      path: (
        "errors/error_" +
        new Date().toISOString() +
        e.message +
        ".png"
      ).replace(/ /g, "_")
    });
    // Close browser
    await browser.close();
    // and throw the error.
    throw e;
  }
}
