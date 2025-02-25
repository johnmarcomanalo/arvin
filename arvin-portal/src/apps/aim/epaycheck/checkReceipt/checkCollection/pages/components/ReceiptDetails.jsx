import { 
  Grid,
  Stack,
  Button
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
import CheckCollectionHooks from "../../hooks/CheckCollectionHooks";
import ViewPrintReceipt from "./ViewPrintReceipt";
import configure from "apps/configure/configure.json";
import {
  getReceiptDetails
} from './../../actions/CheckCollectionActions' 
import { decryptaes } from "utils/LightSecurity";
  let formName = "ReceiptDetails"; 
  const submit = async (values, dispatch, props) => {
    try { 
        const res = await dispatch(getReceiptDetails(values));
        let decrypted = await decryptaes(res?.data); 
        if (decrypted.result === true) {
          await dispatch(reset(formName)); 
          window.location.reload();
        } 
    } catch (error) {
      console.log(error);
    }
  };

  let ReceiptDetails = (props) => { 
      const { ...check } = CheckCollectionHooks();
      const user    = check.account_details
      props.change("code", user.code); 
      props.change("subsection_code", user.subsection_code); 
      return (
        <React.Fragment> 
              <form autoComplete="off" onSubmit={props.handleSubmit(submit)}>
                <Grid container spacing={2}> 
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Stack
                      direction={  "row"  }
                      alignItems={ "flex-end"  }
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Grid item xs={12} sm={12} md={5} lg={5}>
                        <Field
                            id="receipt_number"
                            name="receipt_number"
                            component={InputField}
                            type="text"
                            label="Receipt Number"
                            size="small"
                            required={true}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <Field
                              id="print_format_description"
                              name="print_format_description"
                              label="Format"
                              options={props?.format_list}
                              getOptionLabel={(option) =>
                              option?.description ? option?.description: ""
                              }
                              required={true}
                              component={ComboBox}
                              onChangeHandle={(e, newValue) => {
                                if (newValue?.description) { 
                                  props.change("print_format", newValue.code);
                                }
                              }}
                            /> 
                        </Grid>
                        <Grid item xs={12} sm={12} md={1} lg={1}> 
                          <Button
                            sx={{...configure.default_button, p:1}} 
                            variant="contained"
                            type="submit"
                            fullWidth
                          >Get</Button> 
                        </Grid>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <ViewPrintReceipt data={check.printData}/>
                  </Grid>
                </Grid> 
              </form>
        </React.Fragment>
      );
  }
  
  const ReduxFormComponent = reduxForm({
    form: formName,
    onSubmit:submit
  })(ReceiptDetails);
  const selector = formValueSelector(formName);
  export default connect((state) => {
    const refresh = state.EpayCheckReducer.refresh;
    return { refresh };
  }, {})(ReduxFormComponent);
  
      