import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { MoreHorizontalIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils/cn';

type Props = {
    dropdownOptions: {
        label: string;
        onClick: () => void;
        destructive?: boolean;
        icon?: React.ComponentType<{ className?: string }>;
        disabled?: boolean;
        isSeparator?: boolean;
    }[];
    children: React.ReactNode;
    label?: string;
    align?: "start" | "end" | "center";
    className?: string;


}

const AllocateDropdown = ({ children, dropdownOptions, label, align='end', className }: Props) => {
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {children || (
                        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                            <MoreHorizontalIcon className="size-4" />
                        </Button>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align={align} className={cn("dark:bg-slate-800 w-max", className)} >
                     {label && <><DropdownMenuLabel>{label}</DropdownMenuLabel>  <DropdownMenuSeparator /></>}
                    {dropdownOptions.map((option, index) => (

                        <div key={index}>
                            {
                                option.isSeparator ? (
                                    <DropdownMenuSeparator key={`separator-${index}`} />
                                ) : ( null
                                   // option.destructive && <DropdownMenuSeparator key={`separator-${index}`} className="bg-red-500/10" />
                                )
                            }
                            <DropdownMenuItem
                                key={index}
                                className="cursor-pointer"
                                onClick={option.onClick}
                                // Apply destructive styles if the option is marked as destructive
                                variant={option?.destructive ? 'destructive' : 'default'}
                                disabled={option.disabled}
                            >
                                {option.icon && <option.icon className="size-4 mr-2" />}
                                {option.label}
                            </DropdownMenuItem>
                            </div>
                    ))}

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default AllocateDropdown