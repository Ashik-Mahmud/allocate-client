"use client"
import { cn } from '@/lib/utils';
import React, { forwardRef, InputHTMLAttributes } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    showPasswordToggle?: boolean;
    showPasswordStrength?: boolean;
    id: string;
}
const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(({ label, error, showPasswordStrength, showPasswordToggle, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [pwdValidation, setPwdValidation] = React.useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    })


    return (
        <div>
            <div className={cn("input-group relative ", props.className)}>
                {label ? <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label> : null}
                <div className='relative'>
                    <input
                        id={id}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder={props.placeholder}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200   dark:placeholder:text-slate-500 dark:text-slate-400"
                        value={props.value}
                        ref={ref}
                        {...props}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPwdValidation({
                                length: value.length >= 6,
                                uppercase: /[A-Z]/.test(value) && /[a-z]/.test(value),
                                lowercase: /[a-z]/.test(value) && /[A-Z]/.test(value),
                                number: /\d/.test(value),
                                specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
                            })
                            props.onChange && props.onChange(e);
                        }}
                    />
                    {showPasswordToggle && (
                        <button
                            type="button"
                            className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700 focus:outline-none"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {/* use icon */}
                            {
                                showPassword ? <FaEyeSlash /> : <FaEye />
                            }
                        </button>
                    )}

                </div>
            </div>
            {error && <small className="text-xs text-red-500">{error}</small>}
            {showPasswordStrength && (
                <div className="mt-2">
                    <p className="text-xs text-slate-600 font-bold">Password strength:</p>
                    <ul className="list-disc pl-4 font-heading">
                        <li className={`text-xs  ${pwdValidation.length ? 'text-green-400 font-medium' : 'text-slate-400'}`}>At least 6 characters</li>
                        <li className={`text-xs  ${pwdValidation.uppercase ? 'text-green-400 font-medium' : 'text-slate-400'}`}>Contains uppercase and lowercase letters</li>
                        <li className={`text-xs  ${pwdValidation.number ? 'text-green-400 font-medium' : 'text-slate-400'}`}>Contains numbers</li>
                        <li className={`text-xs  ${pwdValidation.specialChar ? 'text-green-400 font-medium' : 'text-slate-400'}`}>Contains special characters</li>
                    </ul>
                </div>
            )}

        </div>
    )
})

PasswordField.displayName = "PasswordField";
export default PasswordField

