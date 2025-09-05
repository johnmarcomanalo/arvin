import {
Grid,
Stack,
Typography,
Box,
Divider
} from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
//component
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
//hoooks and configuration
import configure from "apps/configure/configure.json";
import { Constants } from "reducer/Contants";
import swal from "sweetalert";
import { decryptaes } from "utils/LightSecurity";
import { putCheckMonitoring } from "../../actions/CheckMonitoringAction";
import CheckMonitoringHooks from "../../hooks/CheckMonitoringHooks";
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
 
    React.useEffect(() => {
      props.initialize({
        modified_by: account_details?.code,
        code: details?.code,
        check_number: details?.check_number,
        check_date: details?.check_date,
        check_amount: details?.check_amount, 
        bank_description: details?.bank_description,
        bank_name: details?.bank_description,
        bank_branch: details?.bank_branch, 
        remarks: details?.remarks,
        account_number: details?.account_number,
        crpr: details?.prefix_crpr,
        subsection_code: details?.subsection_code,
        card_name: details?.card_name,
        card_code: details?.card_code,
        request_status: details?.request_status,
        sales_invoice:(details?.advance_payment==1)?'ADVANCE PAYMENT':details?.sales_invoice,
        dr_number: details?.dr_number,
        check_status: details?.check_status,
        rejected_reference: details?.rejected_reference,
      }); 
    }, []);
    
    return (
      <React.Fragment> 
         <form autoComplete="off" onSubmit={props.handleSubmit}> 
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} >
                <Grid container spacing={1}>  
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                          <Field
                            disabled={true}
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
                            disabled={true}
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
                            disabled={true}
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
                            disabled={true}
                            id="account_number"
                            name="account_number"
                            label="Account Number"
                            type="number"
                            component={InputField}
                          />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                          <Field
                            disabled={true}
                            id="bank_name"
                            name="bank_name"
                            label="Bank Name"
                            type="text"
                            component={InputField}
                          />
                      </Grid>
                      {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                          <Field 
                              id="bank_name"
                              name="bank_name"
                              label="Bank Name"
                              options={check?.banks.phbanks}
                              getOptionLabel={(option) =>
                                option?.name ? option?.name : details?.bank_description
                              }
                              required={true}
                              component={ComboBox}
                              onChangeHandle={(e, newValue) => {
                                if (newValue?.name) {
                                  props.change("bank_description", newValue.name);
                                }
                              }}
                          /> 
                      </Grid> */}
                       <Grid item xs={12} sm={12} md={12} lg={12}>
                          <Field
                          disabled={true}
                            id="bank_branch"
                            name="bank_branch"
                            label="Branch"
                            type="text"
                            component={InputField}
                            required={true}
                          />
                      </Grid>
                     
                </Grid>
            </Grid>
            <Grid  item xs={12} sm={12} md={6} lg={6}>  
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Field
                            disabled={true}
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
                        <Field
                            id="sales_invoice"
                            name="sales_invoice"
                            label="Sale Invoice"
                            type="text"
                            component={InputField}
                            required={true}
                            disabled={true}
                        />
                  </Grid>  
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Field
                            id="check_status"
                            name="check_status"
                            label="Check Status"
                            type="text"
                            component={InputField}
                            required={true}
                            disabled={true}
                        />
                  </Grid> 
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Field
                        disabled={true}
                        id="remarks"
                        name="remarks"
                        label="Remarks"
                        type="text"
                        component={InputField}
                        multiline={true} 
                        linerow={2}
                      />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Field
                        disabled={true}
                        id="rejected_reference"
                        name="rejected_reference"
                        label="Rejected Reference"
                        type="text"
                        component={InputField}
                      />
                  </Grid>
                  {/* <Grid item xs={12} sm={12} md={12} lg={12}>
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
                    </Grid> */}
                </Grid> 
            </Grid> 
            <Grid  item xs={12} sm={12} md={12} lg={12}>
              <Typography fontWeight={'bold'} my={2} style={{ fontSize: '13px' }}>Status History</Typography>
              <Grid container spacing={3} alignItems="center" justifyContent="left">
              {details.history.map((val, i) => {
                  return (
                   <>
                     <Grid item key={i}>
                      <Box
                        border={0.1}
                        borderColor="black"
                        borderRadius={2}
                        p={1}
                        textAlign="center"
                        width={150}
                      >
                        <Typography fontWeight={'bold'} style={{ fontSize: '13px' }}>{val.check_status}</Typography>
                        <Typography style={{ fontSize: '10px' }}>{val.created_at} </Typography>
                      </Box>
                    </Grid>
                    {i !== details.history.length - 1 && (
                      <Grid item>
                        <Divider orientation="horizontal" sx={{ width: 50, borderBottomWidth: 3 }} />
                      </Grid>
                    )}
                   </>
                  );
                })} 
          
              </Grid>
            </Grid>
        </Grid> 
        </form>
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

    