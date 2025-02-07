import React from "react";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import configure from "../../apps/configure/configure.json";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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

const InputFieldButton = (props) => {
  const { alignment = "left", onClick, showLabel = true, ...param } = props;
  return (
    // <div>
    //   {showLabel ? (
    //     <Typography sx={styleSheet.label} align={alignment}>
    //       {props.label}
    //       {props.required ? (
    //         <span style={{ color: configure.denied_color, fontSize: 15 }}>
    //           *
    //         </span>
    //       ) : (
    //         <span style={{ color: "transparent", fontSize: 15 }}>*</span>
    //       )}
    //     </Typography>
    //   ) : null}
    //   <TextField
    //     onClick={onClick}
    //     InputProps={{ readOnly: props.readOnly }}
    //     {...props.input}
    //     error={props.meta.touched && props.meta.error ? true : false}
    //     fullWidth
    //     size="small"
    //     required={props.required}
    //     id="outlined-required"
    //     type={props.type}
    //     multiline={props.multiline}
    //     rows={props.multiline ? props.linerow : undefined}
    //     disabled={props.disabled}
    //     placeholder={props.placeholder}
    //     sx={{
    //       "& input": {
    //         backgroundColor: props.disabled ? "#e8e8e8" : "transparent",
    //       },
    //     }}
    //   />
    // </div>
    <FormControl fullWidth variant="outlined">
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
      <OutlinedInput
        onClick={onClick}
        fullWidth
        size="small"
        id="outlined-adornment-input"
        type={props.type}
        {...props.input}
        InputProps={{ readOnly: props.readOnly }}
        error={props.meta.touched && props.meta.error ? true : false}
        sx={{
          "& input": {
            backgroundColor: props.disabled ? "#e8e8e8" : "transparent",
          },
        }}
        rows={props.multiline}
        disabled={props.disabled}
        placeholder={props.placeholder}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={props.inputLabel}
              onClick={props.handleClick}
              // onMouseDown={props.handleMouse}
              // onMouseUp={props.handleMouseUp}
              edge="end"
            >
              {props.inputIcon}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default InputFieldButton;
