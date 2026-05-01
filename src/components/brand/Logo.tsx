import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoVariant = "full" | "mark" | "icon";
type LogoTheme = "light" | "dark";
type LogoSize = "sm" | "md" | "lg";

const fullSizes = {
  sm: { width: 312, height: 103, className: "h-[3.25rem] w-auto" },
  md: { width: 340, height: 112, className: "h-14 w-auto" },
  lg: { width: 460, height: 152, className: "h-20 w-auto" },
};

const markSizes = {
  sm: { width: 36, height: 36, className: "size-9" },
  md: { width: 44, height: 44, className: "size-11" },
  lg: { width: 60, height: 60, className: "size-[3.75rem]" },
};

export function Logo({
  variant = "full",
  theme = "light",
  size = "md",
  className,
  priority = false,
}: {
  variant?: LogoVariant;
  theme?: LogoTheme;
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}) {
  const isFull = variant === "full";
  const dimensions = isFull ? fullSizes[size] : markSizes[size];
  const src =
    variant === "full"
      ? "/brand/leandoze-logo-official.png"
      : variant === "mark"
        ? "/brand/leandoze-mark-official.png"
        : "/brand/leandoze-icon-official.png";

  return (
    <Image
      src={src}
      alt={isFull ? "LeanDoze logo" : "LeanDoze mark"}
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={cn(
        "object-contain",
        dimensions.className,
        theme === "dark" ? "rounded-xl bg-white" : "",
        className,
      )}
    />
  );
}
