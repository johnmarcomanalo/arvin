import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import ButtonComponent from "../../../../../components/button/Button";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import Page from "../../../../../components/pagination/Pagination";
import Table from "../../../../../components/table/Table";
import configure from "../../../../configure/configure.json";
import ForApprovalQuotationHooks from "../hooks/ForApprovalQuotationHooks";
import { change, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { postForApprovalSalesQuotation } from "../actions/ForApprovalQuotationActions";
import { Constants } from "../../../../../reducer/Contants";
import swal from "sweetalert";

const formName = "ForApprovalQuotation";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(postForApprovalSalesQuotation(values));
    // await dispatch({
    //   type: Constants.ACTION_REFERENCE,
    //   payload: {
    //     refresh: !props.refresh,
    //   },
    // });
    // swal(res.data.title, res.data.message, res.data.icon);
  } catch (error) {
    console.log(error);
  }
};

let ForApprovalQuotation = (props) => {
  const { ...forApprovalQuotation } = ForApprovalQuotationHooks(props);
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  const state = forApprovalQuotation.state;
  props.dispatch(
    change(formName, "selected_requests", state?.selectedDataList)
  );
  const onSubmit = (values) => submit(values, props.dispatch, props);

  return (
    <React.Fragment>
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
              onSelectItem={forApprovalQuotation.onSelectItem}
              id={"home_attendance"}
              localStorage={""}
              rowCount={forApprovalQuotation.dataListCount}
              actionshow={true}
              paginationShow={false}
              subAction1Show={false}
              subAction2Show={true}
              action={(row, index) => {
                return (
                  <FormGroup row>
                    <FormControlLabel
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
                  </FormGroup>
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
})(ForApprovalQuotation);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.QuotationReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
