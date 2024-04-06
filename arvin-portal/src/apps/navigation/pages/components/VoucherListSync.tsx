import { Button, Checkbox, Grid, Stack } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HomeServicesContants } from "../../../home/constants/Constants";
import HomeAppWorkHooks from "../../../home/hooks/HomeAppWorkHooks";
import NavigationHooks from "../../hooks/NavigationHooks";
import configure from "../../../../configure/configure.json";
import { formValueSelector, reduxForm, reset } from "redux-form";
import { onSubmitSyncVoucher } from "../../actions/NavigationActions";
import swal from "sweetalert";
import { encryptLocal } from "../../../../../utils/Encryption";

let formName = "VoucherListSync";
const submit = async (values: any, dispatch: any, props: any) => {
  try {
    const res = await dispatch(onSubmitSyncVoucher(values));
    if (res.result) {
      await swal(res.title, res.message, res.status);
      await dispatch(reset(formName));
      await window.location.reload();
    } else {
      swal(res.title, res.message, res.status);
    }
  } catch (error) {
    console.log(error);
    swal("Oppssss", "Something went wrong", "warning");
  }
};
let VoucherListSync = (props: any) => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { ...navigation } = NavigationHooks(props);
  const { ...homeAppWork } = HomeAppWorkHooks(props);
  const onHandleCheckVoucher = async (values: any) => {
    navigate("/");
    onOpenJoDetailsModal(values);
  };
  const onOpenJoDetailsModal = async (val: any) => {
    const updatedVal = {
      ...val,
      service_id: val.service,
    };
    dispatch({
      type: HomeServicesContants.ACTION_HOME_SERVICES,
      payload: {
        selectServiceFromHomeList: updatedVal,
        openHomeSelectedServiceModal: true,
      },
    });
  };
  props.change("username", props.account_username);
  props.change("password", props.account_password);
  props.change("voucher_list", props.voucherlistsync);
  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table
                size="small"
                sx={{ minWidth: 650 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Voucher Code</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {navigation.voucherlist?.length > 0 ? (
                    navigation.voucherlist?.map((voucher_data: any) => (
                      <TableRow
                        key={voucher_data.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Checkbox
                            checked={voucher_data.selected}
                            onChange={(e) =>
                              navigation.onItemCheck(e, voucher_data)
                            }
                          />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {voucher_data.voucher_code}
                        </TableCell>

                        <TableCell>{voucher_data.service_name}</TableCell>
                        <TableCell align="right">
                          {voucher_data.voucher_amount}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        No voucher
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid container justifyContent={"flex-end"} item xs={12} md={12}>
            <Stack spacing={2} direction="row">
              <Button fullWidth style={configure.default_button} type="submit">
                Sync
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm<any>({
  form: "VoucherListSync",
  onSubmit: submit,
})(VoucherListSync);
const selector = formValueSelector(formName);
export default connect((state: any) => {
  const account_username = state.ClientNavigationReducer.account_username;
  const account_password = state.ClientNavigationReducer.account_password;
  const voucherlistsync = state.ClientNavigationReducer.voucherlistsync;
  return {
    account_username,
    account_password,
    voucherlistsync,
  };
}, {})(ReduxFormComponent);
