import {
  Grid,
  Stack,
  useMediaQuery
} from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
//component
import ComboBox from "components/autoComplete/AutoComplete";
import InputField from "components/inputFIeld/InputField";
import ReceivedCheckCounterHooks from "../hooks/ReceivedCheckCounterHooks";
import ViewPrintReceivedCheckReport from "./components/ViewPrintReceivedCheckReport";
let formName = "ReceivedCheckCounter";
const ReceivedCheckCounter = (props) => {
  const { ...check } = ReceivedCheckCounterHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction={matches ? "row" : "column"}
            alignItems={matches ? "center" : "flex-start"}
            justifyContent="space-between"
            spacing={1}
          >
            <Grid item xs={12} sm={6} md={2} lg={2}>
              {/* <SearchField value={check.search} onChange={check.onChangeSearch} textHidden={false}/> */}
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Field
                    id="filter_date_start"
                    name="filter_date_start"
                    label="Start Date"
                    type="date"
                    component={InputField}
                    onChange={(event) => {
                      // Get the date from the input event
                      const selectedDate = event.target.value;
                      if (selectedDate) {
                        // Pass the selected date to your handler
                        check.onChangeFilterStart(new Date(selectedDate));
                      }
                    }}
                    // disabled
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Field
                    id="filter_date_end"
                    name="filter_date_end"
                    label="End Date"
                    type="date"
                    component={InputField}
                    onChange={(event) => {
                      // Get the date from the input event
                      const selectedDate = event.target.value;
                      if (selectedDate) {
                        // Pass the selected date to your handler
                        check.onChangeFilterEnd(new Date(selectedDate));
                      }
                    }}
                    // disabled
                  />
                </Grid>
              
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Field
                    id="filter_user_access_organization_rights"
                    name="filter_user_access_organization_rights"
                    label="Warehouse"
                    options={check?.listWarehouse}
                    getOptionLabel={(option) =>
                      option?.description ? option?.description : ""
                    }
                    component={ComboBox}
                    onChangeHandle={(e, newValue) => {
                      if (newValue?.description) {
                        check.onChangeFilteSubsection(newValue?.code);
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ViewPrintReceivedCheckReport data={check.reportData} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
})(ReceivedCheckCounter);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = true; // state.QuotationReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
