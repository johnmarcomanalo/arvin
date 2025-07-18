import { Grid, Tooltip, Stack, useMediaQuery } from "@mui/material";
import * as React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm, reset } from "redux-form";
import FormTitle from "components/formTItle/FormTitle";
import InputField from "components/inputFIeld/InputField";
import EmployeeListHooks from "../../hooks/EmployeeListHooks";
import Table from "components/table/Table";
import SearchField from "components/inputFIeld/SearchField";
import Page from "components/pagination/Pagination";
const formName = "EmployeeList";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let EmployeeList = (props) => {
  const matches = useMediaQuery("(min-width:600px)");
  const { ...employeeList } = EmployeeListHooks(props);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent={matches ? "space-between" : "center"}
            alignItems={matches ? "space-between" : "center"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
          >
            <SearchField
              value={employeeList.search}
              onChange={employeeList.onChangeSearch}
            />
            <Page
              page={employeeList?.page}
              limit={employeeList?.searchdataListCount}
              status={""}
              onHandleChange={employeeList.handleChangePage}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={employeeList.columns}
            dataList={employeeList.searchdataList}
            page={employeeList.page}
            rowsPerPage={employeeList.rowsPerPage}
            handleChangePage={employeeList.handleChangePage}
            handleChangeRowsPerPage={employeeList.handleChangeRowsPerPage}
            onSelectItem={props.onClickSelect}
            id={"home_attendance"}
            localStorage={""}
            rowCount={employeeList.searchdataListCount}
            paginationShow={false}
            action={(row) => {
              return null;
            }}
            actionshow={true}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(EmployeeList);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
