import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { change } from "redux-form";
import swal from "sweetalert";
import { cancelRequest } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import { getRefProductGroups } from "../../../settings/reference/actions/ReferenceActions";
import { fetchGetClientGroups } from "../../clientGroups/actions/ClientGroupsActions";
import { getMonthlyAndDailyQoutaByTargetAnnualSales } from "../actions/AnnualSalesQoutaClientGroupsActions";
const AddAnnualSalesQoutaClientGroupsHooks = (props) => {
  const client_groups = useSelector(
    (state) => state.SalesDailyOutReducer.client_groups
  );
  const account_details = useSelector(
    (state) => state.AuthenticationReducer.account_details
  );
  const product_group_category = useSelector(
    (state) => state.ReferenceReducer.product_group_category
  );
  const viewModal = useSelector((state) => state.ReferenceReducer.viewModal);

  const [state, setState] = React.useState({
    debounceTimer: null,
    debounceDelay: 2000,
    sub_group: [],
    type: [
      {
        description: "GROUP",
      },
      {
        description: "SINGLE",
      },
    ],
  });

  const dispatch = useDispatch();

  const columns = [
    { id: "code", label: "Ranking", align: "left" },
    { id: "ranker_code", label: "Ranker", align: "left" },
    { id: "current_point", label: "Point", align: "left" },
  ];
  const GetClientGroups = async () => {
    try {
      dispatch(fetchGetClientGroups());
    } catch (error) {
      console.error(error);
    }
  };
  const debounce = (func, delay) => {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(func, delay);
  };
  React.useEffect(() => {
    GetClientGroups();
    dispatch(getRefProductGroups());
    return () => cancelRequest();
  }, []);

  React.useEffect(() => {
    props.initialize({
      added_by: account_details?.code,
      modified_by: account_details?.code,
    });
    return () => cancelRequest();
  }, []);

  const GetMonthlyAndDailyQoutaByAnnualQouta = async (e) => {
    try {
      let { value } = e.target;
      if (value > 0) {
        await debounce(() => {
          dispatch(getMonthlyAndDailyQoutaByTargetAnnualSales(value));
        }, state.debounceDelay);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onClickOpenViewModal = () => {
    dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        viewModal: true,
      },
    });
  };
  const onClickCloseViewModal = () => {
    dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        viewModal: false,
      },
    });
  };

  const onClickSelectClientList = (data) => {
    let client = {
      customer_code: data.customer_code,
      description: data.description,
      type: data.type,
      status: data.status,
    };
    props.dispatch(
      change("AddAnnualSalesQoutaClientGroups", "subgroups", [client])
    );
    props.dispatch(
      change("AddAnnualSalesQoutaClientGroups", "description", data.description)
    );
    props.dispatch(
      change(
        "AddAnnualSalesQoutaClientGroups",
        "customer_code",
        data.customer_code
      )
    );
    props.dispatch(
      change(
        "AddAnnualSalesQoutaClientGroups",
        "sales_daily_out_settings_client_group_customer_type",
        data.type
      )
    );
    swal("Success", "Client added successfully", "success");
  };
  return {
    state,
    columns,
    product_group_category,
    account_details,
    client_groups,
    viewModal,
    GetMonthlyAndDailyQoutaByAnnualQouta,
    onClickOpenViewModal,
    onClickCloseViewModal,
    onClickSelectClientList,
  };
};

export default AddAnnualSalesQoutaClientGroupsHooks;
