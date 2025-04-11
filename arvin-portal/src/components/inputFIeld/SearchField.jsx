import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";

const styleSheet = {
  label: { fontSize: 13 },
  visibility: "invinsible",
};
const SearchField = (props) => {
  const { textHidden = true, fullwidth = true, ...param } = props;
  return (
    <div style={{ width: "100%" }}>
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
      />
    </div>
  );
};

export default SearchField;
