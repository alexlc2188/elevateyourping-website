import React from "react";

interface Props {
  children: React.ReactNode;
  subHeader: string;
}

export const HeaderSection = ({ children, subHeader }: Props) => {
  return (
    <div className="text-center space-y-3">
      {children}
      <p className="md:text-lg text-slate-700 max-w-2xl mx-auto">{subHeader}</p>
    </div>
  );
};
