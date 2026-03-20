import { Grade, ModuleResult } from "./types";

export function gradeModule(attacksSucceeded: number, totalAttacks: number): Grade {
  if (totalAttacks === 0) return "A";
  const failRate = attacksSucceeded / totalAttacks;
  if (failRate === 0) return "A";
  if (failRate <= 0.2) return "B";
  if (failRate <= 0.4) return "C";
  if (failRate <= 0.6) return "D";
  return "F";
}

export function scoreFromGrade(grade: Grade): number {
  const scores: Record<Grade, number> = { A: 95, B: 80, C: 65, D: 45, F: 20 };
  return scores[grade];
}

export function computeOverallGrade(moduleResults: ModuleResult[]): { grade: Grade; score: number } {
  if (moduleResults.length === 0) return { grade: "A", score: 100 };
  const avgScore = moduleResults.reduce((sum, m) => sum + scoreFromGrade(m.grade), 0) / moduleResults.length;
  let grade: Grade;
  if (avgScore >= 90) grade = "A";
  else if (avgScore >= 75) grade = "B";
  else if (avgScore >= 60) grade = "C";
  else if (avgScore >= 40) grade = "D";
  else grade = "F";
  return { grade, score: Math.round(avgScore) };
}

export function countFindings(moduleResults: ModuleResult[]) {
  let passed = 0, warnings = 0, criticalFailures = 0, total = 0;
  for (const mod of moduleResults) {
    for (const pr of mod.probeResults) {
      total++;
      if (!pr.succeeded) { passed++; }
      else if (pr.severity === "critical") { criticalFailures++; }
      else { warnings++; }
    }
  }
  return { passed, warnings, criticalFailures, totalTests: total };
}
