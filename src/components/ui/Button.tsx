import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-surface-inverse text-content-inverse hover:opacity-90 border border-transparent",
    secondary:
      "bg-surface-subtle text-content-primary hover:bg-surface-elevated border border-border-subtle",
    outline:
      "border border-border-strong bg-transparent text-content-primary hover:border-accent-cyan/40",
    ghost: "bg-transparent text-content-secondary hover:bg-surface-subtle",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
