"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ReminderRecurrence,
  ReminderTargetType,
} from "@/lib/types";
import {
  REMINDER_RECURRENCE_LABELS,
  REMINDER_TARGET_LABELS,
} from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/providers/AppProvider";
import { fromDateTimeLocalValue, toDateTimeLocalValue } from "@/lib/utils/calendar";

export interface ReminderFormValues {
  title: string;
  targetType: ReminderTargetType;
  targetId: string;
  triggerAt: string;
  recurrence: ReminderRecurrence;
}

interface ReminderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ReminderFormValues) => void;
}

function getDefaultTriggerAt(): string {
  const next = new Date();
  next.setMinutes(0, 0, 0);
  next.setHours(next.getHours() + 1);
  return toDateTimeLocalValue(next.toISOString());
}

const DEFAULT_VALUES: ReminderFormValues = {
  title: "",
  targetType: "task",
  targetId: "",
  triggerAt: getDefaultTriggerAt(),
  recurrence: "once",
};

export function ReminderForm({ open, onClose, onSubmit }: ReminderFormProps) {
  const { events, tasks, workflows } = useApp();
  const [values, setValues] = useState<ReminderFormValues>(DEFAULT_VALUES);
  const [error, setError] = useState("");

  const targetOptions = useMemo(() => {
    if (values.targetType === "event") {
      return events.map((event) => ({
        id: event.id,
        label: event.title,
      }));
    }

    if (values.targetType === "task") {
      return tasks.map((task) => ({
        id: task.id,
        label: task.title,
      }));
    }

    return workflows.flatMap((workflow) =>
      workflow.steps.map((step) => ({
        id: step.id,
        label: `${step.order}. ${step.title} — ${workflow.title}`,
      }))
    );
  }, [values.targetType, events, tasks, workflows]);

  useEffect(() => {
    if (!open) return;

    setValues({
      ...DEFAULT_VALUES,
      triggerAt: getDefaultTriggerAt(),
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
      <form id="reminder-form" onSubmit={handleSubmit} className="space-y-4">
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="reminder-target-type"
              className="mb-1 block text-sm font-medium"
            >
              Hedef tipi *
            </label>
            <select
              id="reminder-target-type"
              value={values.targetType}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  targetType: e.target.value as ReminderTargetType,
                  targetId: "",
                }))
              }
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              {(Object.keys(REMINDER_TARGET_LABELS) as ReminderTargetType[]).map(
                (type) => (
                  <option key={type} value={type}>
                    {REMINDER_TARGET_LABELS[type]}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="reminder-target-id"
              className="mb-1 block text-sm font-medium"
            >
              Hedef seçimi *
            </label>
            <select
              id="reminder-target-id"
              value={values.targetId}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, targetId: e.target.value }))
              }
              disabled={targetOptions.length === 0}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-60"
            >
              {targetOptions.length === 0 ? (
                <option value="">Kayıt bulunamadı</option>
              ) : (
                targetOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
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
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>

          <div>
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
