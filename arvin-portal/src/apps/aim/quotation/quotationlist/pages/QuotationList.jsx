import PrintIcon from "@mui/icons-material/Print";
import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { connect } from "react-redux";
import { change, formValueSelector, reduxForm } from "redux-form";
import ButtonComponent from "../../../../../components/button/Button";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import Modal from "../../../../../components/modal/Modal";
import Table from "../../../../../components/table/Table";
import configure from "../../../../configure/configure.json";
import QuotationListHooks from "../hooks/QuotationListHooks";
import ViewPrintQuotation from "./components/ViewPrintQuotation";
import ViewRequestQuotation from "./components/ViewQuotation";
const formName = "QuotationList";
const submit = async (values, dispatch, props, hook) => {
  try {
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let QuotationList = (props) => {
  const { ...forApprovalQuotation } = QuotationListHooks(props);
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
      <Modal
        open={forApprovalQuotation?.printModal}
        // fullScreen={matches ? false : true}
        title={"Print Preview Details"}
        // size={"lg"}
        fullScreen={true}
        action={undefined}
        handleClose={forApprovalQuotation.onClickClosePrintModal}
      >
        <ViewPrintQuotation
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
          <Grid item xs={12} sm={12} md={6} lg={6}>
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
                if(row.status === 'Approved'){}
                return (
                  
                  <Tooltip title="Print">
                    <PrintIcon
                      onClick={() =>
                        forApprovalQuotation.onClickOpenPrintModal(row)
                      }
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
})(QuotationList);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.QuotationReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
