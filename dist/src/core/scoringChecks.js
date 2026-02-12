"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingChecks = exports.hygieneChecks = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
exports.hygieneChecks = [
    { score: 5, note: 'README exists', condition: (f) => !!f.find(n => /^readme/i.test(n)) },
    { score: 3, note: 'LICENSE exists', condition: (f) => !!f.find(n => /^license/i.test(n)) },
    { score: 5, note: 'CONTRIBUTING exists', condition: (f) => !!f.find(n => /^contributing/i.test(n)) },
    {
        score: 5,
        note: 'Issue templates detected',
        condition: async (_, root) => promises_1.default.stat(path_1.default.join(root, '.github/ISSUE_TEMPLATE')).then(() => true).catch(() => false)
    },
    {
        score: 5,
        note: 'CI config detected',
        condition: async (_, root) => {
            const gh = promises_1.default.stat(path_1.default.join(root, '.github/workflows')).then(() => true).catch(() => false);
            const circle = promises_1.default.stat(path_1.default.join(root, '.circleci')).then(() => true).catch(() => false);
            const travis = promises_1.default.stat(path_1.default.join(root, '.travis.yml')).then(() => true).catch(() => false);
            return (await gh) || (await circle) || (await travis);
        }
    }
];
const testingChecks = (scanResult) => [
    {
        score: 5,
        note: 'Tests directory exists',
        condition: async (_, root) => {
            return promises_1.default.stat(path_1.default.join(root, 'test')).then(() => true).catch(() => promises_1.default.stat(path_1.default.join(root, 'tests')).then(() => true).catch(() => false));
        }
    },
    {
        score: 5,
        note: 'Test files detected',
        condition: () => scanResult.files.some(f => f.path.includes('.test.') || f.path.includes('.spec.'))
    },
    {
        score: 5,
        note: 'Test runner config detected',
        condition: (f) => f.includes('vitest.config.ts') || f.includes('jest.config.js')
    },
    {
        score: 5,
        note: 'Coverage reports detected',
        condition: async (_, root) => promises_1.default.stat(path_1.default.join(root, 'coverage')).then(() => true).catch(() => false)
    }
];
exports.testingChecks = testingChecks;
