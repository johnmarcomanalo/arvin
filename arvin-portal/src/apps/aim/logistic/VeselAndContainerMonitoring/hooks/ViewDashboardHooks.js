import { useDispatch, useSelector } from "react-redux";
import React from "react";  
import { getInvoiceDetails } from "../actions/VeselContainerMonitoringActions";
import moment from "moment";
import { AmountDecimal } from "utils/AccountingUtils"

const ViewDashboard = (props) => { 
  const dispatch                       = useDispatch();
  const refresh                        = useSelector((state) => state.LogisticReducer.refresh);
  const monitoringData                 = useSelector((state) => state.LogisticReducer.monitoringData); 
  const monitoring                     = useSelector((state) => state.LogisticReducer.monitoring); 
  const selectedDataRow                = useSelector((state) => state.LogisticReducer.selectedDataRow);
  //monitoring data from api
  const chartGroupWarehouseAndMIP      = monitoringData.chartGroupWarehouseAndMIP ?? []
  const chartGroupCustomerAndWarehouse = monitoringData.chartGroupCustomerAndWarehouse ?? []
  const combineData                    = monitoringData.combineData ?? []
  const customerData                   = monitoringData.customerData ?? []
  const warehouseData                  = monitoringData.warehouseData ?? []
  const TotalDirectToWarehouse         = AmountDecimal(combineData?.[0]?.DirectToWarehouse ?? 0)
  const TotalDirectToCustomer          = AmountDecimal(combineData?.[0]?.DirectToCustomer ?? 0)
  const TotalLackingDRQvsINV           = AmountDecimal(combineData?.[0]?.LackingDRQvsINV ?? 0)
  const TotalLackingGRvsDR             = AmountDecimal(combineData?.[0]?.LackingGRvsDR ?? 0)
  const TotalCMQty                     = AmountDecimal(combineData?.[0]?.TotalCMQty ?? 0)
  const totalPOQty                     = AmountDecimal(combineData?.[0]?.TotalPOQty ?? 0)
  const totalGRQty                     = AmountDecimal(combineData?.[0]?.TotalGRQty ?? 0)
  const totalDRQty                     = AmountDecimal(combineData?.[0]?.TotalDRQty ?? 0)
  const totalQuantity                  = AmountDecimal(combineData?.[0]?.TotalQuantity ?? 0 )

 
  //selected row data
  let   fcl                            = selectedDataRow.FCL ?? 0
  let   InvoiceNo                      = selectedDataRow.InvoiceNo ?? "-"
  let   PONumber                       = selectedDataRow.PONumber ?? "-"
  let   Broker                         = selectedDataRow.Broker ?? "-"
  let   SupplierName                   = selectedDataRow.SupplierName ?? "-"
  let   BLNo                           = selectedDataRow.BLNo ?? "-"
  let   Vessel                         = selectedDataRow.Vessel ?? "-"
  let   PODate                         = moment(selectedDataRow.PODate).format("YYYY-MM-DD") ?? "-"
  
  const columns = [
    { id: "PONumber", label: "PO Number", align: "left", sortable: false },
    { id: "FCL", label: "FCL", align: "left", sortable: false },
    { id: "InvoiceNo", label: "Invoice No.", align: "left", sortable: false }, 
    { id: "BLNo", label: "BL No.", align: "left", sortable: true },
    { id: "Broker", label: "Broker", align: "left", sortable: true },
    { id: "SupplierName", label: "Supplier", align: "left", sortable: true },
    { id: "Quantity", label: "Quantity", align: "left", sortable: true }, 
  ];
    
  const getDetails = async() => {
    if (!selectedDataRow?.InvoiceNo) return;
    try {
      const data = {
        invoice: selectedDataRow.InvoiceNo, 
        sap: selectedDataRow.sap,
        monitoring: monitoring,
      };
      await dispatch(getInvoiceDetails(data));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (selectedDataRow) getDetails();
  }, [selectedDataRow]);

  return {
    InvoiceNo,
    PONumber,
    Broker,
    Vessel,
    BLNo,
    PODate,
    SupplierName,
    combineData,
    customerData,
    warehouseData,
    TotalLackingDRQvsINV,
    TotalLackingGRvsDR,
    TotalDirectToWarehouse,
    TotalDirectToCustomer,
    TotalCMQty,
    totalPOQty,
    totalGRQty,
    totalDRQty,
    totalQuantity,
    fcl,
    columns,
    monitoringData,
    refresh,
    chartGroupWarehouseAndMIP,
    chartGroupCustomerAndWarehouse,
    getDetails,
  };
};

export default ViewDashboard;
