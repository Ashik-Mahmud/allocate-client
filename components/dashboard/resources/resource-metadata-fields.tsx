"use client";

import { Button } from "@/components/ui/button";

type MetadataField = {
  id: string;
  key: string;
  value: string;
  isDefault: boolean;
};

type Props = {
  fields: MetadataField[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Pick<MetadataField, "key" | "value">>) => void;
  onRemove: (id: string) => void;
};

export function ResourceMetadataFields({ fields, onAdd, onUpdate, onRemove }: Props) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Metadata</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Default fields are prefilled for the selected type and can still be removed.
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={onAdd}>
          Add metadata
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.id} className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <span>Key</span>
              <input
                value={field.key}
                disabled={field.isDefault}
                onChange={(event) => onUpdate(field.id, { key: event.target.value })}
                placeholder="key"
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:disabled:bg-slate-900"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <span>Value</span>
              <input
                value={field.value}
                onChange={(event) => onUpdate(field.id, { value: event.target.value })}
                placeholder="value"
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition dark:border-slate-700 dark:bg-slate-950"
              />
            </label>

            <div className="flex items-end">
              <Button type="button" size="sm" variant="ghost" onClick={() => onRemove(field.id)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
