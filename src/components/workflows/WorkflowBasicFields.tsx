"use client";

import type { WorkflowFormValues } from "./workflowFormUtils";

interface WorkflowBasicFieldsProps {
  values: Pick<WorkflowFormValues, "title" | "description">;
  error?: string;
  onChange: (patch: Partial<WorkflowFormValues>) => void;
}

export function WorkflowBasicFields({
  values,
  error,
  onChange,
}: WorkflowBasicFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="workflow-title" className="mb-1 block text-sm font-medium">
          Başlık *
        </label>
        <input
          id="workflow-title"
          value={values.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full min-w-0 rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="Örn: Şirkete başvuru"
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

      <div>
        <label
          htmlFor="workflow-description"
          className="mb-1 block text-sm font-medium"
        >
          Açıklama
        </label>
        <textarea
          id="workflow-description"
          value={values.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={2}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>
    </>
  );
}
