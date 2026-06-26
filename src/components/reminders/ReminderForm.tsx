"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReminderRecurrence } from "@/lib/types";
import { REMINDER_RECURRENCE_LABELS } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ReminderTargetSelect } from "@/components/reminders/ReminderTargetSelect";
import { useApp } from "@/providers/AppProvider";
import { fromDateTimeLocalValue } from "@/lib/utils/calendar";
import {
  getDefaultReminderTriggerAt,
  getReminderTargetOptions,
} from "@/lib/utils/reminder";
import type { ReminderFormValues } from "@/lib/utils/reminderForm";

export type { ReminderFormValues } from "@/lib/utils/reminderForm";

interface ReminderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ReminderFormValues) => void;
}

export function ReminderForm({ open, onClose, onSubmit }: ReminderFormProps) {
  const { events, tasks, workflows } = useApp();
  const [values, setValues] = useState<ReminderFormValues>(() => ({
    title: "",
    targetType: "task",
    targetId: "",
    triggerAt: getDefaultReminderTriggerAt(),
    recurrence: "once",
  }));
  const [error, setError] = useState("");

  const targetOptions = useMemo(
    () =>
      getReminderTargetOptions(
        values.targetType,
        events,
        tasks,
        workflows
      ),
    [values.targetType, events, tasks, workflows]
  );

  useEffect(() => {
    if (!open) return;

    setValues({
      title: "",
      targetType: "task",
      targetId: "",
      triggerAt: getDefaultReminderTriggerAt(),
      recurrence: "once",
    });
    setError("");
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const hasCurrentTarget = targetOptions.some(
      (option) => option.id === values.targetId
    );

    if (!hasCurrentTarget) {
      setValues((prev) => ({
        ...prev,
        targetId: targetOptions[0]?.id ?? "",
      }));
    }
  }, [open, targetOptions, values.targetId]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!values.title.trim()) {
      setError("Başlık zorunludur.");
      return;
    }

    if (!values.targetId) {
      setError("Hedef seçimi zorunludur.");
      return;
    }

    if (!values.triggerAt) {
      setError("Tetikleme zamanı zorunludur.");
      return;
    }

    onSubmit({
      ...values,
      title: values.title.trim(),
      triggerAt: fromDateTimeLocalValue(values.triggerAt),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Yeni Hatırlatma"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Vazgeç
          </Button>
          <Button
            type="submit"
            form="reminder-form"
            disabled={targetOptions.length === 0}
          >
            Oluştur
          </Button>
        </>
      }
    >
      <form id="reminder-form" onSubmit={handleSubmit} className="min-w-0 space-y-4 overflow-x-hidden">
        <div>
          <label htmlFor="reminder-title" className="mb-1 block text-sm font-medium">
            Başlık *
          </label>
          <input
            id="reminder-title"
            value={values.title}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            placeholder="Örn: Toplantı hatırlatması"
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>

        <ReminderTargetSelect
          targetType={values.targetType}
          targetId={values.targetId}
          options={targetOptions}
          onTargetTypeChange={(targetType) =>
            setValues((prev) => ({
              ...prev,
              targetType,
              targetId: "",
            }))
          }
          onTargetIdChange={(targetId) =>
            setValues((prev) => ({ ...prev, targetId }))
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 [&>*]:min-w-0">
          <div className="min-w-0 owerflow-hidden">
            <label
              htmlFor="reminder-trigger-at"
              className="mb-1 block text-sm font-medium"
            >
              Tetikleme zamanı *
            </label>
            <input
              id="reminder-trigger-at"
              type="datetime-local"
              value={values.triggerAt}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, triggerAt: e.target.value }))
              }
              className="box-border w-full min-w-0 max-w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>

          <div className="min-w-0">
            <label
              htmlFor="reminder-recurrence"
              className="mb-1 block text-sm font-medium"
            >
              Tekrar
            </label>
            <select
              id="reminder-recurrence"
              value={values.recurrence}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  recurrence: e.target.value as ReminderRecurrence,
                }))
              }
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              {(
                Object.keys(REMINDER_RECURRENCE_LABELS) as ReminderRecurrence[]
              ).map((recurrence) => (
                <option key={recurrence} value={recurrence}>
                  {REMINDER_RECURRENCE_LABELS[recurrence]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}
