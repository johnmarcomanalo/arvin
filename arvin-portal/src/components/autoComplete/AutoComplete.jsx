import { Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import configure from "../../apps/configure/configure.json";

const styleSheet = {
  label: { fontSize: 13 },
};
export default function ComboBox(props) {
  const { showLabel = true, ...param } = props;
  const handleInputChange = (event, newInputValue) => {
    if (!newInputValue) {
      param.input.onChange(""); // Clear the field when the input is empty
    }
  };
  return (
    <div>
      {showLabel ? (
        <Typography sx={styleSheet.label} align="left">
          {param.label}{" "}
          {param.required ? (
            <span style={{ color: configure.denied_color, fontSize: 15 }}>
              *
            </span>
          ) : undefined}
        </Typography>
      ) : null}
      <Autocomplete
        disablePortal
        id={param.id}
        fullWidth
        size="small"
        options={param.options}
        {...param.input}
        onChange={param.onChangeHandle}
        value={param.value}
        defaultValue={{ [param.initialValue]: param.input.value }}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        getOptionLabel={param.getOptionLabel}
        onInputChange={handleInputChange}
        renderInput={(params) => (
          <TextField {...params} required={param.required} />
        )}
      />{" "}
    </div>
  );
}
