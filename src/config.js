"use strict";

import { config } from "dotenv";
const dotenvParseVariables = require("dotenv-parse-variables");
export const path = require("path");
let env = config({ path: path.resolve(__dirname, "../.env") });
if (env.error) throw env.error;
env = dotenvParseVariables(env.parsed);

export const USERNAME = env.USERNAME;
export const PASSWORD = env.PASSWORD;
export const HEADLESS = env.HEADLESS;
export const DOWNLOAD_TIME = env.DOWNLOAD_TIME;
export const DEBUG = env.DEBUG;
