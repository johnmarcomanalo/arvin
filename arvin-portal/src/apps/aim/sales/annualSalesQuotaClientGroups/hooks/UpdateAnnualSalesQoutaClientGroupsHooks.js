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
const UpdateAnnualSalesQoutaClientGroupsHooks = (props) => {
  return {

  };
};

export default UpdateAnnualSalesQoutaClientGroupsHooks;
