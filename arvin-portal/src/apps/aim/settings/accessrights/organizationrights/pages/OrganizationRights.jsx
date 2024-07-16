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
import UserList from "../../../../humanresource/employeeList/pages/components/UserList";
import OrganizationRightsHooks from "../hooks/OrganizationRightsHooks";
import SearchField from "../../../../../../components/inputFIeld/SearchField";
const formName = "PageRights";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};
let OrganizationRights = (props) => {
  const { ...organizationRights } = OrganizationRightsHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={organizationRights.viewModal}
        fullScreen={matches ? false : true}
        title={"Employee Search"}
        size={"md"}
        action={undefined}
        handleClose={organizationRights.onClickCloseViewModal}
      >
        <UserList />
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
                          organizationRights.onClickOpenViewModal();
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
              <Grid item xs={12} sm={12} md={3} lg={3}>
                <SearchField onChange={organizationRights.onChangeSearch} />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Table
                  columns={organizationRights.columns}
                  dataList={organizationRights.dataList}
                  page={organizationRights.page}
                  rowsPerPage={organizationRights.rowsPerPage}
                  handleChangePage={organizationRights.handleChangePage}
                  handleChangeRowsPerPage={
                    organizationRights.handleChangeRowsPerPage
                  }
                  onSelectItem={organizationRights.onSelectItem}
                  id={"page_rights_table"}
                  localStorage={""}
                  rowCount={organizationRights.searchdataListCount}
                  action={(row) => {
                    let access_rights = row?.access_rights;
                    if (typeof access_rights == "undefined") {
                      access_rights = 0;
                    }
                    return (
                      <FormControl size="small" fullWidth>
                        <InputLabel
                          id="demo-simple-select-label"
                          shrink={true}
                        ></InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Age"
                          value={access_rights}
                          onChange={(e) => {
                            organizationRights.onUpdateEmployeeOrganizationAccess(
                              row,
                              e.target.value
                            );
                          }}
                        >
                          <MenuItem value={1}>Authorized</MenuItem>
                          <MenuItem value={0}>Disabled</MenuItem>
                        </Select>
                      </FormControl>
                    );
                  }}
                  actionshow={true}
                  paginationShow={false}
                  subAction1Show={false}
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
})(OrganizationRights);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
