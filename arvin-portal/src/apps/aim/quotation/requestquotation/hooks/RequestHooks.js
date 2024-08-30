import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { change } from "redux-form";
import { cancelRequest } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import { useDebounce } from "../../../../../utils/HelperUtils";
import { decryptaes } from "../../../../../utils/LightSecurity";
import configure from "../../../../configure/configure.json";
import {
  getAllRefCurrencies,
  getAllRefUnitOfMeasurements,
  getAllRefValueAddedTax,
  getEmployeeCustomerAccessDetails,
} from "../../../settings/reference/actions/ReferenceActions";

const RequestHooks = (props) => {
  const refresh = useSelector((state) => state.QuotationReducer.refresh);
  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000,
    notes: [{ index: 1 }],
    product_list: [],
    noted_by: [],
    approved_by: [],
    quotation_column_list: [
      {
        id: "code",
        label: "Product Code",
        status: 0,
      },
      {
        id: "projected_quantity",
        label: "Projected Quantity",
        status: 0,
      },
      {
        id: "destination",
        label: "Destination",
        status: 0,
      },
      {
        id: "minimum_order_quantity",
        label: "Minimum order Quantity",
        status: 0,
      },
      {
        id: "pickup_price",
        label: "Pickup Price",
        status: 0,
      },
      {
        id: "price_per_unit",
        label: "Price per unit",
        status: 0,
      },
      {
        id: "tax_code",
        label: "Tax Code",
        status: 0,
      },
    ],
    term: [
      {
        description: "Short Term",
      },
      {
        description: "Long Term",
      },
    ],
  });
  const columns = [
    { id: "code", label: "Code", align: "left" },
    { id: "customer", label: "Customer", align: "left" },
    { id: "Date Request", label: "Date Request", align: "left" },
    { id: "status", label: "Status", align: "left" },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("p") != null ? searchParams.get("p") : 1;
  const rowsPerPage =
    searchParams.get("l") != null ? searchParams.get("l") : 10;
  const search =
    searchParams.get("q") != null ? String(searchParams.get("q")) : "";
  const filterQuery =
    searchParams.get("f") != null
      ? String(searchParams.get("f"))
      : moment(new Date()).format("YYYY");
  const debounceSearch = useDebounce(searchParams, 500);
  //filtering,search,page,limit end

  const dispatch = useDispatch();
  const viewModal = useSelector((state) => state.QuotationReducer.viewModal);
  const updateModal = useSelector(
    (state) => state.QuotationReducer.updateModal
  );
  const dataList = useSelector((state) => state.QuotationReducer.dataList);
  const selected_productList = useSelector(
    (state) => state.ReferenceReducer.selected_productList
  );
  const dataListCount = useSelector(
    (state) => state.QuotationReducer.dataListCount
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const dateFilterStart = useSelector(
    (state) => state.QuotationReducer.dateFilterStart
  );
  const dateFilterEnd = useSelector(
    (state) => state.QuotationReducer.dateFilterEnd
  );
  const selectedDataList = useSelector(
    (state) => state.QuotationReducer.selectedDataList
  );
  const access = useSelector((state) => state.AuthenticationReducer.access);
  const currencies = useSelector((state) => state.ReferenceReducer.currencies);
  const unit_of_measurements = useSelector(
    (state) => state.ReferenceReducer.unit_of_measurements
  );
  const value_added_tax = useSelector(
    (state) => state.ReferenceReducer.value_added_tax
  );

  const onClickOpenViewModal = () => {
    dispatch({
      type: Constants.ACTION_QUOTATION,
      payload: {
        viewModal: true,
      },
    });
  };
  const onClickCloseViewModal = () => {
    dispatch({
      type: Constants.ACTION_QUOTATION,
      payload: {
        viewModal: false,
      },
    });
  };
  const handleChangePage = (event, page) => {
    setSearchParams({
      q: search,
      p: page,
      l: String(rowsPerPage),
      f: filterQuery,
    });
  };
  const handleChangeRowsPerPage = (event) => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        rowsPerPage: event.target.value,
      },
    });
  };
  const onSelectItem = (data) => {
    console.log(data);
  };
  const onDeleteDeduction = (data) => {
    console.log(data);
  };
  const onChangeSearch = (event) => {
    // SEARCH DATA
    const search = event.target.value;
    setSearchParams({
      q: search,
      p: "1",
      l: String(rowsPerPage),
      f: filterQuery,
    });
  };
  const debounce = (func, delay) => {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(func, delay);
  };
  const getListParam = () => {
    const data = {
      p: page == null ? 1 : page,
      q: search,
      l: rowsPerPage,
      f: filterQuery,
      u: account_details?.code,
    };
    return data;
  };

  const onChangeFilter = (date) => {
    const filter = date;
    setSearchParams({
      q: search,
      p: "1",
      l: String(rowsPerPage),
      f: filter,
      u: account_details?.code,
    });
  };

  const GetCustomerDetails = async (value) => {
    try {
      let data = {
        customer_code: value.customer_code,
        type: value.type,
        status: value.status,
      };
      const res = await dispatch(getEmployeeCustomerAccessDetails(data));
      const decrypted = decryptaes(res.data);
      const customer_details = decrypted.data;
      props.dispatch(
        change("RequestQuotation", "customer_address", customer_details?.Street)
      );
      props.dispatch(
        change(
          "RequestQuotation",
          "customer_representative",
          customer_details?.CntctPrsn
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeNotes = (event, index) => {
    let valu = event.target.value;
    let target_name = event.target.name;
    let name = target_name.split("-")[0];
    setState((prev) => ({
      ...prev,
      notes: state.notes.map((val, index2) =>
        index === index2 ? { ...val, [name]: valu } : val
      ),
    }));
  };

  const onClickAddNotes = () => {
    let placement = {
      index: state.notes.length + 1,
    };
    state.notes.push(placement);
    setState((prev) => ({
      ...prev,
    }));
  };

  const onClickRemoveNotes = () => {
    if (state.notes.length > 1) {
      state.notes.splice(state.notes.length - 1, 1);
      setState((prev) => ({
        ...prev,
      }));
    }
  };

  const onClickSelectItemProductList = (data) => {
    let product = {
      code: data.code,
      product_description: data.description,
      product_weight: data.weight,
      product_tax_code: data.tax_code,
      product_brand: data.brand,
      product_branch: data.branch,
      product_group: data.groups,
      projected_quantity: 0,
      projected_quantity_unit: "",
      destination: "",
      minimum_order_quantity: 0,
      minimum_order_quantity_unit: "",
      pickup_price: 0,
      pickup_price_unit: "",
      price_per_unit: 0,
      price_unit: "",
      tax_code: "",
      added_by: account_details.code,
      modified_by: account_details.code,
    };
    state.product_list.push(product);
    setState((prev) => ({
      ...prev,
    }));
  };
  const onClickRemoveItemProductList = () => {
    state.product_list.splice(state.product_list.length - 1, 1);
    setState((prev) => ({
      ...prev,
    }));
  };

  React.useEffect(() => {
    dispatch(getAllRefCurrencies());
    dispatch(getAllRefUnitOfMeasurements());
    dispatch(getAllRefValueAddedTax());
    props.initialize({
      added_by: account_details?.code,
      modified_by: account_details?.code,
      request_type: "Sales Quotation",
    });
    return () => cancelRequest();
  }, []);

  const onClickOpenColumnListModal = () => {
    dispatch({
      type: Constants.ACTION_QUOTATION,
      payload: {
        updateModal: true,
      },
    });
  };
  const onClickCloseColumnListModal = () => {
    dispatch({
      type: Constants.ACTION_QUOTATION,
      payload: {
        updateModal: false,
      },
    });
  };

  const handleStatusChange = (index) => {
    const updatedQuotationList = state.quotation_column_list.map((item, i) => {
      if (i === index) {
        return { ...item, status: item.status === 0 ? 1 : 0 };
      }
      return item;
    });

    setState((prevState) => ({
      ...prevState,
      quotation_column_list: updatedQuotationList,
    }));
  };
  const onChangeSelectedProduct = (event, index) => {
    let valu = event.target.value;
    let target_name = event.target.name;
    let name = target_name.split("-")[0];
    setState((prev) => ({
      ...prev,
      product_list: state.product_list.map((val, index2) =>
        index === index2 ? { ...val, [name]: valu } : val
      ),
    }));
  };
  const onSelectUOM = (event, value, index) => {
    let valu = value.description;
    let target_name = event.target.id;
    let name = target_name.split("-")[0];
    setState((prev) => ({
      ...prev,
      product_list: state.product_list.map((val, index2) =>
        index === index2 ? { ...val, [name]: valu } : val
      ),
    }));
  };
  return {
    state,
    search,
    page,
    dataList,
    rowsPerPage,
    dataListCount,
    dateFilterStart,
    dateFilterEnd,
    selectedDataList,
    columns,
    viewModal,
    account_details,
    access,
    selected_productList,
    currencies,
    unit_of_measurements,
    updateModal,
    value_added_tax,
    handleChangeRowsPerPage,
    handleChangePage,
    onSelectItem,
    onDeleteDeduction,
    onChangeSearch,
    onClickOpenViewModal,
    onClickCloseViewModal,
    onChangeFilter,
    GetCustomerDetails,
    onChangeNotes,
    onClickAddNotes,
    onClickRemoveNotes,
    onClickSelectItemProductList,
    onClickOpenColumnListModal,
    onClickCloseColumnListModal,
    handleStatusChange,
    onChangeSelectedProduct,
    onSelectUOM,
    onClickRemoveItemProductList,
  };
};

export default RequestHooks;
