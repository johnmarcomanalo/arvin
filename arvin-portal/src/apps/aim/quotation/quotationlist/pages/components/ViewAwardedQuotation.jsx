import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import { cancelRequest } from "../../../../../../api/api";
import configure from "../../../../../configure/configure.json";
const formName = "ViewAwardedQuotation";
const submit = async (values, dispatch, props) => {
  try {
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let ViewAwardedQuotation = (props) => {
  const { ...param } = props;
  const selected_data = param.selected_data;
  const awarded = selected_data.awarded;
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TableContainer
              sx={{
                // maxHeight: screenHeight - 300,
                whiteSpace: "nowrap",
                overflowX: "auto",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Code
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      OS Number
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Customer
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Product Description
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Project Quantity
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Awarded Quantity
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Unawarded Quantity
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Awarded Percentage
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Unawarded Percentage
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Request Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {awarded.map((value, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{value.product_code}</TableCell>
                        <TableCell>{value.status}</TableCell>
                        <TableCell>{value.os_number}</TableCell>
                        <TableCell>{value.customer_description}</TableCell>
                        <TableCell>{value.product_description}</TableCell>
                        <TableCell>{value.projected_quantity}</TableCell>
                        <TableCell>{value.awarded_quantity}</TableCell>
                        <TableCell>{value.unawarded_quantity}</TableCell>
                        <TableCell>{value.awarded_percentage}</TableCell>
                        <TableCell>{value.unawarded_percentage}</TableCell>
                        <TableCell>{value.request_date}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};
const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(ViewAwardedQuotation);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
