import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";

const styleSheet = {
  label: { fontSize: 13 },
  visibility: "invinsible",
};
const SearchField = (props) => {
  return (
    <div>
      <Typography sx={{ fontSize: 13, visibility: "hidden" }} align="left">
        Search
      </Typography>
      <TextField
        onChange={props.onChange}
        fullWidth
        value={props.value}
        placeholder="Search..."
        size="small"
        id="outlined-required"
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
