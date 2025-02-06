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
  import Page from "../../../../../../components/pagination/Pagination";
  //hoooks and configuration
  import CheckMonitoringHooks from "../../hooks/CheckMonitoringHooks";
  import configure from "../../../../../configure/configure.json";
  let formName = "CheckDetails";
  
  let CheckDetails = (props) => {
    const { ...check } = CheckMonitoringHooks(props);
    const account_details = check.account_details; 
    const check_details   = check.selectedItem;
    
    return (
      <React.Fragment> 
        <Grid container spacing={2}>  
            <Grid  item xs={12} sm={12} md={12} lg={12}>
            <form   autoComplete="off">
               <FormControl size="small" fullWidth>
                    <InputLabel
                      id="demo-simple-select-label"
                      shrink={true}
                    ></InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Age" 
                        // value={check_details.check_status}
                        // onChange={(e) => {
                        //   // check.onUpdateCheckDetails(
                        //   //   row,
                        //   //   e.target.value
                        //   // );
                        // }} 
                    >
                      {check?.status
                        .map((status, key) => (
                          <MenuItem key={key} value={status.description} >
                            {status.description}
                          </MenuItem>
                        ))}

                    </Select>
                  </FormControl>
            </form>
            </Grid>  
        </Grid> 
      </React.Fragment>
    );
}

const ReduxFormComponent = reduxForm({
  form: formName,
})(CheckDetails);
const selector = formValueSelector(formName);
export default connect((state) => {
}, {})(ReduxFormComponent);

    