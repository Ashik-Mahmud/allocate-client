"use client";

import { cn } from '@/lib/utils';
import React from 'react'
import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';

type Props = {
    onSubmit?: () => void;
    className?: string;
}

const VerifyLoggedInUser = ({ className }: Props) => {
    const handleClick = () => {
        // Implement the logic to send a verification email to the user
        console.log("Verification email sent!");
        toast.success("Verification email sent!");
      
    }
    return (
        <div>
        
            <button className={
                cn(
                    "rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 text-sm",
                    className
                )
            }
                onClick={handleClick}
            >
                Send Verification Email
            </button>
        </div>
    )
}

export default VerifyLoggedInUser