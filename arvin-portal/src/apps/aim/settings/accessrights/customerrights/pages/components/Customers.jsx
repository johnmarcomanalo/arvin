import { Grid, Stack, useMediaQuery } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import SearchField from "components/inputFIeld/SearchField";
import Page from "components/pagination/Pagination";
import Table from "components/table/Table";
import CustomersHooks from "../../hooks/CustomersHooks";
import ComboBox from "components/autoComplete/AutoComplete";
const formName = "Customers";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};
let Customers = (props) => {
  const matches = useMediaQuery("(min-width:600px)");
  const { ...customers } = CustomersHooks(props);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Field
            id="type"
            name="type"
            label="Type"
            options={customers?.type}
            getOptionLabel={(option) =>
              option?.description ? option?.description : ""
            }
            required={true}
            component={ComboBox}
            onChangeHandle={(e, newValue) => {
              if (newValue?.description) {
                customers.onChangeFilter(newValue?.description);
              } else {
                customers.onChangeFilter("");
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <SearchField onChange={customers.onChangeSearch} textHidden={false} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Page
              page={customers?.page}
              limit={customers?.dataListCount}
              status={""}
              onHandleChange={customers.handleChangePage}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={customers.columns}
            dataList={customers.dataList}
            page={customers.page}
            rowsPerPage={customers.rowsPerPage}
            handleChangePage={customers.handleChangePage}
            handleChangeRowsPerPage={customers.handleChangeRowsPerPage}
            onSelectItem={props.onClickSelect}
            id={"customers_table"}
            localStorage={""}
            rowCount={customers.searchdataListCount}
            action={(row) => {
              return null;
            }}
            actionshow={true}
            paginationShow={false}
            subAction1Show={true}
            heightLimit={false}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(Customers);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
