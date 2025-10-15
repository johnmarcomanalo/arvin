import { Card, CardHeader, CardContent, Box, Typography, Stack } from "@mui/material";
import { NumericFormat } from "react-number-format";
export default function MetricCard({
  title,
  value,
  unit,
  subValue,
  icon: Icon,
  trend: TrendIcon,
  trendValue,
  trendColor = "success.main",
}) {
  return (
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
            {title}
          </Typography>
        }
        action={
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#093a5c",
              color: "primary.main",
            }}
          >
            {Icon && <Icon    sx={{
              color:'white',
              fontSize:17
            }}/>}
          </Box>
        }
      />
      <CardContent>
        <Stack spacing={1}>
          {/* Main value */}
          <Typography variant="h5" fontWeight={700}>
          <NumericFormat
            thousandsGroupStyle="thousand"
            value={value}
            decimalSeparator="."
            displayType="text"
            type="text"
            thousandSeparator={true}
            allowNegative={true}
            decimalScale={0}
            fixedDecimalScale={true}
            style={{ color: value < 0 ? "#C83232" : 'inherit' }}
          />
          </Typography> 
          {/* {unit && (
              <Typography
                component="span"
                color="text.secondary"
                sx={{ 
                  ml: 0.5,
                  fontSize:13
                }}
              >
                {unit}
              </Typography>
            )} */}
        </Stack>
      </CardContent>
    </Card>
  );
}
