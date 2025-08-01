import {
  Grid,
  Stack,
  useMediaQuery,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import { useTheme } from "@mui/material/styles";
import * as React from "react";  
import { change, Field, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
//component
import TableComponent from "../../../../../../components/table/Table"; 
import SearchField from "../../../../../../components/inputFIeld/SearchField";
import InputField from "../../../../../../components/inputFIeld/InputField";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete"; 
import BankCheckCounterHooks from "../hooks/BankCheckCounterHooks"; 
import moment from "moment";
import configure from "../../../../../configure/configure.json";  
let formName = "BankCheckCounter"
const BankCheckCounter = (props) => {
  const { ...check } = BankCheckCounterHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
       <Grid container spacing={1}>  
          <Grid item xs={12} sm={12} md={12} lg={12}> 
                <Stack
                  direction={matches ? "row" : "column"}
                  alignItems={matches ? "center" : "flex-start"}
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Grid item xs={12} sm={6} md={2} lg={2}>
                    {/* <SearchField value={check.search} onChange={check.onChangeSearch} textHidden={false}/> */}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={3} md={3} lg={3}>
                        <Field
                          id="filter_date_start"
                          name="filter_date_start"
                          label="Start Date"
                          type="date"
                          component={InputField}
                          onChange={(event) => {
                            // Get the date from the input event
                            const selectedDate = event.target.value;
                            if (selectedDate) {
                              // Pass the selected date to your handler
                              check.onChangeFilterStart(new Date(selectedDate));
                            }
                          }}
                          // disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={3} md={3} lg={3}>
                        <Field
                          id="filter_date_end"
                          name="filter_date_end"
                          label="End Date"
                          type="date"
                          component={InputField}
                          onChange={(event) => {
                            // Get the date from the input event
                            const selectedDate = event.target.value;
                            if (selectedDate) {
                              // Pass the selected date to your handler
                              check.onChangeFilterEnd(new Date(selectedDate));
                            }
                          }}
                          // disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={3} md={3} lg={3}>
                        <Field
                          id="filter_user_access_organization_rights"
                          name="filter_user_access_organization_rights"
                          label="Warehouse"
                          options={check?.access.user_access_organization_rights}
                          getOptionLabel={(option) =>
                            option?.description ? option?.description : ""
                          }
                          component={ComboBox}
                          onChangeHandle={(e, newValue) => {
                            if (newValue?.description) { 
                              check.onChangeFilteSubsection(newValue?.code);
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3} md={3} lg={3}>
                        <Field
                          id="filter_bank"
                          name="filter_bank"
                          label="Company Bank"
                          options={check?.bank_accounts}
                          getOptionLabel={(option) =>
                            option?.description ? option?.description : ""
                          }
                          component={ComboBox}
                          onChangeHandle={(e, newValue) => {
                            if (newValue?.description) { 
                              check.onChangeFilteSubsection(newValue?.code);
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Stack> 
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>  
          </Grid>
        </Grid>
    </React.Fragment>
  );
}

const ReduxFormComponent = reduxForm({
  form: formName,
})(BankCheckCounter);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = true // state.QuotationReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);