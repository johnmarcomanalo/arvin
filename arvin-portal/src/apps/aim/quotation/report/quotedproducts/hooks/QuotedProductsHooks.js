import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { change } from "redux-form";
import { useDebounce } from "../../../../../../utils/HelperUtils";
import { getSalesQoutedProducts } from "../actions/QuotedProductsActions";
const QuotationListHooks = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    selectedDataList: [],
    status: [
      {
        description: "All",
      },
      {
        description: "Pending",
      },
      {
        description: "Approved",
      },
      {
        description: "Denied",
      },
    ],
  });
  const selectedDataList = useSelector(
    (state) => state.QuotationReducer.selectedDataList
  );
  const refresh = useSelector((state) => state.QuotationReducer.refresh);
  const dataList = useSelector((state) => state.QuotationReducer.dataList);
  const dataListCount = useSelector(
    (state) => state.QuotationReducer.dataListCount
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const search =
    searchParams.get("q") != null ? String(searchParams.get("q")) : "";
  const page = searchParams.get("p") != null ? searchParams.get("p") : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 10;
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const debounceSearch = useDebounce(searchParams, 500);
  const getListParam = () => {
    const data = {
      p: page == null ? 1 : page,
      q: search,
      l: rowsPerPage,
      u: account_details?.code,
    };
    return data;
  };

  const columns = [
    { id: "product_request_code", label: "Code", align: "left" },
    { id: "status", label: "Status", align: "left" },
    { id: "os_number", label: "OS Number", align: "left" },
    { id: "customer_description", label: "Customer", align: "left" },
    { id: "product_description", label: "Product Description", align: "left" },
    { id: "projected_quantity", label: "Project Quantity", align: "left" },
    { id: "awarded_quantity", label: "Awarded Quantity", align: "left" },
    { id: "unawarded_quantity", label: "Unawarded Quantity", align: "left" },
    { id: "awarded_percentage", label: "Awarded Percentage", align: "left" },
    {
      id: "unawarded_percentage",
      label: "Unawarded Percentage",
      align: "left",
    },
    {
      id: "request_date",
      label: "Request Date",
      align: "left",
    },
  ];

  const onClickSubmit = (status) => {
    props.dispatch(change("ForApprovalQuotation", "status", status));
  };

  const SalesQutoationRequestLists = async () => {
    try {
      const data = getListParam();
      await dispatch(getSalesQoutedProducts(data));
    } catch (error) {
      await console.error(error);
    }
  };

  useEffect(() => {
    SalesQutoationRequestLists();
  }, [refresh, debounceSearch]);

  const onChangeSearch = (event) => {
    // SEARCH DATA
    const search = event.target.value;
    setSearchParams({
      p: page == null ? 1 : page,
      q: search,
      l: rowsPerPage,
      u: account_details?.code,
    });
  };
  const handleChangePage = (event, page) => {
    setSearchParams({
      p: page,
      q: search,
      l: rowsPerPage,
      u: account_details?.code,
    });
  };
  return {
    state,
    page,
    columns,
    dataList,
    search,
    selectedDataList,
    dataListCount,
    onClickSubmit,
    onChangeSearch,
    handleChangePage,
  };
};

export default QuotationListHooks;
