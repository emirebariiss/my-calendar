"use client";

import { useEffect, useMemo, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useEvents } from "@/hooks/useEvents";
import { useApp } from "@/providers/AppProvider";
import { useReminders } from "@/hooks/useReminders";
import { useTags } from "@/hooks/useTags";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TagFilterSelect } from "@/components/ui/TagFilterSelect";
import { TaskForm, type TaskFormValues } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";
import {
  appendReminderId,
  createReminderFromInput,
} from "@/lib/utils/reminder";
import {
  buildEventFromTask,
  canAddTaskToCalendar,
  findEventsForTask,
} from "@/lib/utils/eventLinking";
import { filterByStatus, filterByTag, sortByPriority } from "@/lib/utils/filters";
import { buildTagFilterOptions } from "@/lib/utils/tags";

type TaskView = "list" | "kanban";

export default function TasksPage() {
  const { isLoading } = useApp();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { events, addEvent, deleteEvent } = useEvents();
  const { addReminder } = useReminders();
  const { customTags } = useTags();
  const [view, setView] = useState<TaskView>("list");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">(
    "all"
  );
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [deletingTask, setDeletingTask] = useState<Task | undefined>();

  const tagFilterOptions = useMemo(
    () => buildTagFilterOptions(customTags, tasks),
    [customTags, tasks]
  );

  const filteredTasks = useMemo(() => {
    let result = filterByTag(tasks, tagFilter);
    result = filterByStatus(result, statusFilter);
    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter);
    }
    return sortByPriority(result);
  }, [tasks, tagFilter, statusFilter, priorityFilter]);

  // Aynı göreve bağlı yinelenen event'leri temizle (çoklu tıklama sonrası)
  useEffect(() => {
    if (isLoading) return;

    for (const task of tasks) {
      const linked = findEventsForTask(events, task.id);
      if (linked.length <= 1) continue;

      const primary =
        linked.find((event) => event.id === task.eventId) ?? linked[0];

      linked
        .filter((event) => event.id !== primary.id)
        .forEach((event) => deleteEvent(event.id));

      if (task.eventId !== primary.id) {
        updateTask(task.id, { eventId: primary.id });
      }
    }
  }, [isLoading, tasks, events, deleteEvent, updateTask]);

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

  const handleAddToCalendar = (task: Task) => {
    const linked = findEventsForTask(events, task.id);

    if (linked.length > 0) {
      const primary = linked[0];
      linked.slice(1).forEach((event) => deleteEvent(event.id));
      if (task.eventId !== primary.id) {
        updateTask(task.id, { eventId: primary.id });
      }
      return;
    }

    if (!canAddTaskToCalendar(task)) return;

    const eventId = addEvent(buildEventFromTask(task));
    updateTask(task.id, { eventId });
  };

  const handleSubmit = (values: TaskFormValues) => {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      status: values.status,
      priority: values.priority,
      deadline: values.deadline || undefined,
      tags: values.tags.length > 0 ? values.tags : undefined,
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
          <div className="flex rounded-lg border border-border bg-card p-1">
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

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as TaskStatus | "all")
          }
          className="rounded-lg border border-border bg-input px-3 py-2 text-sm"
        >
          <option value="all">Tüm durumlar</option>
          <option value="not_started">Başlanmadı</option>
          <option value="in_progress">Devam ediyor</option>
          <option value="done">Tamamlandı</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value as TaskPriority | "all")
          }
          className="rounded-lg border border-border bg-input px-3 py-2 text-sm"
        >
          <option value="all">Tüm öncelikler</option>
          <option value="high">Yüksek</option>
          <option value="medium">Orta</option>
          <option value="low">Düşük</option>
        </select>

        <TagFilterSelect
          value={tagFilter}
          options={tagFilterOptions}
          onChange={setTagFilter}
        />
      </div>

      {view === "list" ? (
        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggle}
          onEdit={openEditForm}
          onDelete={setDeletingTask}
          onAddToCalendar={handleAddToCalendar}
        />
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          onMoveTask={handleMoveTask}
          onEdit={openEditForm}
          onDelete={setDeletingTask}
          onAddToCalendar={handleAddToCalendar}
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
