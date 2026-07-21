import React from "react";

export const Header = ({ text }: { text: string }) => {
  return (
    <div className="bg-red-500">
      <h1>{text}</h1>
    </div>
  );
};
