import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/framework/utils";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md" }
>(({ className, variant = "primary", size = "md", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center font-medium transition-colors",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      size === "sm" && "h-8 px-3 text-sm",
      size === "md" && "h-9 px-4 text-sm",
      variant === "primary" && "bg-primary text-text-inverse hover:bg-primary-hover",
      variant === "secondary" && "bg-surface text-text border border-border hover:bg-border/30",
      variant === "ghost" && "text-primary hover:bg-primary-light",
      className,
    )}
    {...props}
  />
));
Button.displayName = "Button";
