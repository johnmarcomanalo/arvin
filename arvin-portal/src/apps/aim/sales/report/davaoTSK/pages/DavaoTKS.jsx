import { Grid, Stack, useMediaQuery } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import Table from "components/table/Table";
import DavaoTKSHooks from "../hooks/DavaoTKSHooks";
import ButtonComponent from "components/button/Button";
import configure from "apps/configure/configure.json";
import InputField from "components/inputFIeld/InputField";
import swal from "sweetalert";
import ComboBox from "components/autoComplete/AutoComplete";
const formName = "DavaoTKS";

const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    swal("Oppss!", "Something went wrong, please try again!", "error");
  }
};

let DavaoTKS = (props) => {
  const { ...davaoTKS } = DavaoTKSHooks(props);
  const state = davaoTKS.state;
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <form onSubmit={props.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Field
                    key={props.refresh}
                    id="type"
                    name="type"
                    label="Type"
                    options={state?.type}
                    getOptionLabel={(option) =>
                      option.description ? option.description : "Create Date"
                    }
                    required={true}
                    component={ComboBox}
                    onChangeHandle={(e, newValue) => {
                      if (newValue?.description) {
                        davaoTKS.onChangeFilterType(newValue.description);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Field
                    id="date_start"
                    name="date_start"
                    label="Date Start"
                    required={true}
                    type="date"
                    component={InputField}
                    onChange={(event) => {
                      // Get the date from the input event
                      const selectedDate = event.target.value;
                      if (selectedDate) {
                        // Pass the selected date to your handler
                        davaoTKS.onChangeFilterStart(selectedDate);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Field
                    id="date_end"
                    name="date_end"
                    label="Date End"
                    required={true}
                    type="date"
                    component={InputField}
                    onChange={(event) => {
                      // Get the date from the input event
                      const selectedDate = event.target.value;
                      if (selectedDate) {
                        // Pass the selected date to your handler
                        davaoTKS.onChangeFilterEnd(selectedDate);
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </form>
            <ButtonComponent
              stx={configure.default_button}
              iconType="export"
              type="export"
              fullWidth={true}
              children={"Export Table"}
              click={() => {
                davaoTKS.exportToExcel(davaoTKS.dataList, "Davao-TKS");
              }}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={davaoTKS.columns}
            dataList={davaoTKS.dataList}
            page={davaoTKS.page}
            rowsPerPage={davaoTKS.rowsPerPage}
            handleChangePage={davaoTKS.handleChangePage}
            handleChangeRowsPerPage={davaoTKS.handleChangeRowsPerPage}
            onSelectItem={davaoTKS.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={davaoTKS.dataListCount}
            actionshow={false}
            paginationShow={false}
            subAction1Show={false}
            subAction2Show={false}
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
  onSubmit: "",
})(DavaoTKS);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;

  return {
    refresh,
  };
}, {})(ReduxFormComponent);
