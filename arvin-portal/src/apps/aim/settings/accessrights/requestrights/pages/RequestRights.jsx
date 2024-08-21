import { Grid, Stack, useMediaQuery } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import ButtonComponent from "../../../../../../components/button/Button";
import InputField from "../../../../../../components/inputFIeld/InputField";
import Modal from "../../../../../../components/modal/Modal";
import Table from "../../../../../../components/table/Table";
import configure from "../../../../../configure/configure.json";
import EmployeeList from "../../../../humanresource/employeeList/pages/components/EmployeeList";
import RequestRightsHooks from "../hooks/RequestRightsHooks";
import Page from "../../../../../../components/pagination/Pagination";
import SearchField from "../../../../../../components/inputFIeld/SearchField";
import UpdateUserRequestHierarchy from "./components/UpdateUserRequestHierarchy";
const formName = "PageRights";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};
let RequestRights = (props) => {
  const { ...requestRights } = RequestRightsHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={requestRights.viewModal}
        fullScreen={matches ? false : true}
        title={"Employee Search"}
        size={"md"}
        action={undefined}
        handleClose={requestRights.onClickCloseViewModal}
      >
        <EmployeeList onClickSelect={requestRights.onSelectItem} />
      </Modal>
      <Modal
        open={requestRights.updateModal}
        fullScreen={matches ? false : true}
        title={"Update Request Hierarchy"}
        size={"sm"}
        action={undefined}
        handleClose={requestRights.onClickCloseUpdateModal}
      >
        <UpdateUserRequestHierarchy />
      </Modal>

      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={2} lg={2}>
            <Card
              sx={{
                boxShadow: configure.box_shadow,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  align="left"
                  sx={{ color: configure.primary_color }}
                >
                  Forms
                </Typography>
                <Typography
                  align="left"
                  gutterBottom
                  sx={{ color: configure.dark_gray_color, fontSize: 12 }}
                >
                  System Parameter for Access Rights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      <ButtonComponent
                        click={() => {
                          requestRights.onClickOpenViewModal();
                        }}
                        iconType="view"
                        type="button"
                      >
                        Employee List
                      </ButtonComponent>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Field
                      id="user_code"
                      name="user_code"
                      label="User Code"
                      component={InputField}
                      required={false}
                      disabled={true}
                    />
                    <Field
                      id="full_name"
                      name="full_name"
                      label="Full Name"
                      component={InputField}
                      disabled={true}
                      required={false}
                    />
                    <Field
                      id="username"
                      name="username"
                      label="Username "
                      component={InputField}
                      disabled={true}
                      required={false}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={10} lg={10}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Stack
                  direction="row"
                  justifyContent={"space-between"}
                  alignItems={"flex-end"}
                  flexDirection={"row"}
                  spacing={2}
                >
                  <SearchField onChange={requestRights.onChangeSearch} />
                  <Page
                    page={RequestRights?.page}
                    limit={RequestRights?.dataListCount}
                    status={""}
                    onHandleChange={requestRights.handleChangePage}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Table
                  columns={requestRights.columns}
                  dataList={requestRights.dataList}
                  page={requestRights.page}
                  rowsPerPage={requestRights.rowsPerPage}
                  handleChangePage={requestRights.handleChangePage}
                  handleChangeRowsPerPage={
                    requestRights.handleChangeRowsPerPage
                  }
                  onSelectItem={requestRights.onClickOpenUpdateModal}
                  id={"page_rights_table"}
                  localStorage={""}
                  rowCount={requestRights.searchdataListCount}
                  action={(row) => {
                    // let access_rights = row?.access_rights;
                    // if (typeof access_rights == "undefined") {
                    //   access_rights = 0;
                    // }
                    // return (
                    //   <FormControl size="small">
                    //     <InputLabel
                    //       id="demo-simple-select-label"
                    //       shrink={true}
                    //     ></InputLabel>
                    //     <Select
                    //       labelId="demo-simple-select-label"
                    //       id="demo-simple-select"
                    //       label="Age"
                    //       value={access_rights}
                    //       onChange={(e) => {
                    //         requestRights.onUpdateEmployeeRequestAccess(
                    //           row,
                    //           e.target.value
                    //         );
                    //       }}
                    //     >
                    //       <MenuItem value={1}>Authorized</MenuItem>
                    //       <MenuItem value={0}>Disabled</MenuItem>
                    //     </Select>
                    //   </FormControl>
                    // );
                    return null;
                  }}
                  actionshow={true}
                  paginationShow={false}
                  subAction1Show={true}
                  heightLimit={true}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(RequestRights);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
