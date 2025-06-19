
// components/Badge.tsx
import React from 'react';

const labelToColor: Record<string, string> = {
  "First Contribution": "bg-green-100 text-green-800",
  "50% Milestone":       "bg-yellow-100 text-yellow-800",
  "One Year of Saving":  "bg-purple-100 text-purple-800",
};

export const Badge: React.FC<{ label: string }> = ({ label }) => (
  <span
    className={
      `inline-block px-2 py-0.5 mr-1 mb-1 rounded-full text-xs font-medium ` +
      (labelToColor[label] || "bg-gray-100 text-gray-800")
    }
  >
    {label}
  </span>
);
