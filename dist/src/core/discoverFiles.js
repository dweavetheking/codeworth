"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoverFiles = discoverFiles;
const fast_glob_1 = __importDefault(require("fast-glob"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const ignore_1 = __importDefault(require("ignore"));
const DEFAULT_IGNORES = [
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage',
    'reports',
    '.next',
    '.vercel',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'bun.lockb',
    '*.min.*'
];
async function discoverFiles(options) {
    const rootDir = path_1.default.resolve(options.path);
    const ignoreFilter = (0, ignore_1.default)();
    // 1. Add default ignores
    ignoreFilter.add(DEFAULT_IGNORES);
    // Add internal codeworth artifacts to ignore
    ignoreFilter.add([
        'codeworth.report.json',
        'codeworth.report.md',
        'badge.svg'
    ]);
    // If outdir is inside rootDir, ignore it
    if (options.outdir) {
        const absOut = path_1.default.resolve(options.outdir);
        // Check if absOut is inside rootDir
        if (absOut.startsWith(rootDir) && absOut !== rootDir) {
            const relativeOut = path_1.default.relative(rootDir, absOut);
            ignoreFilter.add(relativeOut);
            // Ensure we ignore the directory contents too
            ignoreFilter.add(path_1.default.join(relativeOut, '**'));
        }
    }
    // 2. Add .gitignore if exists
    try {
        const gitignorePath = path_1.default.join(rootDir, '.gitignore');
        const gitignoreContent = await promises_1.default.readFile(gitignorePath, 'utf-8');
        ignoreFilter.add(gitignoreContent);
    }
    catch (e) {
        // No .gitignore, that's fine
    }
    // 3. Add .codeworthignore if exists
    try {
        const codeworthignorePath = path_1.default.join(rootDir, '.codeworthignore');
        const cwIgnoreContent = await promises_1.default.readFile(codeworthignorePath, 'utf-8');
        ignoreFilter.add(cwIgnoreContent);
    }
    catch (e) {
        // No .codeworthignore, that's fine
    }
    // 4. Add CLI excludes
    if (options.exclude && options.exclude.length > 0) {
        ignoreFilter.add(options.exclude);
    }
    // glob needs forward slashes even on windows for patterns
    const globPattern = '**/*';
    const files = await (0, fast_glob_1.default)(globPattern, {
        cwd: rootDir,
        dot: true, // include dotfiles
        onlyFiles: true,
        ignore: DEFAULT_IGNORES // fast-glob can handle some basic ignores too, but we filter manually for full gitignore support
    });
    // Filter using ignore package
    return files.filter(f => !ignoreFilter.ignores(f));
}
