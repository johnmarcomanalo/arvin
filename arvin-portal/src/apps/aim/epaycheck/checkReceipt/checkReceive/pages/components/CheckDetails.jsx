import { 
  Grid,
  Stack,
  Card,
  Divider,
  IconButton, 
  Input,  
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
  CardContent,
  ButtonGroup,
  Select
  } from "@mui/material"; 
  import { useTheme } from "@mui/material/styles";
  import * as React from "react";  
  import { connect } from "react-redux";
  import { change, Field, formValueSelector, reduxForm, reset } from "redux-form"; 
  //component
  import TableComponent from "../../../../../../../components/table/Table"; 
  import InputField from "../../../../../../../components/inputFIeld/InputField";
  import SearchField from "../../../../../../../components/inputFIeld/SearchField";
  import ButtonComponent from "../../../../../../../components/button/Button";
  import ComboBox from "../../../../../../../components/autoComplete/AutoComplete";
  import Page from "../../../../../../../components/pagination/Pagination";
  //hoooks and configuration
  import CheckMonitoringHooks from "../../hooks/CheckReceiveHooks";
  import configure from "../../../../../configure/configure.json";
  import swal from "sweetalert";
  import { putCheckMonitoring } from "../../actions/CheckReceivedAction"; 
  import { decryptaes } from "../../../../../../../utils/LightSecurity";
  import { Constants } from "../../../../../../../reducer/Contants"
  let formName = "CheckDetails";

  const submit = async (values, dispatch, props) => {
    try {
      const response = await dispatch(putCheckMonitoring(values));
      await dispatch({
        type: Constants.ACTION_LOADING,
        payload: {
          loading: false,
        },
      });

      let decrypted = decryptaes(response?.data) 
      
      await dispatch({
        type: Constants.ACTION_EPAY_CHECK,
        payload: {
          refresh: !props.refresh,
          editModal: false,
        },
      });
      swal(decrypted.title, decrypted.message, decrypted.status);
    } catch (error) {
      console.log(error);
    }
  };
  
  let CheckDetails = (props) => {
    const { ...check }    = CheckMonitoringHooks(props);
    const account_details = check.account_details; 
    const details         = props.details;
    console.log("modified_by",details);
    
    React.useEffect(() => {
      props.initialize({
        modified_by: account_details?.code,
        code: details?.code,
        check_number: details?.check_number,
        check_date: details?.check_date,
        check_amount: details?.check_amount, 
        bank_description: details?.bank_description,
        bank_branch: details?.bank_branch, 
        bank_address: details?.bank_address,
        advance_payment: details?.advance_payment,
        crpr: details?.crpr,
        subsection_code: details?.subsection_code,
        card_name: details?.card_name,
        card_code: details?.card_code
      }); 
    }, []);
    
    return (
      <React.Fragment> 
        <Grid container spacing={2}>  
            <Grid  item xs={12} sm={12} md={12} lg={12}>
           <form autoComplete="off" onSubmit={props.handleSubmit}>
                <Typography
                  align="left"
                  gutterBottom
                  sx={{ color: configure.dark_gray_color, fontSize: 12, }}
                >
                  Ensure all the required fields are correctly filled out
                </Typography>
                <Grid container spacing={1}>  
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Field
                        id="check_number"
                        name="check_number"
                        label="Check Number"
                        type="number"
                        value={details?.check_number}
                        component={InputField}
                        required={true}
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Field
                        id="check_date"
                        name="check_date"
                        label="Check Date"
                        type="date"
                        component={InputField}
                        required={true}
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Field
                        id="check_amount"
                        name="check_amount"
                        label="Amount"
                        type="number"
                        component={InputField}
                        required={true}
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Field
                        id="bank_description"
                        name="bank_description"
                        label="Bank"
                        type="text"
                        component={InputField}
                        required={true}
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Field
                        id="bank_branch"
                        name="bank_branch"
                        label="Branch"
                        type="text"
                        component={InputField}
                        required={true}
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Field
                        id="bank_address"
                        name="bank_address"
                        label="Bank Address"
                        type="text"
                        component={InputField}
                        required={true}
                      />
                  </Grid> 
                  {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Field
                            id="advance_payment"
                            name="advance_payment"
                            label="Advance Payment"
                            options={check.epay_selection}
                            getOptionLabel={(option) =>
                              option?.description ? option?.description : details?.advance_payment
                            }
                            required={true}
                            disabled={true}
                            readOnly={true}
                            component={ComboBox}
                        />
                  </Grid> */}
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Field
                            id="crpr"
                            name="crpr"
                            label="Document (CR/PR)"
                            type="text"
                            component={InputField}
                            required={true}
                        />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}> 
                  <Field
                            id="card_name"
                            name="card_name"
                            label="Customer"
                            type="text"
                            component={InputField}
                            disabled={true}
                        />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Field
                            id="card_code"
                            name="card_code"
                            label="Customer Code"
                            type="text"
                            component={InputField}
                            required={true}
                            disabled={true}
                        />
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
                          iconType="update"
                          type="submit"
                          fullWidth={true}
                          children={"Submit"}
                        />
                      </Stack>
                    </Grid>
                </Grid>
            </form>
            </Grid>  
        </Grid> 
      </React.Fragment>
    );
}

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(CheckDetails);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.EpayCheckReducer.refresh;
  return {refresh};
}, {})(ReduxFormComponent);

    