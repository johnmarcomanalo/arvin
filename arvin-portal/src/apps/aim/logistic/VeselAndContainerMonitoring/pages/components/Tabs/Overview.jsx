import { Grid, Card, CardHeader, CardContent, Typography, Box } from "@mui/material";
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
  DirectionsBoatFilled
} from "@mui/icons-material";
import Pie from "../Charts/Pie";
import MetricCard from "../MetricCard";

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
  PODate
}) {
  // 🎨 Pastel color palette
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
      subValue: "3423 kg",
      unit: `${(3423 / 1000).toFixed(2)} MT`,
      icon: Warehouse,
      trend: TrendingUp,
      trendColor: pastelColors.green,
      size: { xs: 12, sm: 2 },
    },
    {
      title: "Direct Delivery",
      value: TotalDirectToCustomer,
      subValue: "3423 kg",
      unit: `${(3423 / 1000).toFixed(2)} MT`,
      icon: LocalShipping,
      trend: TrendingUp,
      trendColor: pastelColors.blue,
      size: { xs: 12, sm: 2 },
    },
    {
      title: "DR vs INV",
      value: TotalLackingDRQvsINV,
      subValue: "3423 kg",
      unit: `${(3423 / 1000).toFixed(2)} MT`,
      icon: WarningAmber,
      trend: TrendingUp,
      trendColor: pastelColors.red,
      size: { xs: 12, sm: 2 },
    },
    {
      title: "GRPO vs DR",
      value: TotalLackingGRvsDR,
      subValue: "3423 kg",
      unit: `${(3423 / 1000).toFixed(2)} MT`,
      icon: WarningAmber,
      trend: TrendingUp,
      trendColor: pastelColors.yellow,
      size: { xs: 12, sm: 2 },
    },
    {
      title: "CM/Return",
      value: TotalCMQty,
      subValue: "3423 kg",
      unit: `${(3423 / 1000).toFixed(2)} MT`,
      icon: Reply,
      trend: TrendingUp,
      trendColor: pastelColors.pink,
      size: { xs: 12, sm: 2 },
    },
    {
      title: "Full Container Load",
      value: TotalFCL,
      subValue: "3423 kg",
      unit: `${(3423 / 1000).toFixed(2)} MT`,
      icon: BorderAll,
      trend: TrendingUp,
      trendColor: pastelColors.purple,
      size: { xs: 12, sm: 2 },
    },
  ];


  const details = [
    {
      label: "PO Number",
      value: PONumber,
      icon: <Description fontSize="small" />, 
    },
    {
      label: "Invoice Number",
      value: InvoiceNo,
      icon: <LocalShipping fontSize="small" />, 
    },
    {
      label: "Broker",
      value: Broker,
      icon: <Person fontSize="small" />, 
    },
    {
      label: "Purchased Date",
      value:  PODate,
      icon: <Store fontSize="small" />, 
    },
    {
      label: "Vessel",
      value:  Vessel,
      icon: <DirectionsBoatFilled fontSize="small" />, 
    },
    {
      label: "BL Number",
      value:  BLNo,
      icon: <ChecklistRtl fontSize="small" />, 
    },
  ];

  return (
    <Grid container spacing={2}>
      {/* Details Section */}
      {details.map((item, index) => (
        <Grid item xs={12} sm={6} md={2} key={index}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              // boxShadow: 1,
              height: "100%",
              // bgcolor: "#fff",
            }}
          >
           <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start", // 👈 keep icon top-aligned with text
                p: 2,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>   {/* allow text to wrap properly */}
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                {item.label}
              </Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  noWrap        // 👈 add this if you want text to stay on one line
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
                  flexShrink: 0,   // 👈 prevent icon from shrinking when text is long
                  ml: 1,           // 👈 add spacing from text
                }}
              >
                {item.icon}
            </Box>
            </CardContent> 
          </Card>
        </Grid>
      ))}

      {/* Charts Section */}
      <Grid container item spacing={2} xs={12} md={12}>
        
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
              <Pie data={delivery}/>
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

        {/* Metric Cards */}
        {metrics.map((metric, index) => (
          <Grid item key={index} {...metric.size}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
