import PrintIcon from "@mui/icons-material/Print";
import { Grid, Stack, TextField, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { connect } from "react-redux";
import { change, Field, formValueSelector, reduxForm } from "redux-form";
import ButtonComponent from "../../../../../components/button/Button";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import Modal from "../../../../../components/modal/Modal";
import Table from "../../../../../components/table/Table";
import configure from "../../../../configure/configure.json";
import MyQuotationListHooks from "../hooks/MyQuotationListHooks";
import ViewPrintQuotation from "../../quotationlist/pages/components/ViewPrintQuotation";
import ViewQuotation from "../../quotationlist/pages/components/ViewQuotation";
import InputField from "../../../../../components/inputFIeld/InputField";
import moment from "moment";
import ComboBox from "../../../../../components/autoComplete/AutoComplete";
import ViewAwardedQuotation from "../../quotationlist/pages/components/ViewAwardedQuotation";
const formName = "MyQuotationList";
const submit = async (values, dispatch, props, hook) => {
  try {
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let MyQuotationList = (props) => {
  const { ...quotationList } = MyQuotationListHooks(props);
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  const state = quotationList.state;
  props.dispatch(
    change(formName, "selected_requests", state?.selectedDataList)
  );
  const onSubmit = (values) =>
    submit(values, props.dispatch, props, quotationList);

  return (
    <React.Fragment>
      <Modal
        open={quotationList?.viewModal}
        // fullScreen={matches ? false : true}
        title={"Quotation Details"}
        fullScreen={true}
        // size={"lg"}
        action={undefined}
        handleClose={quotationList.onClickCloseViewModal}
      >
        <ViewQuotation
          onClickOpenModal={quotationList.onClickOpenReportModal}
          selected_data={quotationList.selectedDataList}
          awarded_columns={quotationList.awarded_columns}
        />
      </Modal>
      <Modal
        open={quotationList?.printModal}
        // fullScreen={matches ? false : true}
        title={"Print Preview Details"}
        // size={"lg"}
        fullScreen={true}
        action={undefined}
        handleClose={quotationList.onClickClosePrintModal}
      >
        <ViewPrintQuotation selected_data={quotationList.selectedDataList} />
      </Modal>
      <Modal
        open={quotationList?.reportModal}
        fullScreen={matches ? false : true}
        title={"Award Details"}
        size={"md"}
        action={undefined}
        handleClose={quotationList.onClickCloseReportModal}
      >
        <ViewAwardedQuotation selected_data={quotationList.selectedDataList} />
      </Modal>
      <form onSubmit={props.handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Stack
              direction={matches ? "row" : "column"}
              alignItems={matches ? "center" : "flex-start"}
              justifyContent="space-between"
              spacing={2}
            >
              <SearchField
                value={quotationList.search}
                onChange={quotationList.onChangeSearch}
                textHidden={false}
              />
              <Stack
                direction={matches ? "row" : "column"}
                justifyContent="flex-end"
                alignItems={matches ? "center" : "flex-start"}
                spacing={2}
              >
                <Field
                  id="filter_date_start"
                  name="filter_date_start"
                  label="Start Date"
                  type="date"
                  component={InputField}
                  onChange={(event) => {
                    // Get the date from the input event
                    const selectedDate = event.target.value;
                    if (selectedDate) {
                      // Pass the selected date to your handler
                      quotationList.onChangeFilterStart(new Date(selectedDate));
                    }
                  }}
                  // disabled
                />
                <Field
                  id="filter_date_end"
                  name="filter_date_end"
                  label="End Date"
                  type="date"
                  component={InputField}
                  onChange={(event) => {
                    // Get the date from the input event
                    const selectedDate = event.target.value;
                    if (selectedDate) {
                      // Pass the selected date to your handler
                      quotationList.onChangeFilterEnd(new Date(selectedDate));
                    }
                  }}
                  // disabled
                />
                <Field
                  id="filterStatus"
                  name="filterStatus"
                  label="Status"
                  options={state?.status}
                  getOptionLabel={(option) =>
                    option?.description ? option?.description : "All"
                  }
                  component={ComboBox}
                  onChangeHandle={(e, newValue) => {
                    if (newValue?.description) {
                      quotationList.onChangeFilterStatus(newValue?.description);
                    }
                  }}
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Table
              columns={quotationList.columns}
              dataList={quotationList.dataList}
              page={quotationList.page}
              rowsPerPage={quotationList.rowsPerPage}
              handleChangePage={quotationList.handleChangePage}
              handleChangeRowsPerPage={quotationList.handleChangeRowsPerPage}
              onSelectItem={quotationList.onClickOpenViewModal}
              id={"home_attendance"}
              localStorage={""}
              rowCount={quotationList.dataListCount}
              actionshow={true}
              paginationShow={false}
              subAction1Show={true}
              subAction2Show={true}
              action={(row, index) => {
                if (row.status === "Approved") {
                }
                return (
                  <Tooltip title="Print">
                    <PrintIcon
                      onClick={() => quotationList.onClickOpenPrintModal(row)}
                      style={{
                        color: "#009197",
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
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
