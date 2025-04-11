import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import moment from "moment";
import * as React from "react";
import configure from "apps/configure/configure.json";
import SalesSummaryHooks from "../../hooks/SalesSummaryHooks";

const chartSetting = {
  height: 190,
  margin: { left: 80 },
};

const labels = configure.months_names;

export default function AnnualSalesChart() {
  const [showCurrentYear, setShowCurrentYear] = React.useState(true);
  const [showLastYear, setShowLastYear] = React.useState(true);

  const handleToggleCurrentYear = () => setShowCurrentYear(!showCurrentYear);
  const handleToggleLastYear = () => setShowLastYear(!showLastYear);

  const { yearly_sales_line_chart_summary } = SalesSummaryHooks();
  // Get the current year and last year dynamically
  const currentYear = moment(
    Object.keys(yearly_sales_line_chart_summary)[1]
  ).format("YYYY");
  const lastYear = moment(
    Object.keys(yearly_sales_line_chart_summary)[0]
  ).format("YYYY");

  // Extract the data for the current year and last year
  const currentYearData = yearly_sales_line_chart_summary[currentYear]
    ? Object.keys(yearly_sales_line_chart_summary[currentYear]).map(
        (month) => yearly_sales_line_chart_summary[currentYear][month]
      )
    : Array(12).fill(0);

  const lastYearData = yearly_sales_line_chart_summary[lastYear]
    ? Object.keys(yearly_sales_line_chart_summary[lastYear]).map(
        (month) => yearly_sales_line_chart_summary[lastYear][month]
      )
    : Array(12).fill(0);
  // Prepare series data based on the state
  const series = [];
  if (showCurrentYear) {
    series.push({
      data: currentYearData,
      label: currentYear,
    });
  }
  if (showLastYear) {
    series.push({
      data: lastYearData,
      label: lastYear,
    });
  }

  return (
    <React.Fragment>
      <Card sx={{ boxShadow: configure.box_shadow }}>
        <CardContent>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showCurrentYear}
                  onChange={handleToggleCurrentYear}
                />
              }
              label={currentYear}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showLastYear}
                  onChange={handleToggleLastYear}
                />
              }
              label={lastYear}
            />
          </FormGroup>
          <LineChart
            series={series}
            xAxis={[{ scaleType: "point", data: labels }]}
            {...chartSetting}
          />
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
