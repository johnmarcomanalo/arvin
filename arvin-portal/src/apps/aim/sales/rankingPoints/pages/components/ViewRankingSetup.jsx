import { Grid, TextField } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm, reset } from "redux-form";
import swal from "sweetalert";
import Table from "../../../../../../components/table/Table";
import { Constants } from "../../../../../../reducer/Contants";
import { postAnnualSettingSalesRanking } from "../../actions/SalesRankingPointsActions";
import SalesRankingPointsHooks from "../../hooks/SalesRankingPointsHooks";
const formName = "ViewRankingSetup";
const submit = async (values, dispatch, props) => {
  try {
    let ranking_placement = values.ranking_placement.map((item) => {
      const newItem = { index: item.index };
      Object.keys(item).forEach((key) => {
        if (key.startsWith("description-")) {
          newItem.desc = item[key];
        } else if (key.startsWith("value-")) {
          newItem.val = item[key];
        }
      });
      return newItem;
    });

    let value = {
      description: values.description,
      value: values.value,
      type: values.type,
      ranking_placement: ranking_placement,
      added_by: values.added_by,
      modified_by: values.modified_by,
    };
    const res = await dispatch(postAnnualSettingSalesRanking(value));
    swal(res.data.title, res.data.message, res.data.status);
    reset();
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh: !props.refresh,
        addModal: false,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

let ViewRankingSetup = (props) => {
  const { ...salesRankingPoints } = SalesRankingPointsHooks(props);
  const selectedDataList = salesRankingPoints.selectedDataList;
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Description"
            size="small"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            defaultValue="Hello World"
            value={selectedDataList?.description}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Target Point"
            size="small"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            defaultValue="Hello World"
            value={selectedDataList?.value}
          />
        </Grid>
        <Grid item xs={12} md={12}></Grid>
        <Grid item xs={12} md={12}>
          <Table
            columns={salesRankingPoints.subcolumns}
            dataList={salesRankingPoints.dataSubList}
            page={salesRankingPoints.page}
            rowsPerPage={salesRankingPoints.rowsPerPage}
            handleChangePage={salesRankingPoints.handleChangePage}
            handleChangeRowsPerPage={salesRankingPoints.handleChangeRowsPerPage}
            onSelectItem={null}
            id={"home_attendance"}
            localStorage={""}
            rowCount={salesRankingPoints.dataSubListCount}
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
})(ViewRankingSetup);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
