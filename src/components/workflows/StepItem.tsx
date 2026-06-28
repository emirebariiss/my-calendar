"use client";

import { useEffect, useState } from "react";
import type { WorkflowStep } from "@/lib/types";
import { STEP_STATUS_LABELS } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, isOverdue } from "@/lib/utils/date";

interface StepItemProps {
  step: WorkflowStep;
  onToggleComplete: (step: WorkflowStep) => void;
  onUpdateNotes: (step: WorkflowStep, notes: string) => void;
  onSetInProgress: (step: WorkflowStep) => void;
}

export function StepItem({
  step,
  onToggleComplete,
  onUpdateNotes,
  onSetInProgress,
}: StepItemProps) {
  const savedNotes = step.notes ?? "";
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(savedNotes);

  useEffect(() => {
    setNotesDraft(step.notes ?? "");
  }, [step.notes]);

  const isDirty = notesDraft.trim() !== savedNotes;

  const startEditing = () => {
    setNotesDraft(savedNotes);
    setIsEditingNotes(true);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(step, notesDraft.trim());
    setIsEditingNotes(false);
  };

  const handleCancelNotes = () => {
    setNotesDraft(savedNotes);
    setIsEditingNotes(false);
  };

  const overdue =
    step.dueDate &&
    step.status !== "completed" &&
    step.status !== "skipped" &&
    isOverdue(step.dueDate);
  const isCompleted = step.status === "completed";

  return (
    <li
      className={`rounded-lg border px-4 py-3 ${
        overdue ? "border-red-200 bg-red-50/40" : "border-border bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggleComplete(step)}
          className="mt-1 h-4 w-4 rounded border-border"
          aria-label={`${step.title} tamamlandı olarak işaretle`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className={`font-medium ${isCompleted ? "text-muted line-through" : ""}`}>
                {step.order}. {step.title}
              </p>
              {step.dueDate && (
                <p className="mt-1 text-xs text-muted">
                  Tarih: {formatDate(step.dueDate)}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={isCompleted ? "success" : "default"}>
                {STEP_STATUS_LABELS[step.status]}
              </Badge>
              {overdue && <Badge variant="danger">Gecikmiş</Badge>}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {!isCompleted && step.status !== "in_progress" && (
              <Button
                variant="secondary"
                type="button"
                onClick={() => onSetInProgress(step)}
              >
                Devam et
              </Button>
            )}
            {!isEditingNotes && !savedNotes && (
              <Button variant="ghost" type="button" onClick={startEditing}>
                Not ekle
              </Button>
            )}
          </div>

          {!isEditingNotes && savedNotes && (
            <div className="mt-3 space-y-2">
              <p className="whitespace-pre-wrap rounded-lg bg-accent px-3 py-2 text-sm">
                {savedNotes}
              </p>
              <Button variant="ghost" type="button" onClick={startEditing}>
                Düzenle
              </Button>
            </div>
          )}

          {isEditingNotes && (
            <div className="mt-3 space-y-2">
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={3}
                placeholder="Bu adım için notlar..."
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  disabled={!isDirty}
                  onClick={handleSaveNotes}
                >
                  Kaydet
                </Button>
                <Button variant="ghost" type="button" onClick={handleCancelNotes}>
                  İptal
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
