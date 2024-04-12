import React from "react";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import configure from "../../apps/configure/configure.json";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const styleSheet = {
  label: { fontSize: 13 },
};

const InputDatePicker = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        {...props}
        name={props.name}
        label={props.label}
        slotProps={props.slotProps}
        format={props.format === "" ? "MM/DD/YYYY" : props.format}
      />
    </LocalizationProvider>
  );
};

export default InputDatePicker;
