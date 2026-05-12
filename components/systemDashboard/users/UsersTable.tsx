"use client";

import React from "react";
import { Copy, MoreVertical, Mail, User as UserIcon, Shield, Calendar, ShieldCheck, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { User } from "@/types";

type UsersTableProps = {
    users: User[] | undefined;
    isLoading: boolean;
    onAction?: (action: string, user: User) => void;
};

export function UsersTable({ users, isLoading, onAction }: UsersTableProps) {
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary mx-auto" />
                    <p className="text-sm text-muted-foreground">Loading users...</p>
                </div>
            </div>
        );
    }

    if (!users || users.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <UserIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">No users found</p>
                    <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-card shadow-sm dark:bg-slate-800/50 dark:border-slate-700">
                <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted dark:bg-slate-700/50 dark:border-slate-700">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">Verified</th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">Last login</th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">Role</th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">Organization</th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">Created</th>
                            <th className="px-4 py-3 text-center font-semibold text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-border hover:bg-muted/50 dark:border-slate-700 dark:hover:bg-slate-700/30"
                            >
                                <td className="px-4 py-3 font-medium text-foreground">
                                    <div className="flex items-center gap-2" >
                                        {
                                            user?.photo ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={user.photo}
                                                    alt={user.name || "User"}
                                                    className=" inline-block size-10 rounded object-cover"
                                                />
                                            ) : (
                                                <UserIcon className=" inline-block size-10 text-muted-foreground" />
                                            )
                                        }
                                        <div>
                                            <span className="text-base">
                                                {user.name || "—"}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-slate-600 text-xs">{user.email}</span>
                                                <button
                                                    onClick={() => copyToClipboard(user.email, "Email")}
                                                    className="rounded p-1 hover:bg-background dark:hover:bg-slate-700"
                                                >
                                                    <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {
                                        user.is_verified ? (
                                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <Shield className="h-4 w-4 text-slate-400" />
                                        )
                                    }
                                </td>
                                <td>
                                    {user.last_login
                                        ? new Date(user.last_login).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour12: true,
                                            hour: "numeric",
                                            minute: "numeric",
                                        })
                                        : "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${user.role === "ORG_ADMIN"
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                            }`}
                                    >
                                        <Shield className="h-3 w-3" />
                                        {user.role === "ORG_ADMIN" ? "Org Admin" : user.role || "Unknown"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <div >
                                            <Building2 className="size-8 " />
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold">{user.organization?.name || "—"}</span>
                                            <p className="text-xs text-muted-foreground">{user?.organization?.org_type}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                        : "—"}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 dark:hover:bg-slate-700"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => copyToClipboard(user.id ?? "", "User ID")}
                                            >
                                                <Copy className="mr-2 h-3 w-3" />
                                                Copy ID
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onAction?.("view", user)}
                                            >
                                                <UserIcon className="mr-2 h-3 w-3" />
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onAction?.("reset-password", user)}
                                            >
                                                <Mail className="mr-2 h-3 w-3" />
                                                Reset Password
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="rounded-xl border border-border bg-card p-4 shadow-sm dark:bg-slate-800/50 dark:border-slate-700"
                    >
                        <div className="mb-3 flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="font-semibold text-foreground">{user.name || "Unknown"}</h4>
                                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {user.email}
                                </p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 dark:hover:bg-slate-700">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => copyToClipboard(user.id ?? "", "User ID")}
                                    >
                                        <Copy className="mr-2 h-3 w-3" />
                                        Copy ID
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onAction?.("view", user)}>
                                        <UserIcon className="mr-2 h-3 w-3" />
                                        View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onAction?.("reset-password", user)}>
                                        <Mail className="mr-2 h-3 w-3" />
                                        Reset Password
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-lg bg-muted p-2 dark:bg-slate-700/50">
                                <p className="font-medium text-muted-foreground">Role</p>
                                <p className="mt-1 font-semibold text-foreground">
                                    {user.role === "ORG_ADMIN" ? "Org Admin" : user.role || "Unknown"}
                                </p>
                            </div>
                            <div className="rounded-lg bg-muted p-2 dark:bg-slate-700/50">
                                <p className="font-medium text-muted-foreground">Org</p>
                                <p className="mt-1 truncate font-semibold text-foreground">
                                    {user.organization?.name || "—"}
                                </p>
                            </div>
                            <div className="rounded-lg bg-muted p-2 dark:bg-slate-700/50 col-span-2">
                                <p className="font-medium text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Created
                                </p>
                                <p className="mt-1 font-semibold text-foreground">
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                        : "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
