import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import swal from "sweetalert";
import ComboBox from "components/autoComplete/AutoComplete";
import BreadCrumbs from "components/breadCrumb/BreadCrumbs";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
import SearchField from "components/inputFIeld/SearchField";
import PageTitle from "components/pageTItle/PageTitle";
import Page from "components/pagination/Pagination";
import Table from "components/table/Table";
import { Constants } from "../../../../../reducer/Contants";
import configure from "apps/configure/configure.json";
import { postReferenceSubcomponent } from "../actions/ReferenceActions";
import RefSubcomponentsHooks from "../hooks/RefSubcomponentsHooks";
const title_page = "Subcomponents";
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
const formName = "RefSubcomponents";
const submit = async (values, dispatch, props) => {
  try {
    const response = await dispatch(postReferenceSubcomponent(values));
    await dispatch({
      type: Constants.ACTION_LOADING,
      payload: {
        loading: false,
      },
    });
    await dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        refresh: !props.refresh,
      },
    });
    swal(response.data.title, response.data.message, response.data.status);
  } catch (error) {
    console.log(error);
  }
};
let IndexRefComponents = (props) => {
  const { ...refsubcomponents } = RefSubcomponentsHooks(props);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <BreadCrumbs breadCrumbs={breadCrumbArray} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <PageTitle title={title_page} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={2}>
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
                  System Parameter for Reference Subcomponents
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Field
                      key={props.refresh}
                      id="module_description"
                      name="module_description"
                      label="Module"
                      options={refsubcomponents?.modules}
                      getOptionLabel={(option) =>
                        option.description ? option.description : ""
                      }
                      required={true}
                      component={ComboBox}
                      onChangeHandle={(e, newValue) => {
                        if (newValue?.description) {
                          props.change("module_code", newValue.code);
                          refsubcomponents.getComponentsbyModuleID(
                            newValue.code
                          );
                        }
                      }}
                    />
                    <Field
                      key={props.refresh}
                      id="component_description"
                      name="component_description"
                      label="Component"
                      options={refsubcomponents?.components}
                      getOptionLabel={(option) =>
                        option.description ? option.description : ""
                      }
                      required={true}
                      component={ComboBox}
                      onChangeHandle={(e, newValue) => {
                        if (newValue?.description) {
                          props.change("component_code", newValue.code);
                        }
                      }}
                    />
                    <Field
                      id="description"
                      name="description"
                      label="Description"
                      component={InputField}
                      required={true}
                    />
                    <Field
                      id="link"
                      name="link"
                      label="Link"
                      component={InputField}
                      required={true}
                    />
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
                        iconType="add"
                        type="submit"
                        fullWidth={true}
                        children={"Add"}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={10}>
          <Stack
            direction="row"
            justifyContent={"space-between"}
            alignItems={"flex-end"}
            spacing={2}
            sx={{ margin: 1 }}
          >
            <SearchField onChange={refsubcomponents.onChangeSearch} />
            <Page
              page={refsubcomponents?.page}
              limit={refsubcomponents?.dataListCount}
              status={""}
              onHandleChange={refsubcomponents.handleChangePage}
            />
          </Stack>
          <Table
            columns={refsubcomponents.columns}
            dataList={refsubcomponents.dataList}
            page={refsubcomponents.page}
            rowsPerPage={refsubcomponents.rowsPerPage}
            handleChangePage={refsubcomponents.handleChangePage}
            handleChangeRowsPerPage={refsubcomponents.handleChangeRowsPerPage}
            onSelectItem={refsubcomponents.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={refsubcomponents.dataListCount}
            actionShow={false}
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
})(IndexRefComponents);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.ReferenceReducer.refresh;

  return { refresh };
}, {})(ReduxFormComponent);
