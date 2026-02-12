"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerVersionCommand = registerVersionCommand;
const os_1 = __importDefault(require("os"));
const chalk_1 = __importDefault(require("chalk"));
function registerVersionCommand(program) {
    program
        .command('version')
        .description('Display detailed version information')
        .action(() => {
        console.log(chalk_1.default.bold('Codeworth CLI'));
        console.log(`Version:     1.0.0`); // Hardcoded for now as reading package.json can be tricky in dist
        console.log(`Node:        ${process.version}`);
        console.log(`OS:          ${os_1.default.platform()} ${os_1.default.release()}`);
        console.log(`Arch:        ${os_1.default.arch()}`);
    });
}
