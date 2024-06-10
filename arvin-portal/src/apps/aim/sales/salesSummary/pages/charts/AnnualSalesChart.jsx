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
  height: 230,
};

const lastYear = [4000, 3000, 2000, 2780, 1890, 2390, 3490, 0, 0, 0, 0, 0];
const currentYear = [2400, 1398, 9800, 3908, 4800, 3800, 4300, 0, 0, 0, 0, 0];
const labels = configure.months_names;

export default function AnnualSalesChart() {
  const [showUv, setShowUv] = React.useState(true);
  const [showPv, setShowPv] = React.useState(true);

  const handleToggleUv = () => setShowUv(!showUv);
  const handleTogglePv = () => setShowPv(!showPv);

  return (
    <React.Fragment>
      <Card sx={{ boxShadow: configure.box_shadow }}>
        <CardContent>
          <Typography></Typography>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={showUv} onChange={handleToggleUv} />}
              label={moment(new Date()).format("YYYY")}
            />
            <FormControlLabel
              control={<Checkbox checked={showPv} onChange={handleTogglePv} />}
              label={moment().subtract(1, "year").format("YYYY")}
            />
          </FormGroup>
          <LineChart
            series={[
              ...(showUv
                ? [{ data: lastYear, label: moment(new Date()).format("YYYY") }]
                : []),
              ...(showPv
                ? [
                    {
                      data: currentYear,
                      label: moment().subtract(1, "year").format("YYYY"),
                    },
                  ]
                : []),
            ]}
            xAxis={[{ scaleType: "point", data: labels }]}
            borderRadius={10}
            {...chartSetting}
          />
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
