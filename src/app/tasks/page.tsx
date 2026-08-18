"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useReminders } from "@/hooks/useReminders";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TaskForm, type TaskFormValues } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import type { Task, TaskStatus } from "@/lib/types";
import {
  appendReminderId,
  createReminderFromInput,
} from "@/lib/utils/reminder";

type TaskView = "list" | "kanban";

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { addReminder } = useReminders();
  const [view, setView] = useState<TaskView>("list");
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

  const handleMoveTask = (taskId: string, status: TaskStatus) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task || task.status === status) return;

    updateTask(taskId, {
      status,
      completedAt: status === "done" ? new Date().toISOString() : undefined,
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Görevlerini ekle, düzenle veya tamamlandı olarak işaretle.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border bg-white p-1">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                view === "list"
                  ? "bg-accent text-primary"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Liste
            </button>
            <button
              type="button"
              onClick={() => setView("kanban")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                view === "kanban"
                  ? "bg-accent text-primary"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Kanban
            </button>
          </div>
          <Button type="button" onClick={openCreateForm}>
            + Yeni Görev
          </Button>
        </div>
      </div>

      {view === "list" ? (
        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onEdit={openEditForm}
          onDelete={setDeletingTask}
        />
      ) : (
        <KanbanBoard
          tasks={tasks}
          onMoveTask={handleMoveTask}
          onEdit={openEditForm}
          onDelete={setDeletingTask}
        />
      )}

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
