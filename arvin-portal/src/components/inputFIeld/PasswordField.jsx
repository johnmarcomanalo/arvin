import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { FormControl, OutlinedInput, Typography } from "@mui/material";
import configure from "../../apps/configure/configure.json";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
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
// }
const styleSheet = {
  label: { fontSize: 13 },
};
const InputField = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Typography sx={styleSheet.label}>
        {props.label}
        {props.required ? (
          <span style={{ color: configure.denied_color, fontSize: 15 }}>*</span>
        ) : undefined}
      </Typography>
      <FormControl fullWidth size="small" variant="outlined">
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          {...props.input}
          required={props.required}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </div>
  );
};

export default InputField;
