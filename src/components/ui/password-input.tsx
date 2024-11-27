import * as React from "react"

import { Input } from "./input"
import { EyeIcon, EyeOffIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <div className="relative w-full bg-white rounded-md text-black">
            <Input
                type={showPassword ? "text" : "password"} // toggle between text and password
                className={className}
                ref={ref}
                {...props}
            />
            <span 
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)} // toggles showPassword state
            >
                {showPassword ? (
                <EyeOffIcon className="select-none cursor-pointer" />
                ) : (
                <EyeIcon className="select-none cursor-pointer" />
                )}
            </span>
        </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
