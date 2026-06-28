"use client";

import { useEffect, useState } from "react";
import type { ReminderInput, Workflow } from "@/lib/types";
import { DEFAULT_REMINDER_INPUT } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ReminderFields } from "@/components/reminders/ReminderFields";
import { NativePickerInput } from "@/components/ui/NativePickerInput";
import { getStepReminderDefault } from "@/lib/utils/reminder";

export interface WorkflowStepInput {
  title: string;
  dueDate: string;
  reminder: ReminderInput;
}

export interface WorkflowFormValues {
  title: string;
  description: string;
  steps: WorkflowStepInput[];
}

interface WorkflowFormProps {
  open: boolean;
  mode: "create" | "edit";
  initialWorkflow?: Workflow;
  onClose: () => void;
  onSubmit: (values: WorkflowFormValues) => void;
}

const EMPTY_STEP: WorkflowStepInput = {
  title: "",
  dueDate: "",
  reminder: { ...DEFAULT_REMINDER_INPUT },
};

const DEFAULT_VALUES: WorkflowFormValues = {
  title: "",
  description: "",
  steps: [{ ...EMPTY_STEP }, { ...EMPTY_STEP }],
};

function workflowToFormValues(workflow: Workflow): WorkflowFormValues {
  const sorted = [...workflow.steps].sort((a, b) => a.order - b.order);
  return {
    title: workflow.title,
    description: workflow.description ?? "",
    steps: sorted.map((step) => ({
      title: step.title,
      dueDate: step.dueDate ?? "",
      reminder: { ...DEFAULT_REMINDER_INPUT },
    })),
  };
}

export function WorkflowForm({
  open,
  mode,
  initialWorkflow,
  onClose,
  onSubmit,
}: WorkflowFormProps) {
  const [values, setValues] = useState<WorkflowFormValues>(DEFAULT_VALUES);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialWorkflow) {
      setValues(workflowToFormValues(initialWorkflow));
    } else {
      setValues(DEFAULT_VALUES);
    }
    setError("");
  }, [open, mode, initialWorkflow]);

  const updateStep = (index: number, patch: Partial<WorkflowStepInput>) => {
    setValues((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, ...patch } : step
      ),
    }));
  };

  const addStep = () => {
    setValues((prev) => ({
      ...prev,
      steps: [...prev.steps, { ...EMPTY_STEP }],
    }));
  };

  const removeStep = (index: number) => {
    if (values.steps.length <= 2) return;
    setValues((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!values.title.trim()) {
      setError("Başlık zorunludur.");
      return;
    }

    const validSteps = values.steps.filter((step) => step.title.trim());
    if (validSteps.length < 2) {
      setError("En az 2 adım başlığı girmelisin.");
      return;
    }

    const invalidReminder = validSteps.find(
      (step) => step.reminder.enabled && !step.reminder.triggerAt
    );
    if (invalidReminder) {
      setError("Hatırlatması açık adımlar için tetikleme zamanı gerekli.");
      return;
    }

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      steps: validSteps.map((step) => ({
        title: step.title.trim(),
        dueDate: step.dueDate,
        reminder: step.reminder,
      })),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? "Yeni Süreç" : "Süreci Düzenle"}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Vazgeç
          </Button>
          <Button type="submit" form="workflow-form">
            {mode === "create" ? "Oluştur" : "Kaydet"}
          </Button>
        </>
      }
    >
      <form id="workflow-form" onSubmit={handleSubmit} className="min-w-0 space-y-4 overflow-x-hidden">
        <div>
          <label htmlFor="workflow-title" className="mb-1 block text-sm font-medium">
            Başlık *
          </label>
          <input
            id="workflow-title"
            value={values.title}
            onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full min-w-0 rounded-lg border border-border px-3 py-2 text-sm"
            placeholder="Örn: Şirkete başvuru"
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>

        <div>
          <label htmlFor="workflow-description" className="mb-1 block text-sm font-medium">
            Açıklama
          </label>
          <textarea
            id="workflow-description"
            value={values.description}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={2}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Adımlar * (en az 2)</p>
            <Button variant="secondary" type="button" onClick={addStep}>
              + Adım
            </Button>
          </div>

          {values.steps.map((step, index) => (
            <div
              key={index}
              className="min-w-0 space-y-3 overflow-x-hidden rounded-lg border border-border p-3"
            >
              <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto] [&>*]:min-w-0">
                <input
                  value={step.title}
                  onChange={(e) => updateStep(index, { title: e.target.value })}
                  placeholder={`Adım ${index + 1} başlığı`}
                  className="min-w-0 rounded-lg border border-border px-3 py-2 text-sm"
                />
                <NativePickerInput
                  id={`workflow-step-${index}-date`}
                  type="date"
                  value={step.dueDate}
                  aria-label={`Adım ${index + 1} tarihi`}
                  onChange={(dueDate) => updateStep(index, { dueDate })}
                />
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => removeStep(index)}
                  disabled={values.steps.length <= 2}
                >
                  Sil
                </Button>
              </div>

              <ReminderFields
                idPrefix={`workflow-step-${index}`}
                value={step.reminder}
                suggestedTriggerAt={getStepReminderDefault(step.dueDate || undefined)}
                onChange={(reminder) => updateStep(index, { reminder })}
                compact
              />
            </div>
          ))}
        </div>
      </form>
    </Modal>
  );
}
