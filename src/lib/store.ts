import { ScanConfig, ScanResult, ModuleResult, ScanProgressEvent } from "./types";
import { computeOverallGrade, countFindings } from "./grader";

export function updateProgress(id: string, progress: number) {
  const scan = scans.get(id);
  if (scan) scan.progress = progress;
}

const scans = new Map<string, ScanResult>();
const eventLogs = new Map<string, ScanProgressEvent[]>();

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
    progress: 0,
    startedAt: new Date().toISOString(),
  };
  scans.set(config.id, result);
  eventLogs.set(config.id, []);
  return result;
}

export function pushEvent(id: string, event: ScanProgressEvent) {
  const log = eventLogs.get(id);
  if (log) log.push(event);
}

export function getEvents(id: string, fromIndex: number = 0): ScanProgressEvent[] {
  const log = eventLogs.get(id);
  if (!log) return [];
  return log.slice(fromIndex);
}

export function getEventCount(id: string): number {
  return eventLogs.get(id)?.length || 0;
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

export function failScan(id: string) {
  const scan = scans.get(id);
  if (!scan) return;
  scan.status = "failed";
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
