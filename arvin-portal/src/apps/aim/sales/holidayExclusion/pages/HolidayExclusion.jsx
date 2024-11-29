import { Grid, Stack, useMediaQuery } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import swal from "sweetalert";
import ComboBox from "../../../../../components/autoComplete/AutoComplete";
import InputField from "../../../../../components/inputFIeld/InputField";
import Table from "../../../../../components/table/Table";
import HolidayExclusionHooks from "../hooks/HolidayExclusionHooks";
import Modal from "../../../../../components/modal/Modal";
import MoveSaleQuota from "./components/MoveSaleQuota";
const formName = "HolidayExclusion";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};
let HolidayExclusion = (props) => {
  const { ...holidayExclusion } = HolidayExclusionHooks(props);
  const matches = useMediaQuery("(min-width:600px)");

  const validateNoSunday = (value) => {
    if (value) {
      const date = new Date(value);
      if (date.getDay() === 0) {
        swal("Warning", "Invalid date", "warning");
      }
    }
  };
  return (
    <React.Fragment>
      <Modal
        open={holidayExclusion.addModal}
        fullScreen={matches ? false : true}
        title={"Move Sale Out"}
        size={"lg"}
        action={undefined}
        handleClose={holidayExclusion.onClickClosnMoveSaleQuotaModal}
      >
        <MoveSaleQuota />
      </Modal>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <form onSubmit={props.handleSubmit}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-start" : "center"}
              alignItems={matches ? "flex-start" : "center"}
              flexDirection={matches ? "row" : "column"}
              spacing={2}
            >
              <Field
                id="selected_date"
                name="selected_date"
                label="Selected Date"
                type="date"
                component={InputField}
                required={true}
                validate={validateNoSunday}
                onChange={(e) => {
                  let value = e.target.value;
                  let selectedDate = new Date();
                  if (value !== null) {
                    selectedDate = value;
                  }
                  holidayExclusion.filterDate(selectedDate);
                }}
              />

              <Field
                id="subsection"
                name="subsection"
                label="Sub-section"
                options={holidayExclusion?.user_access_organization_rights}
                getOptionLabel={(option) =>
                  option.description
                    ? option.description
                    : holidayExclusion.filterSubsectionNameQuery
                }
                required={true}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    holidayExclusion.filterSubSections(newValue);
                  }
                }}
              />
            </Stack>
          </form>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={holidayExclusion.columns}
            dataList={holidayExclusion.dataList}
            page={holidayExclusion.page}
            rowsPerPage={holidayExclusion.rowsPerPage}
            handleChangePage={holidayExclusion.handleChangePage}
            handleChangeRowsPerPage={holidayExclusion.handleChangeRowsPerPage}
            onSelectItem={holidayExclusion.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={holidayExclusion.dataListCount}
            actionshow={true}
            paginationShow={false}
            action={(row) => {
              return null;
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
})(HolidayExclusion);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.ReferenceReducer.refresh;

  return { refresh };
}, {})(ReduxFormComponent);
