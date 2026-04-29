"use client"

import React from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    position?: "left" | "right" | "top" | "bottom";
}

const AllocateDrawer = ({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    className,
    position = "right",
}: Props) => {
    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction={position}>
            <DrawerContent className={cn("mx-auto max-w-2xl", className)}>
                {/* Top Handle is included by Shadcn by default, but we add a close button for better UX */}
                <div className="relative mx-auto w-full">
                    <DrawerHeader className="text-left px-6 pt-0">
                        <div className="flex items-center justify-between">
                            <div className='flex flex-col space-y-0.5'>
                                <DrawerTitle className="text-xl text-left font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                    {title}
                                </DrawerTitle>
                                {description && (
                                    <DrawerDescription className="text-slate-500 text-sm dark:text-slate-400">
                                        {description}
                                    </DrawerDescription>
                                )}
                            </div>
                            <DrawerClose asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                    <X className="size-4" />
                                </Button>
                            </DrawerClose>
                        </div>

                    </DrawerHeader>

                    {/* Content Area */}
                    <div className="px-6 py-4">
                        {children}
                    </div>

                    {/* Footer Area */}
                    <DrawerFooter className="px-6 pb-8 pt-4">
                        {footer || (
                            <DrawerClose asChild>
                                <Button variant="outline" className="w-full rounded-xl">Cancel</Button>
                            </DrawerClose>
                        )}
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default AllocateDrawer