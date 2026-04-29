import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { AlertTriangleIcon, Trash2Icon } from 'lucide-react';

type Props = {
    children?: React.ReactNode;
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmButtonClassName?: string;
    size?: 'default' | 'sm'
    type?: 'danger' | 'default' | 'warning';
}

const ConfirmationAlert = ({ title, description, children, cancelText, confirmText, onConfirm, onCancel, confirmButtonClassName, size, type='danger' }: Props) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent size={size || 'default'}>
                <AlertDialogHeader>
                    {type === 'danger' && (
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Trash2Icon />
                        </AlertDialogMedia>
                    )}
                    {type === 'warning' && (
                        <AlertDialogMedia className="bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning">
                            <AlertTriangleIcon />
                        </AlertDialogMedia>
                    )}

                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        {cancelText || 'Cancel'}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className={confirmButtonClassName}>
                        {confirmText || 'Continue'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmationAlert