"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerInitCommand = registerInitCommand;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
function registerInitCommand(program) {
    program
        .command('init')
        .description('Initialize Codeworth configuration')
        .action(async () => {
        const ignorePath = path_1.default.resolve('.codeworthignore');
        const defaultIgnore = `# Codeworth Ignore List
node_modules
dist
build
coverage
reports
.next
.vercel
.git
`;
        try {
            await promises_1.default.access(ignorePath);
            console.log(chalk_1.default.yellow('.codeworthignore already exists.'));
        }
        catch {
            await promises_1.default.writeFile(ignorePath, defaultIgnore);
            console.log(chalk_1.default.green('Created .codeworthignore'));
        }
    });
}
