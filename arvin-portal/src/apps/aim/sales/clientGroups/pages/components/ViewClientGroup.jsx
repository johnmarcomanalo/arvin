import { Grid, TextField } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import Table from "components/table/Table";
import ClientGroupsHooks from "../../hooks/ClientGroupsHooks";
const formName = "ViewClientGroup";
const submit = async (values, dispatch, props) => {
  try {
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let ViewClientGroup = (props) => {
  const { ...clientGroup } = ClientGroupsHooks(props);
  const selectedDataList = clientGroup.selectedDataList;
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <TextField
            label="Description"
            size="small"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            multiline
            defaultValue="Hello World"
            value={selectedDataList?.description}
          />
        </Grid>

        <Grid item xs={12} md={12}></Grid>
        <Grid item xs={12} md={12}>
          <Table
            columns={clientGroup.subcolumns}
            dataList={clientGroup.dataSubList}
            page={clientGroup.page}
            rowsPerPage={clientGroup.rowsPerPage}
            handleChangePage={clientGroup.handleChangePage}
            handleChangeRowsPerPage={clientGroup.handleChangeRowsPerPage}
            onSelectItem={null}
            id={"home_attendance"}
            localStorage={""}
            rowCount={clientGroup.dataSubListCount}
            actionshow={false}
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
})(ViewClientGroup);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
