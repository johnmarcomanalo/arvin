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
  
import { connect } from "react-redux";
import React,{ useState, useEffect } from "react"; 
import { change, Field, formValueSelector, reduxForm, reset } from "redux-form"; 
//component
import TableComponent from "components/table/Table"; 
import InputField from "components/inputFIeld/InputField";
import SearchField from "components/inputFIeld/SearchField";
import ButtonComponent from "components/button/Button";
import ComboBox from "components/autoComplete/AutoComplete";
//hoooks and configuration 
import configure from "apps/configure/configure.json"; 
import CheckStatusHooks from "../../hooks/CheckStatusHooks";
import moment from "moment";
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

    