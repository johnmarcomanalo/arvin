import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// interface BasicSelectProps {
//   data: any;
//   handleChange: () => void;
//   value: string;
//   display: string;
// }
export default function BasicSelect(props) {
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box>
      <FormControl fullWidth size="small">
        <InputLabel id="demo-simple-select-label">Filter</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Filter"
          onChange={handleChange}
        >
          {props.data.map((val, index) => {
            return (
              <MenuItem key={index} value={val[props.value]}>
                {val[props.display]}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
