"use client";

import { useEffect, useState } from "react";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
}

interface TaskFormProps {
  open: boolean;
  mode: "create" | "edit";
  initialTask?: Task;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
}

const DEFAULT_VALUES: TaskFormValues = {
  title: "",
  description: "",
  status: "not_started",
  priority: "medium",
  deadline: "",
};

export function TaskForm({
  open,
  mode,
  initialTask,
  onClose,
  onSubmit,
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(DEFAULT_VALUES);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialTask) {
      setValues({
        title: initialTask.title,
        description: initialTask.description ?? "",
        status: initialTask.status,
        priority: initialTask.priority,
        deadline: initialTask.deadline ?? "",
      });
    } else {
      setValues(DEFAULT_VALUES);
    }
    setError("");
  }, [open, mode, initialTask]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!values.title.trim()) {
      setError("Başlık zorunludur.");
      return;
    }

    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? "Yeni Görev" : "Görevi Düzenle"}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Vazgeç
          </Button>
          <Button type="submit" form="task-form">
            {mode === "create" ? "Oluştur" : "Kaydet"}
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-title" className="mb-1 block text-sm font-medium">
            Başlık *
          </label>
          <input
            id="task-title"
            value={values.title}
            onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            placeholder="Örn: React hooks makalesini oku"
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>

        <div>
          <label htmlFor="task-description" className="mb-1 block text-sm font-medium">
            Açıklama
          </label>
          <textarea
            id="task-description"
            value={values.description}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            placeholder="Opsiyonel detaylar"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="task-status" className="mb-1 block text-sm font-medium">
              Durum
            </label>
            <select
              id="task-status"
              value={values.status}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  status: e.target.value as TaskStatus,
                }))
              }
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="not_started">Başlanmadı</option>
              <option value="in_progress">Devam ediyor</option>
              <option value="done">Tamamlandı</option>
            </select>
          </div>

          <div>
            <label htmlFor="task-priority" className="mb-1 block text-sm font-medium">
              Öncelik
            </label>
            <select
              id="task-priority"
              value={values.priority}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  priority: e.target.value as TaskPriority,
                }))
              }
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="task-deadline" className="mb-1 block text-sm font-medium">
            Deadline (opsiyonel)
          </label>
          <input
            id="task-deadline"
            type="date"
            value={values.deadline}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, deadline: e.target.value }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-muted">
            Boş bırakırsan görev süresiz olarak aktif listede kalır.
          </p>
        </div>
      </form>
    </Modal>
  );
}
