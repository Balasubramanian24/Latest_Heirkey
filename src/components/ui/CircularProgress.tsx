import React from "react";

export function CircularProgress({
  value,
  max,
  size = 36,
  stroke = 4,
  color = "#2BCFD5",
  bg = "#e5e7eb",
  fontSize = 14,
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  color?: string;
  bg?: string;
  fontSize?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, value / max));
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={bg}
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.3s" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fontSize={fontSize}
        fill="#444"
        fontWeight="bold"
      >
        {value}/{max}
      </text>
    </svg>
  );
} 