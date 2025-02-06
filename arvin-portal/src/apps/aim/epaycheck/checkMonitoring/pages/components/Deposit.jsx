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
import { Constants } from "../../../../../../reducer/Contants";
import { useTheme } from "@mui/material/styles";
import * as React from "react";  
import { connect } from "react-redux";
import { change, Field, formValueSelector, reduxForm, reset } from "redux-form"; 
  
//component
import TableComponent from "../../../../../../components/table/Table"; 
import InputField from "../../../../../../components/inputFIeld/InputField";
import SearchField from "../../../../../../components/inputFIeld/SearchField";
import ButtonComponent from "../../../../../../components/button/Button";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
//hoooks and configuration
import DepositHooks from "../../hooks/DepositHooks";
import configure from "../../../../../configure/configure.json";
import swal from "sweetalert";
import {
getCheckDetails,
postCheckDetailsStatus,
} from "../../actions/CheckMonitoringAction" 
let formName = "Deposit"; 
let Deposit = (props) => { 
    const { ...deposit } = DepositHooks(props);
    return (
      <React.Fragment> 
            <form autoComplete="off" onSubmit={props.handleSubmit(deposit.submit)}>
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
                          id="bank_deposit"
                          name="bank_deposit"
                          label="Bank Deposit"
                          options={deposit?.bank_accounts}
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
})(Deposit);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.EpayCheckReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);

    