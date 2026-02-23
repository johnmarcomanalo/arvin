import { Grid, Stack, TablePagination, useMediaQuery } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import configure from "apps/configure/configure.json";
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import SearchField from "components/inputFIeld/SearchField";
import Modal from "components/modal/Modal";
import Page from "components/pagination/Pagination";
import ComponentTable from "components/table/TableDev";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import SalesLeaderboardHooks from "../hooks/PriceTrackerHooks";
import ViewPriceHistory from "./component/ViewPriceHistory";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import InfiniteScroll from "react-infinite-scroll-component";
import RowPage from "components/pagination/RowPagination";
import InputField from "components/inputFIeld/InputField";

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

  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          {/* <Grid item xs={12} sm={12} md={12} lg={12}>
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
          </Grid> */}
          <Grid item xs={12} sm={12} md={12} lg={12}>
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

              <Field
                id="date_start"
                name="date_start"
                label="Date Start"
                required={true}
                type="date"
                component={InputField}
                onChange={(event) => {
                  // Get the date from the input event
                  const selectedDate = event.target.value;
                    // Pass the selected date to your handler
                    // priceTracker.onChangeDateStart(selectedDate);
                    priceTracker.onChangeDateStart(selectedDate || "");
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={8}>
            <ComponentTable
              tableRef={priceTracker.tableRef}
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
              actionshow={false}
              action={(row) => {
                return null;
              }}
              loading={priceTracker.loading}
              hasMore={priceTracker.page < priceTracker.lastPage}
              onLoadMore={priceTracker.loadMore}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <ComponentTable
              columns={priceTracker.columns_history}
              dataList={priceTracker.dataSubList.slice(
                priceTracker.dataSubListCount >= 2 ? 1 : 0,
              )}
              page={priceTracker.page}
              rowsPerPage={priceTracker.rowsPerPage}
              handleChangePage={priceTracker.handleChangePage}
              // handleChangeRowsPerPage={priceTracker.handleChangeRowsPerPage}
              onSelectItem={null}
              id={"home_attendance"}
              localStorage={""}
              rowCount={priceTracker.dataSubListCount}
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
})(PriceTracker);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
