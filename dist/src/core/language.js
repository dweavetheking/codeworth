"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LANGUAGE_MAP = void 0;
exports.getLanguage = getLanguage;
exports.LANGUAGE_MAP = {
    '.js': 'JavaScript',
    '.jsx': 'JavaScript',
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript',
    '.py': 'Python',
    '.lua': 'Lua',
    '.html': 'HTML',
    '.css': 'CSS',
    '.json': 'JSON',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.md': 'Markdown',
    '.sh': 'Shell',
    '.bash': 'Shell',
    '.go': 'Go',
    '.java': 'Java',
    '.c': 'C',
    '.cpp': 'C++',
    '.h': 'C/C++ Header',
    '.rs': 'Rust',
    '.rb': 'Ruby',
    '.php': 'PHP'
};
function getLanguage(filename) {
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    return exports.LANGUAGE_MAP[ext] || 'Other';
}
