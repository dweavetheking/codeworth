"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBadgeCommand = registerBadgeCommand;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const maintainability_js_1 = require("../../core/maintainability.js");
const discoverFiles_js_1 = require("../../core/discoverFiles.js");
const language_js_1 = require("../../core/language.js");
const locCounter_js_1 = require("../../core/locCounter.js");
const complexityProxy_js_1 = require("../../core/complexityProxy.js");
const badgeGenerator_js_1 = require("../../core/badgeGenerator.js");
const valuation_js_1 = require("../../core/valuation.js");
const ci_js_1 = require("../../core/ci.js");
function registerBadgeCommand(program) {
    program
        .command('badge')
        .description('Generate a maintainability badge')
        .option('--path <dir>', 'Path to scan', '.')
        .option('--out <file>', 'Output SVG file', 'reports/codeworth.svg')
        .option('--report <file>', 'Path to report file (overrides auto-discovery in CI mode)')
        .option('--type <type>', 'Badge type (grade, value, certified)', 'grade')
        .option('--ci', 'Run in CI mode (enforces quality gate)')
        .option('--min-grade <grade>', 'Minimum grade required (A+, A, B, C, D, F)', 'C')
        .option('--min-score <score>', 'Minimum score required (0-100)', undefined)
        .action(async (options) => {
        try {
            const rootDir = path_1.default.resolve(options.path);
            let score = 0;
            let grade = 'F';
            let label = 'Codeworth';
            let valueText = '';
            let color = '#737373'; // Default gray
            if (options.ci) {
                // --- CI Mode ---
                // 1. Locate Report
                let reportPath = '';
                let reportData = null;
                if (options.report) {
                    // Explicit report path
                    reportPath = path_1.default.resolve(options.report);
                    try {
                        const data = await promises_1.default.readFile(reportPath, 'utf-8');
                        reportData = JSON.parse(data);
                    }
                    catch (e) {
                        console.error(chalk_1.default.red(`Error: Could not read report at ${reportPath}: ${e.message}`));
                        process.exit(1);
                    }
                }
                else {
                    // Auto-discovery
                    const reportPaths = [
                        path_1.default.join(rootDir, 'reports', 'codeworth.report.json'),
                        path_1.default.join(rootDir, 'codeworth.report.json'),
                        // Fallback to current working dir if path is default
                        path_1.default.join(process.cwd(), 'reports', 'codeworth.report.json'),
                        path_1.default.join(process.cwd(), 'codeworth.report.json')
                    ];
                    for (const p of reportPaths) {
                        try {
                            const data = await promises_1.default.readFile(p, 'utf-8');
                            reportData = JSON.parse(data);
                            reportPath = p;
                            break;
                        }
                        catch (e) {
                            // Continue to next path
                        }
                    }
                    if (!reportData) {
                        console.error(chalk_1.default.red('Error: Could not find a valid codeworth.report.json. Run "codeworth scan" first or use --report.'));
                        process.exit(1);
                    }
                }
                if (!reportData || !reportData.maintainability) {
                    console.error(chalk_1.default.red('Error: Report is missing maintainability data.'));
                    process.exit(1);
                }
                // 2. Evaluate CI Gate
                const ciOptions = {
                    minGrade: options.minGrade,
                    minScore: options.minScore ? parseInt(options.minScore, 10) : undefined
                };
                const ciResult = (0, ci_js_1.evaluateCiGate)(reportData, ciOptions);
                score = ciResult.score;
                grade = ciResult.grade;
                const passed = ciResult.passed;
                // Prepare Badge Data
                valueText = `${grade} (${score})`;
                color = (0, badgeGenerator_js_1.getGradeColor)(grade);
                // 4. Output & Exit
                if (passed) {
                    console.log(chalk_1.default.green(`✅ Codeworth CI PASSED`));
                    console.log(`Grade: ${grade} (${score})`);
                    console.log(chalk_1.default.gray(`Requirement: ${ciResult.message}`));
                }
                else {
                    console.log(chalk_1.default.red(`❌ Codeworth CI FAILED`));
                    console.log(`Grade: ${grade} (${score})`);
                    console.log(chalk_1.default.yellow(`Required: ${ciResult.message}`));
                }
                // Store exit code for later
                var exitCode = passed ? 0 : 1;
            }
            else {
                // --- Standard Mode (Scan & Generate) ---
                const scanOptions = {
                    path: options.path,
                };
                const filePaths = await (0, discoverFiles_js_1.discoverFiles)(scanOptions);
                const files = [];
                const totals = { files: 0, loc: { code: 0, comment: 0, blank: 0 } };
                const languagesMap = new Map();
                for (const filePath of filePaths) {
                    const absolutePath = path_1.default.join(rootDir, filePath);
                    const lang = (0, language_js_1.getLanguage)(filePath);
                    const loc = await (0, locCounter_js_1.countLoc)(absolutePath, lang);
                    const complexity = await (0, complexityProxy_js_1.calculateComplexity)(absolutePath);
                    files.push({
                        path: filePath,
                        size: 0,
                        language: lang,
                        loc,
                        complexity: complexity.score,
                        churn: undefined
                    });
                    totals.files++;
                    totals.loc.code += loc.code;
                    totals.loc.comment += loc.comment;
                    totals.loc.blank += loc.blank;
                    const langStat = languagesMap.get(lang) || { files: 0, loc: 0 };
                    langStat.files++;
                    langStat.loc += loc.code;
                    languagesMap.set(lang, langStat);
                }
                const languages = Array.from(languagesMap.entries()).map(([name, stat]) => ({
                    name,
                    files: stat.files,
                    loc: { code: stat.loc, comment: 0, blank: 0 },
                    percentOfCode: totals.loc.code > 0 ? (stat.loc / totals.loc.code) * 100 : 0
                }));
                const result = {
                    meta: { scannedPath: rootDir, timestamp: new Date().toISOString(), repo: { name: path_1.default.basename(rootDir), hasGit: false } },
                    files,
                    totals,
                    languages,
                    directories: [],
                    hotspots: { byLoc: [], byComplexity: [], byChurn: [] }
                };
                // Check for git presence manually
                try {
                    const gitDir = path_1.default.join(rootDir, '.git');
                    const stat = await promises_1.default.stat(gitDir);
                    if (stat.isDirectory()) {
                        result.meta.repo.hasGit = true;
                    }
                }
                catch { /* ignore */ }
                const maintainability = await (0, maintainability_js_1.calculateMaintainability)(result, rootDir);
                score = maintainability.score;
                grade = maintainability.grade;
                valueText = `${grade} (${score})`;
                color = (0, badgeGenerator_js_1.getGradeColor)(grade);
                // Optional types
                if (options.type === 'certified') {
                    const isGradeEligible = score >= 90;
                    const hygieneCat = maintainability.breakdown.find(c => c.category === 'Project Hygiene');
                    const hasCI = hygieneCat?.notes.some(n => n.includes('CI'));
                    const testCat = maintainability.breakdown.find(c => c.category === 'Testing');
                    const hasTests = testCat && testCat.score > 0;
                    const hasExtremeHotspots = files.some(f => (f.complexity || 0) >= 85);
                    if (isGradeEligible && hasCI && hasTests && !hasExtremeHotspots) {
                        valueText = 'Certified';
                        color = '#16a34a';
                    }
                    else {
                        console.warn(chalk_1.default.yellow('Repo not eligible for Certified badge. Falling back to grade.'));
                    }
                }
                else if (options.type === 'value') {
                    const valuation = (0, valuation_js_1.calculateValuation)(result, maintainability);
                    valueText = (0, badgeGenerator_js_1.formatCurrency)(valuation.riskAdjustedValue);
                    label = 'Value';
                }
            }
            // --- Generate Badge (Common) ---
            const svg = (0, badgeGenerator_js_1.generateBadgeSvg)({
                label,
                valueText,
                color
            });
            const outDir = path_1.default.dirname(options.out);
            await promises_1.default.mkdir(outDir, { recursive: true });
            await promises_1.default.writeFile(options.out, svg);
            if (options.ci) {
                // In CI, we only print the badge path if successful? Or just always.
                // Spec says "Print only minimal CI output."
                // We already printed PASS/FAIL.
                //@ts-ignore
                if (typeof exitCode !== 'undefined' && exitCode !== 0) {
                    process.exit(exitCode);
                }
            }
            else {
                // Normal Output
                console.log(chalk_1.default.green(`Badge written to ${options.out}`));
                if (score >= 50) {
                    console.log('\n' + chalk_1.default.bold('Share your score: Add this to your README.'));
                    const relativePath = path_1.default.relative(rootDir, options.out);
                    const repoUrl = 'https://github.com/<user>/<repo>';
                    const rawUrl = `https://raw.githubusercontent.com/<user>/<repo>/main/${relativePath}`;
                    console.log(chalk_1.default.cyan(`\n[![Codeworth](${relativePath})](${repoUrl})`));
                }
                else {
                    console.log(chalk_1.default.gray('\nTip: Improve maintainability to earn a sharable badge.'));
                }
            }
        }
        catch (error) {
            console.error(chalk_1.default.red('Badge generation failed:'), error);
            process.exit(1);
        }
    });
}
