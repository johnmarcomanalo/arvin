import { Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
import { Field, change, formValueSelector, reduxForm, reset } from "redux-form";
import InputField from "../../../../../../components/inputFIeld/InputField";
import InputYearPicker from "../../../../../../components/inputFIeld/InputYearPicker";
import ButtonComponent from "../../../../../../components/button/Button";
import configure from "../../../../../configure/configure.json";
import RefCompaniesHooks from "../../../../reference/hooks/RefCompaniesHooks";
import RefBusinessUnitsHooks from "../../../../reference/hooks/RefBusinessUnitsHooks";
import RefTeamsHooks from "../../../../reference/hooks/RefTeamsHooks";
import RefDepartmentsHooks from "../../../../reference/hooks/RefDepartmentsHooks";
import RefSectionsHooks from "../../../../reference/hooks/RefSectionsHooks";
import RefSubSectionsHooks from "../../../../reference/hooks/RefSubSectionsHooks";
import { Constants } from "../../../../../../reducer/Contants";
import SalesDailyOutComponentAnnualSettingSalesRankingHooks from "../../hooks/SalesDailyOutComponentAnnualSettingSalesRankingHooks";
import { postAnnualSettingSalesRanking } from "../../actions/SalesDailyOutComponentAnnualSettingSalesRankingActions";
import Table from "../../../../../../components/table/Table";
import moment from "moment";
import swal from "sweetalert";
import { Button, ButtonGroup } from "@mui/material";
const formName = "ViewAnnualSettingSalesRankingPlacement";
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

let ViewAnnualSettingSalesRankingPlacement = (props) => {
  const { ...salesDailyOutComponentAnnualSettingSalesRanking } =
    SalesDailyOutComponentAnnualSettingSalesRankingHooks(props);
  const dataSubList =
    salesDailyOutComponentAnnualSettingSalesRanking?.dataSubList;
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Table
            columns={salesDailyOutComponentAnnualSettingSalesRanking.subcolumns}
            dataList={
              salesDailyOutComponentAnnualSettingSalesRanking.dataSubList
            }
            page={salesDailyOutComponentAnnualSettingSalesRanking.page}
            rowsPerPage={
              salesDailyOutComponentAnnualSettingSalesRanking.rowsPerPage
            }
            handleChangePage={
              salesDailyOutComponentAnnualSettingSalesRanking.handleChangePage
            }
            handleChangeRowsPerPage={
              salesDailyOutComponentAnnualSettingSalesRanking.handleChangeRowsPerPage
            }
            onSelectItem={null}
            id={"home_attendance"}
            localStorage={""}
            rowCount={
              salesDailyOutComponentAnnualSettingSalesRanking.dataSubListCount
            }
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
})(ViewAnnualSettingSalesRankingPlacement);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
