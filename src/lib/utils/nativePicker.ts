/** Ortak stil — globals.css .native-picker-input ile eşleşir */
export const NATIVE_PICKER_INPUT_CLASS =
  "native-picker-input box-border w-full min-w-0 max-w-full rounded-lg border border-border px-2 py-2.5 text-base sm:px-3 sm:py-2 sm:text-sm";

export function splitDateTimeLocalValue(value: string): {
  date: string;
  time: string;
} {
  if (!value || !value.includes("T")) {
    return { date: "", time: "09:00" };
  }

  const [date, timePart] = value.split("T");
  return {
    date,
    time: timePart.slice(0, 5) || "09:00",
  };
}

export function joinDateTimeLocalValue(date: string, time: string): string {
  if (!date) return "";
  return `${date}T${time || "09:00"}`;
}
