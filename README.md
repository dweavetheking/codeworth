# Codeworth

> Static analysis CLI for codebase valuation, maintainability scoring, and CI quality gates.
> Measure rebuild cost. Detect complexity hotspots. Enforce standards.

Codeworth is an open-source static analysis CLI that quantifies the financial and structural health of JavaScript and TypeScript repositories. It produces a maintainability grade, estimates rebuild cost, calculates risk-adjusted codebase value, and identifies complexity hotspots — all from a single command. It is designed to run locally during development or integrate into CI/CD pipelines as an automated quality gate that fails builds when code quality drops below a defined threshold.

As a code valuation tool and technical debt measurement utility, Codeworth provides software asset valuation grounded in transparent, configurable models rather than opaque heuristics. It combines maintainability scoring, rebuild cost estimation, and repository grading into a single report that engineers and non-technical stakeholders can both read. Whether you need a CI quality gate that blocks merges below a certain grade or a defensible dollar figure for a codebase you are handing off, Codeworth generates the numbers and the rationale behind them.

## What Codeworth Does

- **Maintainability Scoring** — Grades your repository from A+ to F based on hygiene, structure, complexity, test coverage, and dependency risk.
- **Rebuild Cost Estimation** — Calculates what it would cost to rewrite the project from scratch at configurable per-line rates.
- **Risk-Adjusted Codebase Valuation** — Applies risk multipliers derived from code quality signals to produce a defensible dollar value.
- **Complexity and Hotspot Detection** — Identifies the most complex files, deeply nested logic, and oversized modules that concentrate maintenance risk.
- **CI/CD Quality Gates** — Exits with a non-zero code when quality falls below a specified grade or score, failing the build automatically.
- **Badge Generation** — Produces static SVG badges (grade, value, certified) suitable for embedding in README files or dashboards.

## Why It Exists

Software is a capital asset, but its value is rarely quantified with the same rigor applied to other business investments.

- Clients and stakeholders routinely underestimate the cost of accumulated technical debt because there is no visible metric for it.
- Engineering teams need objective, non-emotional benchmarks to discuss quality tradeoffs and prioritize refactoring work.
- CI pipelines should enforce architectural and maintainability standards, not just verify that tests pass.
- Codebases change hands — through acquisitions, contractor handoffs, and open-source forks — and the receiving party deserves a structured assessment rather than guesswork.

Codeworth makes the implicit explicit. It turns subjective quality debates into grounded, reproducible measurements.

## Who It's For

- **Freelancers** — Attach a valuation report to project deliverables. Demonstrate the quality and rebuild cost of what you ship.
- **Agencies** — Standardize quality benchmarks across client projects. Use grades and badges in proposals and handoff documentation.
- **Engineering Teams** — Integrate into CI to enforce minimum maintainability standards. Track quality trends across releases.
- **Startup Founders** — Understand the financial value and risk profile of your technical assets during fundraising, due diligence, or acquisition conversations.
- **Open-Source Maintainers** — Signal project health to contributors and adopters with a transparent, reproducible grade.

## Installation

Install globally:

```bash
npm install -g codeworth
```

Or run directly without installing:

```bash
npx codeworth scan
```

**Requirements:** Node.js 18 or later.

## Usage

### Scan

Run a scan against the current directory or a specified path. The scan analyzes source files, computes all metrics, and prints a full report to the terminal.

```bash
# Scan the current directory with default settings
codeworth scan

# Scan a specific path
codeworth scan --path ./src

# Scan using a valuation preset
codeworth scan --preset agency
```

### Badge Generation

Generate static SVG badges for embedding in your README or project documentation.

```bash
# Generate a grade badge
codeworth badge --type grade

# Generate a value badge
codeworth badge --type value

# Generate a certified badge
codeworth badge --type certified
```

**Badge types:**

| Type | Output | Use Case |
|------|--------|----------|
| `grade` | `[Grade: A]` | Standard quality indicator for any project. |
| `value` | `[Value: $150k]` | Risk-adjusted monetary valuation. Useful for deliverables. |
| `certified` | `[Certified]` | Reserved for repositories meeting strict criteria (see below). |

**Certified badge requirements:**

A certified badge is only issued when all of the following conditions are met:

- Maintainability grade of A+ (score 90 or above)
- CI environment detected
- Test infrastructure detected
- No extreme complexity hotspots

This badge is not decorative. It represents a verifiable claim about codebase quality.

### CI Quality Gate

Codeworth can act as a gatekeeper in your CI pipeline. If the codebase drops below your specified standards, the process exits with code 1, which fails the build in any standard CI system.

```bash
# Fail if the repository grade is below B
codeworth badge --ci --min-grade B

# Fail if the raw maintainability score is below 85
codeworth badge --ci --min-score 85
```

On failure, Codeworth outputs a non-zero exit code (1), which halts most CI pipelines (GitHub Actions, GitLab CI, CircleCI, Jenkins) immediately.

### GitHub Actions Example

Add the following workflow to `.github/workflows/codeworth.yml` to enforce a minimum quality standard on every push and pull request.

```yaml
name: Codeworth Quality Gate

on: [push, pull_request]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Codeworth
        run: npm install -g codeworth

      - name: Run Codeworth Scan
        run: codeworth scan

      - name: Enforce Quality Gate
        run: codeworth badge --ci --min-grade B
```

If the repository scores below grade B, the workflow fails and the pull request is blocked (assuming branch protection rules require this check to pass).

## Valuation Model

Codeworth uses a transparent, configurable model to estimate codebase value. There are no hidden weights or proprietary formulas.

### Base Rate

The starting point is a per-line-of-code rebuild cost. The default rate is $10/LOC.

| Preset | Rate | Intended Use |
|--------|------|--------------|
| `junior` | $6/LOC | Junior-level rebuild estimate |
| `senior` | $12/LOC | Senior-level rebuild estimate |
| `agency` | $18/LOC | Agency or consultancy rate |

The base rate can also be set to a custom value via configuration.

### Risk Multipliers

The raw rebuild cost is adjusted by a composite risk multiplier derived from the following signals:

| Factor | Effect |
|--------|--------|
| **Complexity** | High cyclomatic complexity and deep nesting reduce the multiplier. Complex code is harder to maintain and more expensive to modify safely. |
| **Test Coverage** | Presence and density of test code increase the multiplier. Verified code is a more reliable asset. |
| **Documentation** | Inline documentation and README presence increase the multiplier. Documented code transfers knowledge more effectively. |
| **Dependency Risk** | Excessive or outdated external dependencies reduce the multiplier. Supply chain risk degrades asset reliability. |
| **Churn** | High file churn (frequent changes to the same files) reduces the multiplier. Churn often indicates unstable design. |

### Calculation

```text
Rebuild Cost     = Lines of Code * Base Rate
Risk Multiplier  = f(complexity, tests, docs, dependencies, churn)
Adjusted Value   = Rebuild Cost * Risk Multiplier
```

The risk multiplier is always between 0 and 1. A score of 1.0 means zero detected risk (unlikely in practice). A lower multiplier reflects higher risk and reduces the adjusted value accordingly.

All inputs and weights are visible in the scan output. Nothing is hidden.

## Maintainability Model

Codeworth assigns a letter grade based on a weighted composite score across multiple quality dimensions. The score maps to a standard academic scale:

| Grade | Score Range | Interpretation |
|-------|-------------|----------------|
| A+ | 90 – 100 | Exceptional. Low complexity, strong test coverage, clean structure. |
| A | 85 – 89 | Excellent. Minimal technical debt. Production-ready with confidence. |
| B | 75 – 84 | Good. Solid baseline. Minor hotspots are present but manageable. |
| C | 65 – 74 | Fair. Technical debt is accumulating. Refactoring should be prioritized. |
| D | 50 – 64 | Poor. Significant structural risk. Remediation is necessary. |
| F | Below 50 | Critical. High rebuild risk. Maintenance cost likely exceeds value. |

### Scoring Dimensions

The composite score is derived from the following categories:

- **Hygiene** — File structure, formatting consistency, naming conventions.
- **Structure** — Directory depth, module organization, separation of concerns.
- **Complexity** — Cyclomatic complexity, maximum nesting depth, function length.
- **Testing** — Presence of test files, test-to-source ratio, test framework detection.
- **Dependency Risk** — Total dependency count, depth of dependency tree, known outdated packages.

Each dimension contributes to the final score. The weights are fixed and documented in the source code.

## Example Output

The following is representative output from running `codeworth scan` on a mid-sized TypeScript project:

```text
Codeworth Report
================

Repository:        my-project
Files Analyzed:    124
Lines of Code:     18,340
Preset:            senior ($12/LOC)

--- Maintainability ---

  Hygiene:           82
  Structure:         78
  Complexity:        71
  Testing:           88
  Dependency Risk:   75

  Composite Score:   79
  Grade:             B

--- Valuation ---

  Rebuild Cost:      $220,080
  Risk Multiplier:   0.74
  Adjusted Value:    $162,859

--- Hotspots ---

  src/engine/parser.ts         complexity: 38   nesting: 7
  src/utils/legacyAdapter.ts   complexity: 29   nesting: 6
  src/services/billing.ts      complexity: 24   nesting: 5

--- Summary ---

  3 complexity hotspots detected.
  Grade B: Meets standard quality threshold.
  Recommended action: Refactor top hotspots to reduce concentrated risk.
```

## Philosophy

**Code is infrastructure.** Like any infrastructure, it should be inspectable, measurable, and subject to minimum standards.

Codeworth does not attempt to capture every nuance of software quality. It provides a consistent, reproducible baseline that can be versioned, tracked over time, and enforced automatically. The valuation model is intentionally transparent so that its outputs can be challenged, adjusted, and understood by anyone reading the report.

Quality should be a measurable property of a codebase, not a matter of opinion. Standards should be enforced by automation so that engineers can focus on architecture and features rather than arguing about subjective thresholds in code review.

The tool is opinionated about what it measures. It is not opinionated about what your thresholds should be. Set the grade floor that matches your project's risk tolerance and let the pipeline enforce it.

## License

MIT
