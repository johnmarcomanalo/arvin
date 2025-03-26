import {
  Grid,
  Stack
} from "@mui/material";
  
import React from "react";
import { connect } from "react-redux";
import { change, Field, formValueSelector, reduxForm } from "redux-form";
//component
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
//hoooks and configuration 
import configure from "apps/configure/configure.json";
import moment from "moment";
import CheckStatusHooks from "../../hooks/CheckStatusHooks";
let formName = "Reject";
let Reject = (props) => { 
    const { ...check } = CheckStatusHooks(props);
    props.dispatch(change(formName, "rejected_date", moment(new Date()).format("YYYY-MM-DD"))); 
    props.dispatch(change(formName, "status", "REJECTED")); 
    return (
      <React.Fragment> 
            <form autoComplete="off" onSubmit={props.handleSubmit(check.submit)}>
              <Grid container spacing={2}> 
                  <Grid  item xs={12} sm={12} md={12} lg={12}>
                    <Field
                        id="rejected_date"
                        name="rejected_date"
                        component={InputField}
                        type="date"
                        label="Rejected Date"
                        size="small"
                        disabled={true} 
                        fullWidth
                      />
                  </Grid>   
                   <Grid  item xs={12} sm={12} md={12} lg={12}> 
                      <Field
                          id="rejected_remarks"
                          name="rejected_remarks"
                          label="Remarks"
                          options={check?.reject_remarks}
                          getOptionLabel={(option) =>
                          option?.description ? option?.description: ""
                          } 
                          required={true}
                          component={ComboBox}
                          onChangeHandle={(e, newValue) => {  
                            
                          }}
                      />
                  </Grid>  
                   <Grid  item xs={12} sm={12} md={12} lg={12}> 
                      <Field
                          id="rejected_addtional_remarks"
                          name="rejected_addtional_remarks"
                          label="Addtional Remarks" 
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
            </form>
      </React.Fragment>
    );
}

const ReduxFormComponent = reduxForm({
  form: formName, 
})(Reject);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.EpayCheckReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);

    