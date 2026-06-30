import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: "default" | "sm" | "icon";
};

export function Button({ className, variant = "primary", size = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[14px] font-medium transition-[background,border-color,color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37a987] focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        size === "default" && "min-h-11 px-4 text-sm",
        size === "sm" && "min-h-9 px-3 text-xs",
        size === "icon" && "size-10 px-0",
        variant === "primary" && "bg-[#123c35] text-[#f6fbf8] shadow-[0_12px_30px_rgba(18,60,53,0.18)] hover:bg-[#185346]",
        variant === "secondary" && "border border-[#cbd8d2] bg-[#f7fbf8] text-[#1c2b28] hover:border-[#82bca7] hover:bg-[#eef8f3]",
        variant === "quiet" && "text-[#51635d] hover:bg-[#e8f0ec] hover:text-[#182421]",
        variant === "danger" && "border border-[#e3c6be] bg-[#fff5f1] text-[#9b4536] hover:bg-[#ffece5]",
        className,
      )}
      {...props}
    />
  );
}
