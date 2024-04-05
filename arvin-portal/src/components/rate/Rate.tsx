import Rating from "@mui/material/Rating";
import React from "react";
interface InputFieldProps {
  name?: any;
  value?: any;
  limit?: any;
  status?: any;
  onChangeRate?: (event: any, page: any) => void;
}
const Rate = (props: InputFieldProps) => {
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newValue: any
  ) => {
    if (props.onChangeRate) {
      props.onChangeRate(event, newValue);
    }
  };
  return (
    <Rating
      name={props.name}
      // value={props.value}
      onChange={handlePageChange}
      max={5}
      size="large"
    />
  );
};

export default Rate;
