"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/services/http";
import type { CreateResourcePayload, Resource, ResourceType } from "@/types/resources";

import { ResourceMetadataFields } from "@/components/dashboard/resources/resource-metadata-fields";
import { set } from "date-fns";
import { is } from "zod/v4/locales";

const resourceTypes: ResourceType[] = [
  "MEETING_ROOM",
  "WORKSTATION",
  "PARKING",
  "EQUIPMENT",
  "COLLABORATION_SPACE", // Booths, pods, lounge areas
  "IT_INFRASTRUCTURE",   // Printers, routers, servers
  "LOCKER",               // Personal storage
  "KITCHEN_FACILITY",     // Coffee machines, catering prep areas
  "VIRTUAL_LICENSE",      // Software seats, Zoom rooms
  "VEHICLE",              // Company cars, delivery vans
  "HEALTH_SAFETY",        // First aid kits, AEDs, fire extinguishers
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
    { key: "has_vc_hardware", value: "true" },
  ],
  WORKSTATION: [
    { key: "zone", value: "A" },
    { key: "desk_type", value: "Standing" },
    { key: "monitor_count", value: "2" },
  ],
  PARKING: [
    { key: "slot_no", value: "P-101" },
    { key: "ev_charging", value: "false" },
    { key: "access_level", value: "Standard" },
  ],
  EQUIPMENT: [
    { key: "serial_number", value: "SN-0000" },
    { key: "asset_tag", value: "TAG-123" },
    { key: "warranty_expiry", value: "2025-12-31" },
  ],
  COLLABORATION_SPACE: [
    { key: "type", value: "Phone Booth" },
    { key: "privacy_glass", value: "true" },
  ],
  IT_INFRASTRUCTURE: [
    { key: "maintenance_contact", value: "it-ops@org.com" },
    { key: "network_segment", value: "VLAN-10" },
  ],
  LOCKER: [
    { key: "assigned_to", value: "Unassigned" },
    { key: "location", value: "West Wing" },
  ],
  VIRTUAL_LICENSE: [
    { key: "saas_name", value: "Not Specified" },
    { key: "cost_center", value: "Operations" },
  ],
  VEHICLE: [
    { key: "odometer", value: "0" },
    { key: "insurance_provider", value: "AllState" },
  ],
  HEALTH_SAFETY: [
    { key: "safety_type", value: "Fire Extinguisher" },
    { key: "inspection_frequency", value: "Annual" },
  ],
  KITCHEN_FACILITY: [
    { key: "vendor", value: "Nespresso" },
    { key: "requires_refill", value: "true" },
  ],
  OTHER: [
    { key: "description", value: "General Resource" },
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
  const [hourlyRate, setHourlyRate] = useState("10");
  const [photo, setPhoto] = useState<string>('');
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>(
    buildDefaultMetadataFields("MEETING_ROOM")
  );
  // const [isAvailable, setIsAvailable] = useState(true);
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
        is_active: isActive,
        is_maintenance: isMaintenance,
      });

      setSuccess(mode === "edit" ? "Resource updated." : "Resource created.");
      setName("");
      setType("MEETING_ROOM");
      setHourlyRate("25");
      setMetadataFields(buildDefaultMetadataFields("MEETING_ROOM"));
      setIsActive(true);
      setIsMaintenance(false);
      setPhoto('');
      onSuccess?.();
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Failed to create resource."));
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className ?? "space-y-3 mt-5" + " overflow-auto"}>
      {/* <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Create resource</h2> */}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <span>Name <small className="text-red-500"> *</small></span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Meeting Room A"
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <span>Type <small className="text-red-500"> *</small></span>
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
          <span>Hourly rate <small className="text-red-500"> *</small></span>
          <input
            value={hourlyRate}
            onChange={(event) => setHourlyRate(event.target.value)}
            type="number"
            min="0"
            step="5"
            max={"100"}
            // no decimal input, only multiples of 5
            placeholder="25"
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
          />
          <small className="text-[10px] text-slate-500 dark:text-slate-400">
             *Set only float values that are multiples of 5, e.g. 0, 5, 10, 15, etc. This will determine the credit cost for booking this resource per hour.
          </small>
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

      <div className="flex flex-wrap items-stretch gap-4 text-sm text-slate-700 dark:text-slate-300">
        <label className="flex items-center gap-2 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1 w-[48%]">
          <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
          <div className="flex flex-col ">
            <span>
              {isActive ? "Active (available for booking)" : "Inactive (not available for booking)"}
            </span>
            <small>
              This resource will {isActive ? "be available" : "not be available"} for new bookings, but existing bookings will not be affected.
            </small>
          </div>
        </label>
        <label className="flex items-center gap-2 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1 w-[48%]">
          <input
            type="checkbox"
            checked={isMaintenance}
            onChange={(event) => setIsMaintenance(event.target.checked)}
          />
          <div className="flex flex-col ">
            <span>
              {isMaintenance ? "Under maintenance" : "Not under maintenance"}
            </span>
            <small>
              This resource will {isMaintenance ? "be marked as under maintenance" : "not be marked as under maintenance"}, which can be used to prevent bookings during maintenance periods.
            </small>
          </div>
        </label>
      </div>

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p> : null}

      <div className="text-right sticky -bottom-6 p-3 bg-white dark:bg-slate-950 ">
        <Button type="submit" size={"lg"} disabled={isSubmitting} className="px-5 cursor-pointer">
          {isSubmitting ? "Saving..." : submitLabel ?? (mode === "edit" ? "Save changes" : "Create resource")}
        </Button>
      </div>
    </form>
  );
}
