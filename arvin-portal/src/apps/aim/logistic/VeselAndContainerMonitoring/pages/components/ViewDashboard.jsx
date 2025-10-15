import { Grid, Stack, useMediaQuery,Card, CardHeader, CardContent } from "@mui/material";
import SearchField from "components/inputFIeld/SearchField";
import Page from "components/pagination/Pagination";
import TableComponent from "components/table/Table";
import * as React from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form"; 
import ViewDashboardHooks from "../../hooks/ViewDashboardHooks"
import MetricOverview from './../components/MetricOverview'
import CustomTab from './ReusableTabs'
import Overview from "./Tabs/Overview";
import Details from "./Tabs/Details";
import {
  TrendingUp,
  TrendingDown,
  LocalShipping,
  Reply,
  Warehouse,
  ListAlt,
  AccessTime,
  WarningAmber,
} from "@mui/icons-material";
const formName = "FormDashboard"; 
let ViewDashboard = (props) => {
  const { ...dash } = ViewDashboardHooks(props)
  const matches = useMediaQuery("(min-width:600px)");
  const tabs = [
    {
      label: "Overview",
      content: <Overview  
                    warehouse={dash.chartGroupWarehouseAndMIP} 
                    delivery={dash.chartGroupCustomerAndWarehouse} 
                    TotalLackingDRQvsINV={dash.TotalLackingDRQvsINV}
                    TotalLackingGRvsDR={dash.TotalLackingGRvsDR}
                    TotalDirectToWarehouse={dash.TotalDirectToWarehouse}
                    TotalDirectToCustomer={dash.TotalDirectToCustomer}
                    TotalCMQty={dash.TotalCMQty}
                    TotalFCL={dash.fcl}
                    InvoiceNo={dash.InvoiceNo}
                    PONumber={dash.PONumber}
                    Broker={dash.Broker}
                    SupplierName={dash.SupplierName}
                    BLNo={dash.BLNo}
                    Vessel={dash.Vessel}
                    PODate={dash.PODate}
                />,
    },
    {
      label: "Warehouse & Direct Delivery Details",
      content: <Details 
                    Warehouse={dash.combineData} 
                    totalCMQty={dash.TotalCMQty}
                    totalPOQty={dash.totalPOQty}
                    totalGRQty={dash.totalGRQty}
                    totalDRQty={dash.totalDRQty}
                    totalQuantity={dash.totalQuantity}
              />
    },
    
  ];

  return (
    <React.Fragment>
      <Grid container item spacing={2}>
        {/* <MetricOverview /> */} 
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomTab tabs={tabs} /> 
          </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName, 
})(ViewDashboard);
const selector = formValueSelector(formName);
export default connect((state) => {
  return {};
}, {})(ReduxFormComponent);
