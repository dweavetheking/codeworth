"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const badgeGenerator_1 = require("../src/core/badgeGenerator");
(0, vitest_1.describe)('Badge Generator', () => {
    (0, vitest_1.describe)('getGradeColor', () => {
        (0, vitest_1.it)('returns correct colors for grades', () => {
            (0, vitest_1.expect)((0, badgeGenerator_1.getGradeColor)('A+')).toBe('#16a34a');
            (0, vitest_1.expect)((0, badgeGenerator_1.getGradeColor)('A')).toBe('#22c55e');
            (0, vitest_1.expect)((0, badgeGenerator_1.getGradeColor)('B')).toBe('#14b8a6');
            (0, vitest_1.expect)((0, badgeGenerator_1.getGradeColor)('C')).toBe('#f59e0b');
            (0, vitest_1.expect)((0, badgeGenerator_1.getGradeColor)('D')).toBe('#ea580c');
            (0, vitest_1.expect)((0, badgeGenerator_1.getGradeColor)('F')).toBe('#dc2626');
            (0, vitest_1.expect)((0, badgeGenerator_1.getGradeColor)('Z')).toBe('#737373'); // Default
        });
    });
    (0, vitest_1.describe)('formatCurrency', () => {
        (0, vitest_1.it)('formats small numbers correctly', () => {
            (0, vitest_1.expect)((0, badgeGenerator_1.formatCurrency)(500)).toBe('$500');
            (0, vitest_1.expect)((0, badgeGenerator_1.formatCurrency)(999)).toBe('$999');
        });
        (0, vitest_1.it)('formats thousands correctly', () => {
            (0, vitest_1.expect)((0, badgeGenerator_1.formatCurrency)(1000)).toBe('$1K');
            (0, vitest_1.expect)((0, badgeGenerator_1.formatCurrency)(1500)).toBe('$1.5K');
            (0, vitest_1.expect)((0, badgeGenerator_1.formatCurrency)(12400)).toBe('$12.4K');
            (0, vitest_1.expect)((0, badgeGenerator_1.formatCurrency)(100000)).toBe('$100K');
        });
        (0, vitest_1.it)('formats millions correctly', () => {
            (0, vitest_1.expect)((0, badgeGenerator_1.formatCurrency)(1000000)).toBe('$1M');
            (0, vitest_1.expect)((0, badgeGenerator_1.formatCurrency)(1500000)).toBe('$1.5M');
            (0, vitest_1.expect)((0, badgeGenerator_1.formatCurrency)(4200000)).toBe('$4.2M');
        });
    });
    (0, vitest_1.describe)('generateBadgeSvg', () => {
        (0, vitest_1.it)('generates a valid SVG string', () => {
            const svg = (0, badgeGenerator_1.generateBadgeSvg)({
                label: 'TestLabel',
                valueText: 'A (100)',
                color: '#000000'
            });
            (0, vitest_1.expect)(svg).toContain('<svg');
            (0, vitest_1.expect)(svg).toContain('TestLabel');
            (0, vitest_1.expect)(svg).toContain('A (100)');
            (0, vitest_1.expect)(svg).toContain('fill="#000000"');
        });
        (0, vitest_1.it)('matches snapshot', () => {
            const svg = (0, badgeGenerator_1.generateBadgeSvg)({
                label: 'Codeworth',
                valueText: 'A+ (95)',
                color: '#16a34a'
            });
            (0, vitest_1.expect)(svg).toMatchSnapshot();
        });
    });
});
