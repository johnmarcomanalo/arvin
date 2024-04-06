import { AxiosResponse } from "axios";
// import { get, post, remove } from "../../../../api/Api";
// import { LoginConstants } from "../../../auth/login/constants/Constants";
import { get, post, remove } from "../../../api/api"

// export const getWishListByClientID = (values: any) => async (dispatch: any) => {
//   const res: any = (await get(
//     "add-to-wish-List/?clientId=" + values,
//     dispatch
//   )) as AxiosResponse<any>;
//   return res;
// };
// export const deleteWishList = (values: any) => async (dispatch: any) => {
//   const res = await remove(
//     "wish-list-delete/",
//     values.wish_list_id + "/",
//     dispatch
//   );
//   return res;
// };
// export const getMessageByClientID = (values: any) => async (dispatch: any) => {
//   const res: any = (await get(
//     "messages-by-client/?clientId=" + values,
//     dispatch
//   )) as AxiosResponse<any>;
//   return res;
// };
// export const getVoucherListByClientID =
//   (values: any) => async (dispatch: any) => {
//     const res: any = (await get(
//       "vouchers/?clientId=" + values,
//       dispatch
//     )) as AxiosResponse<any>;
//     return res;
//   };
// export const getDashboardScheduledJobOrder =
//   (values: any) => async (dispatch: any) => {
//     const res = await get(
//       "dashboard-job-order-scheduled/?client_id=" + values,
//       dispatch
//     );
//     return res;
//   };

// export const onSubmitSyncVoucher =
//   (formValues: any) => async (dispatch: any) => {
//     await dispatch({
//       type: LoginConstants.ACTION_LOGIN_CONSTANT,
//       payload: {
//         isLoading: true,
//       },
//     });
//     const res = await post("sync-voucher/", formValues, dispatch);
//     await dispatch({
//       type: LoginConstants.ACTION_LOGIN_CONSTANT,
//       payload: {
//         isLoading: false,
//       },
//     });
//     return res;
//   };
