import React from "react";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import configure from "../../apps/configure/configure.json";
// interface InputFieldProps {
//   label: string;
//   meta: any;
//   value?: any;
//   input: any;
//   required?: boolean;
//   type?: string;
//   readOnly?: boolean;
//   multiline?: boolean;
//   onClick?: () => void;
//   disabled?: boolean;
//   placeholder?: any;
// }
const styleSheet = {
  label: { fontSize: 13 },
};

const InputField = (props) => {
  const { alignment = "left", onClick, showLabel = true, ...param } = props;
  return (
    <div>
      {showLabel ? (
        <Typography sx={styleSheet.label} align={alignment}>
          {props.label}
          {props.required ? (
            <span style={{ color: configure.denied_color, fontSize: 15 }}>
              *
            </span>
          ) : (
            <span style={{ color: "transparent", fontSize: 15 }}>*</span>
          )}
        </Typography>
      ) : null}
      <TextField
        onClick={onClick}
        InputProps={{ 
          readOnly: props.readOnly, 
          minLength: props.minLength,
          maxLength: props.maxLength,
          pattern: props.pattern,
        }}
        {...props.input}
        error={props.meta.touched && props.meta.error ? true : false}
        fullWidth
        size="small"
        required={props.required}
        id="outlined-required"
        type={props.type}
        multiline={props.multiline}
        rows={props.multiline ? props.linerow : undefined}
        disabled={props.disabled}
        placeholder={props.placeholder} 
        sx={{
          "& input": {
            backgroundColor: props.disabled ? "#e8e8e8" : "transparent",
          },
          "& .MuiOutlinedInput-root": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: props.borderColor, // default border color
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: props.borderColor, // focused border color
            },
          },
        
        }}
      />
    </div>
  );
};

export default InputField;
