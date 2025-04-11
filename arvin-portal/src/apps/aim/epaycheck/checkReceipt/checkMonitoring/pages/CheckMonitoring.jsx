import {
  ButtonGroup,
  Grid,
  Stack,
  useMediaQuery,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { change, Field, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
//component
import ButtonComponent from "components/button/Button";
import TableComponent from "components/table/Table";
import SearchField from "components/inputFIeld/SearchField";
import InputField from "components/inputFIeld/InputField";
import ComboBox from "components/autoComplete/AutoComplete";
import Modal from "components/modal/Modal";
import Page from "components/pagination/Pagination";
import CheckMonitoringHooks from "../hooks/CheckMonitoringHooks";
import moment from "moment";
import configure from "apps/configure/configure.json";
import Deposit from "./components/Deposit";
import CheckDetails from "./components/CheckDetails";
import Reject from "./components/Reject";
let formName = "CheckMonitoring";
const CheckMonitoring = (props) => {
  const { ...check } = CheckMonitoringHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  const state = check.state;
  return (
    <React.Fragment>
      <Modal
        open={check.viewModal}
        fullScreen={matches ? false : true}
        title={"Deposit Details"}
        size={"sm"}
        action={undefined}
        handleClose={check.onClickCloseViewModalDeposit}
      >
        <Deposit />
      </Modal>
      <Modal
        open={check.editModal}
        fullScreen={matches ? false : true}
        title={"Check Details"}
        size={"sm"}
        action={undefined}
        handleClose={check.onClickCloseEditModal}
      >
        <CheckDetails details={check.selectedItem} />
      </Modal>
      <Modal
        open={check.viewModal2}
        fullScreen={matches ? false : true}
        title={"Reject Details"}
        size={"sm"}
        action={undefined}
        handleClose={check.onClickCloseRejectModal}
      >
        <Reject />
      </Modal>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction={matches ? "row" : "column"}
            alignItems={matches ? "center" : "flex-start"}
            justifyContent="space-between"
            spacing={2}
          >
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <SearchField
                value={check.search}
                onChange={check.onChangeSearch}
                textHidden={false}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={6} lg={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={3} lg={3}>
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
                    // disabled
                  />
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3}>
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
                    // disabled
                  />
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3}>
                  <Field
                    id="filterStatus"
                    name="filterStatus"
                    label="Status"
                    options={check?.status}
                    getOptionLabel={(option) =>
                      option?.description
                        ? option?.description
                        : check.filterStatus
                    }
                    component={ComboBox}
                    onChangeHandle={(e, newValue) => {
                      if (newValue?.description) {
                        check.onChangeFilterStatus(newValue?.description);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3}>
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
              </Grid>
            </Grid>
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
            subAction1Show={check.filterStatus == "ON-HAND" ? true : false}
            subAction2Show={true}
            action={(row, index) => {
              let check_status = row?.check_status;
              // return (
              //   <FormControl size="small" fullWidth>
              //     <InputLabel
              //       id="demo-simple-select-label"
              //       shrink={true}
              //     ></InputLabel>
              //     <Select
              //         labelId="demo-simple-select-label"
              //         id="demo-simple-select"
              //         label="Age"
              //         value={check_status}
              //         onChange={(e) => {
              //           check.onUpdateCheckDetails(
              //             row,
              //             e.target.value
              //           );
              //         }}
              //         size="small"
              //         sx={{ width: "100%", height: "33px", marginLeft: "-5px" }}
              //     >
              //       {check?.status
              //         .filter((status) => status.description !== "ALL")
              //         .map((status, key) => (
              //           <MenuItem key={key} value={status.description} >
              //             {status.description}
              //           </MenuItem>
              //         ))}

              //     </Select>
              //   </FormControl>
              // );

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
            {check.filterStatus === "ON-HAND" ? (
              <ButtonGroup disableElevation aria-label="Disabled button group">
                <ButtonComponent
                  stx={configure.default_button}
                  iconType="add"
                  type="button"
                  fullWidth={true}
                  children={"Deposit"}
                  click={check.onClickOpenViewModalDeposit}
                />
                <ButtonComponent
                  stx={configure.default_button}
                  iconType="add"
                  type="button"
                  fullWidth={true}
                  children={"Transmit"}
                  click={check.onClickTransmit}
                />
                <ButtonComponent
                  stx={configure.default_button}
                  iconType="add"
                  type="button"
                  fullWidth={true}
                  children={"Reject"}
                  click={check.onClickOpenRejectModal}
                />
              </ButtonGroup>
            ) : (
              <ButtonGroup disableElevation aria-label="Disabled button group">
                <ButtonComponent
                  stx={configure.default_button}
                  iconType="delete"
                  type="button"
                  fullWidth={true}
                  children={"Undo " + check.filterStatus}
                  click={check.onClickUndo}
                />
              </ButtonGroup>
            )}
          </Stack>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
})(CheckMonitoring);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = !state.EpayCheckReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
