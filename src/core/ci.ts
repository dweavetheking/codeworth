import { ScanResult } from './types.js';

export interface CiOptions {
    minGrade?: string;
    minScore?: number;
}

export interface CiResult {
    passed: boolean;
    message: string;
    score: number;
    grade: string;
}

export function evaluateCiGate(scanResult: ScanResult, options: CiOptions): CiResult {
    const maintainability = scanResult.maintainability;

    if (!maintainability) {
        return {
            passed: false,
            message: 'No maintainability data found in scan result.',
            score: 0,
            grade: 'F'
        };
    }

    const score = maintainability.score;
    const grade = maintainability.grade;

    const gradeRank: Record<string, number> = {
        'A+': 6, 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1
    };
    const currentRank = gradeRank[grade] || 0;

    let passed = false;
    let message = '';

    if (options.minScore !== undefined) {
        passed = score >= options.minScore;
        message = `Score >= ${options.minScore}`;
    } else {
        const minGrade = options.minGrade || 'C'; // Default C if not specified, though caller normally provides defaults
        const minRank = gradeRank[minGrade] || 0;
        passed = currentRank >= minRank;
        message = `Grade >= ${minGrade}`;
    }

    return {
        passed,
        message,
        score,
        grade
    };
}
