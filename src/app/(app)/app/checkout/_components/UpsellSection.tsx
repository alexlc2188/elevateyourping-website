"use client";

import { MatchOffer } from "@prisma/client";

interface UpsellSectionProps {
  currentPackage: MatchOffer;
  onUpgrade: () => void;
}

export function UpsellSection({
  currentPackage,
  onUpgrade,
}: UpsellSectionProps) {
  // Only show if current selection is REVIEW_ONLY
  if (currentPackage !== "REVIEW_ONLY") {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6 my-6">
      {/* Header with icon and title */}
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4L3 9"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl  text-slate-900 mb-2">
            🚀 Upgrade to Complete Package
          </h3>
          {/* Badges - stack on mobile */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-green-100 text-green-800 text-xs sm:text-sm font-semibold px-2 py-1 rounded-full">
              Save 30%
            </span>
            <span className="bg-red-100 text-red-800 text-xs sm:text-sm font-semibold px-2 py-1 rounded-full">
              Only 10 left this week
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-700 mb-4 text-sm sm:text-base">
        Get both the expert review <strong>AND</strong> a personalized training
        plan to fix the issues we find.
      </p>

      {/* Benefits box */}
      <div className="bg-white rounded-lg p-3 sm:p-4 mb-4">
        <h4 className="font-medium text-slate-900 mb-2 text-sm sm:text-base">
          What you'll get extra:
        </h4>
        <ul className="text-xs sm:text-sm text-slate-700 space-y-1">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Custom Training Plan
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Specific exercises to improve your game
          </li>
        </ul>
      </div>

      {/* Pricing and CTA - stack on mobile */}
      <div className="space-y-4">
        {/* Pricing info */}
        <div className="text-center sm:text-left">
          <div className="mb-2">
            <span className="line-through text-slate-500 text-sm">
              Regular: $198
            </span>
            <span className="ml-2 text-base sm:text-lg font-bold text-green-600">
              Save 30% ($69)
            </span>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-blue-600">
              Final Price: $129
            </span>
          </div>
        </div>

        {/* CTA Button - full width on mobile */}
        <button
          onClick={onUpgrade}
          className="w-full sm:w-auto   bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:py-4 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base">
          Upgrade Now - Save 30%
        </button>
      </div>
    </div>
  );
}
