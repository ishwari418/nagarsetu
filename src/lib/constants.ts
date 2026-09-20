export const CATEGORIES = [
  "Water",
  "Roads",
  "Waste",
  "Drainage",
  "Pollution",
  "Street Infrastructure",
  "Public Health",
  "Other",
] as const;

export const STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "IN_PROGRESS",
  "RESOLVED",
] as const;

export const PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

export const STATUS_LABEL: Record<string, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under review",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

export const PRIORITY_LABEL: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const CATEGORY_ICON: Record<string, string> = {
  Water: "◐",
  Roads: "▬",
  Waste: "◧",
  Drainage: "◍",
  Pollution: "◇",
  "Street Infrastructure": "▮",
  "Public Health": "✚",
  Other: "◌",
};

export function statusTone(status: string) {
  switch (status) {
    case "RESOLVED":
      return "bg-civic-light text-civic-dark border-civic/30";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-800 border-amber-300";
    case "UNDER_REVIEW":
      return "bg-sky-50 text-sky-800 border-sky-300";
    default:
      return "bg-slate-100 text-ink-soft border-line";
  }
}

export function priorityTone(priority: string) {
  switch (priority) {
    case "HIGH":
      return "bg-clay-light text-clay border-clay/40";
    case "MEDIUM":
      return "bg-amber-50 text-amber-800 border-amber-300";
    default:
      return "bg-slate-100 text-ink-muted border-line";
  }
}
