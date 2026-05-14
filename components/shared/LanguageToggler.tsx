"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/lib/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, Check, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils/cn";


interface LocaleSwitcherProps {
    variant?: "pill-toggle" | "full-dropdown" | "icon-circle" | "minimal-code" | "tabs";
    className?: string;
}

export function LocaleSwitcher({ variant = "full-dropdown", className }: LocaleSwitcherProps) {
    const [isPending, startTransition] = useTransition();
    const locale = useLocale();
    const t = useTranslations();
    const pathname = usePathname();

    const languages = [
        { code: "en", label: "English", short: "EN", flag: "🇺🇸",  },
        { code: "bn", label: "বাংলা", short: "BN", flag: "🇧🇩" , },
    ];

    // Pill Toggle Variant
    if (variant === "pill-toggle") {
        return (
            <div className={cn(
                "rounded-full border border-primary/25 bg-white/75 p-1 text-xs shadow-sm backdrop-blur dark:border-primary/35 dark:bg-slate-900/70",
                className,
                isPending && "opacity-50 pointer-events-none"
            )}>

                {languages.map((lang) => (
                    <Link
                        key={lang.code}
                        href={pathname}
                        locale={lang.code}
                        className={`inline-block rounded-full px-3 py-1.5 font-semibold transition ${locale === lang.code
                                ? "bg-primary text-primary-foreground"
                                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                            }`}
                    >
                        {lang?.code === 'en' ? t("language.switcherEnglish") : t("language.switcherBangla")}
                    </Link>
                ))}
            </div>
        );
    }

    // Tabs Variant
    if (variant === "tabs") {
        return (
            <div className={cn("flex bg-muted dark:bg-slate-900 p-1 rounded-lg w-fit", className)}>
                {languages.map((lang) => (
                    <Link
                        key={lang.code}
                        href={pathname}
                        locale={lang.code}
                        className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                            locale === lang.code
                                ? "bg-background text-foreground dark:bg-slate-800 dark:text-white shadow-sm"
                                : "text-muted-foreground hover:text-foreground dark:hover:text-slate-300"
                        )}
                    >
                        {lang.short}
                    </Link>
                ))}
            </div>
        );
    }

    // Icon Circle 
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size={variant === "icon-circle" ? "icon" : "sm"}
                    className={cn(
                        "focus-visible:ring-0 gap-2",
                        variant === "icon-circle" && "rounded-full border bg-background dark:text-slate-300 dark:bg-slate-700 shadow-sm h-9 w-9",
                        variant === "minimal-code" && "h-8 px-2 border border-dashed font-mono",
                        className
                    )}
                >
                    {variant === "icon-circle" ? (
                        <Globe className="h-4 w-4 dark:text-white" />
                    ) : (
                        <Languages className="h-4 w-4 opacity-70 dark:text-slate-400" />
                    )}

                    {variant === "full-dropdown" && (
                        <>
                            <span className="font-medium text-sm dark:text-slate-300">
                                {languages.find((l) => l.code === locale)?.label}
                            </span>
                            <ChevronDown className="h-3 w-3 opacity-50 dark:text-slate-400" />
                        </>
                    )}

                    {variant === "minimal-code" && (
                        <span className="text-xs font-bold uppercase">{locale}</span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40 p-1">
                {languages.map((lang) => (
                    <DropdownMenuItem key={lang.code} asChild>
                        <Link
                            href={pathname}
                            locale={lang.code}
                            className="flex items-center justify-between w-full cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <span>{lang.flag}</span>
                                <span>{lang.label}</span>
                            </div>
                            {locale === lang.code && <Check className="h-4 w-4 opacity-50" />}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}