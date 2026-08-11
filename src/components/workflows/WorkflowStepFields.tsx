"use client";

import { Button } from "@/components/ui/Button";
import { NativePickerInput } from "@/components/ui/NativePickerInput";
import { ReminderFields } from "@/components/reminders/ReminderFields";
import { getStepReminderDefault } from "@/lib/utils/reminder";
import type { WorkflowStepInput } from "./workflowFormUtils";

interface WorkflowStepFieldsProps {
  steps: WorkflowStepInput[];
  onUpdateStep: (index: number, patch: Partial<WorkflowStepInput>) => void;
  onAddStep: () => void;
  onRemoveStep: (index: number) => void;
}

export function WorkflowStepFields({
  steps,
  onUpdateStep,
  onAddStep,
  onRemoveStep,
}: WorkflowStepFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Adımlar * (en az 2)</p>
        <Button variant="secondary" type="button" onClick={onAddStep}>
          + Adım
        </Button>
      </div>

      {steps.map((step, index) => (
        <div
          key={index}
          className="min-w-0 space-y-3 overflow-x-hidden rounded-lg border border-border p-3"
        >
          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto] [&>*]:min-w-0">
            <input
              value={step.title}
              onChange={(e) => onUpdateStep(index, { title: e.target.value })}
              placeholder={`Adım ${index + 1} başlığı`}
              className="min-w-0 rounded-lg border border-border px-3 py-2 text-sm"
            />
            <NativePickerInput
              id={`workflow-step-${index}-date`}
              type="date"
              value={step.dueDate}
              aria-label={`Adım ${index + 1} tarihi`}
              onChange={(dueDate) => onUpdateStep(index, { dueDate })}
            />
            <Button
              variant="ghost"
              type="button"
              onClick={() => onRemoveStep(index)}
              disabled={steps.length <= 2}
            >
              Sil
            </Button>
          </div>

          <ReminderFields
            idPrefix={`workflow-step-${index}`}
            value={step.reminder}
            suggestedTriggerAt={getStepReminderDefault(step.dueDate || undefined)}
            onChange={(reminder) => onUpdateStep(index, { reminder })}
            compact
          />
        </div>
      ))}
    </div>
  );
}
