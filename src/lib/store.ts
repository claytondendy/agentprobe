import { ScanConfig, ScanResult, ModuleResult } from "./types";
import { computeOverallGrade, countFindings } from "./grader";

const scans = new Map<string, ScanResult>();

export function createScan(config: ScanConfig): ScanResult {
  const result: ScanResult = {
    id: config.id,
    config,
    status: "running",
    overallGrade: "A",
    overallScore: 100,
    moduleResults: [],
    totalTests: 0,
    passed: 0,
    warnings: 0,
    criticalFailures: 0,
    startedAt: new Date().toISOString(),
  };
  scans.set(config.id, result);
  return result;
}

export function updateScan(id: string, moduleResult: ModuleResult) {
  const scan = scans.get(id);
  if (!scan) return;
  scan.moduleResults.push(moduleResult);
  const { grade, score } = computeOverallGrade(scan.moduleResults);
  const counts = countFindings(scan.moduleResults);
  scan.overallGrade = grade;
  scan.overallScore = score;
  scan.totalTests = counts.totalTests;
  scan.passed = counts.passed;
  scan.warnings = counts.warnings;
  scan.criticalFailures = counts.criticalFailures;
}

export function completeScan(id: string) {
  const scan = scans.get(id);
  if (!scan) return;
  scan.status = "complete";
  scan.completedAt = new Date().toISOString();
}

export function getScan(id: string): ScanResult | undefined {
  return scans.get(id);
}

export function getAllScans(): ScanResult[] {
  return Array.from(scans.values()).sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}
