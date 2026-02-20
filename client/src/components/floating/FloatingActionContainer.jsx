import React from "react";
import FloatingCart from "./FloatingCart";
import FloatingOrderStatus from "./FloatingOrderStatus";

const FloatingActionContainer = () => {
  return (
    // The master fixed container. 'pointer-events-none' allows clicking around the buttons.
    <div className="fixed bottom-6 left-0 right-0 z-[60] px-4 flex flex-col items-center pointer-events-none">
      {/* 'flex-col' and 'gap-3' will smartly stack the active items! */}
      <div className="w-full max-w-md flex flex-col gap-3">
        <FloatingOrderStatus />
        <FloatingCart />
      </div>
    </div>
  );
};

export default FloatingActionContainer;
