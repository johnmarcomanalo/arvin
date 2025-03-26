import {
Grid,
Stack,
Typography
} from "@mui/material";
  
import React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
//component
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
//hoooks and configuration 
import configure from "apps/configure/configure.json";
let formName = "RejectClose";
let RejectClose = (props) => {
    return (
      <React.Fragment> 
            <form autoComplete="off" onSubmit={props.handleSubmit(props.onClickRejectToClose)}>
              <Grid container spacing={2}> 
                  <Grid  item xs={12} sm={12} md={12} lg={12}> 
                      <Typography
                        align="left"
                        gutterBottom
                        sx={{ color: configure.dark_gray_color, fontSize: 13, }}
                      >
                        Please enter the reference number if a replacement has been made. If the customer chooses to proceed with online banking, kindly provide the control number or online verification number.
                      </Typography>
                  </Grid>
                  <Grid  item xs={12} sm={12} md={12} lg={12}> 
                     <Field
                          id="rejected_reference"
                          name="rejected_reference"
                          label="Reference Number"
                          required={true}
                          type="number"
                          component={InputField}
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
})(RejectClose);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.EpayCheckReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);

    