import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import moment from "moment";
import * as React from "react";
import configure from "../../../../../configure/configure.json";

const chartSetting = {
  height: 150,
};

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490, 0, 0, 0, 0, 0];
const labels = configure.months_names;

export default function AnnualSalesLineChart() {
  const [showUv, setShowUv] = React.useState(true);
  const [showPv, setShowPv] = React.useState(true);

  const handleToggleUv = () => setShowUv(!showUv);
  const handleTogglePv = () => setShowPv(!showPv);

  return (
    <React.Fragment>
      <LineChart
        series={[...(showUv ? [{ data: uData }] : [])]}
        xAxis={[
          {
            scaleType: "point",
            data: labels,
            label: "",
            tickLabels: { display: false },
          },
        ]}
        yAxis={[
          {
            label: "",
            tickLabels: { display: false },
          },
        ]}
        borderRadius={10}
        {...chartSetting}
      />
    </React.Fragment>
  );
}
