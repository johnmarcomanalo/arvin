import {
  Grid,
  Paper,
  Stack,
  TableContainer,
  useMediaQuery,
  Table,
  Tooltip,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
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
// import Table from "../../../../../../components/table/Table";
import configure from "../../../../../configure/configure.json";
import UserList from "../../../../humanresource/employeeList/pages/components/UserList";
import PageRightsHooks from "../hooks/PageRightsHooks";
import SearchField from "../../../../../../components/inputFIeld/SearchField";
import AccountList from "apps/aim/humanresource/employeeList/pages/components/AccountList";
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
  const [screenHeight, setScreenHeight] = React.useState(window.innerHeight);
  return (
    <React.Fragment>
      <Modal
        open={pageRights.viewModal}
        fullScreen={matches ? false : true}
        title={"Account Search"}
        size={"md"}
        action={undefined}
        handleClose={pageRights.onClickCloseViewModal}
      >
        <AccountList onClickSelect={pageRights.onSelectItem} />
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
                        Account List
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
                <SearchField onChange={pageRights.onChangeSearch} />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Paper sx={{ boxShadow: configure.box_shadow }}>
                  <TableContainer
                    sx={{
                      maxHeight: screenHeight - 300,
                      whiteSpace: "nowrap",
                      overflowX: "auto",
                    }}
                    id={"tableScroll2"}
                  >
                    <Table size="small" stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{
                              backgroundColor: configure.primary_table_color,
                              color: configure.primary_table_text_color,
                              textAlign: "left",
                            }}
                          >
                            Action
                          </TableCell>
                          {pageRights.columns.map((value) => {
                            return (
                              <TableCell
                                style={{
                                  backgroundColor:
                                    configure.primary_table_color,
                                  color: configure.primary_table_text_color,
                                  textAlign: "left",
                                }}
                              >
                                {value.label}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pageRights.dataList.map((data, index) => {
                          try {
                            let access_rights = data?.access_rights;
                            if (typeof access_rights == "undefined") {
                              access_rights = 0;
                            }
                            return (
                              <TableRow
                                key={data.code}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell>
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
                                        pageRights.onUpdateEmployeePageAccess(
                                          data,
                                          e.target.value
                                        );
                                      }}
                                    >
                                      <MenuItem value={1}>Authorized</MenuItem>
                                      <MenuItem value={0}>Disabled</MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell align="left">
                                  {data.module_description}
                                </TableCell>
                                <TableCell align="left">
                                  {data.component_description}
                                </TableCell>
                                <TableCell align="left">
                                  {data.sub_component_description}
                                </TableCell>
                                <TableCell align="left">
                                  <FormControlLabel
                                    label="Create"
                                    control={
                                      <Checkbox
                                        checked={
                                          data.create == 1 ? true : false
                                        }
                                        disabled={
                                          data.component_code == "" &&
                                          data.sub_component_code == ""
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          pageRights.handleAccessCheckType(
                                            e,
                                            "create",
                                            data
                                          );
                                        }}
                                      />
                                    }
                                  />
                                </TableCell>
                                <TableCell align="left">
                                  <FormControlLabel
                                    label="Update"
                                    control={
                                      <Checkbox
                                        checked={
                                          data.update == 1 ? true : false
                                        }
                                        disabled={
                                          data.component_code == "" &&
                                          data.sub_component_code == ""
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          pageRights.handleAccessCheckType(
                                            e,
                                            "update",
                                            data
                                          );
                                        }}
                                      />
                                    }
                                  />
                                </TableCell>
                                <TableCell align="left">
                                  <FormControlLabel
                                    label="Delete"
                                    control={
                                      <Checkbox
                                        checked={
                                          data.delete == 1 ? true : false
                                        }
                                        disabled={
                                          data.component_code == "" &&
                                          data.sub_component_code == ""
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          pageRights.handleAccessCheckType(
                                            e,
                                            "delete",
                                            data
                                          );
                                        }}
                                      />
                                    }
                                  />
                                </TableCell>
                                <TableCell align="left">
                                  <FormControlLabel
                                    label="Generate"
                                    control={
                                      <Checkbox
                                        checked={
                                          data.generate == 1 ? true : false
                                        }
                                        disabled={
                                          data.component_code == "" &&
                                          data.sub_component_code == ""
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          pageRights.handleAccessCheckType(
                                            e,
                                            "generate",
                                            data
                                          );
                                        }}
                                      />
                                    }
                                  />
                                </TableCell>
                                <TableCell align="left">
                                  <FormControlLabel
                                    label="Export"
                                    control={
                                      <Checkbox
                                        checked={
                                          data.export == 1 ? true : false
                                        }
                                        disabled={
                                          data.component_code == "" &&
                                          data.sub_component_code == ""
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          pageRights.handleAccessCheckType(
                                            e,
                                            "export",
                                            data
                                          );
                                        }}
                                      />
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          } catch (error) {
                            console.log(error);
                          }
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
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
})(PageRights);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
