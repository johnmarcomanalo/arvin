import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HomeIcon from "@mui/icons-material/Home";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import SettingsIcon from "@mui/icons-material/Settings";
import WidgetsIcon from "@mui/icons-material/Widgets";
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import swal from "sweetalert";
import BreadCrumbs from "components/breadCrumb/BreadCrumbs";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
import SearchField from "components/inputFIeld/SearchField";
import PageTitle from "components/pageTItle/PageTitle";
import Page from "components/pagination/Pagination";
import Table from "components/table/Table";
import { Constants } from "../../../../../reducer/Contants";
import configure from "apps/configure/configure.json";
import { postReferenceUnitOfMeasurements } from "../actions/ReferenceActions";
import RefUnitOfMeasurementsHooks from "../hooks/RefUnitOfMeasurementsHooks";
import UpdateRefUnitOfMeasurements from "./components/UpdateRefUnitOfMeasurements";
import Modal from "components/modal/Modal";
const title_page = "Unit of Measurements";
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
const formName = "RefUnitOfMeasurements";
const submit = async (values, dispatch, props) => {
  try {
    const response = await dispatch(postReferenceUnitOfMeasurements(values));
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
    swal(response.title, response.message, response.status);
  } catch (error) {
    console.log(error);
  }
};
let IndexRefUnitOfMeasurements = (props) => {
  const matches = useMediaQuery("(min-width:600px)");
  const { ...refUnitOfMeasurements } = RefUnitOfMeasurementsHooks(props);
  return (
    <React.Fragment>
      <Modal
        open={refUnitOfMeasurements.updateModal}
        fullScreen={matches ? false : true}
        title={"Update Unit of Measurement"}
        size={"xs"}
        action={undefined}
        handleClose={refUnitOfMeasurements.onClickCloseUpdateModal}
      >
        <UpdateRefUnitOfMeasurements
          account_details={refUnitOfMeasurements.account_details}
          selected_ref={refUnitOfMeasurements.selected_ref}
        />
      </Modal>
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
                  System Parameter for Reference Unit of Measurements
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
                      id="type"
                      name="type"
                      label="Unit"
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
            <SearchField onChange={refUnitOfMeasurements.onChangeSearch} />
            <Page
              page={refUnitOfMeasurements?.page}
              limit={refUnitOfMeasurements?.dataListCount}
              status={""}
              onHandleChange={refUnitOfMeasurements.handleChangePage}
            />
          </Stack>
          <Table
            columns={refUnitOfMeasurements.columns}
            dataList={refUnitOfMeasurements.dataList}
            page={refUnitOfMeasurements.page}
            rowsPerPage={refUnitOfMeasurements.rowsPerPage}
            handleChangePage={refUnitOfMeasurements.handleChangePage}
            handleChangeRowsPerPage={
              refUnitOfMeasurements.handleChangeRowsPerPage
            }
            onSelectItem={refUnitOfMeasurements.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={refUnitOfMeasurements.dataListCount}
            actionshow={true}
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
})(IndexRefUnitOfMeasurements);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.ReferenceReducer.refresh;

  return { refresh };
}, {})(ReduxFormComponent);
