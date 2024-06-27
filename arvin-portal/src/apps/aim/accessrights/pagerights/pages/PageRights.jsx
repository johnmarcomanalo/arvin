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
import ButtonComponent from "../../../../../components/button/Button";
import InputField from "../../../../../components/inputFIeld/InputField";
import Modal from "../../../../../components/modal/Modal";
import Table from "../../../../../components/table/Table";
import configure from "../../../../configure/configure.json";
import UserList from "../../../humanresource/employeeList/pages/components/UserList";
import PageRightsHooks from "../hooks/PageRightsHooks";
const formName = "PageRights";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};
let PageRights = (props) => {
  const { ...pageRights } = PageRightsHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={pageRights.viewModal}
        fullScreen={matches ? false : true}
        title={"Employee Search"}
        size={"md"}
        action={undefined}
        handleClose={pageRights.onClickCloseViewModal}
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
                          pageRights.onClickOpenViewModal();
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
            <Card
              sx={{
                boxShadow: configure.box_shadow,
              }}
            >
              <CardContent>
                <Table
                  columns={pageRights.columns}
                  dataList={pageRights.searchdataList}
                  page={pageRights.page}
                  rowsPerPage={pageRights.rowsPerPage}
                  handleChangePage={pageRights.handleChangePage}
                  handleChangeRowsPerPage={pageRights.handleChangeRowsPerPage}
                  onSelectItem={pageRights.onSelectItem}
                  id={"page_rights_table"}
                  localStorage={""}
                  rowCount={pageRights.searchdataListCount}
                  action={(row) => {
                    return (
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Age
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Age"
                          onChange={(e) => {
                            console.log(e.target.value);
                          }}
                        >
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    );
                  }}
                  actionshow={true}
                  paginationShow={false}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(PageRights);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
