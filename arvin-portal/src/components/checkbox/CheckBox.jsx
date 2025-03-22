import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

const CheckBox = (props) => {
  const { input,label, checked, onChange, name, disabled } = props;
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          name={name}
          disabled={disabled}
          onChange={(e) => input.onChange(e.target.checked)}
          {...props.input}
          
        />
      }
      label={label}
    />
  );
};

export default CheckBox;
