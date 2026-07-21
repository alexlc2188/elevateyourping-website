import * as React from "react";

export const PaddleIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="100%"  // 👈 Allow outer className to control size
      height="100%" // 👈 Same here
      {...props}
    >
      <circle cx="9" cy="9" r="7" />
      <path d="M15 15l5 5" />
      <path d="M16 8a4 4 0 01-5.5 5.5" />
    </svg>
  )
);

PaddleIcon.displayName = "PaddleIcon";