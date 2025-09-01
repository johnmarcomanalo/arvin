import {
  Checkbox,
  Grid,
  Stack,
  useMediaQuery,
  ButtonGroup,
  Button
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
import CheckARReceiveHooks from "../hooks/CheckARReceiveHooks"; 
import Loading from "components/loading/Loading";
import CachedIcon from '@mui/icons-material/Cached';
const Reject = React.lazy(() => import("./../../checkMonitoring/pages/components/Reject"));
let formName = "CheckARReceive";
const CheckARReceive = (props) => {
  const { ...check } = CheckARReceiveHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  const state = check.state;
  return (
    <React.Fragment> 
      <React.Suspense fallback={<Loading/>}>
        <Modal
          open={check.viewModal2}
          fullScreen={matches ? false : true}
          title={"Reject Details"}
          size={"sm"}
          action={undefined}
          handleClose={check.onClickCloseRejectModal}
        >
          <Reject/>
        </Modal> 
      </React.Suspense>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={1}>
          <Stack
            direction="row"
            justifyContent={matches ? "flex-start" : "center"}
            alignItems={matches ? "flex-end" : "flex-end"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
          >
            
             <Button 
                variant="contained"
                color="primary"
                startIcon={<CachedIcon/>}
                onClick={() => { 
                    check.reloadData();  
                }}
              >
                Refresh
              </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={11} lg={11}>
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
                id="filter_received_by"
                name="filter_received_by"
                label="Received By"
                options={check?.receivedBy}
                getOptionLabel={(option) =>
                  option?.description ? option?.description : check.filterReceivedBy
                }
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    check.onChangeFilterReceivedBy(newValue?.description);
                  }
                }}
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
                    check.onChangeFilterStatus(newValue?.code);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={1}>
              <Field
                id="filter_user_access_organization_rights"
                name="filter_user_access_organization_rights"
                label="Warehouse"
                options={check?.warehouseList}
                getOptionLabel={(option) =>
                  option?.description ? option?.description : check.filterSubSectionName
                }
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    check.onChangeFilterSubsection(newValue?.code,newValue?.description);
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
                  disabled={row.applied_at !== null}
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
 
                <ButtonGroup disableElevation aria-label="Disabled button group">
                  <ButtonComponent
                  stx={configure.default_button}
                  iconType="add"
                  type="button"
                  fullWidth={true}
                  children={"Receive Check"}
                  click={check.onClickReceive}
                />
                </ButtonGroup> 
            ) : (
              <ButtonGroup disableElevation aria-label="Disabled button group">
              <ButtonComponent
                stx={configure.default_button}
                iconType="update"
                type="button"
                fullWidth={true}
                children={"Apply AR"}
                click={check.onClickApplyAR}
              /> 
              {/* <ButtonComponent
                stx={configure.default_button}
                iconType="update"
                type="button"
                fullWidth={true}
                children={"Undo Receive"}
                click={check.onClickUndoReceive}
              /> */}
              <ButtonComponent
                  stx={configure.default_button}
                  iconType="add"
                  type="button"
                  fullWidth={true}
                  children={"Reject"}
                  click={check.onClickOpenRejectModal}
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
})(CheckARReceive);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = !state.EpayCheckReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
