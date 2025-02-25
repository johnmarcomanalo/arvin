import { Grid, Stack, useMediaQuery } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import SearchField from "components/inputFIeld/SearchField";
import Page from "components/pagination/Pagination";
import TableComponent from "components/table/Table";
import CheckCustomerHooks from "../../hooks/CheckCustomerHooks";
const formName = "CheckCustomer"; 
let CheckCustomer = (props) => {
  const matches = useMediaQuery("(min-width:600px)"); 
  const { ...customer } = CheckCustomerHooks(props); 
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent={matches ? "space-between" : "center"}
            alignItems={matches ? "flex-start" : "center"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
          >
            <SearchField onChange={customer.onChangeSearch} />
            <Page
              page={customer?.page}
              limit={customer?.dataListCount}
              onHandleChange={customer.handleChangePage}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TableComponent
            columns={customer.columns}
            dataList={customer.dataList}
            handleChangePage={customer.handleChangePage}
            onSelectItem={props.onClickSelect}
            id={"customers_table"}
            localStorage={""}
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
})(CheckCustomer);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
