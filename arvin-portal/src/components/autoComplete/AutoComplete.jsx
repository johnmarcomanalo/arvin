import { Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import configure from "../../apps/configure/configure.json";

const styleSheet = {
  label: { fontSize: 13 },
};
export default function ComboBox(props) {
  const handleInputChange = (event, newInputValue) => {
    if (!newInputValue) {
      props.input.onChange(""); // Clear the field when the input is empty
    }
  };
  return (
    <div>
      <Typography sx={styleSheet.label}>
        {props.label}{" "}
        {props.required ? (
          <span style={{ color: configure.denied_color, fontSize: 15 }}>*</span>
        ) : undefined}
      </Typography>
      <Autocomplete
        disablePortal
        id={props.id}
        fullWidth
        size="small"
        options={props.options}
        {...props.input}
        onChange={props.onChangeHandle}
        value={props.value}
        defaultValue={{ [props.initialValue]: props.input.value }}
        isOptionEqualToValue={(option, value) =>
          option.value === value.value
        }
        getOptionLabel={props.getOptionLabel}
        onInputChange={handleInputChange}
        renderInput={(params) => (
          <TextField {...params} required={props.required} />
        )}
      />{" "}
    </div>
  );
}
