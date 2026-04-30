"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/services/http";
import type { CreateResourcePayload, Resource, ResourceType } from "@/types/resources";

import { ResourceMetadataFields } from "@/components/dashboard/resources/resource-metadata-fields";
import { set } from "date-fns";

const resourceTypes: ResourceType[] = [
  "MEETING_ROOM",
  "WORKSTATION",
  "PARKING",
  "EQUIPMENT",
  "OTHER",
];

type MetadataField = {
  id: string;
  key: string;
  value: string;
  isDefault: boolean;
};

const metadataDefaultsByType: Record<ResourceType, Array<{ key: string; value: string }>> = {
  MEETING_ROOM: [
    { key: "capacity", value: "8" },
    { key: "floor", value: "2" },
  ],
  WORKSTATION: [
    { key: "zone", value: "A" },
    { key: "desk_count", value: "1" },
  ],
  PARKING: [
    { key: "slot_no", value: "P-101" },
    { key: "covered", value: "false" },
  ],
  EQUIPMENT: [
    { key: "category", value: "projector" },
    { key: "portable", value: "true" },
  ],
  OTHER: [
    { key: "label", value: "general" },
  ],
};

type Props = {
  onSubmit: (payload: CreateResourcePayload) => Promise<void>;
  isSubmitting: boolean;
  onSuccess?: () => void;
  className?: string;
  initialValues?: Resource | null;
  submitLabel?: string;
  mode?: "create" | "edit";
};

function parseMetadataValue(value: string): string | number | boolean | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed === "true") {
    return true;
  }

  if (trimmed === "false") {
    return false;
  }

  const numeric = Number(trimmed);
  if (!Number.isNaN(numeric)) {
    return numeric;
  }

  return trimmed;
}

function buildDefaultMetadataFields(type: ResourceType): MetadataField[] {
  return metadataDefaultsByType[type].map((field, index) => ({
    id: `default-${type}-${index}`,
    key: field.key,
    value: field.value,
    isDefault: true,
  }));
}

function isResourceType(value: string): value is ResourceType {
  return resourceTypes.includes(value as ResourceType);
}

export function ResourceCreateForm({
  onSubmit,
  isSubmitting,
  onSuccess,
  className,
  initialValues,
  submitLabel,
  mode = "create",
}: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ResourceType>("MEETING_ROOM");
  const [hourlyRate, setHourlyRate] = useState("25");
  const [photo, setPhoto] = useState<string>('');
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>(
    buildDefaultMetadataFields("MEETING_ROOM")
  );
  const [isAvailable, setIsAvailable] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    const nextType = isResourceType(initialValues.type) ? initialValues.type : "OTHER";
    const metadata = initialValues.metadata ?? {};

    const metadataFromResource = Object.entries(metadata).map(([key, value], index) => ({
      id: `edit-${initialValues.id}-${index}`,
      key,
      value: value === null ? "" : String(value),
      isDefault: false,
    }));

    setName(initialValues.name);
    setType(nextType);
    setPhoto(initialValues.photo || '');
    setHourlyRate(String(initialValues.hourly_rate));
    setMetadataFields(metadataFromResource.length > 0 ? metadataFromResource : buildDefaultMetadataFields(nextType));
    setIsAvailable(Boolean(initialValues.is_available));
    setIsActive(Boolean(initialValues.is_active));
    setIsMaintenance(Boolean(initialValues.is_maintenance));
    setError(null);
    setSuccess(null);
  }, [initialValues]);

  function addMetadataField() {
    setMetadataFields((current) => [
      ...current,
      {
        id: `custom-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        key: "",
        value: "",
        isDefault: false,
      },
    ]);
  }

  function updateMetadataField(id: string, updates: Partial<Pick<MetadataField, "key" | "value">>) {
    setMetadataFields((current) =>
      current.map((field) => (field.id === id ? { ...field, ...updates } : field))
    );
  }

  function removeMetadataField(id: string) {
    setMetadataFields((current) => current.filter((field) => field.id !== id));
  }

  function handleTypeChange(nextType: ResourceType) {
    setType(nextType);

    if (mode === "create") {
      setMetadataFields(buildDefaultMetadataFields(nextType));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Resource name is required.");
      return;
    }

    const numericRate = Number(hourlyRate);
    if (Number.isNaN(numericRate) || numericRate < 0) {
      setError("Hourly rate must be a valid positive number.");
      return;
    }

    const metadataEntries = metadataFields.map((field) => ({
      key: field.key.trim(),
      value: parseMetadataValue(field.value),
    }));

    if (metadataEntries.some((entry) => entry.key.length === 0)) {
      setError("Every metadata row must have a key.");
      return;
    }

    const uniqueKeyCount = new Set(metadataEntries.map((entry) => entry.key.toLowerCase())).size;
    if (uniqueKeyCount !== metadataEntries.length) {
      setError("Metadata keys must be unique.");
      return;
    }

    const payloadMetadata = Object.fromEntries(
      metadataEntries.map((entry) => [entry.key, entry.value])
    );

    try {
      await onSubmit({
        name: name.trim(),
        type,
        ...(photo ? { photo: photo.trim() } : {}),
        hourly_rate: numericRate,
        metadata: payloadMetadata,
        is_available: isAvailable,
        is_active: isActive,
        is_maintenance: isMaintenance,
      });

      setSuccess(mode === "edit" ? "Resource updated." : "Resource created.");
      setName("");
      setType("MEETING_ROOM");
      setHourlyRate("25");
      setMetadataFields(buildDefaultMetadataFields("MEETING_ROOM"));
      setIsAvailable(true);
      setIsActive(true);
      setIsMaintenance(false);
      setPhoto('');
      onSuccess?.();
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Failed to create resource."));
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className ?? "space-y-3 mt-5"}>
      {/* <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Create resource</h2> */}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <span>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Meeting Room A"
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <span>Type</span>
          <select
            value={type}
            onChange={(event) => handleTypeChange(event.target.value as ResourceType)}
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
          >
            {resourceTypes.map((resourceType) => (
              <option key={resourceType} value={resourceType}>
                {resourceType}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 col-span-2 text-sm text-slate-700 dark:text-slate-300">
          <span>Hourly rate</span>
          <input
            value={hourlyRate}
            onChange={(event) => setHourlyRate(event.target.value)}
            type="number"
            min="0"
            step="0.01"
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-1 col-span-2 text-sm text-slate-700 dark:text-slate-300">
          <span>Photo</span>
          <input
            value={photo}
            onChange={(event) => setPhoto(event.target.value)}
            type="url"
            placeholder="https://example.com/photo.jpg"
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

      </div>

      <ResourceMetadataFields
        fields={metadataFields}
        onAdd={addMetadataField}
        onUpdate={updateMetadataField}
        onRemove={removeMetadataField}
      />

      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700 dark:text-slate-300">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isAvailable} onChange={(event) => setIsAvailable(event.target.checked)} />
          <span>Available</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
          <span>Active</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isMaintenance}
            onChange={(event) => setIsMaintenance(event.target.checked)}
          />
          <span>Maintenance</span>
        </label>
      </div>

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel ?? (mode === "edit" ? "Save changes" : "Create resource")}
      </Button>
    </form>
  );
}
