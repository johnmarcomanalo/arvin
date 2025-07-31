import React from "react";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import configure from "../../apps/configure/configure.json";

const styleSheet = {
  label: { fontSize: 13 },
};

// Format number with commas and decimals
const formatWithCommas = (value) => {
  if (!value) return "";
  const [intPart, decimalPart] = value.toString().split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt;
};

// Remove commas for raw value
const unformatNumber = (value) => value.replace(/,/g, "");

const InputNumberField = (props) => {
  const {
    input,
    label,
    required,
    meta,
    type,
    readOnly,
    disabled,
    borderColor,
    multiline,
    linerow,
    placeholder,
    minLength,
    maxLength,
    pattern,
    onClick,
    alignment = "left",
    showLabel = true,
    decimalplace = 2,
  } = props;

  const isNumberField = type === "number";

  const handleChange = (e) => {
    let val = e.target.value;
  
    val = unformatNumber(val);
  
    const regex = new RegExp(`^\\d*(\\.\\d{0,${decimalplace}})?$`);
    if (!regex.test(val)) return;
  
    input.onChange(val);
  };

  const displayValue =
    isNumberField && input?.value !== undefined && input?.value !== null
      ? formatWithCommas(input.value.toString())
      : input.value ?? "";

  return (
    <div>
      {showLabel && (
        <Typography sx={styleSheet.label} align={alignment}>
          {label}
          {required ? (
            <span style={{ color: configure.denied_color, fontSize: 15 }}>*</span>
          ) : (
            <span style={{ color: "transparent", fontSize: 15 }}>*</span>
          )}
        </Typography>
      )}

      <TextField
        onClick={onClick}
        InputProps={{
          readOnly: readOnly,
          minLength,
          maxLength,
          pattern,
        }}
        {...input}
        error={meta.touched && !!meta.error}
        fullWidth
        size="small"
        required={required}
        id="outlined-required"
        type="text" // must be "text" to support comma formatting
        multiline={multiline}
        rows={multiline ? linerow : undefined}
        disabled={disabled}
        placeholder={placeholder}
        value={displayValue}
        onChange={isNumberField ? handleChange : input.onChange}
        sx={{
          "& input": {
            backgroundColor: disabled ? "#e8e8e8" : "transparent",
          },
          "& .MuiOutlinedInput-root": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: borderColor,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: borderColor,
            },
          },
        }}
      />
    </div>
  );
};

export default InputNumberField;
