"use client"

import * as React from "react"

import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

export interface PasswordInputProps
    extends Omit<React.ComponentProps<"input">, "type"> {
    showPassword?: boolean
    onToggleVisibility?: () => void
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, showPassword = false, onToggleVisibility, ...props }, ref) => {
        return (
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    className={cn(
                        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={onToggleVisibility}
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                    </span>
                </Button>
            </div>
        )
    }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
