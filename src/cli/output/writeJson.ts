import fs from 'fs/promises';
import path from 'path';
import { ScanResult } from '../../core/types.js';

export async function writeJson(result: ScanResult, outDir: string, filename: string = 'codeworth.report.json') {
    const outputPath = path.join(outDir, filename);
    await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
    return outputPath;
}
