import { useDispatch, useSelector } from "react-redux";
const ViewPriceHistoryHooks = (props) => {
  const dispatch = useDispatch();
  const access = useSelector((state) => state.AuthenticationReducer.access);
  const dataSubList = useSelector(
    (state) => state.SalesDailyOutReducer.dataSubList,
  );
  const dataSubListCount = useSelector(
    (state) => state.SalesDailyOutReducer.dataSubListCount,
  );
  const columns = [
    { id: "ItemCode", label: "Code", align: "left" },
    { id: "ItemName", label: "Daily Description", align: "left" },
    { id: "PickupPrice", label: "Pick-up Price", align: "right" },
    { id: "OldPrice", label: "Previous Price", align: "right" },
    { id: "SKU", label: "SKU", align: "right" },
    { id: "Warehouse", label: "Warehouse", align: "left" },
    { id: "Brand", label: "Brand", align: "left" },
    { id: "TaxCode", label: "TaxCode", align: "left" },
    { id: "Time_Stamp", label: "Time_Stamp", align: "left" },
  ];

  return {
    access,
    columns,
    dataSubList,
    dataSubListCount,
  };
};

export default ViewPriceHistoryHooks;
