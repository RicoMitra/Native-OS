import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-[14px] border border-[#cbd8d2] bg-[#fbfdfb] px-3 text-sm text-[#182421] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition duration-200 placeholder:text-[#879892] focus:border-[#37a987] focus:ring-2 focus:ring-[#37a987]/20",
        className,
      )}
      {...props}
    />
  );
}
