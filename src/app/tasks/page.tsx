"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useReminders } from "@/hooks/useReminders";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TaskForm, type TaskFormValues } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import type { Task } from "@/lib/types";
import {
  appendReminderId,
  createReminderFromInput,
} from "@/lib/utils/reminder";

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { addReminder } = useReminders();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [deletingTask, setDeletingTask] = useState<Task | undefined>();

  const openCreateForm = () => {
    setFormMode("create");
    setEditingTask(undefined);
    setFormOpen(true);
  };

  const openEditForm = (task: Task) => {
    setFormMode("edit");
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleToggle = (task: Task) => {
    const nextStatus = task.status === "done" ? "not_started" : "done";
    updateTask(task.id, {
      status: nextStatus,
      completedAt: nextStatus === "done" ? new Date().toISOString() : undefined,
    });
  };

  const handleSubmit = (values: TaskFormValues) => {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      status: values.status,
      priority: values.priority,
      deadline: values.deadline || undefined,
      completedAt:
        values.status === "done" ? new Date().toISOString() : undefined,
    };
    const reminderPayload = createReminderFromInput(values.reminder, {
      targetType: "task",
      targetId: "",
      title: `${values.title} hatırlatması`,
    });

    if (formMode === "create") {
      const taskId = addTask(payload);

      if (reminderPayload) {
        const reminderId = addReminder({ ...reminderPayload, targetId: taskId });
        updateTask(taskId, {
          reminderIds: appendReminderId(undefined, reminderId),
        });
      }
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, payload);

      if (reminderPayload) {
        const reminderId = addReminder({
          ...reminderPayload,
          targetId: editingTask.id,
        });
        updateTask(editingTask.id, {
          reminderIds: appendReminderId(editingTask.reminderIds, reminderId),
        });
      }
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setDeletingTask(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Görevlerini ekle, düzenle veya tamamlandı olarak işaretle.
        </p>
        <Button type="button" onClick={openCreateForm}>
          + Yeni Görev
        </Button>
      </div>

      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onEdit={openEditForm}
        onDelete={setDeletingTask}
      />

      <TaskForm
        open={formOpen}
        mode={formMode}
        initialTask={editingTask}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deletingTask)}
        title="Görevi sil"
        message={`"${deletingTask?.title}" görevini silmek istediğine emin misin? Bu işlem geri alınamaz.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTask(undefined)}
      />
    </div>
  );
}
