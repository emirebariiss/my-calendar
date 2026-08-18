"use client";

import type { Workflow, WorkflowStep } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { StepItem } from "./StepItem";

interface StepListProps {
  workflow: Workflow;
  onToggleComplete: (step: WorkflowStep) => void;
  onUpdateNotes: (step: WorkflowStep, notes: string) => void;
  onSetInProgress: (step: WorkflowStep) => void;
  onAddToCalendar: (step: WorkflowStep) => void;
}

export function StepList({
  workflow,
  onToggleComplete,
  onUpdateNotes,
  onSetInProgress,
  onAddToCalendar,
}: StepListProps) {
  const sortedSteps = [...workflow.steps].sort((a, b) => a.order - b.order);

  if (sortedSteps.length === 0) {
    return <EmptyState title="Bu süreçte adım yok" />;
  }

  return (
    <ul className="space-y-3">
      {sortedSteps.map((step) => (
        <StepItem
          key={step.id}
          step={step}
          onToggleComplete={onToggleComplete}
          onUpdateNotes={onUpdateNotes}
          onSetInProgress={onSetInProgress}
          onAddToCalendar={onAddToCalendar}
        />
      ))}
    </ul>
  );
}
