// Pie.jsx (improved)
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Centralize color palette so you can reuse or swap themes easily
const COLORS = [
  "#50758D", // Deep Blue (primary brand)
  "#325D79", // Teal (secondary)
  "#09BCE6", // Navy / Dark Teal

  // Extended harmonies (analogous + lighter shades)
  "#5A8DA8", // Light Teal
  "#7BA4BA", // Soft Blue-Teal
  "#A6BBD4", // Pastel Blue
  "#B7D1D9", // Pastel Teal
  "#D4E2EC", // Very Light Mist Blue
];


export default function PieChartCard({ data, height = 320 }) {
 
  // Custom label function with smaller font
  const renderLabel = ({ name, percent, x, y }) => {
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 13,
          fontWeight: 600,
          fill: "#333",
          stroke: "white",       // 👈 outline color
          strokeWidth: 0.6,      // 👈 thickness of outline
          paintOrder: "stroke",  // 👈 ensures stroke is drawn behind fill
        }}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={110}
          innerRadius={50}
          dataKey="value"
          label={renderLabel}
          labelLine={false} // ✅ remove connecting lines for cleaner look
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="white"
              strokeWidth={2}
            />
          ))}
        </Pie>

        <Tooltip
          formatter={(value, name) => [
            value.toLocaleString(),
            name,
          ]}
        />
        <Legend
          verticalAlign="bottom"
          height={40}
          wrapperStyle={{ fontSize: 13,marginTop:3 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
