# Codeworth Report

> **Executive Summary**
> 
> **Overall Grade**: B (82/100)
> **Rebuild Cost**: $18,624
> **Risk-Adjusted Value**: $21,511
> **Top Risk**: Complexity (Score: 12/25)
> **Primary Recommendation**: Refactor highly complex file: src/cli/commands/badge.ts (Score: 100)

## Maintainability: ████████████████░░░░ 82%

### Scan Metadata
- **Repo**: codeworth
- **Date**: 2/11/2026, 9:09:57 PM
- **Scanned Files**: 35
- **Total LOC**: 2,435
- **Node Version**: v25.5.0
- **Platform**: darwin (24.6.0)

## Valuation Details
| Metric | Value |
|---|---|
| **Rebuild Cost** | $18,624 |
| **Risk-Adjusted** | $21,511 |
| **Confidence** | **MEDIUM** |

### Valuation Inputs
- **Rate Model**: per_loc ($10/LOC)

### Multipliers
- Complexity: x0.97
- Tests: x1.10
- Docs: x1.00
- Churn: x1.00
- Dependencies: x1.05

## Maintainability Breakdown
| Category | Score | Max | Notes |
|---|---|---|---|
| Project Hygiene | 20 | 20 | README exists, LICENSE exists, CONTRIBUTING exists, Issue templates detected, CI config detected |
| Code Structure | 20 | 25 | No huge files, TypeScript detected, Linter/Formatter detected |
| Complexity | 12 | 25 | Moderate complexity, 2 extreme hotspots |
| Testing | 20 | 20 | Tests directory exists, Test files detected, Test runner config detected, Coverage reports detected |
| Dependency Risk | 10 | 10 | Lockfile present, Low dependencies |

### Quick Wins
- Refactor highly complex file: src/cli/commands/badge.ts (Score: 100)

## Extreme Hotspots (Complexity >= 85)
| File | Complexity |
|---|---|
| src/cli/commands/badge.ts | 100.0 |
| src/core/maintainability.ts | 90.2 |

## Top Hotspots
| File | LOC | Complexity |
|---|---|---|
| src/cli/commands/badge.ts | 195 | 100.0 |
| src/cli/commands/scan.ts | 154 | 71.8 |
| test/cli/badge.test.ts | 124 | 0.0 |
| src/cli/output/writeMarkdown.ts | 117 | 69.0 |
| README.md | 111 | 39.2 |
| src/core/maintainability.ts | 99 | 90.2 |
| src/core/types.ts | 98 | 44.0 |
| src/core/valuation.ts | 89 | 80.1 |
| src/core/locCounter.ts | 86 | 67.7 |
| src/core/complexityProxy.ts | 84 | 65.3 |

## Language Breakdown
| Language | Files | Code | Comment | Blank | % |
|---|---|---|---|---|---|
| TypeScript | 24 | 1,568 | 113 | 310 | 81.5% |
| Markdown | 3 | 148 | 0 | 63 | 7.7% |
| Other | 4 | 75 | 0 | 15 | 3.9% |
| JavaScript | 1 | 60 | 4 | 1 | 3.1% |
| JSON | 2 | 51 | 0 | 0 | 2.7% |
| YAML | 1 | 22 | 0 | 5 | 1.1% |