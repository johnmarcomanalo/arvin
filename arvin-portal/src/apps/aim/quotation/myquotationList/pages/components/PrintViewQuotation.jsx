import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import HelpIcon from "@mui/icons-material/Help";
import { Field, formValueSelector, reduxForm } from "redux-form";
import configure from "../../../../../configure/configure.json";
import InputField from "../../../../../../components/inputFIeld/InputField";
import ButtonComponent from "../../../../../../components/button/Button";
import { cancelRequest } from "../../../../../../api/api";
import swal from "sweetalert";
import { Constants } from "../../../../../../reducer/Contants";
const formName = "ViewQuotation";
const Demo = styled("div")(({ theme }) => ({
  backgroundColor: configure.primary_color,
}));
const submit = async (values, dispatch, props) => {
  try {
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};
let ViewQuotation = (props) => {
  const { ...param } = props;
  const selected_data = param.selected_data;
  React.useEffect(() => {
    props.initialize({
      code: selected_data?.code,
      customer_representative: selected_data?.customer_representative,
      customer_description: selected_data?.customer_description,
      customer_address: selected_data?.customer_address,
      currency_type: selected_data?.currency_type,
      request_date: selected_data?.request_date,
      quotation_opening_letter: selected_data?.quotation_opening_letter,
      quotation_closing_letter: selected_data?.quotation_closing_letter,
      products: selected_data?.products,
      notes: selected_data?.notes,
      requestor_name: selected_data?.requestor_name,
      term: selected_data?.term,
      date_requested: selected_data?.date_requested,
    });
    return () => cancelRequest();
  }, []);
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={2}
            >
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: configure.tertiary_color, // Set your custom background color here
                      color: configure.primary_color, // Optional: set the text color to ensure contrast
                    },
                  },
                }}
                title={
                  <React.Fragment>
                    {JSON.parse(selected_data.request_hierarchy).map(
                      (val, index) => {
                        let approver = val?.approver;
                        return (
                          <List dense={true}>
                            <ListItem>
                              <ListItemText
                                primary={
                                  val.level_description +
                                  " - (" +
                                  val.status +
                                  ")"
                                }
                                secondary={approver
                                  .map((approver_value) => {
                                    return approver_value?.full_name;
                                  })
                                  .join(", ")} // Joining approvers to a single string
                                sx={{
                                  "& .MuiTypography-root": {
                                    color: configure.primary_color,
                                  }, // Applies color to all text within ListItemText
                                  "& .MuiTypography-body2": {
                                    color: configure.primary_color,
                                  }, // Specifically targets secondary text
                                }}
                              />
                            </ListItem>
                          </List>
                        );
                      }
                    )}
                  </React.Fragment>
                }
              >
                <Button sx={configure.default_button} startIcon={<HelpIcon />}>
                  Request Hierarchy Status
                </Button>
              </Tooltip>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Field
              id="requestor_name"
              name="requestor_name"
              label="Requestor"
              component={InputField}
              required={true}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Field
              id="term"
              name="term"
              label="Term"
              component={InputField}
              required={true}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Field
              id="customer_description"
              name="customer_description"
              label="Customer"
              component={InputField}
              required={true}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Field
              id="date_requested"
              name="date_requested"
              label="Date Requested"
              component={InputField}
              required={true}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Field
              id="customer_representative"
              name="customer_representative"
              label="Attention"
              component={InputField}
              required={true}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              id="request_date"
              name="request_date"
              label="Letter Date"
              component={InputField}
              required={true}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="customer_address"
              name="customer_address"
              label="Address"
              component={InputField}
              required={true}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <Field
              id="quotation_opening_letter"
              name="quotation_opening_letter"
              label="Opening Letter"
              component={InputField}
              required={true}
              disabled={true}
              multiline={true}
            />
          </Grid>
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
                      PRODUCT DESCRIPTION
                    </TableCell>

                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                      align="center"
                    >
                      PROJECTED QUANTITY
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                      align="center"
                    >
                      DESTINATION
                    </TableCell>

                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                      align="center"
                    >
                      MINIMUM ORDER QUANTITY
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                      align="center"
                    >
                      PICKUP PRICE
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                      align="center"
                    >
                      PRICE PER UNIT
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                      align="center"
                    >
                      TAX CODE
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selected_data?.products?.map((value, index) => {
                    return (
                      <TableRow>
                        <TableCell>{value.product_description}</TableCell>
                        <TableCell>
                          {value.projected_quantity +
                            " " +
                            value.projected_quantity_unit}
                        </TableCell>
                        <TableCell>{value.destination}</TableCell>
                        <TableCell>
                          {value.minimum_order_quantity +
                            " " +
                            value.minimum_order_quantity_unit}
                        </TableCell>
                        <TableCell>
                          {value.pickup_price + " " + value.pickup_price_unit}
                        </TableCell>
                        <TableCell>
                          {value.price_per_unit + " " + value.price_unit}
                        </TableCell>
                        <TableCell>{value.tax_code}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
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
                      Notes
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selected_data?.notes?.map((value, index) => {
                    return (
                      <TableRow>
                        <TableCell>{value.description}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={12}>
            <Field
              id="quotation_closing_letter"
              name="quotation_closing_letter"
              label="Closing Letter"
              component={InputField}
              required={true}
              disabled={true}
              multiline={true}
            />
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};
const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(ViewQuotation);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
