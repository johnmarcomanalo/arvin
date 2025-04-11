import { Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import configure from "apps/configure/configure.json";
const formName = "QuotationColumnList";
const submit = async (values, dispatch, props) => {
  try {
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let QuotationColumnList = (props) => {
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                      align="center"
                    >
                      Status
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                      align="left"
                    >
                      Label
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.quotation_column_list.map((value, index) => (
                    <TableRow key={value.id}>
                      <TableCell align="center">
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={value.status}
                              onChange={() => props.handleStatusChange(index)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell align="left">{value.label}</TableCell>
                    </TableRow>
                  ))}
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
})(QuotationColumnList);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
