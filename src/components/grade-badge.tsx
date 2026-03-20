import { Grade } from "@/lib/types";

const gradeStyles: Record<Grade, string> = {
  A: "bg-emerald-50 text-emerald-600 border-emerald-100",
  B: "bg-slate-100 text-slate-600 border-slate-200",
  C: "bg-amber-50 text-amber-600 border-amber-100",
  D: "bg-amber-50 text-amber-600 border-amber-100",
  F: "bg-red-50 text-red-600 border-red-100",
};

export function GradeBadge({ grade, size = "sm" }: { grade: Grade; size?: "sm" | "lg" }) {
  const sizeClass = size === "lg" ? "w-20 h-20 text-3xl" : "w-8 h-8 text-xs";
  return (
    <div className={`${sizeClass} rounded-full border flex items-center justify-center font-headline font-bold ${gradeStyles[grade]}`}>
      {grade}
    </div>
  );
}
