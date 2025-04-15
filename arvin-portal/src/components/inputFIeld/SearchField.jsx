import React, { useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";

const SearchField = (props) => {
  const {
    textHidden = true,
    autoFocus = true,
    fullwidth = false,
    ...param
  } = props;
  const inputRef = useRef(null);  // Create a reference for the TextField input

  // Focus the input when the component mounts or autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);  // Only re-run if autoFocus prop changes

  return (
    <div>
      {textHidden === false && (
        <Typography sx={{ fontSize: 15, visibility: "hidden" }} align="left">
          Search
        </Typography>
      )}
      <TextField
        autoComplete="off"
        onChange={props.onChange}
        fullWidth={fullwidth}
        value={props.value}
        placeholder="Search..."
        size="small"
        id="outlined-required"
        inputProps={{ maxLength: 50 }}
        sx={{
          "& input": {
            backgroundColor: props.disabled ? "#e8e8e8" : "transparent",
          },
        }}
        inputRef={inputRef} // Attach the ref to TextField's input
      />
    </div>
  );
};

export default SearchField;
