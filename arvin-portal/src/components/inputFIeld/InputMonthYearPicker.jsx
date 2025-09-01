import React from "react";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import configure from "../../apps/configure/configure.json";
import moment from "moment";
import { createTheme } from "@mui/material/styles";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
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
const InputMonthYearPicker = ({
  input,
  label,
  meta: { touched, error },
  required,
  placeholder,
  showText = true,
  disableFuture,
  disablePast,
  value
}) => {
  // Convert input value to a valid Date object using moment.js
  const dateValue = input.value ? moment(input.value).toDate() : null;

  // Handle change event to convert the selected date to a string before passing it to Redux Form
  const handleChange = (date) => {
    const dateString = date ? moment(date).format("YYYY-MM-DD") : null;
    input.onChange(dateString);
  };

  console.log(input);
  
  return (
    <div>
      {showText ? (
        <Typography sx={styleSheet.label} align="left">
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
        <DatePicker
          dateFormat={"YYYY-MM"}
          theme={theme}
          onChange={(date) => input.onChange(date)}
          selected={
            input.value
              ? moment(input.value, "YYYY-MM").format("YYYY-MM")
              : null
          }
          views={["year", "month"]}
          openTo="year"
          value={value}
          disabledKeyboardNavigation
          placeholderText={placeholder}
          slotProps={{ field: { size: "small" } }}
          sx={{ width: "100%" }}
          disableFuture={disableFuture}
          disablePast={disablePast}
        />
      </LocalizationProvider>
    </div>
  );
};

export default InputMonthYearPicker;
