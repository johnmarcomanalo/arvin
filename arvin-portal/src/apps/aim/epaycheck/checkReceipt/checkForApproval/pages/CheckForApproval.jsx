import {
  ButtonGroup,
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
import CheckForApprovalHooks from "../hooks/CheckForApprovalHooks";
import ViewRemarks from "./components/ViewRemarks";
import CheckDetails from "../../checkMonitoring/pages/components/CheckDetails";
let formName = "CheckForApproval"
const CheckForApproval = (props) => {
    const { ...check } = CheckForApprovalHooks(props); 
    const matches = useMediaQuery("(min-width:600px)");
    const state = check.state
    const account      = check?.account_details
    return (
      <React.Fragment> 
         <Modal
            open={check.viewModal}
            fullScreen={matches ? false : true}
            title={"Remarks Details"}
            size={"lg"}
            action={undefined}
            handleClose={check.onClickCloseViewRemarksModal}
          >
          <ViewRemarks/>
        </Modal>
        <Modal
              open={check.editModal}
              fullScreen={matches ? false : true}
              title={"Check Details"}
              size={"sm"}
              action={undefined}
              handleClose={check.onClickCloseEditModal}
            >
            <CheckDetails details={check.selectedItem}/>
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
                    <Grid item xs={12} sm={12} md={3} lg={1}>
                      <Field
                        id="filter_status"
                        name="filter_status"
                        label="Status"
                        options={check?.statusList}
                        getOptionLabel={(option) =>
                          option?.description ? option?.description : check.filterStatus
                        }
                        component={ComboBox}
                        onChangeHandle={(e, newValue) => {
                          if (newValue?.description) { 
                            check.onChangeFilterStatus(newValue?.description);
                          }else{
                            check.onChangeFilterStatus(check.filterStatus);
                          }
                        }}
                      />
                    </Grid> 
                    <Grid item xs={12} sm={12} md={3} lg={1}>
                      <Field
                        id="filter_user_access_organization_rights"
                        name="filter_user_access_organization_rights"
                        label="Warehouse"
                        options={(check?.access.user_access_organization_rights.length > 0)? check?.warehouse : []}
                        getOptionLabel={(option) =>
                          option?.description ? option?.description : (check?.access.user_access_organization_rights.length > 0 ?"All" : "")
                        }
                        component={ComboBox}
                        onChangeHandle={(e, newValue) => {
                          if (newValue?.description) { 
                            check.onChangeFilteSubsection(newValue?.code);
                          }else{
                            if(check?.access.user_access_organization_rights.length > 0){
                              check.onChangeFilteSubsection("All");
                            }else{
                              check.onChangeFilteSubsection(account.subsection_code);
                            }
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
                    onSelectItem={check.onClickFunc}
                    id={"home_attendance"}
                    localStorage={""}
                    rowCount={check.dataListCount}
                    actionshow={true}
                    paginationShow={false}
                    subAction1Show={(check.filterStatus !== "APPROVED")}
                    subAction2Show={true}
                    action={(row, index) => {
                      return (
                        <Checkbox  
                        // checked={check.selectedDataList.includes(row.code)}
                          onChange={async (e) => { 
                              check.handleCheckboxChange(row,e.target.checked); 
                          }}
                          size="medium"
                          sx={{ height: "23px", margin: "-10px" }}
                        />
                      )
                    }}
                /> 
            </Grid> 
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="flex-end" 
                >
                  {account?.user_code === "27" && (
                      check.filterStatus === "PENDING" ? ( 
                        <ButtonGroup disableElevation aria-label="Disabled button group">
                          <ButtonComponent
                            stx={configure.default_button}
                            iconType="update"
                            type="button"
                            fullWidth={true}
                            children="Approve"
                            click={() => check.onClickApprove()}
                          />
                          <ButtonComponent
                            stx={configure.default_button}
                            iconType="update"
                            type="button"
                            fullWidth={true}
                            children="Disapprove"
                            click={() => check.onClickDisapprove()}
                          />
                        </ButtonGroup>
                      ) : (
                        <ButtonComponent
                          stx={configure.default_button}
                          iconType="update"
                          type="button"
                          fullWidth={true}
                          children="Undo"
                          click={() => check.onClickUndo()}
                        />
                      )
                    )}

                </Stack>
            </Grid>
          </Grid>
      </React.Fragment>
    );
  }
  
  const ReduxFormComponent = reduxForm({
    form: formName,
  })(CheckForApproval);
  const selector = formValueSelector(formName);
  export default connect((state) => {
    const refresh =  state.EpayCheckReducer.refresh;
    return { refresh };
  }, {})(ReduxFormComponent);