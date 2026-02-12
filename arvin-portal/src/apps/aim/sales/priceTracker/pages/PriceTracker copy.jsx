import { Grid, Stack, useMediaQuery } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import configure from "apps/configure/configure.json";
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import SearchField from "components/inputFIeld/SearchField";
import Modal from "components/modal/Modal";
import Page from "components/pagination/Pagination";
import ComponentTable from "components/table/Table";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import SalesLeaderboardHooks from "../hooks/PriceTrackerHooks";
import ViewPriceHistory from "./component/ViewPriceHistory";

const formName = "PriceTracker";

const submit = async (values, dispatch, props) => {
  try {
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let PriceTracker = (props) => {
  const { ...priceTracker } = SalesLeaderboardHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  const target_point = parseInt(priceTracker?.target_point);
  const [screenHeight, setScreenHeight] = React.useState(window.innerHeight);
  const active_page = priceTracker?.active_page;

  const calculateCurrentPoint = (point_details) => {
    let current_point = 0;
    if (Array.isArray(point_details)) {
      point_details.forEach((point) => {
        current_point += parseInt(point.value, 10);
      });
    }
    return current_point;
  };

  const sortedDataList = (priceTracker?.dataList ?? [])
    .map((data) => ({
      ...data,
      current_point: calculateCurrentPoint(data.details),
    }))
    .sort((a, b) => b.current_point - a.current_point);
  return (
    <React.Fragment>
      <Modal
        open={priceTracker?.viewModal}
        fullScreen={matches ? false : true}
        title={"Price  history"}
        size={"lg"}
        action={undefined}
        handleClose={priceTracker.onClickCloseViewModal}
      >
        <ViewPriceHistory />
      </Modal>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent={"flex-end"}
            alignItems={"flex-end"}
            flexDirection={"row"}
            spacing={2}
          >
            <ButtonComponent
              stx={configure.default_button}
              iconType="export"
              type="button"
              fullWidth={true}
              children={"Export"}
              click={priceTracker.onClickOpenAddModal}
            />
            {priceTracker.selected_code ? (
              <ButtonComponent
                stx={configure.default_button}
                iconType="add"
                type="button"
                fullWidth={true}
                children={"Add Ranker"}
                click={priceTracker.onClickOpenAddModal2}
              />
            ) : null}
            {priceTracker.selected_code ? (
              <ButtonComponent
                stx={configure.default_button}
                iconType="refresh"
                type="button"
                fullWidth={true}
                children={"Refresh Ranking"}
                click={priceTracker.onClickRefreshRanking}
              />
            ) : null}
          </Stack>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Stack
            direction="row"
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            flexDirection={"row"}
            spacing={2}
          >
            <SearchField
              textHidden={false}
              value={priceTracker.search}
              onChange={priceTracker.onChangeSearch}
            />
            <FormControl sx={{ m: 1, minWidth: 320 }} size="small">
              <Field
                id="type"
                name="type"
                label="Type"
                options={priceTracker?.type}
                getOptionLabel={(option) =>
                  option?.description
                    ? option?.description
                    : priceTracker.filterQuery
                }
                component={ComboBox}
                showLabel={true}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    priceTracker.onChangeFilter(newValue?.code);
                  }
                }}
              />
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 320 }} size="small">
              <Field
                id="warehouse"
                name="warehouse"
                label="Warehouse"
                options={priceTracker?.filteredWarehouses}
                getOptionLabel={(option) =>
                  option?.description
                    ? option?.description
                    : priceTracker.filterReceivedBy
                }
                component={ComboBox}
                showLabel={true}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    priceTracker.onChangeWarehouse(newValue?.code);
                  }
                }}
              />
            </FormControl>
          </Stack>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Stack
            direction="row"
            justifyContent={"flex-end"}
            alignItems={"flex-end"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
          >
            <Page
              page={priceTracker?.page}
              limit={priceTracker?.dataListCount}
              status={""}
              onHandleChange={priceTracker.handleChangePage}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ComponentTable
            columns={priceTracker.columns}
            dataList={priceTracker.dataList}
            page={priceTracker.page}
            rowsPerPage={priceTracker.rowsPerPage}
            handleChangePage={priceTracker.handleChangePage}
            handleChangeRowsPerPage={priceTracker.handleChangeRowsPerPage}
            onSelectItem={priceTracker.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={priceTracker.dataListCount}
            paginationShow={false}
            subAction1Show={true}
            subAction2Show={false}
            actionshow={true}
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
})(PriceTracker);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
