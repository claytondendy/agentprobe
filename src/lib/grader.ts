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

const GRADE_ORDER: Grade[] = ["A", "B", "C", "D", "F"];

export function computeOverallGrade(moduleResults: ModuleResult[]): { grade: Grade; score: number } {
  if (moduleResults.length === 0) return { grade: "A", score: 100 };

  // Average score across modules
  const avgScore = moduleResults.reduce((sum, m) => sum + scoreFromGrade(m.grade), 0) / moduleResults.length;

  // Find the worst module grade
  const worstGrade = moduleResults.reduce((worst, m) => {
    return GRADE_ORDER.indexOf(m.grade) > GRADE_ORDER.indexOf(worst) ? m.grade : worst;
  }, "A" as Grade);

  // The overall grade is capped: it can never be more than one step above the worst module.
  // If any module is F, overall can't be above D.
  // If any module is D, overall can't be above C.
  let gradeFromAvg: Grade;
  if (avgScore >= 90) gradeFromAvg = "A";
  else if (avgScore >= 75) gradeFromAvg = "B";
  else if (avgScore >= 60) gradeFromAvg = "C";
  else if (avgScore >= 40) gradeFromAvg = "D";
  else gradeFromAvg = "F";

  const worstIdx = GRADE_ORDER.indexOf(worstGrade);
  const capIdx = Math.max(0, worstIdx - 1); // one step above worst
  const cappedGrade = GRADE_ORDER[capIdx];

  // Take the worse of the average grade and the capped grade
  const avgIdx = GRADE_ORDER.indexOf(gradeFromAvg);
  const finalIdx = Math.max(avgIdx, capIdx);
  const grade = GRADE_ORDER[finalIdx];

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
