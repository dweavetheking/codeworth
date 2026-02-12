"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const promises_1 = __importDefault(require("fs/promises"));
const commander_1 = require("commander");
const badge_1 = require("../../src/cli/commands/badge");
// Mock fs and process.exit
vitest_1.vi.mock('fs/promises');
(0, vitest_1.describe)('Badge Command - CI Mode', () => {
    let program;
    let mockExit;
    let mockLog;
    let mockError;
    (0, vitest_1.beforeEach)(() => {
        program = new commander_1.Command();
        (0, badge_1.registerBadgeCommand)(program);
        // Mock process.exit to be a no-op so tests allow "exit" without killing runner
        // @ts-ignore
        mockExit = vitest_1.vi.spyOn(process, 'exit').mockImplementation((code) => {
            return undefined;
        });
        mockLog = vitest_1.vi.spyOn(console, 'log').mockImplementation(() => { });
        mockError = vitest_1.vi.spyOn(console, 'error').mockImplementation(() => { });
        // Reset fs mocks
        vitest_1.vi.resetAllMocks();
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.restoreAllMocks();
    });
    // Helper to create a mock report
    const createMockReport = (grade, score) => ({
        maintainability: {
            grade,
            score,
            breakdown: [],
            quickWins: []
        }
    });
    (0, vitest_1.it)('should fail if no report is found', async () => {
        // Mock fs.readFile to fail for all attempts
        vitest_1.vi.mocked(promises_1.default.readFile).mockRejectedValue(new Error('File not found'));
        vitest_1.vi.mocked(promises_1.default.stat).mockRejectedValue(new Error('File not found'));
        try {
            await program.parseAsync(['node', 'codeworth', 'badge', '--ci']);
        }
        catch (e) {
            // expected to catch
        }
        (0, vitest_1.expect)(mockExit).toHaveBeenCalledWith(1);
        (0, vitest_1.expect)(mockError).toHaveBeenCalledWith(vitest_1.expect.stringContaining('Error: Could not find a valid codeworth.report.json'));
    });
    (0, vitest_1.it)('should pass if grade meets default threshold (C)', async () => {
        const report = createMockReport('B', 80);
        vitest_1.vi.mocked(promises_1.default.readFile).mockResolvedValue(JSON.stringify(report));
        vitest_1.vi.mocked(promises_1.default.mkdir).mockResolvedValue(undefined);
        vitest_1.vi.mocked(promises_1.default.writeFile).mockResolvedValue(undefined);
        await program.parseAsync(['node', 'codeworth', 'badge', '--ci']);
        (0, vitest_1.expect)(mockLog).toHaveBeenCalledWith(vitest_1.expect.stringContaining('PASSED'));
        (0, vitest_1.expect)(mockLog).toHaveBeenCalledWith(vitest_1.expect.stringContaining('Grade: B (80)'));
        (0, vitest_1.expect)(mockExit).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('should fail if grade is below default threshold (C)', async () => {
        const report = createMockReport('D', 65);
        vitest_1.vi.mocked(promises_1.default.readFile).mockResolvedValue(JSON.stringify(report));
        vitest_1.vi.mocked(promises_1.default.mkdir).mockResolvedValue(undefined);
        vitest_1.vi.mocked(promises_1.default.writeFile).mockResolvedValue(undefined);
        try {
            await program.parseAsync(['node', 'codeworth', 'badge', '--ci']);
        }
        catch (e) { }
        (0, vitest_1.expect)(mockLog).toHaveBeenCalledWith(vitest_1.expect.stringContaining('FAILED'));
        (0, vitest_1.expect)(mockLog).toHaveBeenCalledWith(vitest_1.expect.stringContaining('Required: Grade >= C'));
        (0, vitest_1.expect)(mockExit).toHaveBeenCalledWith(1);
    });
    (0, vitest_1.it)('should pass if grade meets specified threshold', async () => {
        const report = createMockReport('A', 92);
        vitest_1.vi.mocked(promises_1.default.readFile).mockResolvedValue(JSON.stringify(report));
        vitest_1.vi.mocked(promises_1.default.mkdir).mockResolvedValue(undefined);
        vitest_1.vi.mocked(promises_1.default.writeFile).mockResolvedValue(undefined);
        await program.parseAsync(['node', 'codeworth', 'badge', '--ci', '--min-grade', 'A']);
        (0, vitest_1.expect)(mockLog).toHaveBeenCalledWith(vitest_1.expect.stringContaining('PASSED'));
    });
    (0, vitest_1.it)('should fail if grade is below specified threshold', async () => {
        const report = createMockReport('B', 85);
        vitest_1.vi.mocked(promises_1.default.readFile).mockResolvedValue(JSON.stringify(report));
        vitest_1.vi.mocked(promises_1.default.mkdir).mockResolvedValue(undefined);
        vitest_1.vi.mocked(promises_1.default.writeFile).mockResolvedValue(undefined);
        try {
            await program.parseAsync(['node', 'codeworth', 'badge', '--ci', '--min-grade', 'A']);
        }
        catch (e) { }
        (0, vitest_1.expect)(mockLog).toHaveBeenCalledWith(vitest_1.expect.stringContaining('FAILED'));
        (0, vitest_1.expect)(mockLog).toHaveBeenCalledWith(vitest_1.expect.stringContaining('Required: Grade >= A'));
        (0, vitest_1.expect)(mockExit).toHaveBeenCalledWith(1);
    });
    (0, vitest_1.it)('should pass if score meets min-score', async () => {
        const report = createMockReport('B', 80);
        vitest_1.vi.mocked(promises_1.default.readFile).mockResolvedValue(JSON.stringify(report));
        vitest_1.vi.mocked(promises_1.default.mkdir).mockResolvedValue(undefined);
        vitest_1.vi.mocked(promises_1.default.writeFile).mockResolvedValue(undefined);
        await program.parseAsync(['node', 'codeworth', 'badge', '--ci', '--min-score', '75']);
        (0, vitest_1.expect)(mockLog).toHaveBeenCalledWith(vitest_1.expect.stringContaining('PASSED'));
        (0, vitest_1.expect)(mockLog).toHaveBeenCalledWith(vitest_1.expect.stringContaining('Score >= 75'));
    });
    (0, vitest_1.it)('should fail if score is below min-score', async () => {
        const report = createMockReport('B', 80);
        vitest_1.vi.mocked(promises_1.default.readFile).mockResolvedValue(JSON.stringify(report));
        vitest_1.vi.mocked(promises_1.default.mkdir).mockResolvedValue(undefined);
        vitest_1.vi.mocked(promises_1.default.writeFile).mockResolvedValue(undefined);
        try {
            await program.parseAsync(['node', 'codeworth', 'badge', '--ci', '--min-score', '85']);
        }
        catch (e) { }
        (0, vitest_1.expect)(mockLog).toHaveBeenCalledWith(vitest_1.expect.stringContaining('FAILED'));
        (0, vitest_1.expect)(mockLog).toHaveBeenCalledWith(vitest_1.expect.stringContaining('Required: Score >= 85'));
        (0, vitest_1.expect)(mockExit).toHaveBeenCalledWith(1);
    });
    (0, vitest_1.it)('should regenerate badge', async () => {
        const report = createMockReport('A', 95);
        vitest_1.vi.mocked(promises_1.default.readFile).mockResolvedValue(JSON.stringify(report));
        vitest_1.vi.mocked(promises_1.default.mkdir).mockResolvedValue(undefined);
        vitest_1.vi.mocked(promises_1.default.writeFile).mockResolvedValue(undefined);
        await program.parseAsync(['node', 'codeworth', 'badge', '--ci']);
        // Check that writeFile was called with path and content (ignore 2 arguments vs 3)
        (0, vitest_1.expect)(promises_1.default.writeFile).toHaveBeenCalledWith(vitest_1.expect.stringContaining('.svg'), vitest_1.expect.stringContaining('<svg'));
    });
    (0, vitest_1.it)('should regenerate badge even on failure', async () => {
        const report = createMockReport('F', 30);
        vitest_1.vi.mocked(promises_1.default.readFile).mockResolvedValue(JSON.stringify(report));
        vitest_1.vi.mocked(promises_1.default.mkdir).mockResolvedValue(undefined);
        vitest_1.vi.mocked(promises_1.default.writeFile).mockResolvedValue(undefined);
        try {
            await program.parseAsync(['node', 'codeworth', 'badge', '--ci']);
        }
        catch (e) { }
        // Verify fs.writeFile was called
        (0, vitest_1.expect)(promises_1.default.writeFile).toHaveBeenCalled();
    });
});
