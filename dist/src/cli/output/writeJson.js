"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJson = writeJson;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function writeJson(result, outDir, filename = 'codeworth.report.json') {
    const outputPath = path_1.default.join(outDir, filename);
    await promises_1.default.writeFile(outputPath, JSON.stringify(result, null, 2));
    return outputPath;
}
