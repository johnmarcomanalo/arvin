import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  LocalShipping,
  Reply,
  Warehouse,
  ListAlt,
  AccessTime,
  WarningAmber,
  BorderAll
} from "@mui/icons-material";

export default function MetricOverview() {
  const metrics = [
    {
      title: "Total Containers",
      value: "21",
      change: "+3",
      trend: "up",
      icon: <ListAlt fontSize="small" />,
      color: "primary.main",
    },
    {
      title: "Warehouse Receiving",
      value: "16,639 KG",
      change: "+2,150 KG",
      trend: "up",
      icon: <Warehouse fontSize="small" />,
      color: "secondary.main",
    },
    {
      title: "Direct Delivery",
      value: "4,160 KG",
      change: "+840 KG",
      trend: "up",
      icon: <LocalShipping fontSize="small" />,
      color: "info.main",
    },
    {
      title: "GRPO vs DR",
      value: "0",
      change: "0",
      trend: "down",
      icon: <WarningAmber fontSize="small" />,
      color: "error.main",
    },
    {
      title: "DR vs Invoice",
      value: "0",
      change: "0",
      trend: "down",
      icon: <WarningAmber fontSize="small" />,
      color: "error.main",
    },
    {
      title: "CM/Return",
      value: "0",
      change: "0",
      trend: "down",
      icon: <Reply fontSize="small" />,
      color: "warning.main",
    },
  ];

  return (
    <Grid item container spacing={3} >
      {metrics.map((metric, index) => {
        const isPositive = metric.trend === "up";
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;

        return (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                p: 1,
                borderRadius: 3,
                borderColor: "divider",
              }}
            >
              <CardHeader
                sx={{ pb: 0 }}
                title={
                  <Typography variant="body2" color="text.secondary">
                    {metric.title}
                  </Typography>
                }
                action={
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      bgcolor: `${metric.color}20`, // soft tint
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: metric.color,
                    }}
                  >
                    {metric.icon}
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {metric.value}
                </Typography>

                <Box display="flex" alignItems="center">
                  <TrendIcon
                    fontSize="small"
                    sx={{
                      color: isPositive ? "success.main" : "error.main",
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: isPositive ? "success.main" : "error.main",
                      mr: 0.5,
                      fontWeight: 600,
                    }}
                  >
                    {metric.change}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    from last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
