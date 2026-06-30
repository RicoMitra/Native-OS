import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-y rounded-[14px] border border-[#cbd8d2] bg-[#fbfdfb] px-3 py-3 text-sm leading-6 text-[#182421] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition duration-200 placeholder:text-[#879892] focus:border-[#37a987] focus:ring-2 focus:ring-[#37a987]/20",
        className,
      )}
      {...props}
    />
  );
}
