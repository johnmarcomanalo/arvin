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

import { useDispatch, useSelector } from "react-redux";
import { Constants } from "reducer/Contants";
import { useTheme } from "@mui/material/styles";
import * as React from "react";  
import { connect } from "react-redux";
import { change, Field, formValueSelector, reduxForm, reset } from "redux-form"; 
  
//component
import TableComponent from "components/table/Table"; 
import InputField from "components/inputFIeld/InputField";
import SearchField from "components/inputFIeld/SearchField";
import ButtonComponent from "components/button/Button";
import ComboBox from "components/autoComplete/AutoComplete";
//hoooks and configuration
import CheckStatusHooks from "../../hooks/CheckStatusHooks";
import configure from "apps/configure/configure.json";
import swal from "sweetalert";
import {
getCheckDetails,
postCheckDetailsStatus,
} from "../../actions/CheckMonitoringAction" 
import moment from "moment";
let formName = "Deposit"; 
let Deposit = (props) => { 
    const { ...check } = CheckStatusHooks(props);
    props.dispatch(change(formName, "deposited_date", moment(new Date()).format("YYYY-MM-DD"))); 
    props.dispatch(change(formName, "status", "DEPOSITED")); 
    return (
      <React.Fragment> 
            <form autoComplete="off" onSubmit={props.handleSubmit(check.submit)}>
              <Grid container spacing={2}> 
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
})(Deposit);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.EpayCheckReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);

    