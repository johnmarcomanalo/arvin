import {
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { connect } from "react-redux";
import { change, formValueSelector, reduxForm } from "redux-form";
import swal from "sweetalert";
import ButtonComponent from "../../../../../components/button/Button";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import Modal from "../../../../../components/modal/Modal";
import Table from "../../../../../components/table/Table";
import { Constants } from "../../../../../reducer/Contants";
import configure from "../../../../configure/configure.json";
import { postForApprovalSalesQuotation } from "../actions/ForApprovalQuotationActions";
import ForApprovalQuotationHooks from "../hooks/MyQuotationListHooks";
import ViewRequestQuotation from "./components/ViewQuotation";
const formName = "MyQuotationList";
const submit = async (values, dispatch, props, hook) => {
  try {
    const result = await swal({
      title: "Are you sure?",
      text:
        "Do you want to " +
        (values.status === "Approved" ? "approve" : "deny") +
        " this request?",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    });

    if (result) {
      // Await the dispatch and handle the response
      const res = await dispatch(postForApprovalSalesQuotation(values));

      // Dispatching the action to refresh
      await dispatch({
        type: Constants.ACTION_QUOTATION,
        payload: {
          refresh: !props.refresh,
        },
      });

      // Reset the selected data list
      await hook.onResetSelectedDataList();

      // Show the success or error message from the response
      await swal(res.title, res.message, res.icon);
    } else {
      // Optional: handle when the user cancels the action
      await swal("Cancelled", "The request remains unchanged.", "info");
    }
  } catch (error) {
    console.log(error);
    // Optional: Handle errors with a SweetAlert
    swal("Error", "An error occurred while processing the request.", "error");
  }
};

let MyQuotationList = (props) => {
  const { ...forApprovalQuotation } = ForApprovalQuotationHooks(props);
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  const state = forApprovalQuotation.state;
  props.dispatch(
    change(formName, "selected_requests", state?.selectedDataList)
  );
  const onSubmit = (values) =>
    submit(values, props.dispatch, props, forApprovalQuotation);

  return (
    <React.Fragment>
      {/*  */}
      <Modal
        open={forApprovalQuotation?.viewModal}
        fullScreen={matches ? false : true}
        title={"Quotation Details"}
        size={"lg"}
        action={undefined}
        handleClose={forApprovalQuotation.onClickCloseViewModal}
      >
        <ViewRequestQuotation
          selected_data={forApprovalQuotation.selectedDataList}
        />
      </Modal>
      <form onSubmit={props.handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-start" : "center"}
              alignItems={matches ? "flex-start" : "center"}
              flexDirection={matches ? "row" : "column"}
              spacing={2}
            >
              <SearchField
                value={forApprovalQuotation.search}
                onChange={forApprovalQuotation.onChangeSearch}
              />
            </Stack>
          </Grid>
          {/* <Grid item xs={12} sm={12} md={6} lg={6}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-end" : "center"}
              alignItems={matches ? "flex-end" : "center"}
              flexDirection={matches ? "row" : "column"}
              spacing={2}
            >
              <ButtonComponent
                stx={configure.default_button}
                iconType="filter"
                type="button"
                fullWidth={true}
                children={"Filter"}
                click={forApprovalQuotation.onClickSelectedApprove}
              />
            </Stack>
          </Grid> */}
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Stack
              direction="row"
              justifyContent={matches ? "flex-end" : "center"}
              alignItems={matches ? "flex-end" : "center"}
              flexDirection={matches ? "row" : "column"}
              spacing={2}
            >
              <ButtonComponent
                stx={configure.approve_button}
                iconType="approve"
                type="submit"
                fullWidth={true}
                children={"Approve (" + state.selectedDataList.length + ")"}
                click={() => {
                  forApprovalQuotation.onClickSubmit("Approved");
                }}
              />
              <ButtonComponent
                stx={configure.disapprove_button}
                iconType="deny"
                type="submit"
                fullWidth={true}
                children={"Deny (" + state.selectedDataList.length + ")"}
                click={() => {
                  forApprovalQuotation.onClickSubmit("Denied");
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Table
              columns={forApprovalQuotation.columns}
              dataList={forApprovalQuotation.dataList}
              page={forApprovalQuotation.page}
              rowsPerPage={forApprovalQuotation.rowsPerPage}
              handleChangePage={forApprovalQuotation.handleChangePage}
              handleChangeRowsPerPage={
                forApprovalQuotation.handleChangeRowsPerPage
              }
              onSelectItem={forApprovalQuotation.onClickOpenViewModal}
              id={"home_attendance"}
              localStorage={""}
              rowCount={forApprovalQuotation.dataListCount}
              actionshow={true}
              paginationShow={false}
              subAction1Show={true}
              subAction2Show={true}
              action={(row, index) => {
                return (
                  <FormControlLabel
                    size="small"
                    control={
                      <Checkbox
                        // checked={false}
                        onChange={(e) => {
                          forApprovalQuotation.onSelectRow(e, row);
                        }}
                      />
                    }
                    // label={"test"}
                  />
                );
              }}
            />
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
})(MyQuotationList);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.QuotationReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
