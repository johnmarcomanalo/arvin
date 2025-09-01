import { Typography, Popper } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import configure from "../../apps/configure/configure.json";
import { createTheme } from "@mui/material/styles";

const styleSheet = {
  label: { fontSize: 13 },
};

export default function ComboBox(props) {
  const { showLabel = true, disable = false,input, ...param  } = props;
  const handleInputChange = (event, newInputValue) => {
    console.log("newInputValue",newInputValue);
    
    if (!newInputValue) {
      if (input?.onChange) {
        input.onChange(""); // safe update redux-form state
      }
    }
    
  }; 
  
  return (
    <div style={{ width: "100%" }}>
      {showLabel ? (
        <Typography sx={styleSheet.label} align="left">
          {param.label}{" "}
          {param.required ? (
            <span style={{ color: configure.denied_color, fontSize: 15 }}>
              *
            </span>
          ) : (
            <span style={{ color: "transparent", fontSize: 15 }}>*</span>
          )}
        </Typography>
      ) : null}
      <Autocomplete
        disabled={disable}
        disablePortal
        id={param.id}
        fullWidth
        size="small"
        options={param.options}
        // PopperComponent={CustomPopper}
        {...param.input}
        // onChange={param.onChangeHandle}

        onChange={(e, newValue) => {
          input?.onChange(newValue?.description || ""); // update redux-form
          param.onChangeHandle?.(e, newValue); // trigger your custom handler
        }}        // value={param.value}
        value={
          param.options.find((opt) => opt.description === input.value) || null
        } // ensures value is matched
        // defaultValue={{ [param.initialValue]: param.input.value }}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        getOptionLabel={param.getOptionLabel}
        onInputChange={handleInputChange}
        renderInput={(params) => (
          <TextField {...params} required={param.required} fullWidth />
        )}
        componentsProps={{
          paper: {
            sx: {
              textAlign: "left", // Align dropdown options to the left
            },
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: props.borderColor, // default border color
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: props.borderColor, // focused border color
            },
          },
        
        }}
      />{" "}
    </div>
  );
}
