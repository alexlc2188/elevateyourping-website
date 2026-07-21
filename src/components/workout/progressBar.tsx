import React from "react";

export const progressBar = () => {
  return (
    <div className="mb-4">
      <div className="text-sm text-muted-foreground mb-2">
        3 of 6 drills completed
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full w-[50%] bg-secondary transition-all" />
      </div>
    </div>
  );
};
