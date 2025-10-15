import UpgradeIcon from "@mui/icons-material/Upgrade";
import {
   Grid,
   Stack,
   Tooltip,
   useMediaQuery,
   Card, 
   CardContent, 
   CardHeader, 
   CardTitle 
} from "@mui/material"; 
import { Field, formValueSelector, reduxForm } from "redux-form";
import { connect } from "react-redux";
import * as React from "react"; 
import SearchField from "components/inputFIeld/SearchField";
import InputField from "components/inputFIeld/InputField";  
import ComboBox from "components/autoComplete/AutoComplete"; 
import VeselContainerMonitoringHooks from "../hooks/VeselContainerMonitoringHooks"; 
import Page from "components/pagination/Pagination";
import TableComponent from "components/table/TableSorting";
import Loading from "components/loading/Loading";
import Modal from "components/modal/Modal"; 
import ViewDashboard from"./components/ViewDashboard";
const formName = "vesselForm"

const VeselContainerMonitoring = (props) => {
  const { ...vcm } = VeselContainerMonitoringHooks(props);
  const matches = useMediaQuery("(min-width:600px)");

  return (
    <React.Fragment>
      {/* modalllll */}
        <Modal
            open={vcm.viewModal}
            fullScreen={ false}
            title={"View Invoice Details"}
            size={"xxl"}
            action={undefined}
            handleClose={vcm.onClickCloseModal}
          >
          <ViewDashboard/>
        </Modal>
      <Grid container spacing={2}> 
        <Grid item xs={12} sm={12} md={12} lg={12}>
        <Stack
            direction={matches ? "row" : "column"}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
          {/* Left side (fields) */}
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Grid item xs={12} sm={12} md={2} lg={2}> 
              <SearchField 
                textHidden={false} 
                value={vcm.search} 
                onChange={vcm.onChangeSearch} 
              />   
            </Grid>

            <Grid item xs={12} sm={12} md={1} lg={2}>
              <Field 
                id="sap"
                name="sap"
                label="SAP"
                options={vcm?.sapList}
                getOptionLabel={(option) => option?.description || ""}
                value={"MANILA"}
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    vcm.onChangeSAP(newValue?.description);
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={1} lg={2}>
              <Field 
                id="monitoring"
                name="monitoring"
                label="Monitoring"
                options={vcm?.vesselAndContainer}
                getOptionLabel={(option) => option?.description || ""} 
                component={ComboBox}
                onChangeHandle={(e, newValue) => {
                  if (newValue?.description) {
                    vcm.onChangeMonitoring(newValue?.description);
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2}>
              <Field
                id="filter_date_start"
                name="filter_date_start"
                label="Start Date"
                type="date"
                component={InputField}
                onChange={(event) => {
                  const selectedDate = event.target.value;
                  if (selectedDate) {
                    vcm.onChangeFilterStart(new Date(selectedDate));
                  }
                }} 
              />
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2}>
              <Field
                id="filter_date_end"
                name="filter_date_end"
                label="End Date"
                type="date"
                component={InputField}
                onChange={(event) => {
                  const selectedDate = event.target.value;
                  if (selectedDate) {
                    vcm.onChangeFilterEnd(new Date(selectedDate));
                  }
                }}
              />
            </Grid>
          </Stack>

          {/* Right side (pagination) */}
          <Page
            page={vcm?.page}
            limit={vcm?.dataListCount}
            status={""}
            onHandleChange={vcm.onChangePage}
          />
        </Stack>


        </Grid> 
        <Grid item xs={12} sm={12} md={12} lg={12}>
        <TableComponent
              columns={vcm.columns}
              dataList={vcm.dataList}
              page={vcm.page}
              rowsPerPage={vcm.rowsPerPage}
              handleChangePage={vcm.onChangePage}
              handleChangeRowsPerPage={vcm.handleChangeRowsPerPage} 
              onSelectItem={vcm.onClickOpenModal}
              // onSelectItem={vcm.onSelectInvoice}
              id={"home_attendance"}
              localStorage={""}
              rowCount={vcm.dataListCount}
              actionshow={true}
              paginationShow={false}
              subAction1Show={true}
              subAction2Show={false}
              onSortChange={vcm.onChangeSorting}
              initialSortBy={vcm.filter_sort_by}
              initialSortDirection={vcm.filter_order}
              getRowStyle={(row) => {  
                return {}; // default style
              }}
              action={(row, index) => {
                return vcm.onClickOpenModal(row);
              }}
          /> 
        </Grid> 

      </Grid>
    </React.Fragment>
  );
}

const ReduxFormComponent = reduxForm({
  form: formName,
})(VeselContainerMonitoring);
const selector = formValueSelector(formName);
export default connect((state) => {
  const sap = selector(state, "sap");
  const monitoring = selector(state, "monitoring"); 
  const refresh =  state.LogisticReducer.refresh; 
 
  return {
    refresh, 
    sap,
    monitoring, 
  };
}, {})(ReduxFormComponent);
