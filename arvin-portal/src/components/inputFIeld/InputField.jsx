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
  const { alignment = "left", onClick, ...param } = props;
  return (
    <div>
      <Typography sx={styleSheet.label} align={alignment}>
        {props.label}
        {props.required ? (
          <span style={{ color: configure.denied_color, fontSize: 15 }}>*</span>
        ) : (
          <span style={{ color: "transparent", fontSize: 15 }}>*</span>
        )}
      </Typography>
      <TextField
        onClick={onClick}
        InputProps={{ readOnly: props.readOnly }}
        {...props.input}
        error={props.meta.touched && props.meta.error ? true : false}
        fullWidth
        size="small"
        required={props.required}
        id="outlined-required"
        type={props.type}
        multiline={props.multiline}
        rows={props.multiline ? 4 : undefined}
        disabled={props.disabled}
        placeholder={props.placeholder}
        sx={{
          "& input": {
            backgroundColor: props.disabled ? "#e8e8e8" : "transparent",
          },
        }}
      />
    </div>
  );
};

export default InputField;
