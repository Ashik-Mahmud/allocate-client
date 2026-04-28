import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle
} from '../ui/alert-dialog'
import { Trash2Icon, AlertTriangleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
    onConfirm?: () => void;
    confirmButtonClassName?: string;
    variant?: 'destructive' | 'warning' | 'default';
    icon?: React.ReactNode;
    errorMessage?: string;
}

const AllocateConfirmationAlert = ({
    open,
    onOpenChange,
    title,
    description,
    cancelText,
    confirmText,
    onConfirm,
    confirmButtonClassName,
    variant = 'destructive',
    icon,
    errorMessage
}: Props) => {

    // Logic to determine icon color based on variant
    const variantStyles = {
        destructive: "bg-destructive/10 text-destructive dark:bg-destructive/20",
        warning: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500",
        default: "bg-slate-100 text-slate-600 dark:bg-slate-800"
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="sm" className="bg-white dark:bg-slate-900">
                <AlertDialogHeader>
                    <AlertDialogMedia className={cn(variantStyles[variant])}>
                        {icon || (variant === 'destructive' ? <Trash2Icon size={20} /> : <AlertTriangleIcon size={20} />)}
                    </AlertDialogMedia>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {errorMessage && (
                    <div className="p-4 mt-4 bg-red-50 text-red-700 rounded-md">
                        <p className="text-sm">{errorMessage}</p>
                    </div>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => onOpenChange(false)}
                    >
                        {cancelText || 'Cancel'}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault(); // Prevents auto-closing if you want to handle loading states
                            onConfirm?.();
                        }}
                        className={cn(
                            variant === 'destructive' && "bg-destructive hover:bg-destructive/90",
                            confirmButtonClassName
                        )}
                    >
                        {confirmText || 'Continue'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AllocateConfirmationAlert