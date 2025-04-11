import { Grid, Tooltip, Stack } from "@mui/material";
import * as React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Table from "components/table/Table";
import HomeComponentAttendanceHooks from "../../hooks/HomeComponentAttendanceHooks";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm, reset } from "redux-form";
import { required } from "../../../../../utils/ErrorUtils";
import FormTitle from "components/formTItle/FormTitle";
import InputField from "components/inputFIeld/InputField";
import InputDatePicker from "components/inputFIeld/InputDatePicker";
const formName = "Attendance";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let Attendance = (props) => {
  const { ...homeComponentAttendance } = HomeComponentAttendanceHooks(props);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Stack direction="row" justifyContent="flex-start" spacing={2}>
            <FormTitle title="Attendance" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <form onSubmit={props.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  spacing={2}
                >
                  <Field
                    id="dateFilterStart"
                    name="dateFilterStart"
                    label="Filter Date Start"
                    type="date"
                    component={InputField}
                    required={false}
                  />
                  <Field
                    id="dateFilterEnd"
                    name="dateFilterEnd"
                    label="Filter Date End"
                    type="date"
                    component={InputField}
                    required={false}
                  />
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={homeComponentAttendance.columns}
            dataList={homeComponentAttendance.dataList}
            page={homeComponentAttendance.page}
            rowsPerPage={homeComponentAttendance.rowsPerPage}
            handleChangePage={homeComponentAttendance.handleChangePage}
            handleChangeRowsPerPage={
              homeComponentAttendance.handleChangeRowsPerPage
            }
            onSelectItem={homeComponentAttendance.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={homeComponentAttendance.dataListCount}
            action={(row) => {
              return (
                <Tooltip title="Delete">
                  <DeleteOutlineIcon
                    onClick={() =>
                      homeComponentAttendance.onDeleteDeduction(row)
                    }
                    style={{
                      color: "#009197",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              );
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(Attendance);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
