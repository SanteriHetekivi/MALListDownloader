"use strict";
import { config } from "dotenv";
export const path = require("path");

var env = null;
export const DOCKER = process.env.DOCKER === "true";
if (!DOCKER) {
  let env_raw = config({ path: path.resolve(__dirname, "../.env") });
  if (env_raw.error) throw env_raw.error;
}

export const USERNAME = process.env.USERNAME;
export const PASSWORD = process.env.PASSWORD;
export const HEADLESS = process.env.HEADLESS === "true";
export const DOWNLOAD_TIME = parseInt(process.env.DOWNLOAD_TIME, 10);
export const DEBUG =
  typeof process.env.DEBUG === "string" &&
  process.env.DEBUG.includes("MALDownloader");
