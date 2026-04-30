

import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Info } from 'lucide-react';

type Props = {
    children?: React.ReactNode;
    content: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

const AllocateTooltip = ({ children, content, position = 'top', className }: Props) => {
    return (
        <Tooltip >
            <TooltipTrigger asChild>
                {children || <Info className="size-4 text-slate-300 cursor-help hover:text-slate-500 transition-colors" />}
            </TooltipTrigger>
            <TooltipContent side={position} className="bg-slate-900 text-white border-slate-800">
               {content}
            </TooltipContent>
        </Tooltip>
    )
}

export default AllocateTooltip