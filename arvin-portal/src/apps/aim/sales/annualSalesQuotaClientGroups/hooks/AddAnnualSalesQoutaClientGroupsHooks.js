import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { change } from "redux-form";
import swal from "sweetalert";
import { cancelRequest } from "../../../../../api/api";
import { Constants } from "../../../../../reducer/Contants";
import { getRefProductGroups } from "../../../settings/reference/actions/ReferenceActions";
import { fetchGetClientGroups } from "../../clientGroups/actions/ClientGroupsActions";
import { getMonthlyAndDailyQoutaByTargetAnnualSales } from "../actions/AnnualSalesQoutaClientGroupsActions";
import moment from "moment";
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
  const viewModal2 = useSelector((state) => state.ReferenceReducer.viewModal2);
  const employeeModal = useSelector(
    (state) => state.HumanResourceReducer.viewModal
  );
  const addModal2 = useSelector(
    (state) => state.SalesDailyOutReducer.addModal2
  );
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
    // GetClientGroups();
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

  const onClickOpenAddModal2 = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        addModal2: true,
      },
    });
  };
  const onClickCloseAddModal2 = () => {
    dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        addModal2: false,
      },
    });
  };

  const onClickOpenEmployeeViewModal = () => {
    dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        viewModal: true,
      },
    });
  };
  const onClickCloseEmployeeViewModal = () => {
    dispatch({
      type: Constants.ACTION_HUMAN_RESOURCE,
      payload: {
        viewModal: false,
      },
    });
  };

  const onClickSelectGroupList = (data) => {
    props.dispatch(
      change("AddAnnualSalesQoutaClientGroups", "subgroup", data.subgroup)
    );
    props.dispatch(
      change("AddAnnualSalesQoutaClientGroups", "description", data.description)
    );
    props.dispatch(
      change(
        "AddAnnualSalesQoutaClientGroups",
        "sales_daily_out_settings_client_group_code",
        data.code
      )
    );
    props.dispatch(change("AddAnnualSalesQoutaClientGroups", "bdo", data.bdo));
    props.dispatch(
      change("AddAnnualSalesQoutaClientGroups", "type", data.type)
    );
    props.dispatch(
      change("AddAnnualSalesQoutaClientGroups", "subsection", data.subsection)
    );
    swal("Success", "Client added successfully", "success");
  };
  const onClickRemoveSelectGroupList = () => {
    props.dispatch(change("AddAnnualSalesQoutaClientGroups", "subgroup", []));
    props.dispatch(
      change("AddAnnualSalesQoutaClientGroups", "description", "")
    );
    props.dispatch(
      change(
        "AddAnnualSalesQoutaClientGroups",
        "sales_daily_out_settings_client_group_code",
        null
      )
    );
    props.dispatch(change("AddAnnualSalesQoutaClientGroups", "bdo", ""));
    props.dispatch(change("AddAnnualSalesQoutaClientGroups", "type", ""));
    props.dispatch(change("AddAnnualSalesQoutaClientGroups", "subsection", ""));
  };

  const onClickSelectEmployee = (data) => {
    props.dispatch(
      change("AddAnnualSalesQoutaClientGroups", "bdo", data.username)
    );
    props.dispatch(
      change("AddAnnualSalesQoutaClientGroups", "bdo_name", data.full_name)
    );
    swal("Success", "BDO added successfully", "success");
  };
  const onClickOpenClientListViewModal = () => {
    dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        viewModal2: true,
      },
    });
  };
  const onClickCloseClientListViewModal = () => {
    dispatch({
      type: Constants.ACTION_REFERENCE,
      payload: {
        viewModal2: false,
      },
    });
  };
  return {
    state,
    columns,
    product_group_category,
    account_details,
    client_groups,
    viewModal,
    employeeModal,
    viewModal2,
    addModal2,
    GetMonthlyAndDailyQoutaByAnnualQouta,
    onClickSelectGroupList,
    onClickOpenEmployeeViewModal,
    onClickCloseEmployeeViewModal,
    onClickSelectEmployee,
    onClickOpenClientListViewModal,
    onClickCloseClientListViewModal,
    onClickRemoveSelectGroupList,
    onClickOpenAddModal2,
    onClickCloseAddModal2,
  };
};

export default AddAnnualSalesQoutaClientGroupsHooks;
