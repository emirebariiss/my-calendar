"use client";

import { useEffect, useState } from "react";
import type { Workflow } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { WorkflowBasicFields } from "./WorkflowBasicFields";
import { WorkflowStepFields } from "./WorkflowStepFields";
import { TagPicker } from "@/components/ui/TagPicker";
import { useTags } from "@/hooks/useTags";
import {
  EMPTY_STEP,
  getDefaultWorkflowFormValues,
  workflowToFormValues,
  type WorkflowFormValues,
  type WorkflowStepInput,
} from "./workflowFormUtils";

export type { WorkflowFormValues, WorkflowStepInput };

interface WorkflowFormProps {
  open: boolean;
  mode: "create" | "edit";
  initialWorkflow?: Workflow;
  onClose: () => void;
  onSubmit: (values: WorkflowFormValues) => void;
}

export function WorkflowForm({
  open,
  mode,
  initialWorkflow,
  onClose,
  onSubmit,
}: WorkflowFormProps) {
  const [values, setValues] = useState<WorkflowFormValues>(
    getDefaultWorkflowFormValues()
  );
  const [error, setError] = useState("");
  const { customTags, ensureCustomTag, deleteCustomTag } = useTags();

  const updateValues = (patch: Partial<WorkflowFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
  };

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialWorkflow) {
      setValues(workflowToFormValues(initialWorkflow));
    } else {
      setValues(getDefaultWorkflowFormValues());
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
      tags: values.tags,
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
      <form
        id="workflow-form"
        onSubmit={handleSubmit}
        className="min-w-0 space-y-4 overflow-x-hidden"
      >
        <WorkflowBasicFields
          values={values}
          error={error}
          onChange={updateValues}
        />

        <TagPicker
          selected={values.tags}
          customTags={customTags}
          onChange={(tags) => updateValues({ tags })}
          onAddCustomTag={ensureCustomTag}
          onDeleteCustomTag={deleteCustomTag}
        />

        <WorkflowStepFields
          steps={values.steps}
          onUpdateStep={updateStep}
          onAddStep={addStep}
          onRemoveStep={removeStep}
        />
      </form>
    </Modal>
  );
}
