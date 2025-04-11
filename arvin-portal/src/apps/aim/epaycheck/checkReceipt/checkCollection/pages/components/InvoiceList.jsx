import { ButtonGroup, Grid, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { connect } from "react-redux";
import { change, Field, formValueSelector, reduxForm, reset } from "redux-form";
//component
import TableComponent from "components/table/Table";
import SearchField from "components/inputFIeld/SearchField";
import Page from "components/pagination/Pagination";
//hoooks and configuration
import CheckCollectionHooks from "../../hooks/CheckCollectionHooks";
let formName = "InvoiceList";

let InvoiceList = (props) => {
  const { ...check } = CheckCollectionHooks(props);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent={"space-between"}
            alignItems={"flex-end"}
            flexDirection={"row"}
            spacing={2}
          >
            <SearchField onChange={check.onChangeSearch} textHidden={false} />
            <Page
              page={check?.page}
              limit={check?.dataListCount}
              onHandleChange={check.handleChangePage}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TableComponent
            columns={check.columns}
            dataList={check.dataList}
            onSelectItem={props.onSelectItem}
            id={"invoice_list_table"}
            localStorage={""}
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
})(InvoiceList);
const selector = formValueSelector(formName);
export default connect((state) => {}, {})(ReduxFormComponent);
