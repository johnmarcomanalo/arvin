import { Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import swal from "sweetalert";
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import configure from "apps/configure/configure.json";
const formName = "FilterSales";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    swal("Oppss!", "Something went wrong, please try again!", "error");
  }
};
let FilterSales = (props) => {
  const dispatch = useDispatch();
  const { ...param } = props;
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Field
              key={props.refresh}
              id="subcomponents"
              name="subcomponents"
              label="Warehouses"
              options={param?.user_access_organization_rights}
              getOptionLabel={(option) =>
                option?.description ? option?.description : ""
              }
              required={true}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  param.onChangeFilter(newValue);
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <ButtonComponent
                stx={configure.default_button}
                iconType="close"
                type="button"
                fullWidth={true}
                children={"Close"}
                click={() => {
                  param.onClose();
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(FilterSales);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
