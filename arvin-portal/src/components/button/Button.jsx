import React, { ReactNode } from "react";
import Button from "@mui/material/Button";
import configure from "../../apps/configure/configure.json";

const ButtonComponent = (props) => {
  return (
    <div>
      <Button
        style={configure.default_button}
        fullWidth={props.fullwidth}
        // data-testid={props.dataTestId}
        type="submit"
        variant="contained"
      >
        {props.children}
      </Button>
    </div>
  );
};

export default ButtonComponent;
