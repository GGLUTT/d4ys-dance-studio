import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseBookingNotes(notes: string | null) {
  if (!notes) {
    return {
      comment: "",
      direction: "",
      format: "",
      trainer: "",
      time: "",
      source: "",
    };
  }
  const lines = notes.split("\n");
  const getValue = (prefix: string) =>
    lines.find(line => line.startsWith(prefix))?.replace(`${prefix} `, "") ?? "";
  const firstLine = lines[0] ?? "";
  const hasPrefixedFirstLine =
    firstLine.startsWith("Напрямок:") ||
    firstLine.startsWith("Формат:") ||
    firstLine.startsWith("Тренер:") ||
    firstLine.startsWith("Час:") ||
    firstLine.startsWith("Джерело:");
  return {
    comment: hasPrefixedFirstLine ? "" : firstLine,
    direction: getValue("Напрямок:"),
    format: getValue("Формат:"),
    trainer: getValue("Тренер:"),
    time: getValue("Час:"),
    source: getValue("Джерело:"),
  };
}
