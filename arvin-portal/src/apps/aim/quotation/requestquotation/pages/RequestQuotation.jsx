import {
  ButtonGroup,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { connect } from "react-redux";
import { change, Field, formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import ComboBox from "../../../../../components/autoComplete/AutoComplete";
import ButtonComponent from "../../../../../components/button/Button";
import InputField from "../../../../../components/inputFIeld/InputField";
import Modal from "../../../../../components/modal/Modal";
import { Constants } from "../../../../../reducer/Contants";
import { decryptaes } from "../../../../../utils/LightSecurity";
import configure from "../../../../configure/configure.json";
import ProductList from "../../../settings/reference/pages/components/ProductList";
import { postQuotationRequest } from "../actions/RequestActions";
import RequestHooks from "../hooks/RequestHooks";
import QuotationColumnList from "./components/QuotationColumnList";
const formName = "RequestQuotation";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(postQuotationRequest(values));
    let decrypted = await decryptaes(res?.data);
    await dispatch({
      type: Constants.ACTION_QUOTATION,
      payload: {
        refresh: !props.refresh,
      },
    });
    await swal(decrypted.title, decrypted.message, decrypted.status);
    if (decrypted.result == true) {
      await dispatch(reset(formName));
      await window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
};
let RequestQuotation = (props) => {
  const [screenHeight, setScreenHeight] = React.useState(window.innerHeight);
  const { ...request } = RequestHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  const access = request.access;
  const state = request?.state;
  props.dispatch(change(formName, "notes", state?.notes));
  props.dispatch(change(formName, "product_list", state?.product_list));
  React.useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const visibleColumns = state?.quotation_column_list.filter(
    (column) => column.status === 1
  );
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

      <Modal
        open={request.updateModal}
        fullScreen={matches ? false : true}
        title={"Column List"}
        size={"xs"}
        action={undefined}
        handleClose={request.onClickCloseColumnListModal}
      >
        <QuotationColumnList
          quotation_column_list={state.quotation_column_list}
          handleStatusChange={request.handleStatusChange}
        />
      </Modal>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
          >
            <Card
              sx={{
                boxShadow: configure.box_shadow,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  align="left"
                  sx={{ color: configure.primary_color }}
                >
                  Request Sales Quotation
                </Typography>
                <Typography
                  align="left"
                  gutterBottom
                  sx={{ color: configure.dark_gray_color, fontSize: 12 }}
                >
                  Request Parameter for Sales Quotation
                </Typography>
                <Grid container spacing={2}>
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
                          props.change("customer_code", newValue.customer_code);
                          props.change("customer_type", newValue.type);
                          props.change("customer_address", res?.Street);
                          props.change(
                            "customer_representative",
                            res?.CntctPrsn
                          );
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
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Field
                      id="request_date"
                      name="request_date"
                      label="Request Date"
                      type="date"
                      component={InputField}
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Field
                      id="term"
                      name="term"
                      label="Term"
                      options={state?.term}
                      getOptionLabel={(option) =>
                        option?.description ? option?.description : ""
                      }
                      required={true}
                      component={ComboBox}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Field
                      id="currency_description"
                      name="currency_description"
                      label="Currency"
                      options={request?.currencies}
                      getOptionLabel={(option) =>
                        option?.description ? option?.description : ""
                      }
                      required={true}
                      component={ComboBox}
                      onChangeHandle={(e, newValue) => {
                        if (newValue?.description) {
                          props.change("currency_type", newValue.type);
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={6}>
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
                            {visibleColumns.some(
                              (column) => column.id === "code"
                            ) && (
                              <TableCell
                                style={{
                                  backgroundColor:
                                    configure.primary_table_color,
                                  color: configure.primary_table_text_color,
                                }}
                              >
                                PRODUCT CODE
                              </TableCell>
                            )}

                            <TableCell
                              style={{
                                backgroundColor: configure.primary_table_color,
                                color: configure.primary_table_text_color,
                              }}
                            >
                              PRODUCT DESCRIPTION
                            </TableCell>
                            {visibleColumns.some(
                              (column) => column.id === "projected_quantity"
                            ) && (
                              <TableCell
                                style={{
                                  backgroundColor:
                                    configure.primary_table_color,
                                  color: configure.primary_table_text_color,
                                }}
                                align="center"
                              >
                                PROJECTED QUANTITY
                              </TableCell>
                            )}
                            {visibleColumns.some(
                              (column) => column.id === "projected_quantity"
                            ) && (
                              <TableCell
                                style={{
                                  backgroundColor:
                                    configure.primary_table_color,
                                  color: configure.primary_table_text_color,
                                }}
                                align="center"
                              >
                                PROJECTED QUANTITY UNIT
                              </TableCell>
                            )}
                            {visibleColumns.some(
                              (column) => column.id === "destination"
                            ) && (
                              <TableCell
                                style={{
                                  backgroundColor:
                                    configure.primary_table_color,
                                  color: configure.primary_table_text_color,
                                }}
                                align="center"
                              >
                                DESTINATION
                              </TableCell>
                            )}
                            {visibleColumns.some(
                              (column) => column.id === "minimum_order_quantity"
                            ) && (
                              <TableCell
                                style={{
                                  backgroundColor:
                                    configure.primary_table_color,
                                  color: configure.primary_table_text_color,
                                }}
                                align="center"
                              >
                                MINIMUM ORDER QUANTITY
                              </TableCell>
                            )}
                            {visibleColumns.some(
                              (column) => column.id === "minimum_order_quantity"
                            ) && (
                              <TableCell
                                style={{
                                  backgroundColor:
                                    configure.primary_table_color,
                                  color: configure.primary_table_text_color,
                                }}
                                align="center"
                              >
                                MINIMUM ORDER QUANTITY UNIT
                              </TableCell>
                            )}
                            {visibleColumns.some(
                              (column) => column.id === "pickup_price"
                            ) && (
                              <TableCell
                                style={{
                                  backgroundColor:
                                    configure.primary_table_color,
                                  color: configure.primary_table_text_color,
                                }}
                                align="center"
                              >
                                PICKUP PRICE
                              </TableCell>
                            )}
                            {visibleColumns.some(
                              (column) => column.id === "pickup_price"
                            ) && (
                              <TableCell
                                style={{
                                  backgroundColor:
                                    configure.primary_table_color,
                                  color: configure.primary_table_text_color,
                                }}
                                align="center"
                              >
                                PICKUP PRICE UNIT
                              </TableCell>
                            )}

                            {visibleColumns.some(
                              (column) => column.id === "price_per_unit"
                            ) && (
                              <TableCell
                                style={{
                                  backgroundColor:
                                    configure.primary_table_color,
                                  color: configure.primary_table_text_color,
                                }}
                                align="center"
                              >
                                PRICE PER UNIT
                              </TableCell>
                            )}
                            {visibleColumns.some(
                              (column) => column.id === "price_per_unit"
                            ) && (
                              <TableCell
                                style={{
                                  backgroundColor:
                                    configure.primary_table_color,
                                  color: configure.primary_table_text_color,
                                }}
                                align="center"
                              >
                                PRICE UNIT (UM)
                              </TableCell>
                            )}
                            {visibleColumns.some(
                              (column) => column.id === "tax_code"
                            ) && (
                              <TableCell
                                style={{
                                  backgroundColor:
                                    configure.primary_table_color,
                                  color: configure.primary_table_text_color,
                                }}
                                align="center"
                              >
                                TAX CODE
                              </TableCell>
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {state.product_list?.map((value, index) => {
                            return (
                              <TableRow>
                                {visibleColumns.some(
                                  (column) => column.id === "code"
                                ) && (
                                  <TableCell align="left  ">
                                    {value.code}
                                  </TableCell>
                                )}
                                <TableCell align="left">
                                  {value.product_description}
                                </TableCell>
                                {visibleColumns.some(
                                  (column) => column.id === "projected_quantity"
                                ) && (
                                  <TableCell align="left">
                                    <Field
                                      id={"projected_quantity-" + index}
                                      name={"projected_quantity-" + index}
                                      label=""
                                      component={InputField}
                                      showLabel={false}
                                      type="number"
                                      value={value.description}
                                      onChange={(e) => {
                                        request.onChangeSelectedProduct(
                                          e,
                                          index
                                        );
                                      }}
                                    />
                                  </TableCell>
                                )}
                                {visibleColumns.some(
                                  (column) => column.id === "projected_quantity"
                                ) && (
                                  <TableCell align="left">
                                    <Field
                                      id={"projected_quantity_unit-" + index}
                                      name={"projected_quantity_unit-" + index}
                                      label=""
                                      options={request?.unit_of_measurements}
                                      getOptionLabel={(option) =>
                                        option?.description
                                          ? option?.description
                                          : ""
                                      }
                                      required={true}
                                      component={ComboBox}
                                      showLabel={false}
                                      onChangeHandle={(e, newValue) => {
                                        if (newValue?.description) {
                                          request.onSelectUOM(
                                            e,
                                            newValue,
                                            index
                                          );
                                        }
                                      }}
                                    />
                                  </TableCell>
                                )}
                                {visibleColumns.some(
                                  (column) => column.id === "destination"
                                ) && (
                                  <TableCell align="left">
                                    <Field
                                      id={"destination-" + index}
                                      name={"destination-" + index}
                                      label=""
                                      component={InputField}
                                      showLabel={false}
                                      value={value.description}
                                      onChange={(e) => {
                                        request.onChangeSelectedProduct(
                                          e,
                                          index
                                        );
                                      }}
                                    />
                                  </TableCell>
                                )}
                                {visibleColumns.some(
                                  (column) =>
                                    column.id === "minimum_order_quantity"
                                ) && (
                                  <TableCell align="left">
                                    <Field
                                      id={"minimum_order_quantity-" + index}
                                      name={"minimum_order_quantity-" + index}
                                      label=""
                                      component={InputField}
                                      showLabel={false}
                                      type="number"
                                      value={value.description}
                                      onChange={(e) => {
                                        request.onChangeSelectedProduct(
                                          e,
                                          index
                                        );
                                      }}
                                    />
                                  </TableCell>
                                )}
                                {visibleColumns.some(
                                  (column) =>
                                    column.id === "minimum_order_quantity"
                                ) && (
                                  <TableCell align="left">
                                    <Field
                                      id={
                                        "minimum_order_quantity_unit-" + index
                                      }
                                      name={
                                        "minimum_order_quantity_unit-" + index
                                      }
                                      label=""
                                      options={request?.unit_of_measurements}
                                      getOptionLabel={(option) =>
                                        option?.description
                                          ? option?.description
                                          : ""
                                      }
                                      required={true}
                                      component={ComboBox}
                                      showLabel={false}
                                      onChangeHandle={(e, newValue) => {
                                        if (newValue?.description) {
                                          request.onSelectUOM(
                                            e,
                                            newValue,
                                            index
                                          );
                                        }
                                      }}
                                    />
                                  </TableCell>
                                )}
                                {visibleColumns.some(
                                  (column) => column.id === "pickup_price"
                                ) && (
                                  <TableCell align="left">
                                    <Field
                                      id={"pickup_price-" + index}
                                      name={"pickup_price-" + index}
                                      label=""
                                      component={InputField}
                                      showLabel={false}
                                      type="number"
                                      value={value.description}
                                      onChange={(e) => {
                                        request.onChangeSelectedProduct(
                                          e,
                                          index
                                        );
                                      }}
                                    />
                                  </TableCell>
                                )}
                                {visibleColumns.some(
                                  (column) => column.id === "pickup_price"
                                ) && (
                                  <TableCell align="left">
                                    <Field
                                      id={"pickup_price_unit-" + index}
                                      name={"pickup_price_unit-" + index}
                                      label=""
                                      options={request?.unit_of_measurements}
                                      getOptionLabel={(option) =>
                                        option?.description
                                          ? option?.description
                                          : ""
                                      }
                                      required={true}
                                      component={ComboBox}
                                      showLabel={false}
                                      onChangeHandle={(e, newValue) => {
                                        if (newValue?.description) {
                                          request.onSelectUOM(
                                            e,
                                            newValue,
                                            index
                                          );
                                        }
                                      }}
                                    />
                                  </TableCell>
                                )}
                                {visibleColumns.some(
                                  (column) => column.id === "price_per_unit"
                                ) && (
                                  <TableCell align="left">
                                    <Field
                                      id={"price_per_unit-" + index}
                                      name={"price_per_unit-" + index}
                                      label=""
                                      component={InputField}
                                      showLabel={false}
                                      type="number"
                                      value={value.description}
                                      onChange={(e) => {
                                        request.onChangeSelectedProduct(
                                          e,
                                          index
                                        );
                                      }}
                                    />
                                  </TableCell>
                                )}
                                {visibleColumns.some(
                                  (column) => column.id === "price_per_unit"
                                ) && (
                                  <TableCell align="left">
                                    <Field
                                      id={"price_unit-" + index}
                                      name={"price_unit-" + index}
                                      label=""
                                      options={request?.unit_of_measurements}
                                      getOptionLabel={(option) =>
                                        option?.description
                                          ? option?.description
                                          : ""
                                      }
                                      required={true}
                                      component={ComboBox}
                                      showLabel={false}
                                      onChangeHandle={(e, newValue) => {
                                        if (newValue?.description) {
                                          request.onSelectUOM(
                                            e,
                                            newValue,
                                            index
                                          );
                                        }
                                      }}
                                    />
                                  </TableCell>
                                )}
                                {visibleColumns.some(
                                  (column) => column.id === "tax_code"
                                ) && (
                                  <TableCell align="left">
                                    <Field
                                      id={"tax_code-" + index}
                                      name={"tax_code-" + index}
                                      label=""
                                      options={request?.value_added_tax}
                                      getOptionLabel={(option) =>
                                        option?.description
                                          ? option?.description
                                          : ""
                                      }
                                      required={true}
                                      component={ComboBox}
                                      showLabel={false}
                                      onChangeHandle={(e, newValue) => {
                                        if (newValue?.description) {
                                          request.onSelectUOM(
                                            e,
                                            newValue,
                                            index
                                          );
                                        }
                                      }}
                                    />
                                  </TableCell>
                                )}
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
                        <ButtonComponent
                          stx={configure.default_button}
                          iconType="delete"
                          type="button"
                          fullWidth={true}
                          children={"Remove Product"}
                          click={request.onClickRemoveItemProductList}
                        />
                        <ButtonComponent
                          stx={configure.default_button}
                          iconType="update"
                          type="button"
                          fullWidth={true}
                          children={"Edit Column"}
                          click={request.onClickOpenColumnListModal}
                        />
                      </ButtonGroup>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TableContainer
                      sx={{
                        maxHeight: screenHeight - 300,
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
                              No.
                            </TableCell>
                            <TableCell
                              style={{
                                backgroundColor: configure.primary_table_color,
                                color: configure.primary_table_text_color,
                              }}
                            >
                              Note Description
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {state?.notes.map((value, index) => {
                            return (
                              <TableRow>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
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
                                    showLabel={false}
                                  />
                                </TableCell>
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
                </Grid>
              </CardContent>
            </Card>
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
