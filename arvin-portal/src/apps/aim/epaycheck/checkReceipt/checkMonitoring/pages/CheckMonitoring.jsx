import {
  ButtonGroup,
  Checkbox,
  Grid,
  Stack,
  Tooltip,
  useMediaQuery
} from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
//component 
import CancelIcon from '@mui/icons-material/Cancel';
import configure from "apps/configure/configure.json";
import ComboBox from "components/autoComplete/AutoComplete";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
import SearchField from "components/inputFIeld/SearchField";
import Loading from "components/loading/Loading";
import Modal from "components/modal/Modal";
import Page from "components/pagination/Pagination";
import TableComponent from "components/table/Table";
import CheckMonitoringHooks from "../hooks/CheckMonitoringHooks";
const Deposit = React.lazy(() => import("./components/Deposit"));
const CheckDetails = React.lazy(() => import("./components/CheckDetails"));
const Reject = React.lazy(() => import("./components/Reject"));
const RejectedClose = React.lazy(() => import("./components/RejectedClose"));
let formName = "CheckMonitoring"
const CheckMonitoring = (props) => {
    const { ...check } = CheckMonitoringHooks(props); 
    const matches      = useMediaQuery("(min-width:600px)");
    const state        = check?.state
    const account      = check?.account_details 
    return (
      <React.Fragment>
          <React.Suspense fallback={<Loading/>}>
          <Modal
              open={check.rejectCloseModal}
              fullScreen={matches ? false : true}
              title={"Rejected Close Details"}
              size={"sm"}
              action={undefined}
              handleClose={check.onClickCloseCloseRejectedModal}
            >
            <RejectedClose onClickRejectToClose={check.onClickRejectToClose}/>
          </Modal>
          </React.Suspense>
          <React.Suspense fallback={<Loading/>}>
          <Modal
              open={check.viewModal}
              fullScreen={matches ? false : true}
              title={"Deposit Details"}
              size={"sm"}
              action={undefined}
              handleClose={check.onClickCloseViewModalDeposit}
            >
            <Deposit/>
          </Modal>
          </React.Suspense>
          <React.Suspense fallback={<Loading/>}>
          <Modal
              open={check.editModal}
              fullScreen={matches ? false : true}
              title={"Check Details"}
              size={"lg"}
              action={undefined}
              handleClose={check.onClickCloseEditModal}
            >
            <CheckDetails details={check.selectedItem}/>
          </Modal> 
          </React.Suspense>
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
                        disabled={check.filterStatus=='ON-HAND'}
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
                        disabled={check.filterStatus=='ON-HAND'}
                      />
                    
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={1}>
                        <Field
                          id="filterStatus"
                          name="filterStatus"
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
                        options={check?.access.user_access_organization_rights?.sort((a, b) => a.description.localeCompare(b.description))}
                        getOptionLabel={(option) =>
                          option?.description ? option?.description : ""
                        }
                        component={ComboBox}
                        onChangeHandle={(e, newValue) => {
                          if (newValue?.description) { 
                            check.onChangeFilteSubsection(newValue?.code);
                          }else{
                            check.onChangeFilteSubsection(account.subsection_code);
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
                    <SearchField value={check.search} onChange={check.onChangeSearch}/>   
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
                    subAction1Show={true}
                    subAction2Show={true}
                    action={(row, index) => {
                      if (row.check_status!=="REJECTED") {
                        return ( 
                          <Checkbox 
                            checked={check.selectedDataList.includes(row.code)}
                            onChange={async (e) => { 
                                check.handleCheckboxChange(row,e.target.checked); 
                            }}
                            size="medium"
                            sx={{ height: "23px", margin: "-10px" }}
                            disabled={row.status === "CLOSED"}
                          />
                        )
                      }else{
                        return (
                          <Tooltip title="Close Reject">
                            <CancelIcon
                              onClick={() => check.onClickOpenCloseRejectedModal(row)}
                              style={{
                                color: "#009197",
                                cursor: "pointer",
                              }}
                            />
                          </Tooltip>
                        )
                      }
                     
                    }}
                /> 
            </Grid> 
               <Grid item xs={12} sm={12} md={12} lg={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="flex-end">
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
                     {Array.isArray(check.subsection_allowed_to_reject) &&
                        check.subsection_allowed_to_reject.includes(Number(account?.subsection_code)) && (
                        <ButtonComponent
                          stx={configure.default_button}
                          iconType="add"
                          type="button"
                          fullWidth={true}
                          children={"Reject"}
                          click={check.onClickOpenRejectModal}
                        />
                      )}
                    </ButtonGroup>
                  ) : (check.filterStatus === "REJECTED" && check.subsection_allowed_to_reject.includes(Number(account?.subsection_code))) ? ( 
                    // <ButtonGroup disableElevation aria-label="Disabled button group">
                    //     <ButtonComponent
                    //       stx={configure.default_button}
                    //       iconType="update"
                    //       type="button"
                    //       fullWidth={true}
                    //       children={"Close Rejected"}
                    //       click={check.onClickRejectToClose}
                    //     />
                    // </ButtonGroup>
                    <></>
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
  }
  
  const ReduxFormComponent = reduxForm({
    form: formName,
  })(CheckMonitoring);
  const selector = formValueSelector(formName);
  export default connect((state) => {
    const refresh =  !state.EpayCheckReducer.refresh;
    return { refresh };
  }, {})(ReduxFormComponent);
