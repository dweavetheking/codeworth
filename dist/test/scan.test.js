"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const discoverFiles_1 = require("../src/core/discoverFiles");
const language_1 = require("../src/core/language");
const locCounter_1 = require("../src/core/locCounter");
const FIXTURE_DIR = path_1.default.join(__dirname, 'fixtures', 'basic');
(0, vitest_1.describe)('Codeworth Core', () => {
    (0, vitest_1.beforeAll)(async () => {
        // Setup fixture
        await promises_1.default.mkdir(FIXTURE_DIR, { recursive: true });
        await promises_1.default.writeFile(path_1.default.join(FIXTURE_DIR, 'main.ts'), 'console.log("hello");\n// comment');
        await promises_1.default.writeFile(path_1.default.join(FIXTURE_DIR, 'utils.js'), 'function foo() { return 1; }');
        await promises_1.default.writeFile(path_1.default.join(FIXTURE_DIR, 'ignored.txt'), 'ignored');
        await promises_1.default.writeFile(path_1.default.join(FIXTURE_DIR, '.gitignore'), 'ignored.txt');
    });
    (0, vitest_1.afterAll)(async () => {
        // Cleanup
        await promises_1.default.rm(FIXTURE_DIR, { recursive: true, force: true });
    });
    (0, vitest_1.it)('should discover files respecting gitignore', async () => {
        const files = await (0, discoverFiles_1.discoverFiles)({ path: FIXTURE_DIR });
        const relativePaths = files.map(f => path_1.default.relative(path_1.default.resolve(FIXTURE_DIR), path_1.default.join(path_1.default.resolve(FIXTURE_DIR), f))); // discoverFiles returns relative paths, but let's be safe
        // discoverFiles returns paths relative to rootDir.
        (0, vitest_1.expect)(files).toContain('main.ts');
        (0, vitest_1.expect)(files).toContain('utils.js');
        (0, vitest_1.expect)(files).not.toContain('ignored.txt');
    });
    (0, vitest_1.it)('should detect languages correctly', () => {
        (0, vitest_1.expect)((0, language_1.getLanguage)('main.ts')).toBe('TypeScript');
        (0, vitest_1.expect)((0, language_1.getLanguage)('utils.js')).toBe('JavaScript');
        (0, vitest_1.expect)((0, language_1.getLanguage)('unknown.foo')).toBe('Other');
    });
    (0, vitest_1.it)('should count LOC correctly', async () => {
        const mainTsPath = path_1.default.join(FIXTURE_DIR, 'main.ts');
        const counts = await (0, locCounter_1.countLoc)(mainTsPath, 'TypeScript');
        (0, vitest_1.expect)(counts.code).toBe(1);
        (0, vitest_1.expect)(counts.comment).toBe(1);
    });
    (0, vitest_1.it)('should calculate complexity', async () => {
        // Create a complex file
        const complexFile = `
            function a() {
                if (true) {
                    if (false) {
                        return;
                    }
                }
            }
        `;
        const complexPath = path_1.default.join(FIXTURE_DIR, 'complex.js');
        await promises_1.default.writeFile(complexPath, complexFile);
        const { calculateComplexity } = await Promise.resolve().then(() => __importStar(require('../src/core/complexityProxy')));
        const result = await calculateComplexity(complexPath);
        (0, vitest_1.expect)(result.score).toBeGreaterThan(0);
        (0, vitest_1.expect)(result.details.funcCount).toBeGreaterThanOrEqual(1);
        (0, vitest_1.expect)(result.details.branchCount).toBeGreaterThanOrEqual(2);
    });
});
