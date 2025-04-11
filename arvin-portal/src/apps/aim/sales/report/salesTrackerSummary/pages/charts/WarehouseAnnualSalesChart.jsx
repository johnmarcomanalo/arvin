import { Card, CardContent } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import * as React from "react";
import configure from "apps/configure/configure.json";

// Dataset with sales data
const dataset = [
  { value: 21, month: "January" },
  { value: 28, month: "February" },
  { value: 41, month: "March" },
  { value: 73, month: "April" },
  { value: 99, month: "May" },
  { value: 144, month: "June" },
  { value: 319, month: "July" },
  { value: 249, month: "August" },
  { value: 131, month: "September" },
  { value: 55, month: "October" },
  { value: 48, month: "November" },
  { value: 25, month: "December" },
];

// Format value for display
const valueFormatter = (value) => `${value}mm`;

// Chart settings
const chartSetting = {
  yAxis: [{ label: "Sales Monthly Out" }],
  series: [
    {
      dataKey: "value",
      label: "Warehouse Monthly Sale (min target 200)",
      valueFormatter,
    },
  ],
  height: 270,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

// Handle bar click event
const handleAxisClick = (data) => {
  const seriesValues = data.seriesValues;
  const details = {
    month: data.axisValue,
    value: seriesValues["auto-generated-id-0"], // Replace with appropriate key
  };
};

// Main component
export default function TickPlacementBars() {
  const [tickPlacement, setTickPlacement] = React.useState("middle");
  const [tickLabelPlacement, setTickLabelPlacement] = React.useState("middle");

  // Extract month and sales data
  const monthArray = dataset.map((item) => item.month);
  const valueArray = dataset.map((item) => item.value);

  // Set target and bar colors
  const target = 200;
  const barColors = valueArray.map((val) => (val >= target ? "green" : "red"));

  return (
    <div style={{ width: "100%" }}>
      <Card sx={{ boxShadow: configure.box_shadow }}>
        <CardContent>
          <BarChart
            dataset={dataset}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "month",
                tickPlacement,
                tickLabelPlacement,
                colorMap: {
                  type: "ordinal",
                  values: monthArray,
                  colors: barColors,
                },
              },
            ]}
            onAxisClick={(event, d) => handleAxisClick(d)}
            {...chartSetting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
