import { Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import moment from "moment";
import React from "react";
import configure from "../../apps/configure/configure.json";
const styleSheet = {
  label: { fontSize: 13 },
};
const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiInputLabel-outlined.Mui-focused": {
            width: "100%",
          },
        },
      },
    },
    MuiPickersTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiInputLabel-outlined.Mui-focused": {
            width: "100%",
          },
        },
      },
    },
  },
});
const InputDateRange = ({
  input,
  label,
  meta: { touched, error },
  required,
  placeholder,
  showText = true,
  disableFuture,
  disablePast,
}) => {
  // Convert input value to a valid Date object using moment.js
  const dateValue = input.value ? moment(input.value).toDate() : null;

  // Handle change event to convert the selected date to a string before passing it to Redux Form
  const handleChange = (date) => {
    const dateString = date ? moment(date).format("YYYY-MM-DD") : null;
    input.onChange(dateString);
  };

  return (
    <div>
      {showText ? (
        <Typography sx={styleSheet.label}>
          {label}
          {required ? (
            <span style={{ color: configure.denied_color, fontSize: 15 }}>
              *
            </span>
          ) : (
            <span style={{ color: "transparent", fontSize: 15 }}>*</span>
          )}
        </Typography>
      ) : null}

      <LocalizationProvider fullWidth dateAdapter={AdapterMoment}>
        {/* <DatePicker
          dateFormat={"MM"}
          theme={theme}
          selected={
            input.value
              ? moment(input.value, "MM").format("MM")
              : null
          }
          views={["month"]}
          openTo="year"
          disabledKeyboardNavigation
          placeholderText={placeholder}
          slotProps={{ field: { size: "small" } }}
          sx={{ width: "100%" }}
          disableFuture={disableFuture}
          disablePast={disablePast}
        /> */}
        <DemoContainer components={["SingleInputDateRangeField"]}>
          <DateRangePicker
            slots={{ field: SingleInputDateRangeField }}
            name="allowedRange"
            disableFuture={disableFuture}
            slotProps={{ field: { size: "small" } }}
            onChange={(date) => input.onChange(date)}
            sx={{ width: "100%" }}
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};

export default InputDateRange;
