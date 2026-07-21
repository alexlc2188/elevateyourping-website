import * as React from "react";

export const AnalysisIcon = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>(({ className, ...props }, ref) => (
  <svg
    ref={ref}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    width="100%"
    height="100%"
    {...props}>
    {/* Magnifying glass handle */}
    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={2.5} />

    {/* Glass circle */}
    <circle cx="11" cy="11" r="6" />

    {/* Paddle inside - made more prominent */}
    <ellipse cx="11" cy="10" rx="2.5" ry="3" />
    <line x1="11" y1="13" x2="11" y2="15" strokeWidth={2} />
  </svg>
));

AnalysisIcon.displayName = "AnalysisIcon";
