import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { MoreHorizontalIcon } from 'lucide-react';
import { Button } from '../ui/button';

type Props = {
    dropdownOptions: {
        label: string;
        onClick: () => void;
        destructive?: boolean;
    }[];
    children: React.ReactNode;

}

const AllocateDropdown = ({ children, dropdownOptions }: Props) => {
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
                <DropdownMenuContent align="end" className="dark:bg-slate-800">
                    {dropdownOptions.map((option, index) => (

                        <div key={index}>
                            {
                                option.destructive && <DropdownMenuSeparator key={`separator-${index}`} className="bg-red-500/10" />
                            }
                            <DropdownMenuItem
                                key={index}
                                className="cursor-pointer"
                                onClick={option.onClick}
                                // Apply destructive styles if the option is marked as destructive
                                variant={option?.destructive ? 'destructive' : 'default'}
                            >
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