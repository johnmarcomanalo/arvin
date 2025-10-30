import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Paper,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Stack,
} from "@mui/material";
import {
  TrendingUp,
  LocalShipping,
  Warehouse,
  Reply,
  WarningAmber,
  Description,
  Person,
  Store,
  BorderAll,
  ChecklistRtl,
  DirectionsBoatFilled,
} from "@mui/icons-material";
import Pie from "../Charts/Pie";
import MetricCard from "../MetricCard";
import CheckBoxComponent from "components/checkbox/CheckBox";
import { Field } from "redux-form";
export default function Overview({
  delivery,
  warehouse,
  TotalLackingDRQvsINV,
  TotalLackingGRvsDR,
  TotalDirectToWarehouse,
  TotalDirectToCustomer,
  TotalCMQty,
  TotalFCL,
  InvoiceNo,
  PONumber,
  Broker,
  SupplierName,
  BLNo,
  Vessel,
  PODate,
}) {
  const pastelColors = {
    blue: "#A5C9F7",
    green: "#A7E9AF",
    yellow: "#FBE7A1",
    red: "#F9A8A8",
    purple: "#D6B3F9",
    pink: "#F9C5D1",
  };

  const metrics = [
    {
      title: "Warehouse Receive",
      value: TotalDirectToWarehouse,
      icon: Warehouse,
      trend: TrendingUp,
      trendColor: pastelColors.green,
      size: { xs: 12, sm: 6, md: 2 },
    },
    {
      title: "Direct Delivery",
      value: TotalDirectToCustomer,
      icon: LocalShipping,
      trend: TrendingUp,
      trendColor: pastelColors.blue,
      size: { xs: 12, sm: 6, md: 2 },
    },
    {
      title: "DR vs INV",
      value: TotalLackingDRQvsINV,
      icon: WarningAmber,
      trend: TrendingUp,
      trendColor: pastelColors.red,
      size: { xs: 12, sm: 6, md: 2 },
    },
    {
      title: "GRPO vs DR",
      value: TotalLackingGRvsDR,
      icon: WarningAmber,
      trend: TrendingUp,
      trendColor: pastelColors.yellow,
      size: { xs: 12, sm: 6, md: 2 },
    },
    {
      title: "CM/Return",
      value: TotalCMQty,
      icon: Reply,
      trend: TrendingUp,
      trendColor: pastelColors.pink,
      size: { xs: 12, sm: 6, md: 2 },
    },
    {
      title: "Full Container Load",
      value: TotalFCL,
      icon: BorderAll,
      trend: TrendingUp,
      trendColor: pastelColors.purple,
      size: { xs: 12, sm: 6, md: 2 },
    },
  ];

  const details = [
    { label: "PO Number", value: PONumber, icon: <Description fontSize="small" /> },
    { label: "Invoice Number", value: InvoiceNo, icon: <LocalShipping fontSize="small" /> },
    { label: "Broker", value: Broker, icon: <Person fontSize="small" /> },
    { label: "Purchased Date", value: PODate, icon: <Store fontSize="small" /> },
    { label: "Vessel", value: Vessel, icon: <DirectionsBoatFilled fontSize="small" /> },
    { label: "BL Number", value: BLNo, icon: <ChecklistRtl fontSize="small" /> },
  ];

  return (
    <Box>
      {/* 🔹 Header with Conversion Filters */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography sx={{fontSize:20}} fontWeight="bold" color="text.primary">
          Overview
        </Typography>

        <Box 
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            px: 2,
            py: 1, 
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            Convert Number In:
          </Typography>

          <FormGroup row>
            <Field
              name="mt"
              component={CheckBoxComponent}
              // checked={state.advancePayment}
              // onChange={check.handleCheckboxChange}
              type="checkbox" 
              label="MT" 
            />
            <Field
              name="kg"
              component={CheckBoxComponent}
              // checked={state.advancePayment}
              // onChange={check.handleCheckboxChange}
              type="checkbox" 
              label="KG" 
            />
            <Field
              name="bags"
              component={CheckBoxComponent}
              // checked={state.advancePayment}
              // onChange={check.handleCheckboxChange}
              type="checkbox" 
              label="BAGS" 
            />
          </FormGroup>
        </Box>
      </Stack>

      {/* 🔹 Details Section */}
      <Grid container spacing={2} mb={3}>
        {details.map((item, index) => (
          <Grid item xs={12} sm={6} md={2} key={index}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  p: 2,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {item.label}
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    noWrap
                    sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                  >
                    {item.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    bgcolor: "#093a5c",
                    color: "white",
                    ml: 1,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔹 Charts and Metrics Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
            <CardHeader
              title={
                <Typography variant="body2" color="text.secondary">
                  Warehouse VS. Direct Delivery
                </Typography>
              }
              titleTypographyProps={{
                fontSize: 15,
                fontWeight: "bold",
                align: "center",
              }}
            />
            <CardContent>
              <Pie data={delivery} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
            <CardHeader
              title={
                <Typography variant="body2" color="text.secondary">
                  Warehouse Receive Quantity
                </Typography>
              }
              titleTypographyProps={{
                fontSize: 15,
                fontWeight: "bold",
                align: "center",
              }}
            />
            <CardContent>
              <Pie data={warehouse} colors={[pastelColors.purple, pastelColors.yellow]} />
            </CardContent>
          </Card>
        </Grid>

        {metrics.map((metric, index) => (
          <Grid item key={index} {...metric.size}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
