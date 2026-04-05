import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-normal tracking-[0.01em] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500";

export const Button = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={clsx(
        baseClasses,
        "bg-accent-gradient text-white shadow-[0_12px_30px_rgba(1,112,193,0.28)] hover:-translate-y-[1px] hover:shadow-[0_16px_36px_rgba(1,112,193,0.34)] focus:ring-accent-500 focus:ring-offset-neutral-950",
        className
      )}
      {...props}
    />
  );
};
