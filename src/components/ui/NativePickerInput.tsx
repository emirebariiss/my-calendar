"use client";

import {
  joinDateTimeLocalValue,
  NATIVE_PICKER_INPUT_CLASS,
  splitDateTimeLocalValue,
} from "@/lib/utils/nativePicker";

interface DateTimeLocalInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  "aria-label"?: string;
}

/** Mobilde date+time (iOS Safari), sm+ datetime-local */
export function DateTimeLocalInput({
  id,
  value,
  onChange,
  "aria-label": ariaLabel,
}: DateTimeLocalInputProps) {
  const { date, time } = splitDateTimeLocalValue(value);

  return (
    <>
      <div className="grid min-w-0 grid-cols-1 gap-2 sm:hidden">
        <input
          id={`${id}-date`}
          type="date"
          value={date}
          aria-label={ariaLabel ? `${ariaLabel} — tarih` : "Tarih"}
          onChange={(e) =>
            onChange(joinDateTimeLocalValue(e.target.value, time))
          }
          className={NATIVE_PICKER_INPUT_CLASS}
        />
        <input
          id={`${id}-time`}
          type="time"
          value={time}
          aria-label={ariaLabel ? `${ariaLabel} — saat` : "Saat"}
          onChange={(e) =>
            onChange(joinDateTimeLocalValue(date, e.target.value))
          }
          className={NATIVE_PICKER_INPUT_CLASS}
        />
      </div>

      <input
        id={id}
        type="datetime-local"
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className={`${NATIVE_PICKER_INPUT_CLASS} hidden sm:block`}
      />
    </>
  );
}

interface NativePickerInputProps {
  id: string;
  type: "date" | "time";
  value: string;
  onChange: (value: string) => void;
  "aria-label"?: string;
}

export function NativePickerInput({
  id,
  type,
  value,
  onChange,
  "aria-label": ariaLabel,
}: NativePickerInputProps) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      className={NATIVE_PICKER_INPUT_CLASS}
    />
  );
}
