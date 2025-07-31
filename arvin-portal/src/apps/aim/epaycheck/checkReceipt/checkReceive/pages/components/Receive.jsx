import {
  Grid,
  Stack
} from "@mui/material";

import * as React from "react";
import { connect } from "react-redux";
import { change, Field, formValueSelector, reduxForm } from "redux-form";
  
//component
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
//hoooks and configuration
import configure from "apps/configure/configure.json";
import moment from "moment";
import CheckStatusHooks from "../../../checkMonitoring/hooks/CheckStatusHooks";
let formName = "Receive"; 
let Receive = (props) => { 
    const { ...check } = CheckStatusHooks(props);
    props.dispatch(change(formName, "receive_date", moment(new Date()).format("YYYY-MM-DD")));
    return (
      <React.Fragment> 
            <form autoComplete="off" onSubmit={props.handleSubmit(check.submit)}>
              <Grid container spacing={2}> 
                  <Grid  item xs={12} sm={12} md={12} lg={12}>
                    <Field
                        id="deposited_date"
                        name="deposited_date"
                        component={InputField}
                        type="date"
                        label="Deposit Date"
                        size="small"
                        disabled={true} 
                        fullWidth
                      />
                  </Grid>  
                  <Grid  item xs={12} sm={12} md={12} lg={12}> 
                      <Field
                          id="deposited_bank"
                          name="deposited_bank"
                          label="Bank Deposit"
                          options={check?.bank_accounts}
                          getOptionLabel={(option) =>
                          option?.description ? option?.description: ""
                          } 
                          required={true}
                          component={ComboBox}
                          onChangeHandle={(e, newValue) => {  
                          }}
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
})(Receive);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.EpayCheckReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);

    