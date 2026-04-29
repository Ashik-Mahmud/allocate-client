"use client"

import React, { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    BadgeCheck,
    Building2,
    Globe,
    Hash,
    Image as ImageIcon,
    Info,
    Mail,
    MapPin,
    ShieldCheck,
    ToggleLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Organizations } from '@/types/organization'

const ORG_TYPES = [
    { value: 'Tech', label: 'Tech' },
    { value: 'Garments', label: 'Garments' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Education', label: 'Education' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'Services', label: 'Services' },
    { value: 'Other', label: 'Other' },
] as const

const FALLBACK_TIMEZONES = [
    'UTC',
    'Asia/Dhaka',
    'Asia/Kolkata',
    'Asia/Singapore',
    'Asia/Dubai',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
] as const

const DEFAULT_NOTIFICATION_PREFERENCES = {
    email: true,
    sms: false,
    push: false,
    inApp: true,
}

const emptyAddress = {
    street: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
}

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

const getTimezoneOptions = () => {
    if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
        try {
            return Intl.supportedValuesOf('timeZone')
        } catch {
            return [...FALLBACK_TIMEZONES]
        }
    }

    return [...FALLBACK_TIMEZONES]
}

export const TIMEZONE_GROUPS = getTimezoneOptions().reduce<Record<string, string[]>>((groups, timeZone) => {
    const region = timeZone.includes('/') ? timeZone.split('/')[0] : 'Other'
    if (!groups[region]) {
        groups[region] = []
    }

    groups[region].push(timeZone)
    return groups
}, {})

type CountryOption = {
    name: string;
    code: string;
}

type NotificationPreferences = typeof DEFAULT_NOTIFICATION_PREFERENCES

const orgSchema = z.object({
    name: z.string().min(2, 'Organization name is required'),
    slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens'),
    org_type: z.string().min(1, 'Organization type is required'),
    tagline: z.string().max(140, 'Tagline is too long').optional().or(z.literal('')),
    business_email: z.string().email('Invalid business email').optional().or(z.literal('')),
    timezone: z.string().min(1, 'Timezone is required'),
    photo: z.string().url('Invalid photo URL').optional().or(z.literal('')),
    is_active: z.boolean(),
    address: z.object({
        street: z.string().optional().or(z.literal('')),
        line2: z.string().optional().or(z.literal('')),
        city: z.string().optional().or(z.literal('')),
        state: z.string().optional().or(z.literal('')),
        postalCode: z.string().optional().or(z.literal('')),
        country: z.string().optional().or(z.literal('')),
    }),
    settings: z.object({
        notificationPreference: z.object({
            email: z.boolean(),
            sms: z.boolean(),
            push: z.boolean(),
            inApp: z.boolean(),
        }),
    }),
})

export type OrgFormValues = z.infer<typeof orgSchema>

type Props = {
    data?: Partial<Organizations>;
    onSubmit: (values: Partial<Organizations>) => void;
    formId?: string;
}

function getDefaultFormValues(data?: Partial<Organizations>): OrgFormValues {
    const addressValue = typeof data?.address === 'object' && data?.address !== null ? data.address as Record<string, unknown> : {}
    const notificationPreference = data?.settings && typeof data.settings === 'object'
        ? ((data.settings as Organizations['settings'])?.notificationPreference ?? DEFAULT_NOTIFICATION_PREFERENCES)
        : DEFAULT_NOTIFICATION_PREFERENCES

    return {
        name: data?.name ?? '',
        slug: data?.slug ?? slugify(data?.name ?? ''),
        org_type: data?.org_type ?? '',
        tagline: data?.tagline ?? '',
        business_email: data?.business_email ?? '',
        timezone: data?.timezone ?? 'UTC',
        photo: data?.photo ?? '',
        is_active: data?.is_active ?? true,
        address: {
            street: typeof addressValue.street === 'string' ? addressValue.street : emptyAddress.street,
            line2: typeof addressValue.line2 === 'string' ? addressValue.line2 : emptyAddress.line2,
            city: typeof addressValue.city === 'string' ? addressValue.city : emptyAddress.city,
            state: typeof addressValue.state === 'string' ? addressValue.state : emptyAddress.state,
            postalCode: typeof addressValue.postalCode === 'string' ? addressValue.postalCode : emptyAddress.postalCode,
            country: typeof addressValue.country === 'string' ? addressValue.country : emptyAddress.country,
        },
        settings: {
            notificationPreference: {
                email: notificationPreference.email ?? true,
                sms: notificationPreference.sms ?? false,
                push: notificationPreference.push ?? false,
                inApp: notificationPreference.inApp ?? true,
            },
        },
    }
}

function mapToOrganizationPayload(values: OrgFormValues): Partial<Organizations> {
    const cleanOptionalText = (value: string) => {
        const trimmed = value.trim()
        return trimmed.length > 0 ? trimmed : undefined
    }

    return {
        name: values.name.trim(),
        slug: values.slug.trim(),
        org_type: cleanOptionalText(values.org_type),
        tagline: cleanOptionalText(values.tagline ?? ''),
        business_email: cleanOptionalText(values.business_email ?? ''),
        timezone: values.timezone,
        photo: cleanOptionalText(values.photo ?? '') || '',
        is_active: values.is_active,
        address: {
            street: cleanOptionalText(values.address.street ?? ''),
            line2: cleanOptionalText(values.address.line2 ?? ''),
            city: cleanOptionalText(values.address.city ?? ''),
            state: cleanOptionalText(values.address.state ?? ''),
            postalCode: cleanOptionalText(values.address.postalCode ?? ''),
            country: cleanOptionalText(values.address.country ?? ''),
        },
        settings: {
            notificationPreference: {
                ...values.settings.notificationPreference,
            },
        },
        needUpdateOrg: false,
    }
}

const UpdateOrganization = ({ data, onSubmit, formId }: Props) => {
    const [countries, setCountries] = useState<CountryOption[]>([])
    const [countryStatus, setCountryStatus] = useState<'loading' | 'ready' | 'error'>('loading')

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<OrgFormValues>({
        resolver: zodResolver(orgSchema as any),
        defaultValues: getDefaultFormValues(data),
    })

    useEffect(() => {
        if (data) {
            reset(getDefaultFormValues(data))
        }
    }, [data, reset])

    useEffect(() => {
        const controller = new AbortController()
        const loadCountries = async () => {
            try {
                setCountryStatus('loading')
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2', {
                    signal: controller.signal,
                })

                if (!response.ok) {
                    throw new Error('Failed to load countries')
                }

                const payload = await response.json() as Array<{ name?: { common?: string }; cca2?: string }>
                const nextCountries = payload
                    .map((country) => ({
                        name: country.name?.common ?? country.cca2 ?? '',
                        code: country.cca2 ?? country.name?.common ?? '',
                    }))
                    .filter((country) => country.name.length > 0 && country.code.length > 0)
                    .sort((first, second) => first.name.localeCompare(second.name))

                setCountries(nextCountries)
                setCountryStatus('ready')
            } catch {
                if (!controller.signal.aborted) {
                    setCountries([])
                    setCountryStatus('error')
                }
            }
        }

        loadCountries()

        return () => controller.abort()
    }, [])

    const watchedName = useWatch({ control, name: 'name' })
    const watchedSlug = useWatch({ control, name: 'slug' })
    const watchedOrgType = useWatch({ control, name: 'org_type' })
    const watchedTimezone = useWatch({ control, name: 'timezone' })
    const watchedCountry = useWatch({ control, name: 'address.country' })
    const watchedActive = useWatch({ control, name: 'is_active' })
    const slugPreview = watchedSlug.trim() || slugify(watchedName)

    const handleFormSubmit = (values: OrgFormValues) => {
        onSubmit(mapToOrganizationPayload(values))
    }

    return (
        <form id={formId} onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 relative no-scrollbar overflow-y-auto px-0">
            <section className="overflow-auto rounded-tl-3xl rounded-tr-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
                <div className="bg-linear-to-r from-slate-950 via-slate-900 to-slate-700 px-6 py-5 text-white">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                                <BadgeCheck className="size-3.5" /> Organization profile
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight">Make the organization profile feel complete</h2>
                                <p className="mt-2 text-sm text-white/70">
                                    Update the public slug, address, operating timezone, and notification defaults in one place.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[24rem]">
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Public path</p>
                                <p className="mt-2 break-all text-sm font-medium text-white">/{slugPreview || 'organization'}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Status</p>
                                <p className="mt-2 text-sm font-medium text-white">{watchedActive ? 'Active' : 'Inactive'}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Timezone</p>
                                <p className="mt-2 text-sm font-medium text-white">{watchedTimezone || 'UTC'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 px-6 py-6">
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(22rem,0.9fr)]">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        <Building2 className="size-3.5 text-slate-400" /> Organization name
                                    </label>
                                    <input
                                        {...register('name')}
                                        placeholder="Acme Holdings"
                                        className={cn(
                                            'flex h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-950',
                                            errors.name ? 'border-destructive' : 'border-slate-200 dark:border-zinc-800'
                                        )}
                                    />
                                    {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        <Hash className="size-3.5 text-slate-400" /> Public slug
                                    </label>
                                    <input
                                        {...register('slug')}
                                        placeholder="acme-holdings"
                                        className={cn(
                                            'flex h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-950',
                                            errors.slug ? 'border-destructive' : 'border-slate-200 dark:border-zinc-800'
                                        )}
                                    />
                                    {errors.slug ? (
                                        <p className="text-[11px] text-destructive">{errors.slug.message}</p>
                                    ) : (
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Used in the company URL and should stay lowercase with hyphens only.</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        <ShieldCheck className="size-3.5 text-slate-400" /> Organization type
                                    </label>
                                    <select
                                        {...register('org_type')}
                                        className={cn(
                                            'flex h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-950',
                                            errors.org_type ? 'border-destructive' : 'border-slate-200 dark:border-zinc-800'
                                        )}
                                    >
                                        <option value="">Select a type</option>
                                        {ORG_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                    {errors.org_type && <p className="text-[11px] text-destructive">{errors.org_type.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        <Mail className="size-3.5 text-slate-400" /> Business email
                                    </label>
                                    <input
                                        {...register('business_email')}
                                        type="email"
                                        placeholder="admin@company.com"
                                        className={cn(
                                            'flex h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-950',
                                            errors.business_email ? 'border-destructive' : 'border-slate-200 dark:border-zinc-800'
                                        )}
                                    />
                                    {errors.business_email && <p className="text-[11px] text-destructive">{errors.business_email.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <Info className="size-3.5 text-slate-400" /> Tagline
                                </label>
                                <input
                                    {...register('tagline')}
                                    placeholder="A short brand line for your team and customers"
                                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        <ImageIcon className="size-3.5 text-slate-400" /> Brand logo URL
                                    </label>
                                    <input
                                        {...register('photo')}
                                        placeholder="https://..."
                                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        <Globe className="size-3.5 text-slate-400" /> Timezone
                                    </label>
                                    <select
                                        {...register('timezone')}
                                        className={cn(
                                            'flex h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-950',
                                            errors.timezone ? 'border-destructive' : 'border-slate-200 dark:border-zinc-800'
                                        )}
                                    >
                                        <option value="">Select timezone</option>
                                        {Object.entries(TIMEZONE_GROUPS).map(([region, timezones]) => (
                                            <optgroup key={region} label={region}>
                                                {timezones.map((timeZone) => (
                                                    <option key={timeZone} value={timeZone}>{timeZone}</option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                    {errors.timezone && <p className="text-[11px] text-destructive">{errors.timezone.message}</p>}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40">
                                <div className="flex items-center gap-2">
                                    <MapPin className="size-4 text-indigo-500" />
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Address details</h3>
                                </div>
                                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Street address</label>
                                        <input
                                            {...register('address.street')}
                                            placeholder="House / building, road, block"
                                            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                                        />
                                    </div>

                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address line 2</label>
                                        <input
                                            {...register('address.line2')}
                                            placeholder="Apartment, suite, floor, area"
                                            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">City</label>
                                        <input
                                            {...register('address.city')}
                                            placeholder="Dhaka"
                                            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">State / region</label>
                                        <input
                                            {...register('address.state')}
                                            placeholder="Dhaka Division"
                                            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Postal code</label>
                                        <input
                                            {...register('address.postalCode')}
                                            placeholder="1207"
                                            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Country</label>
                                        <input
                                            {...register('address.country')}
                                            list="organization-country-list"
                                            placeholder={countryStatus === 'loading' ? 'Loading countries...' : 'Bangladesh'}
                                            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950"
                                        />
                                        <datalist id="organization-country-list">
                                            {countries.map((country) => (
                                                <option key={country.code} value={country.name} />
                                            ))}
                                        </datalist>
                                        {countryStatus === 'error' ? (
                                            <p className="text-[11px] text-amber-600 dark:text-amber-400">Country suggestions could not be loaded. You can still type the value manually.</p>
                                        ) : (
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Loaded from a public country API for fast entry.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside className="space-y-6">
                            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/40">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    <ToggleLeft className="size-4 text-emerald-500" /> Active state
                                </div>
                                <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-zinc-950 dark:text-slate-200">
                                    <input
                                        {...register('is_active')}
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>
                                        <span className="block font-medium">Organization is active</span>
                                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">Disable this to keep the org on file without making it active.</span>
                                    </span>
                                </label>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/40">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    <Info className="size-4 text-indigo-500" /> Notification defaults
                                </div>
                                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                    These values mirror the default settings in your schema and can be changed later without breaking the profile flow.
                                </p>
                                <div className="mt-4 space-y-3">
                                    {([
                                        ['email', 'Email'],
                                        ['sms', 'SMS'],
                                        ['push', 'Push'],
                                        ['inApp', 'In-app'],
                                    ] as Array<[keyof NotificationPreferences, string]>).map(([key, label]) => (
                                        <label key={key} className={
                                            cn(
                                                "flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-zinc-950",
                                                key === 'sms' || key === 'push' ? 'opacity-50 cursor-not-allowed' : ''
                                            )
                                        }
                                        title={key === 'sms' || key === 'push' ? 'SMS and Push notifications are not available in this version.' : undefined}
                                        >
                                            <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
                                            <input
                                                {...register(`settings.notificationPreference.${key}` as const)}
                                                type="checkbox"
                                                disabled={key === 'sms' || key === 'push'}
                                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Live snapshot</p>
                                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-sm dark:border-slate-800 dark:bg-slate-950/50">
                                        <p className="font-medium text-slate-900 dark:text-slate-100">{watchedName || 'Organization name preview'}</p>
                                        <p className="mt-1 text-slate-500 dark:text-slate-400">/{slugPreview || 'organization'}</p>
                                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                                            {watchedOrgType || 'Organization type'} · {watchedCountry || 'Country'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>


                </div>
            </section>
            
        </form>
    )
}

export default UpdateOrganization