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
//   onChange?: any;
//   accept?: string;
//   multiple?: boolean;
// }
const styleSheet = {
  label: { fontSize: 13 },
};
const FileInputField = (props) => {
  return (
    <div>
      <Typography sx={styleSheet.label}>
        {props.label}
        {props.required ? (
          <span style={{ color: configure.denied_color, fontSize: 15 }}>*</span>
        ) : undefined}
      </Typography>
      <TextField
        inputProps={{
          readOnly: props.readOnly,
          accept: props.accept ? props.accept : null,
          multiple: props?.multiple,
        }}
        {...props.input}
        error={props.meta.touched && props.meta.error ? true : false}
        fullWidth
        size="small"
        required={props.required}
        id="outlined-required"
        type={props.type}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};

export default FileInputField;
