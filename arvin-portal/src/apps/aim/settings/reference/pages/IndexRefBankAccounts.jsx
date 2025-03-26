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
import BreadCrumbs from "../../../../../components/breadCrumb/BreadCrumbs";
import ButtonComponent from "../../../../../components/button/Button";
import InputField from "../../../../../components/inputFIeld/InputField";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import PageTitle from "../../../../../components/pageTItle/PageTitle";
import Page from "../../../../../components/pagination/Pagination";
import Table from "../../../../../components/table/Table";
import { Constants } from "../../../../../reducer/Contants";
import configure from "../../../../configure/configure.json";
import { postReferenceBankAccounts } from "../actions/ReferenceActions";
import RefBankAccountsHooks from "../hooks/RefBankAccountsHooks";
import UpdateRefBankAccounts from "./components/UpdateRefBankAccounts";
import Modal from "../../../../../components/modal/Modal";
const title_page = "Bank Accounts";
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
const formName = "RefBankAccounts";
const submit = async (values, dispatch, props) => {
  try {
    const response = await dispatch(postReferenceBankAccounts(values));
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
let IndexRefBankAccounts = (props) => {
  const { ...refBankAccounts } = RefBankAccountsHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={refBankAccounts.updateModal}
        fullScreen={matches ? false : true}
        title={"Update Currency"}
        size={"xs"}
        action={undefined}
        handleClose={refBankAccounts.onClickCloseUpdateModal}
      >
        <UpdateRefBankAccounts
          account_details={refBankAccounts.account_details}
          selected_ref={refBankAccounts.selected_ref}
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
                  System Parameter for Reference Currencies
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
                      label="Currency Type"
                      component={InputField}
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Field
                      id="bank_account_number"
                      name="bank_account_number"
                      label="Bank Account Number"
                      component={InputField}
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Field
                      id="prefix"
                      name="prefix"
                      label="Prefix (Company Prefix)"
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
            <SearchField onChange={refBankAccounts.onChangeSearch} />
            <Page
              page={refBankAccounts?.page}
              limit={refBankAccounts?.dataListCount}
              status={""}
              onHandleChange={refBankAccounts.handleChangePage}
            />
          </Stack>
          <Table
            columns={refBankAccounts.columns}
            dataList={refBankAccounts.dataList}
            page={refBankAccounts.page}
            rowsPerPage={refBankAccounts.rowsPerPage}
            handleChangePage={refBankAccounts.handleChangePage}
            handleChangeRowsPerPage={refBankAccounts.handleChangeRowsPerPage}
            onSelectItem={refBankAccounts.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={refBankAccounts.dataListCount}
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
})(IndexRefBankAccounts);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.ReferenceReducer.refresh;

  return { refresh };
}, {})(ReduxFormComponent);
