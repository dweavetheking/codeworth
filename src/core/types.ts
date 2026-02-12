export interface ScanOptions {
    path: string;
    minSizeKb?: number;
    maxFiles?: number;
    includeGenerated?: boolean;
    noGit?: boolean;
    top?: number;
    exclude?: string[];
    outdir?: string;
}

export interface FileResult {
    path: string;
    size: number;
    language: string;
    loc: {
        code: number;
        comment: number;
        blank: number;
    };
    complexity?: number;
    churn?: {
        commits: number;
        authors: number;
    };
}

export interface ScanResult {
    meta: {
        scannedPath: string;
        timestamp: string;
        repo: {
            name: string;
            commit?: string;
            branch?: string;
            hasGit: boolean;
        };
    };
    files: FileResult[];
    totals: {
        files: number;
        loc: {
            code: number;
            comment: number;
            blank: number;
        };
    };
    languages: {
        name: string;
        files: number;
        loc: {
            code: number;
            comment: number;
            blank: number;
        };
        percentOfCode: number;
    }[];
    directories: {
        path: string;
        files: number;
        loc: {
            code: number;
            comment: number;
            blank: number;
        };
    }[];
    hotspots: {
        byLoc: { path: string; locCode: number }[];
        byComplexity: { path: string; score: number }[];
        byChurn: { path: string; commits: number; authors: number }[];
    };
    maintainability?: MaintainabilityResult;
    valuation?: {
        rebuildCost: number;
        riskAdjustedValue: number;
        confidence: 'LOW' | 'MEDIUM' | 'HIGH';
        assumptions: {
            rateModel: string;
            locRateUsd: number;
            multipliers: {
                complexity: number;
                tests: number;
                docs: number;
                churn: number;
                deps: number;
            };
        };
    };
}

export interface MaintainabilityResult {
    score: number;
    grade: string;
    breakdown: {
        category: string;
        score: number;
        max: number;
        notes: string[];
    }[];
    quickWins: string[];
}
