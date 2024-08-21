import { Grid, Tooltip, Stack, useMediaQuery } from "@mui/material";
import * as React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm, reset } from "redux-form";
import FormTitle from "../../../../../../components/formTItle/FormTitle";
import InputField from "../../../../../../components/inputFIeld/InputField";
import UploadEmployeeHooks from "../../hooks/UploadEmployeeHooks";
import Table from "../../../../../../components/table/Table";
import SearchField from "../../../../../../components/inputFIeld/SearchField";
import RenderDropZone from "../../../../../../components/renderDropZone/RenderDropZone";
import configure from "../../../../../configure/configure.json";
const formName = "EmployeeList";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let UploadEmployee = (props) => {
  const matches = useMediaQuery("(min-width:600px)");
  const { ...uploadEmployee } = UploadEmployeeHooks(props);
  const state = uploadEmployee?.state;
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Field
              name="rates"
              type="file"
              accept={configure.files.AllowedImportFile}
              attachedFile={state.attachedFile}
              handleOnDrop={uploadEmployee.handleOnDrop}
              component={RenderDropZone}
              size_lg={12}  
              size_xl={12}
            />
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(UploadEmployee);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
