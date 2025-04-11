import {
    Grid,
    Stack
} from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
  //component
  import SearchField from "components/inputFIeld/SearchField";
import Page from "components/pagination/Pagination";
import TableComponent from "components/table/TableSorting";
  //hoooks and configuration
  import CheckSalesInvoiceHooks from "../../hooks/CheckSalesInvoiceHooks";
  let formName = "InvoiceList";
  let InvoiceList = (props) => {
    const { ...check } = CheckSalesInvoiceHooks(props);
    return (
      <React.Fragment> 
            <Grid container spacing={2}>  
                <Grid  item xs={12} sm={12} md={12} lg={12}>
                    <Stack
                        direction="row"
                        justifyContent={"space-between"}
                        alignItems={"flex-end"}
                        flexDirection={"row"}
                        spacing={2}
                    >
                    <SearchField value={check.search}  onChange={check.onChangeSearch} textHidden={false}/>
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
                        onSortChange={check.onChangeSorting}
                    />
                </Grid>
            </Grid> 
      </React.Fragment>
    );
}

const ReduxFormComponent = reduxForm({
  form: formName,
})(InvoiceList);
const selector = formValueSelector(formName);
export default connect((state) => {}, {})(ReduxFormComponent);
