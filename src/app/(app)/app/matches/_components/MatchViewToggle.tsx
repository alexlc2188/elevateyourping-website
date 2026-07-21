"use client";

export type ToggleViews = "history" | "reviews" | "stats";

export const MatchViewToggle = ({
  view,
  onChange,
  count,
}: {
  view: ToggleViews;
  onChange: (view: ToggleViews) => void;
  count: number;
}) => {
  return (
    <div className="bg-slate-100 rounded-full p-1 flex w-max m-auto">
      <button
        onClick={() => onChange("history")}
        className={`px-4 py-1 rounded-full text-sm font-medium transition ${
          view === "history" ? "bg-white shadow text-black" : "text-slate-500"
        }`}>
        Match History
      </button>
      <button
        onClick={() => onChange("reviews")}
        className={`px-4 py-1 rounded-full text-sm font-medium transition ${
          view === "reviews" ? "bg-white shadow text-black" : "text-slate-500"
        }`}>
        Match Review ({count})
      </button>
      {/* <button
        onClick={() => onChange("stats")}
        className={`px-4 py-1 rounded-full text-sm font-medium transition ${
          view === "stats" ? "bg-white shadow text-black" : "text-slate-500"
        }`}>
        Stats
      </button> */}
    </div>
  );
};
