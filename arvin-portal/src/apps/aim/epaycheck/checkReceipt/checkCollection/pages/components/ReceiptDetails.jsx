import { Grid, Stack } from "@mui/material";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";

// Component imports
import ComboBox from "components/autoComplete/AutoComplete";
import InputField from "components/inputFIeld/InputField";
// Hooks and configuration
import CheckCollectionHooks from "../../hooks/CheckCollectionHooks";
import ViewPrintReceipt from "./ViewPrintReceipt";

const formName = "ReceiptDetailsForm";

let ReceiptDetails = (props) => {
  const { ...check } = CheckCollectionHooks(props); 
  return (
    <form autoComplete="off">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            alignItems="flex-end"
            justifyContent="space-between"
            spacing={2}
          >
            <Grid item xs={12} sm={6}>
              <Field
                id="receipt_number"
                name="receipt_number"
                component={InputField}
                type="text"
                label="Receipt Number"
                size="small"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                key={props.refresh}
                id="receipt_description"
                name="receipt_description"
                component={ComboBox}
                label="Format" 
                options={check?.dataListFormat}
                getOptionLabel={(option) => option?.description || (props.receipt_description ?? "")}
                required
                // When a new option is selected, update both receipt_code and receipt_description with the same value (newValue.code)
                onChangeHandle={(event, newValue) => {
                  if (newValue?.description) {
                    props.change("receipt_code", newValue.code);
                    props.change("receipt_description", newValue.description);
                  }else{
                    props.change("receipt_code",(props.receipt_description ?? ""));
                    props.change("receipt_description",(props.receipt_description ?? ""));
                  }
                }}
              />
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <ViewPrintReceipt data={check.printData} />
        </Grid>
      </Grid>
    </form>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  destroyOnUnmount: false,
})(ReceiptDetails);

const selector = formValueSelector(formName);
export default connect((state) => ({
  refresh:             state.EpayCheckReducer.refresh,
  receipt_number:      selector(state, "receipt_number"),
  receipt_code:        selector(state, "receipt_code"),
  receipt_description: selector(state, "receipt_description"),
}))(ReduxFormComponent);
