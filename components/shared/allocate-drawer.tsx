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
    showHeader?: boolean;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    position?: "left" | "right" | "top" | "bottom";
    showHandler?: boolean
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
    showHeader = true,
    showHandler = true,
}: Props) => {
    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction={position} shouldScaleBackground={false} 
        
        >
            <DrawerContent className={cn("mx-auto max-w-2xl h-dvh rounded-none border-none", className)} showHandler={showHandler}>
                {/* Top Handle is included by Shadcn by default, but we add a close button for better UX */}
                <div className="flex h-full flex-col">
                    
                        <DrawerHeader className={
                            cn("text-left px-6 pt-0", !showHeader && "hidden")
                        }>
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
                    <div className=" overflow-y-auto no-scrollbar flex-1 ">
                        {children}
                    </div>

                    {/* Footer Area */}
                    <DrawerFooter className="px-6 pb-5 pt-4 dark:bg-gray-900 border-t dark:border-gray-700" >
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