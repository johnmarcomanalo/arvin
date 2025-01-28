import AcUnitIcon from "@mui/icons-material/AcUnit";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import swal from "sweetalert";
import BreadCrumbs from "../../../../../components/breadCrumb/BreadCrumbs";
import ButtonComponent from "../../../../../components/button/Button";
import InputField from "../../../../../components/inputFIeld/InputField";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import PageTitle from "../../../../../components/pageTItle/PageTitle";
import Page from "../../../../../components/pagination/Pagination";
import Table from "../../../../../components/table/Table";
import { Constants } from "../../../../../reducer/Contants";
import configure from "../../../../configure/configure.json";
import { postReferenceHolidays } from "../actions/ReferenceActions";
import RefHolidaysHooks from "../hooks/RefHolidaysHooks";
import ComboBox from "../../../../../components/autoComplete/AutoComplete";
import RefSubSectionsFormHooks from "../hooks/RefSubSectionsFormHooks";
const title_page = "Holidays";
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
      <AcUnitIcon
        sx={{
          mr: 0.5,
          fontSize: configure.bread_crumbs_font_size,
          color: configure.primary_color,
        }}
      />
    ),
  },
];
const formName = "RefHolidays";
const submit = async (values, dispatch, props) => {
  try {
    const response = await dispatch(postReferenceHolidays(values));
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
let IndexRefHolidays = (props) => {
  const { ...refHolidays } = RefHolidaysHooks(props);
  const access = refHolidays.access;
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
                  System Parameter for Reference Holiday
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Field
                      id="type"
                      name="type"
                      label="Type"
                      options={configure?.holiday_type}
                      getOptionLabel={(option) =>
                        option.description ? option.description : ""
                      }
                      required={true}
                      component={ComboBox}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Field
                      id="holiday_date"
                      name="holiday_date"
                      label="Date"
                      type="date"
                      component={InputField}
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Field
                      id="subsection_description"
                      name="subsection_description"
                      label="Subsection"
                      options={access?.user_access_organization_rights}
                      getOptionLabel={(option) =>
                        option.description ? option.description : ""
                      }
                      required={false}
                      component={ComboBox}
                      onChangeHandle={(e, newValue) => {
                        if (newValue?.description) {
                          props.change("section_code", newValue.section_code);
                          props.change("subsection_code", newValue.code);
                        }
                      }}
                    />
                  </Grid>
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
            <SearchField onChange={refHolidays.onChangeSearch} />
            <Page
              page={refHolidays?.page}
              limit={refHolidays?.dataListCount}
              status={""}
              onHandleChange={refHolidays.handleChangePage}
            />
          </Stack>
          <Table
            columns={refHolidays.columns}
            dataList={refHolidays.dataList}
            page={refHolidays.page}
            rowsPerPage={refHolidays.rowsPerPage}
            handleChangePage={refHolidays.handleChangePage}
            handleChangeRowsPerPage={refHolidays.handleChangeRowsPerPage}
            onSelectItem={refHolidays.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={refHolidays.dataListCount}
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
})(IndexRefHolidays);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.ReferenceReducer.refresh;

  return { refresh };
}, {})(ReduxFormComponent);
