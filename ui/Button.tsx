import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

const baseClasses =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500";

export const Button = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={clsx(
        baseClasses,
        "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500",
        className
      )}
      {...props}
    />
  );
};
