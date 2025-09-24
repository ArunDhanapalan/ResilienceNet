"use client";

import React from 'react';


export const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 text-sm shadow-md border bg-background rounded-lg">
        <p className="font-bold mb-1">{label || payload[0].name}</p>
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: item.color || item.fill }} 
            />
            <p className="text-muted-foreground">{`${item.name}:`} <span className="font-bold text-foreground">{item.value}</span></p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// This component is not strictly necessary for functionality but is kept for consistency 
// with the original import statement. It doesn't render anything itself.
export const ChartTooltipContent = () => {
  return null;
};