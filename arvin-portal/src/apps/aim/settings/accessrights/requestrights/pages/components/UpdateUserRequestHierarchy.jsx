import { Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import ButtonComponent from "../../../../../../../components/button/Button";
import InputField from "../../../../../../../components/inputFIeld/InputField";
import configure from "../../../../../../configure/configure.json";
import UpdateUserRequestHierarchyHooks from "../../hooks/UpdateUserRequestHierarchyHooks";
import ComboBox from "../../../../../../../components/autoComplete/AutoComplete";
import { postUserRequestAccess } from "../../actions/RequestRightsActions";
import { Constants } from "../../../../../../../reducer/Contants";
import swal from "sweetalert";
const formName = "UpdateUserRequestHierarchy";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(postUserRequestAccess(values));
    await dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        refresh: !props.refresh,
        updateModal: false,
      },
    });
    await dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        refresh: !props.HRrefresh,
      },
    });
    console.log(res);
    await swal(res.data.title, res.data.message, res.data.status);
  } catch (error) {
    console.log(error);
  }
};

let UpdateUserRequestHierarchy = (props) => {
  const { ...updateUserRequestHierarchy } =
    UpdateUserRequestHierarchyHooks(props);
  const request_hierarchies = updateUserRequestHierarchy.request_hierarchies;
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Grid item xs={12} md={12}>
              <Field
                id="request_type_description"
                name="request_type_description"
                label="Request Type"
                disabled={true}
                required={true}
                component={InputField}
              />
            </Grid>
            <Field
              id="request_hierarchy_description"
              name="request_hierarchy_description"
              label="Hierarchy Description"
              options={request_hierarchies}
              getOptionLabel={(option) =>
                option?.description ? option?.description : ""
              }
              required={true}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  console.log(newValue);
                  props.change("ref_request_hierarchies_code", newValue.code);
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={12}>
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
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(UpdateUserRequestHierarchy);
const selector = formValueSelector(formName);
export default connect((state) => {
  const HRrefresh = state.HumanResourceReducer.refresh;
  const refresh = state.ReferenceReducer.refresh;

  return {
    HRrefresh,
    refresh,
  };
}, {})(ReduxFormComponent);
