import { ButtonGroup, Grid, Paper, Stack, useMediaQuery } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { change, Field, formValueSelector, reduxForm } from "redux-form";
import RequestHooks from "../hooks/RequestHooks";
import configure from "../../../../configure/configure.json";
import ButtonComponent from "../../../../../components/button/Button";
import InputField from "../../../../../components/inputFIeld/InputField";
import ComboBox from "../../../../../components/autoComplete/AutoComplete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ProductList from "../../../settings/reference/pages/components/ProductList";
import Modal from "../../../../../components/modal/Modal";
const formName = "RequestQuotation";
const submit = async (values, dispatch, props) => {
  try {
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};
let RequestQuotation = (props) => {
  const { ...request } = RequestHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  const access = request.access;
  const state = request?.state;
  props.dispatch(change(formName, "notes", state?.notes));
  props.dispatch(change(formName, "produc_list", state?.product_list));
  return (
    <React.Fragment>
      <Modal
        open={request.viewModal}
        fullScreen={matches ? false : true}
        title={"Product Search"}
        size={"lg"}
        action={undefined}
        handleClose={request.onClickCloseViewModal}
      >
        <ProductList onClickFunction={request.onClickSelectItemProductList} />
      </Modal>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={2}
            >
              <ButtonComponent
                stx={configure.default_button}
                iconType="submit"
                type="submit"
                fullWidth={true}
                children={"Submit"}
              />
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
          >
            <Paper
              sx={{
                boxShadow: configure.box_shadow,
                width: { xs: "100%", sm: "100%", md: "60%", lg: "80%" },
                padding: 5,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                  <Field
                    id="request_date"
                    name="request_date"
                    label="Request Date"
                    type="date"
                    component={InputField}
                    required={true}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}></Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Field
                    id="customer_description"
                    name="customer_description"
                    label="Customer"
                    options={access?.user_access_customer_rights}
                    getOptionLabel={(option) =>
                      option?.description ? option?.description : ""
                    }
                    required={true}
                    component={ComboBox}
                    onChangeHandle={(e, newValue) => {
                      if (newValue?.description) {
                        let res = request.GetCustomerDetails(newValue);
                        console.log(res);
                        props.change("customer_code", newValue.customer_code);
                        props.change("customer_type", newValue.type);
                        props.change("customer_address", res?.Street);
                        props.change("customer_representative", res?.CntctPrsn);
                        props.change(
                          "quotation_opening_letter",
                          configure?.quotation_opening_letter
                        );
                        props.change(
                          "quotation_closing_letter",
                          configure?.quotation_closing_letter
                        );
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Field
                    id="customer_address"
                    name="customer_address"
                    label="Address"
                    required={true}
                    component={InputField}
                    multiline={true}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Field
                    id="customer_representative"
                    name="customer_representative"
                    label="Attention"
                    required={true}
                    component={InputField}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Field
                    id="quotation_opening_letter"
                    name="quotation_opening_letter"
                    label="Opening Letter"
                    required={true}
                    component={InputField}
                    multiline={true}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                            }}
                          >
                            PRODUCT CODE
                          </TableCell>
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
                            MINIMUM DELIVERY QUANTITY
                          </TableCell>
                          <TableCell
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                            }}
                            align="center"
                          >
                            UNIT PRICE
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {state.product_list?.map((value,index)=>{
                          return (
                            <TableRow>
                              <TableCell align="center">
                                {value.description}
                              </TableCell>
                              <TableCell align="center">{value.code}</TableCell>
                            </TableRow>
                          );
                        })}
                        
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                    spacing={2}
                  >
                    <ButtonGroup
                      disableElevation
                      aria-label="Disabled button group"
                    >
                      <ButtonComponent
                        stx={configure.default_button}
                        iconType="add"
                        type="button"
                        fullWidth={true}
                        children={"Add Product"}
                        click={request.onClickOpenViewModal}
                      />
                    </ButtonGroup>
                  </Stack>
                </Grid>
                {state?.notes.map((value, index) => {
                  return (
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Field
                        id={"description-" + index}
                        name={"description-" + index}
                        label={"Note " + (index + 1)}
                        required={true}
                        component={InputField}
                        multiline={true}
                        value={value.description}
                        onChange={(e) => {
                          request.onChangeNotes(e, index);
                        }}
                      />
                    </Grid>
                  );
                })}
                <Grid item xs={12} md={12}>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                    spacing={2}
                  >
                    <ButtonGroup
                      disableElevation
                      aria-label="Disabled button group"
                    >
                      <ButtonComponent
                        stx={configure.default_button}
                        iconType="add"
                        type="button"
                        fullWidth={true}
                        children={"Add Note"}
                        click={request.onClickAddNotes}
                      />
                      <ButtonComponent
                        stx={configure.default_button}
                        iconType="delete"
                        type="button"
                        fullWidth={true}
                        children={"Remove Note"}
                        click={request.onClickRemoveNotes}
                      />
                    </ButtonGroup>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Field
                    id="quotation_closing_letter"
                    name="quotation_closing_letter"
                    label="Closing Letter"
                    required={true}
                    component={InputField}
                    multiline={true}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(RequestQuotation);
const selector = formValueSelector(formName);
export default connect((state) => {
  const productList = state.ReferenceReducer.productList;
  return { productList };
}, {})(ReduxFormComponent);
