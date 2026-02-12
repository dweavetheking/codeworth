"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasGit = hasGit;
exports.getFileChurn = getFileChurn;
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const execAsync = util_1.default.promisify(child_process_1.exec);
async function hasGit(cwd) {
    try {
        await promises_1.default.stat(path_1.default.join(cwd, '.git'));
        return true;
    }
    catch {
        return false;
    }
}
async function getFileChurn(filepath, cwd) {
    try {
        // We use relative path for git commands usually, but we need to be careful with CWD
        const relativePath = path_1.default.relative(cwd, filepath);
        // Get commit count
        // git log --follow --format=oneline <file> | wc -l
        const { stdout: commitStdout } = await execAsync(`git log --follow --format=oneline -- "${relativePath}" | wc -l`, { cwd });
        const commits = parseInt(commitStdout.trim()) || 0;
        // Get author count
        // git log --follow --format="%aN" <file> | sort -u | wc -l
        const { stdout: authorStdout } = await execAsync(`git log --follow --format="%aN" -- "${relativePath}" | sort -u | wc -l`, { cwd });
        const authors = parseInt(authorStdout.trim()) || 0;
        return { commits, authors };
    }
    catch (e) {
        // If git fails (e.g. file not committed yet), return 0
        return { commits: 0, authors: 0 };
    }
}
