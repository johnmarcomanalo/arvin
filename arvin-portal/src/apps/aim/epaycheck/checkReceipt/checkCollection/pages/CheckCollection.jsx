import { 
  ButtonGroup,
  CardContent,
  Card,
  Divider,
  Grid, 
  IconButton, 
  Input, 
  Stack,  
  Tab,  
  Table,  
  TableBody,  
  TableCell,  
  TableContainer,  
  TableFooter,  
  TableHead,  
  TableRow,  
  Tooltip,  
  Typography,  
  useMediaQuery,
  Box,
  Button
} from "@mui/material"; 
import { useTheme } from "@mui/material/styles";
import * as React from "react";  
import { connect } from "react-redux";
import { change, Field, formValueSelector, reduxForm, reset } from "redux-form"; 
//component
import ButtonComponent from "components/button/Button";
import ComboBox from "components/autoComplete/AutoComplete";
import Modal from "components/modal/Modal";  
import InputField from "components/inputFIeld/InputField";

//hoooks and other  configuration
import CheckCollectionHooks from "../hooks/CheckCollectionHooks";
import configure from "apps/configure/configure.json";
import InvoiceList from "./components/InvoiceList";
import ReceiptDetails from "./components/ReceiptDetails";
import Customers from "apps/aim/settings/accessrights/customerrights/pages/components/Customers";
import CheckCustomer from "./components/CheckCustomer";
import { CloudUpload, Upload } from "@mui/icons-material";
let formName = "CheckCollection";

let CheckCollection = (props) => {
  const { ...check }    = CheckCollectionHooks(props);
  const state           = check.state;
  const account_details = check.account_details;
  const amount          = check.state.invoice_list.reduce((a, b) => a + parseFloat(b.doctotal), null)
  const access          = check.access;
  const matches         = useMediaQuery("(min-width:600px)"); 
  props.dispatch(change(formName, "invoice_list", state?.invoice_list));
  props.dispatch(change(formName, "subsection_code", account_details.subsection_code));
  props.dispatch(change(formName, "amount", amount));
  return (
    <React.Fragment>
        <Modal
            open={check.viewModal}
            fullScreen={matches ? false : true}
            title={"Invoice Search"}
            size={"lg"}
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
            handleClose={check.onClickCloseAccessCustomerModal}
        >
          <CheckCustomer onClickSelect={check.getCustomerDetails}/>
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
                  <ButtonComponent
                      stx={configure.default_button}
                      iconType="export"
                      type="button"
                      fullWidth={true}
                      children={"Print CR/PR"}
                      click={check.onClickOpenReceiptDetailsModal}
                    />
                </Stack> 
                <Grid container spacing={2}>  
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Field
                        id="check_number"
                        name="check_number"
                        label="Check Number"
                        type="number"
                        component={InputField}
                        required={true}
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
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Field
                        id="check_amount"
                        name="check_amount"
                        label="Amount"
                        type="number"
                        component={InputField}
                        required={true}
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Field
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
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Field
                        id="bank_address"
                        name="bank_address"
                        label="Bank Address"
                        type="text"
                        component={InputField}
                        required={true}
                      />
                  </Grid>
                 
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Field
                            id="advance_payment"
                            name="advance_payment"
                            label="Advance Payment"
                            options={check.epay_selection}
                            getOptionLabel={(option) =>
                            option?.description ? option?.description: ""
                            } 
                            required={true}
                            component={ComboBox}
                            onChangeHandle={(e, newValue) => { 
                             
                            }}
                        />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Field
                            id="crpr"
                            name="crpr"
                            label="Document (CR/PR)"
                            type="text"
                            component={InputField}
                            required={true}
                        />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}> 
                      {/* <Field
                            id="card_name"
                            name="card_name"
                            label="Customer"
                            options={access?.user_access_customer_rights}
                            getOptionLabel={(option) =>
                              option?.description ? option?.description : check?.customer_name
                            }
                            required={true}
                            component={ComboBox}
                            onChangeHandle={(e, newValue) => {
                              if (newValue?.description) {
                                check.GetCustomerDetails(newValue);
                                props.change("card_code", newValue.customer_code);
                              }
                            }}
                        />  */}
                         <Field
                            id="card_name"
                            name="card_name"
                            label="Customer"
                            type="text"
                            component={InputField}
                            required={true}
                            onClick={check.onClickOpenAccessCustomerModal}
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
                        />
                  </Grid>
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
                    tabIndex={-1}
                    startIcon={<Upload />}
                     sx={{...configure.default_button, px:2}}
                    disabled
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
                                <TableCell style={{ backgroundColor: configure.primary_table_color, color: configure.primary_table_text_color, }}>  DOCUMENT NUMBER </TableCell> 
                                <TableCell style={{ backgroundColor: configure.primary_table_color, color: configure.primary_table_text_color, }}>  DOCUMENT DATE </TableCell> 
                                <TableCell style={{ backgroundColor: configure.primary_table_color, color: configure.primary_table_text_color, }}>  SI NUMBER </TableCell> 
                                <TableCell style={{ backgroundColor: configure.primary_table_color, color: configure.primary_table_text_color, }}>  DR NUMBER </TableCell> 
                                <TableCell style={{ backgroundColor: configure.primary_table_color, color: configure.primary_table_text_color, }}>  VAT </TableCell> 
                                <TableCell style={{ backgroundColor: configure.primary_table_color, color: configure.primary_table_text_color, }}>  TOTAL INVOICE </TableCell>
                            </TableRow> 
                          </TableHead>
                          <TableBody>
                            {check?.state.invoice_list?.length > 0 ? (
                              check.state.invoice_list.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell>{row?.docno}</TableCell>
                                  <TableCell>{row?.docdate}</TableCell>
                                  <TableCell>{row?.sino}</TableCell>
                                  <TableCell>{row?.drno}</TableCell>
                                  <TableCell>{row?.vatsum}</TableCell>
                                  <TableCell>{row?.doctotal}</TableCell>
                                </TableRow>
                              )) 
                            ) : (
                              <TableRow>
                                <TableCell colSpan={6} align="center">Data not available</TableCell>
                              </TableRow>
                            )} 
                            <TableRow>
                              <TableCell colSpan={4}></TableCell>
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
                          <ButtonComponent
                            stx={configure.default_button }
                            iconType="add"
                            type="button"
                            fullWidth={true}
                            children={"Add Invoice"}
                            click={check.onClickOpenViewModal}
                          />
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
    const refresh = state.EpayCheckReducer.refresh;
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    return { refresh, customerDetails };
  }, {})(ReduxFormComponent);
  
  