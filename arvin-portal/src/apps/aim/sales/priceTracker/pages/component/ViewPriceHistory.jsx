import { Grid } from "@mui/material";
import ComponentTable from "components/table/Table";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import swal from "sweetalert";
import ViewPriceHistoryHooks from "../../hooks/ViewPriceHistoryHooks";
const formName = "ViewPriceHistory";
const submit = async (values, dispatch, props) => {
  try {
    console.log(values);
  } catch (error) {
    swal("Oppss!", "Something went wrong, please try again!", "error");
  }
};

let ViewPriceHistory = (props) => {
  const dispatch = useDispatch();
  const { ...viewPriceHistory } = ViewPriceHistoryHooks(props);

  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <ComponentTable
              columns={viewPriceHistory.columns}
              dataList={viewPriceHistory.dataSubList}
              page={viewPriceHistory.page}
              rowsPerPage={viewPriceHistory.rowsPerPage}
              handleChangePage={viewPriceHistory.handleChangePage}
              handleChangeRowsPerPage={viewPriceHistory.handleChangeRowsPerPage}
              onSelectItem={viewPriceHistory.onSelectItem}
              id={"home_attendance"}
              localStorage={""}
              rowCount={viewPriceHistory.dataSubListCount}
              paginationShow={false}
              subAction1Show={true}
              subAction2Show={false}
              actionshow={false}
              action={(row) => {
                return null;
              }}
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
})(ViewPriceHistory);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
