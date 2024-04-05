import TextField from "@mui/material/TextField";
import { ChangeEvent } from "react";
// interface InputFieldProps {
//   label?: string;
//   meta?: any;
//   value?: any;
//   input?: any;
//   required?: boolean;
//   type?: string;
//   readOnly?: boolean;
//   multiline?: boolean;
//   onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
// }
const SearchField = (props) => {
  return (
    <div>
      <TextField
        onChange={props.onChange}
        fullWidth
        value={props.value}
        placeholder="Search..."
        size="small"
        id="outlined-required"
      />
    </div>
  );
};

export default SearchField;
