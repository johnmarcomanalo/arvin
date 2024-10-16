import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import WidgetsIcon from "@mui/icons-material/Widgets";
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import swal from "sweetalert";
import ComboBox from "../../../../../components/autoComplete/AutoComplete";
import BreadCrumbs from "../../../../../components/breadCrumb/BreadCrumbs";
import ButtonComponent from "../../../../../components/button/Button";
import InputField from "../../../../../components/inputFIeld/InputField";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import Modal from "../../../../../components/modal/Modal";
import PageTitle from "../../../../../components/pageTItle/PageTitle";
import Page from "../../../../../components/pagination/Pagination";
import Table from "../../../../../components/table/Table";
import { Constants } from "../../../../../reducer/Contants";
import configure from "../../../../configure/configure.json";
import { postReferenceProductGroups } from "../actions/ReferenceActions";
import RefProductGroupsHooks from "../hooks/RefProductGroupsHooks";
import UpdateRefProductGroups from "./components/UpdateRefProductGroups";
const title_page = "Product Groups";
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
const formName = "RefProductGroups";
const submit = async (values, dispatch, props) => {
  try {
    const response = await dispatch(postReferenceProductGroups(values));
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
let IndexRefProductGroups = (props) => {
  const matches = useMediaQuery("(min-width:600px)");
  const { ...refProductGroups } = RefProductGroupsHooks(props);
  return (
    <React.Fragment>
      <Modal
        open={refProductGroups.updateModal}
        fullScreen={matches ? false : true}
        title={"Update Unit of Measurement"}
        size={"xs"}
        action={undefined}
        handleClose={refProductGroups.onClickCloseUpdateModal}
      >
        <UpdateRefProductGroups
          account_details={refProductGroups.account_details}
          selected_ref={refProductGroups.selected_ref}
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
                  System Parameter for Reference Product Groups
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Field
                      id="description"
                      name="description"
                      label="Description"
                      options={refProductGroups?.product_group_category_sap}
                      getOptionLabel={(option) =>
                        option.description ? option.description : ""
                      }
                      required={true}
                      component={ComboBox}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Field
                      id="unit_conversion"
                      name="unit_conversion"
                      label="Unit Conversion"
                      component={InputField}
                      required={true}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Field
                      id="unit_of_measurment"
                      name="unit_of_measurment"
                      label="UoM Quota"
                      options={refProductGroups?.unit_of_measurements}
                      getOptionLabel={(option) =>
                        option.description ? option.description : ""
                      }
                      required={true}
                      component={ComboBox}
                      onChangeHandle={(e, newValue) => {
                        if (newValue?.description) {
                          props.change(
                            "ref_unit_of_measurements_code",
                            newValue?.code
                          );
                        }
                      }}
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
            <SearchField onChange={refProductGroups.onChangeSearch} />
            <Page
              page={refProductGroups?.page}
              limit={refProductGroups?.dataListCount}
              status={""}
              onHandleChange={refProductGroups.handleChangePage}
            />
          </Stack>
          <Table
            columns={refProductGroups.columns}
            dataList={refProductGroups.dataList}
            page={refProductGroups.page}
            rowsPerPage={refProductGroups.rowsPerPage}
            handleChangePage={refProductGroups.handleChangePage}
            handleChangeRowsPerPage={refProductGroups.handleChangeRowsPerPage}
            onSelectItem={refProductGroups.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={refProductGroups.dataListCount}
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
})(IndexRefProductGroups);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.ReferenceReducer.refresh;

  return { refresh };
}, {})(ReduxFormComponent);
