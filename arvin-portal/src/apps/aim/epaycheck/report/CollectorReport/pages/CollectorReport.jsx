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
import CollectorReportHooks from "../hooks/CollectorReportHooks";
import ViewCollectorReport from "./components/ViewPrintCollectorReport";
let formName = "CollectorReport";
const CollectorReport = (props) => {
  const { ...creport } = CollectorReportHooks(props);
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
              {/* <SearchField value={creport.search} onChange={creport.onChangeSearch} textHidden={false}/> */}
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
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
                        creport.onChangeFilterStart(new Date(selectedDate));
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
                        creport.onChangeFilterEnd(new Date(selectedDate));
                      }
                    }}
                    // disabled
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Field
                    id="filterSap"
                    name="filterSap"
                    label="SAP"
                    options={creport?.sapList}
                    getOptionLabel={(option) =>
                      option?.description ? option?.description : creport.filterSap
                    }
                    component={ComboBox}
                    onChangeHandle={(e, newValue) => {
                      if (newValue?.description) {
                        creport.onChangeFilterSap(newValue?.description);
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ViewCollectorReport data={creport.reportData} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
})(CollectorReport);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = true; // state.QuotationReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
