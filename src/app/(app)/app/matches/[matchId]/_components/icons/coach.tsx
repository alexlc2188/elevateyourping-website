import * as React from "react";

export const CoachIcon = React.forwardRef<
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
    {/* Coach face - made larger */}
    <circle cx="7" cy="12" r="5" />
    {/* Simple face features - adjusted for larger face */}
    <path d="M5 11.5a.6.6 0 1 0 1.2 0 .6.6 0 1 0-1.2 0" fill="currentColor" />
    <path d="M7.8 11.5a.6.6 0 1 0 1.2 0 .6.6 0 1 0-1.2 0" fill="currentColor" />
    <path d="M5 14a4 3 0 0 0 4 0" />

    {/* Paddle with handle - made larger */}
    <ellipse cx="17" cy="12" rx="4" ry="5" />
    <path d="M17 17v4" strokeWidth={2.5} />
  </svg>
));

CoachIcon.displayName = "CoachIcon";
