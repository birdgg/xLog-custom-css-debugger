import React from "react";
import { createRoot } from "react-dom/client";

const Popup = () => {
  return (
    <div className="relative overflow-hidden h-[600px] w-[500px] pt-2"></div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
