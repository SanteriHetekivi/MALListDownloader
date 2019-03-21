"use strict";

import { config } from "dotenv";
const dotenvParseVariables = require("dotenv-parse-variables");

let env = config();
if (env.error) throw env.error;
env = dotenvParseVariables(env.parsed);

export const USERNAME = env.USERNAME;
export const PASSWORD = env.PASSWORD;
export const HEADLESS = env.HEADLESS;
export const DOWNLOAD_TIME = env.DOWNLOAD_TIME;
