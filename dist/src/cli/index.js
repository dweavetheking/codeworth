#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const scan_js_1 = require("./commands/scan.js");
const init_js_1 = require("./commands/init.js");
const badge_js_1 = require("./commands/badge.js");
const version_js_1 = require("./commands/version.js");
const program = new commander_1.Command();
program
    .name('codeworth')
    .description('Codebase valuation and maintainability tool')
    .version('1.0.0');
(0, scan_js_1.registerScanCommand)(program);
(0, init_js_1.registerInitCommand)(program);
(0, badge_js_1.registerBadgeCommand)(program);
(0, version_js_1.registerVersionCommand)(program);
program.parse(process.argv);
