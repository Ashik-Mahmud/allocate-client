"use client";

import React from "react";
import { useFetchOrganizationById } from "@/features/system/hooks";
import { Building2, Clipboard, CheckCircle2, XCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Organizations } from "@/types/organization";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

type Props = {
  id: string;
};

const formatDate = (v?: string | Date | null) => {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
};

const KeyValue = ({ k, v }: { k: string; v?: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-muted-foreground">{k}</span>
    <span className="text-sm font-medium text-foreground">{v ?? "-"}</span>
  </div>
);

const OrganizationDetail = ({ id }: Props) => {
  const { data, isLoading, isError } = useFetchOrganizationById(id);
  const org: Organizations | undefined = data?.data;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("Organization ID copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <Loader className="mx-auto mb-2 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading organization...</p>
      </div>
    );
  }

  if (isError || !org) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
        <XCircle className="mx-auto mb-2 size-6 text-rose-500" />
        <p className="text-sm font-medium text-foreground">Organization not found</p>
        <p className="text-xs text-muted-foreground">It may have been removed or you do not have access.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-colors sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {org.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={org.photo} alt={org.name || "org"} className="h-10 w-10 rounded-md object-cover" />
            ) : (
              <Building2 className="size-5" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{org.name}</h2>
            <p className="text-xs text-muted-foreground">{org.tagline ?? org.slug ?? "Organization"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground mr-2">{org.id}</div>
          <Button variant="outline" size="sm" onClick={handleCopyId}>
            <Clipboard className="size-4" />
            Copy ID
          </Button>
          <Button
            size="sm"
              variant={org.isVerified ? "outline" : "destructive"}
          >
            {org.isVerified ? (
              <><CheckCircle2 className="mr-2 size-4 text-emerald-500" /> Verified</>
            ) : (
              <><XCircle className="mr-2 size-4 text-rose-500" /> Unverified</>
            )}
          </Button>
        </div>
      </header>

      <section className="rounded-2xl border border-border bg-card p-4 transition-colors">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Overview</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KeyValue k="Business Email" v={org.business_email} />
          <KeyValue k="Type" v={org.org_type ?? "-"} />
          <KeyValue k="Plan" v={org.plan_type ?? "-"} />
          <KeyValue k="Credits" v={org.credit_pool ?? 0} />
          <KeyValue k="Frozen Credits" v={org.frozen_credits ?? 0} />
          <KeyValue k="Users" v={org._count?.users ?? (org.users ? org.users.length : 0)} />
          <KeyValue k="Verified" v={org.isVerified ? "Yes" : "No"} />
          <KeyValue k="Active" v={org.is_active ? "Yes" : "No"} />
          <KeyValue k="Timezone" v={org.timezone} />
          <KeyValue k="Slug" v={org.slug} />
          <KeyValue k="Tagline" v={org.tagline} />
          <KeyValue k="Need Update" v={org.needUpdateOrg ? "Yes" : "No"} />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 transition-colors">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Address</h3>
        <div className="text-sm text-foreground">
          {typeof org.address === "string" ? (
            <p>{org.address}</p>
          ) : (
            <div className="space-y-1 text-sm text-foreground">
              <div>{org.address?.street}</div>
              <div>{org.address?.line2}</div>
              <div>{org.address?.city}, {org.address?.state} {org.address?.postalCode}</div>
              <div>{org.address?.country}</div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 transition-colors">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Settings & Trial</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <KeyValue k="Weekly Report" v={org.weeklyReportEnabled ? "Enabled" : "Disabled"} />
          <KeyValue k="Trial Allowed" v={(org as any).isTrialAllowed ? "Yes" : "No"} />
          <KeyValue k="Used Trial" v={(org as any).hasUsedTrial ? "Yes" : "No"} />
          <KeyValue k="Trial Start" v={formatDate((org as any).trialStartAt)} />
          <KeyValue k="Trial End" v={formatDate((org as any).trialEndsAt)} />
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="text-xs text-muted-foreground">Notification Preferences</div>
            <div className="mt-1 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-muted/20 px-2 py-1 text-xs">Email: <strong className="ml-1">{org.settings?.notificationPreference?.email ? 'On' : 'Off'}</strong></span>
              <span className="inline-flex items-center gap-2 rounded-full bg-muted/20 px-2 py-1 text-xs">SMS: <strong className="ml-1">{org.settings?.notificationPreference?.sms ? 'On' : 'Off'}</strong></span>
              <span className="inline-flex items-center gap-2 rounded-full bg-muted/20 px-2 py-1 text-xs">Push: <strong className="ml-1">{org.settings?.notificationPreference?.push ? 'On' : 'Off'}</strong></span>
              <span className="inline-flex items-center gap-2 rounded-full bg-muted/20 px-2 py-1 text-xs">InApp: <strong className="ml-1">{org.settings?.notificationPreference?.inApp ? 'On' : 'Off'}</strong></span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 transition-colors">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Users ({org?.users?.length ?? 0})</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {org?.users?.slice(0, 4)?.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{u.name || u.email}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
                <p className="text-xs text-muted-foreground">Role: {u.role}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-xs text-muted-foreground">Credits: {u.personal_credits ?? 0}</div>
                <div className="text-xs text-muted-foreground">Last Login: {formatDate(u.last_login)}</div>
              </div>
            </div>
          ))}
          {org?.users && org.users.length > 4 && (
            <Link href={ROUTES.dashboardAdmin.users} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3 col-span-2">
              <div>
                <p className="text-sm font-medium text-foreground">+{org?.users?.length - 4} more</p>
              </div>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default OrganizationDetail;