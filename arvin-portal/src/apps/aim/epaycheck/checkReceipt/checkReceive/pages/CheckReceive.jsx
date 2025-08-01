import {
  Checkbox,
  Grid,
  Stack,
  useMediaQuery
} from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
//component
import configure from "apps/configure/configure.json";
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
import SearchField from "components/inputFIeld/SearchField";
import Modal from "components/modal/Modal";
import Page from "components/pagination/Pagination";
import TableComponent from "components/table/Table";
import CheckReceiveHooks from "../hooks/CheckReceiveHooks";
import Receive from "./components/Receive";
let formName = "CheckReceive";
const CheckReceive = (props) => {
  const { ...check } = CheckReceiveHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  const state = check.state;
  return (
    <React.Fragment>
      <Modal
        open={check.viewModal}
        fullScreen={matches ? false : true}
        title={"Receive Details"}
        size={"sm"}
        action={undefined}
        handleClose={check.onClickCloseReceiveModal}
      >
        <Receive />
      </Modal>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent={matches ? "flex-end" : "center"}
            alignItems={matches ? "flex-end" : "center"}
            flexDirection={matches ? "row" : "column"}
            spacing={1}
          >
            <Grid item xs={12} sm={12} md={2} lg={1}>
              <Field
                id="filter_date_start"
                name="filter_date_start"
                label="Start Date"
                type="date"
                component={InputField}
                onChange={(event) => {
                  // Get the date from the input event
                  const selectedDate = event.target.value;
                  if (selectedDate) {
                    // Pass the selected date to your handler
                    check.onChangeFilterStart(new Date(selectedDate));
                  }
                }}
                disabled={check.filterStatus == "TRANSMITTED"}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={2} lg={1}>
              <Field
                id="filter_date_end"
                name="filter_date_end"
                label="End Date"
                type="date"
                component={InputField}
                onChange={(event) => {
                  // Get the date from the input event
                  const selectedDate = event.target.value;
                  if (selectedDate) {
                    // Pass the selected date to your handler
                    check.onChangeFilterEnd(new Date(selectedDate));
                  }
                }}
                disabled={check.filterStatus == "TRANSMITTED"}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={1}>
              <Field
                id="filter_status"
                name="filter_status"
                label="Status"
                options={check?.status}
                getOptionLabel={(option) =>
                  option?.description ? option?.description : check.filterStatus
                }
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    check.onChangeFilterStatus(newValue?.description);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={1}>
              <Field
                id="filter_user_access_organization_rights"
                name="filter_user_access_organization_rights"
                label="Warehouse"
                options={check?.access.user_access_organization_rights}
                getOptionLabel={(option) =>
                  option?.description ? option?.description : ""
                }
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    check.onChangeFilteSubsection(newValue?.code);
                  }
                }}
              />
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Stack
            direction="row"
            justifyContent={matches ? "flex-start" : "center"}
            alignItems={matches ? "flex-start" : "center"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
          >
            <SearchField value={check.search} onChange={check.onChangeSearch} />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Stack
            direction="row"
            justifyContent={matches ? "flex-end" : "center"}
            alignItems={matches ? "flex-end" : "center"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
          >
            <Page
              page={check?.page}
              limit={check?.dataListCount}
              status={""}
              onHandleChange={check.handleChangePage}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TableComponent
            columns={check.columns}
            dataList={check.dataList}
            page={check.page}
            rowsPerPage={check.rowsPerPage}
            handleChangePage={check.handleChangePage}
            handleChangeRowsPerPage={check.handleChangeRowsPerPage}
            onSelectItem={check.onClickOpenEditModal}
            id={"home_attendance"}
            localStorage={""}
            rowCount={check.dataListCount}
            actionshow={true}
            paginationShow={false}
            subAction1Show={false}
            subAction2Show={true}
            action={(row, index) => {
              return (
                <Checkbox
                  checked={check.selectedDataList.includes(row.code)}
                  onChange={async (e) => {
                    check.handleCheckboxChange(row, e.target.checked);
                  }}
                  size="medium"
                  sx={{ height: "23px", margin: "-10px" }}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            {check.filterStatus == "TRANSMITTED" ? (
              <ButtonComponent
                stx={configure.default_button}
                iconType="add"
                type="button"
                fullWidth={true}
                children={"Receive Check"}
                click={check.onClickReceive}
              />
            ) : (
              <ButtonComponent
                stx={configure.default_button}
                iconType="update"
                type="button"
                fullWidth={true}
                children={"Undo Receive"}
                click={check.onClickUndoReceive}
              />
            )}
          </Stack>
        </Grid>
        {/* <Grid item xs={12} sm={12} md={12} lg={12}>
          <TableComponent
            columns={check.columns}
            dataList={check.dataList}
            page={check.page}
            rowsPerPage={check.rowsPerPage}
            handleChangePage={check.handleChangePage}
            handleChangeRowsPerPage={check.handleChangeRowsPerPage}
            onSelectItem={check.onClickOpenEditModal}
            id={"home_attendance"}
            localStorage={""}
            rowCount={check.dataListCount}
            actionshow={true}
            paginationShow={false}
            subAction1Show={false}
            subAction2Show={true}
            action={(row, index) => {
              return (
                <Checkbox
                  // checked={check.selectedDataList.includes(row.code)}
                  onChange={async (e) => {
                    check.handleCheckboxChange(row, e.target.checked);
                  }}
                  size="medium"
                  sx={{ height: "23px", margin: "-10px" }}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <ButtonGroup disableElevation aria-label="Disabled button group">
              <ButtonComponent
                stx={configure.default_button}
                iconType="add"
                type="button"
                fullWidth={true}
                children={"Receive Check"}
                click={check.onClickReceive}
              />
              <ButtonComponent
                stx={configure.default_button}
                iconType="update"
                type="button"
                fullWidth={true}
                children={"Undo Receive"}
                click={check.onClickUndoReceive}
              />
            </ButtonGroup>
          </Stack>
        </Grid> */}
      </Grid>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
})(CheckReceive);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = !state.EpayCheckReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
