import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  Checkbox,
  Box,
  Chip
} from "@mui/material";
import React, { useState } from 'react';
import { connect } from "react-redux";
import { change, Field, formValueSelector, reduxForm } from "redux-form";
//component
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import CheckBoxComponent from "components/checkbox/CheckBox";
import InputField from "components/inputFIeld/InputField";
import Modal from "components/modal/Modal";

//hoooks and other  configuration
import { AddCircle, Upload } from "@mui/icons-material";
import configure from "apps/configure/configure.json";
import CheckCollectionHooks from "../hooks/CheckCollectionHooks";
import CheckCustomer from "./components/CheckCustomer";
import InvoiceList from "./components/InvoiceList";
import ReceiptDetails from "./components/ReceiptDetails"; 
let formName = "CheckCollection";
let CheckCollection = (props) => {
  const { ...check }    = CheckCollectionHooks(props);
  const state           = check.state;
  const account         = check.account_details;
  const amount          = check.state.invoice_list.reduce((a, b) => a + parseFloat(b.doctotal), null)
  const access          = check.access;
  const matches         = useMediaQuery("(min-width:600px)"); 
  const borderColor     = "#ffcccc"
  props.dispatch(change(formName, "invoice_list", state?.invoice_list));
  props.dispatch(change(formName, "subsection_code", account.subsection_code));
  props.dispatch(change(formName, "amount", amount)); 
  return (
    <React.Fragment>
        <Modal
            open={check.viewModal}
            fullScreen={matches ? false : true}
            title={"Invoice Search"}
            size={"xl"}
            action={undefined}
            handleClose={check.onClickCloseViewModal}
          >
           <InvoiceList onSelectItem={check.onSelectItem} />
        </Modal>
        <Modal
            open={check.viewModal2}
            fullScreen={matches ? false : true}
            title={"Print Receipt Details"}
            size={"lg"}
            action={undefined}
            handleClose={check.onClickCloseReceiptDetailsModal}
        >
           <ReceiptDetails format_list={check.dataListFormat}/>
        </Modal>
        <Modal
            open={check.viewModal3}
            fullScreen={matches ? false : true}
            title={"Customer Details"}
            size={"lg"}
            action={undefined}
            handleClose={check.onClickCloseCustomerModal}
        >
          <CheckCustomer/>
        </Modal>
        <form onSubmit={props.handleSubmit(check.submit)} autoComplete="off">
        <Card
              sx={{
                boxShadow: configure.box_shadow,
              }}
            >
            <CardContent >
               <Stack
                  direction={matches ? "row" : "column"}
                  alignItems={matches ? "center" : "flex-start"}
                  justifyContent="space-between"
                  spacing={1}
                >
                  <div>
                  <Typography
                    variant="h6"
                    align="left"
                    sx={{ color: configure.primary_color }}
                  >
                    Check Details
                  </Typography>
                  <Typography
                    align="left"
                    gutterBottom
                    sx={{ color: configure.dark_gray_color, fontSize: 12 }}
                  >
                    Ensure all the required fields are correctly filled out
                  </Typography>
                  </div>
                
                </Stack> 
                <Grid container spacing={2}>  
                <Grid item xs={12} sm={12} md={12} lg={12}>
                <Stack
                  direction={matches ? "row" : "column"}
                  alignItems={matches ? "center" : "flex-start"}
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Field
                    name="advance_payment"
                    component={CheckBoxComponent}
                    checked={state.advancePayment}
                    onChange={check.handleCheckboxChange}
                    type="checkbox" 
                    label="Advance Payment" 
                  />
                  <ButtonComponent
                      stx={configure.default_button}
                      iconType="export"
                      type="button"
                      fullWidth={true}
                      children={"Print CR/PR"}
                      click={check.onClickOpenReceiptDetailsModal}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>  
                    <Field
                      id="card_name"
                      name="card_name"
                      label="Customer"
                      type="text"
                      component={InputField}
                      required={true}
                      readOnly={true}
                      onClick={check.onClickOpenCustomerModal}
                      borderColor={borderColor}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Field
                          id="card_code"
                          name="card_code"
                          label="Customer Code"
                          type="text"
                          component={InputField}
                          required={true}
                          readOnly={true}
                          onClick={check.onClickOpenCustomerModal}
                          borderColor={borderColor}
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Field
                        id="check_number"
                        name="check_number"
                        label="Check Number"
                        type="number"
                        component={InputField}
                        required={true}
                        borderColor={borderColor}
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Field
                        id="check_date"
                        name="check_date"
                        label="Check Date"
                        type="date"
                        component={InputField}
                        required={true}
                        borderColor={borderColor}
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Field
                        id="check_amount"
                        name="check_amount"
                        label="Check Amount"
                        type="number"
                        component={InputField}
                        required={true}
                        borderColor={borderColor}
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Field
                            key={props.refresh}
                            id="bank_name"
                            name="bank_name"
                            label="Bank Name"
                            options={check?.banks.phbanks}
                            getOptionLabel={(option) =>
                              option?.name ? option?.name : ""
                            }
                            required={true}
                            component={ComboBox}
                            onChangeHandle={(e, newValue) => {
                              if (newValue?.name) {
                                props.change("bank_description", newValue.name);
                              }
                            }}
                            disabled={true}
                            borderColor={borderColor}
                        /> 
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Field
                        id="bank_branch"
                        name="bank_branch"
                        label="Branch"
                        type="text"
                        component={InputField}
                        required={true}
                        borderColor={borderColor}
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Field
                          id="account_number"
                          name="account_number"
                          label="Account Number"
                          type="number"
                          component={InputField}
                          required={true}
                          borderColor={borderColor}
                      />
                  </Grid> 
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Field
                          id="crpr"
                          name="crpr"
                          label="Document Number (CR/PR)"
                          type="number"
                          component={InputField}
                          required={true}
                          borderColor={borderColor}
                      />
                  </Grid> 
                  <Grid item xs={12} sm={12} md={6} lg={6}> 
                      <Field
                        id="remarks"
                        name="remarks"
                        label="Remarks"
                        multiline={true}
                        height={100} 
                        component={InputField}
                      />
                  </Grid>
                  {(state.advancePayment) && (
                    <>
                       <Grid item xs={12} sm={12} md={6} lg={6}>
                          <Field
                               key={props.refresh}
                               id="form_description"
                               name="form_description"
                               label="Form Description"
                               options={check?.form_type}
                               getOptionLabel={(option) =>
                                 option?.description ? option?.description : ""
                               }
                               required={state.advancePayment}
                               component={ComboBox}
                               onChangeHandle={(e, newValue) => {
                                 if (newValue?.value) {
                                   props.change("document_type", newValue.value);
                                 }
                               }}
                               borderColor={borderColor}
                          />
                      </Grid> 
                      <Grid item xs={12} sm={12} md={6} lg={6}>  
                          <Field 
                           id="company"
                           name="company"
                           label="Company (Pay to the order of)"
                           options={check?.bank_accounts}
                           getOptionLabel={(option) =>
                             option?.description ? option?.description : ""
                           }
                           required={state.advancePayment}
                           component={ComboBox}
                           onChangeHandle={(e, newValue) => {
                             if (newValue?.description) {
                               props.change("prefix", newValue.prefix);
                             }
                           }}
                           borderColor={borderColor}
                          />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Stack
                    direction={matches ? "row" : "column"}
                    alignItems={matches ? "center" : "flex-start"}
                    justifyContent="space-between"
                    spacing={1}
                  >
                  <div>
                    <Typography
                        align="left"
                        gutterBottom
                        sx={{ color: configure.primary_color }}
                      >
                        Selected Invoice
                      </Typography>
                      <Typography
                        align="left"
                        gutterBottom
                        sx={{ color: configure.dark_gray_color, fontSize: 12 }}
                      >
                      Ensure all invoice details are correct before submission
                      </Typography>
                  </div> 
                  <Button
                      component="label"
                      role={undefined}
                      variant="contained" 
                      startIcon={<Upload />}
                      sx={ configure.default_button }
                      disabled={true} 
                    >
                      Upload Check 
                    </Button>
                </Stack>
                     
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>  
                      
                      <TableContainer
                        sx={{
                          // maxHeight: screenHeight - 300,
                          whiteSpace: "nowrap",
                          overflowX: "auto",
                          marginBottom: 2,
                        
                        }}
                      >
                        <Table size="small">
                          <TableHead>
                            <TableRow> 
                              {check.column_headers.map((header, index) => (
                                <TableCell key={index} align={header.align} style={{ backgroundColor: configure.primary_table_color, color: configure.primary_table_text_color, }}>
                                  {header.label}
                                </TableCell>
                              ))}
                            </TableRow> 
                          </TableHead>
                          <TableBody>
                            {check?.state.invoice_list?.length > 0 ? (
                              check.state.invoice_list.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell align="left" sx={{ pt: 0, pr: 0, pb: 0, pl: 1 }}>
                                    <Checkbox 
                                      checked={row.tag}  // Ensure row.tag is correctly mapped 
                                      onChange={() => check.onChangeTag(index)}  // Call function directly
                                      size="medium"
                                      sx={{ height: "10px", ml: 2, p: 0 }}
                                    />
                                  </TableCell>
                                  <TableCell>{row?.bp_payment_term}</TableCell>
                                  <TableCell>{row?.docno}</TableCell>
                                  <TableCell>{row?.docdate}</TableCell>
                                  <TableCell>{row?.drno}</TableCell>
                                  <TableCell>{row?.sino}</TableCell>
                                  <TableCell>{row?.form}</TableCell>
                                  <TableCell>{row?.vatsum}</TableCell>
                                  <TableCell>{row?.doctotal}</TableCell>
                                </TableRow>
                              )) 
                            ) : (
                              <TableRow>
                                <TableCell colSpan={9} align="center">Data not available</TableCell>
                              </TableRow>
                            )} 
                            <TableRow>
                              <TableCell colSpan={7}></TableCell>
                              <TableCell  align="left">TOTAL</TableCell>
                              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                                {Number(amount).toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                              </TableCell>
                            </TableRow>
                          </TableBody> 
                        </Table> 
                      </TableContainer> 
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>  
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="flex-end" 
                    >
                      <ButtonGroup
                        disableElevation
                        aria-label="Disabled button group"
                      >
                         <Button 
                            variant="contained" 
                            startIcon={<AddCircle />}
                            sx={ configure.default_button } 
                            onClick={check.onClickOpenViewModal} 
                            disabled={state.advancePayment}
                          >
                            Add Invoice 
                          </Button>
                          {/* <ButtonComponent 
                            disabled={advancePayment}
                            stx={configure.default_button }
                            iconType="add"
                            type="button" 
                            fullWidth={true}
                            children={""}
                            click={check.onClickOpenViewModal}
                          /> */}
                          <ButtonComponent  
                            stx={configure.default_button }
                            iconType="delete"
                            type="button"
                            fullWidth={true}
                            children={"Remove"}
                            click={check.onClickRemoveInvoiceList}
                          />
                        </ButtonGroup>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                        spacing={2}
                        sx={{ marginTop: 2 }}
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
        </form>
    </React.Fragment>
  );
  }

  const ReduxFormComponent = reduxForm({
    form: formName,
  })(CheckCollection);
  const selector = formValueSelector(formName);
  export default connect((state) => {
     const refresh =  state.EpayCheckReducer.refresh; 
    return { refresh };
  }, {})(ReduxFormComponent);
  
  