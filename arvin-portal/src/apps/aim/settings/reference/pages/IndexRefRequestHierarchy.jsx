import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import WidgetsIcon from "@mui/icons-material/Widgets";
import {
  ButtonGroup,
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import { connect } from "react-redux";
import { change, Field, formValueSelector, reduxForm } from "redux-form";
import swal from "sweetalert";
import ComboBox from "components/autoComplete/AutoComplete";
import BreadCrumbs from "components/breadCrumb/BreadCrumbs";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
import SearchField from "components/inputFIeld/SearchField";
import Modal from "components/modal/Modal";
import PageTitle from "components/pageTItle/PageTitle";
import Page from "components/pagination/Pagination";
import Table from "components/table/Table";
import { Constants } from "../../../../../reducer/Contants";
import configure from "apps/configure/configure.json";
import EmployeeList from "../../../humanresource/employeeList/pages/components/EmployeeList";
import { postReferenceRequestHierarchy } from "../actions/ReferenceActions";
import RefRequestHierarchyHooks from "../hooks/RefRequestHierarchyHooks";
import ViewRefRequestHierarchy from "./components/ViewRefRequestHierarchy";
const title_page = "Request Hierarchy";
const breadCrumbArray = [
  {
    name: "Home",
    href: "/",
    icon: (
      <HomeIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
  {
    name: "Settings",
    href: "",
    icon: (
      <SettingsIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
  {
    name: "Reference",
    href: "",
    icon: (
      <AutoStoriesIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
  {
    name: title_page,
    href: "",
    icon: (
      <WidgetsIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
];
const formName = "RefRequestHierarchy";
const submit = async (values, dispatch, props) => {
  try {
    let data = {
      description: values.description,
      hierarchy_structure: values.hierarchy,
      request_type_code: values.request_type_code,
      added_by: values.added_by,
      modified_by: values.modified_by,
    };
    const response = await dispatch(postReferenceRequestHierarchy(data));
    await dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        refresh: !props.refresh,
      },
    });
    swal(response.title, response.message, response.status);
  } catch (error) {
    console.log(error);
  }
};
let IndexRefRequestHierarchy = (props) => {
  const { ...refRequestHierarchy } = RefRequestHierarchyHooks(props);
  const state = refRequestHierarchy.state;
  const matches = useMediaQuery("(min-width:600px)");
  props.dispatch(change(formName, "hierarchy", state?.hierarchy));
  return (
    <React.Fragment>
      <Modal
        open={refRequestHierarchy.viewModal}
        fullScreen={matches ? false : true}
        title={"Employee Search"}
        size={"md"}
        action={undefined}
        handleClose={refRequestHierarchy.onClickCloseViewModal}
      >
        <EmployeeList onClickSelect={refRequestHierarchy.onSelectApprover} />
      </Modal>
      <Modal
        open={refRequestHierarchy.viewSelectedRefModal}
        fullScreen={matches ? false : true}
        title={"Hierarchy"}
        size={"sm"}
        action={undefined}
        handleClose={refRequestHierarchy.onClickCloseRefViewModal}
      >
        <ViewRefRequestHierarchy />
      </Modal>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <BreadCrumbs breadCrumbs={breadCrumbArray} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <PageTitle title={title_page} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={3}>
          <form onSubmit={props.handleSubmit}>
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
                  System Parameter for Reference Hierarchy Request
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Field
                      id="description"
                      name="description"
                      label="Description"
                      component={InputField}
                      required={true}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Field
                      key={props.refresh}
                      id="request_type_description"
                      name="request_type_description"
                      label="Request Type"
                      options={refRequestHierarchy?.request_types}
                      getOptionLabel={(option) =>
                        option.description ? option.description : ""
                      }
                      required={true}
                      component={ComboBox}
                      onChangeHandle={(e, newValue) => {
                        if (newValue?.description) {
                          props.change("request_type_code", newValue.code);
                          props.change("request_type_type", newValue.type);
                        }
                      }}
                    />
                  </Grid>
                  {state.hierarchy.map((value, index) => {
                    let approvers = value?.approver;
                    return (
                      <Grid item xs={12} md={12}>
                        <Field
                          id={"level_description-" + index}
                          name={"level_description-" + index}
                          label={"Level " + (index + 1) + " Description "}
                          component={InputField}
                          value={value.description}
                          required={true}
                          multiline={true}
                          onChange={(e) => {
                            refRequestHierarchy.onChangeHierarchyLevelDescription(
                              e,
                              index
                            );
                          }}
                        />
                        <List
                          sx={{
                            width: "100%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                          }}
                        >
                          {approvers.map((approver, index_approver) => (
                            <ListItem
                              key={index_approver}
                              disableGutters
                              secondaryAction={
                                <IconButton
                                  aria-label="comment"
                                  onClick={() => {
                                    refRequestHierarchy.onRemoveApprover(
                                      approver
                                    );
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                              }
                            >
                              <ListItemText primary={approver.full_name} />
                            </ListItem>
                          ))}
                        </List>
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                          alignItems="flex-end"
                          spacing={2}
                          sx={{ margin: 1 }}
                        >
                          <ButtonGroup
                            disableElevation
                            aria-label="Disabled button group"
                          >
                            <ButtonComponent
                              stx={configure.default_button}
                              iconType="add"
                              type="button"
                              fullWidth={true}
                              children={"Add Approver"}
                              click={() => {
                                refRequestHierarchy.onClickOpenViewModal(index);
                              }}
                            />
                          </ButtonGroup>
                        </Stack>
                      </Grid>
                    );
                  })}
                </Grid>

                <Grid item xs={12} md={12}>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                    spacing={2}
                    sx={{ margin: 1 }}
                  >
                    <ButtonGroup
                      disableElevation
                      aria-label="Disabled button group"
                    >
                      <ButtonComponent
                        stx={configure.default_button}
                        iconType="add"
                        type="button"
                        fullWidth={true}
                        children={"Add Level"}
                        click={refRequestHierarchy.onClickAddHierarchyLevel}
                      />
                      <ButtonComponent
                        stx={configure.default_button}
                        iconType="remove"
                        type="button"
                        fullWidth={true}
                        children={"Remove Level"}
                        click={refRequestHierarchy.onClickRemoveHierarchyLevel}
                      />
                    </ButtonGroup>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                    spacing={2}
                  >
                    <ButtonComponent
                      stx={configure.default_button}
                      iconType="submit"
                      type="submit"
                      fullWidth={true}
                      children={"Submit "}
                    />
                  </Stack>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={9}>
          <Stack
            direction="row"
            justifyContent={"space-between"}
            alignItems={"flex-end"}
            spacing={2}
            sx={{ margin: 1 }}
          >
            <SearchField onChange={refRequestHierarchy.onChangeSearch} />
            <Page
              page={refRequestHierarchy?.page}
              limit={refRequestHierarchy?.dataListCount}
              status={""}
              onHandleChange={refRequestHierarchy.handleChangePage}
            />
          </Stack>
          <Table
            columns={refRequestHierarchy.columns}
            dataList={refRequestHierarchy.dataList}
            page={refRequestHierarchy.page}
            rowsPerPage={refRequestHierarchy.rowsPerPage}
            handleChangePage={refRequestHierarchy.handleChangePage}
            handleChangeRowsPerPage={
              refRequestHierarchy.handleChangeRowsPerPage
            }
            onSelectItem={refRequestHierarchy.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={refRequestHierarchy.dataListCount}
            actionshow={true}
            subAction1Show={true}
            paginationShow={false}
            action={(row) => {
              return null;
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(IndexRefRequestHierarchy);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.ReferenceReducer.refresh;

  return { refresh };
}, {})(ReduxFormComponent);
