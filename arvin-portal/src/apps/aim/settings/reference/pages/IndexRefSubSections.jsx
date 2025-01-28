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
import swal from "sweetalert";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm, reset } from "redux-form";
import ComboBox from "../../../../../components/autoComplete/AutoComplete";
import BreadCrumbs from "../../../../../components/breadCrumb/BreadCrumbs";
import ButtonComponent from "../../../../../components/button/Button";
import InputField from "../../../../../components/inputFIeld/InputField";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import PageTitle from "../../../../../components/pageTItle/PageTitle";
import Page from "../../../../../components/pagination/Pagination";
import Table from "../../../../../components/table/Table";
import { Constants } from "../../../../../reducer/Contants";
import configure from "../../../../configure/configure.json";
import {
  postReferenceComponent,
  postReferenceSubsection,
} from "../actions/ReferenceActions";
import RefSubSectionsFormHooks from "../hooks/RefSubSectionsFormHooks";
import Modal from "../../../../../components/modal/Modal";
import UpdateRefSubsections from "./components/UpdateRefSubsections";
const title_page = "Subsections";
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
const formName = "Refsubsections";
const submit = async (values, dispatch, props) => {
  try {
    const response = await dispatch(postReferenceSubsection(values));
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
    // dispatch(reset(formName));
    props.resetForm();
  } catch (error) {
    console.log(error);
  }
};
let IndexRefsubsections = (props) => {
  const matches = useMediaQuery("(min-width:600px)");
  const { ...refsubsections } = RefSubSectionsFormHooks(props);
  let dataList = refsubsections.dataList ? refsubsections.dataList : [];
  return (
    <React.Fragment>
      {/* <Modal
        open={refsubsections.updateModal}
        fullScreen={matches ? false : true}
        title={"Update Subsections"}
        size={"xs"}
        action={undefined}
        handleClose={refsubsections.onClickCloseUpdateModal}
      >
        <UpdateRefSubsections
          account_details={refsubsections.account_details}
          selected_ref={refsubsections.selected_ref}
        />
      </Modal> */}
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
                  System Parameter for Reference Subsections
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Field
                      id="section_description"
                      name="section_description"
                      label="Section"
                      options={refsubsections?.sections}
                      getOptionLabel={(option) =>
                        option.description ? option.description : ""
                      }
                      required={true}
                      component={ComboBox}
                      onChangeHandle={(e, newValue) => {
                        if (newValue?.description) {
                          props.change("section_code", newValue.code);
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
                      id="type"
                      name="type"
                      label="Abbreviation"
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
            <SearchField
              value={refsubsections.search}
              onChange={refsubsections.onChangeSearch}
            />
            <Page
              page={refsubsections?.page}
              limit={refsubsections?.dataListCount}
              status={""}
              onHandleChange={refsubsections.handleChangePage}
            />
          </Stack>
          <Table
            columns={refsubsections.columns}
            dataList={refsubsections.dataList}
            page={refsubsections.page}
            rowsPerPage={refsubsections.rowsPerPage}
            handleChangePage={refsubsections.handleChangePage}
            handleChangeRowsPerPage={refsubsections.handleChangeRowsPerPage}
            onSelectItem={refsubsections.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={refsubsections.dataListCount}
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
})(IndexRefsubsections);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.ReferenceReducer.refresh;

  return { refresh };
}, {})(ReduxFormComponent);
