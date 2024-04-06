import { Grid, IconButton } from "@mui/material";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import HomeAppWorkHooks from "../../../home/hooks/HomeAppWorkHooks";
import NavigationHooks from "../../hooks/NavigationHooks";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HomeServicesContants } from "../../../home/constants/Constants";
import { getSelectedServiceByID } from "../../../home/actions/HomeAppWorkActions";
const VoucherList = (props: any) => {
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
  return (
    <React.Fragment>
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
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <IconButton
                          color="inherit"
                          aria-label="ArrowForwardIosIcon"
                          onClick={() => {
                            onHandleCheckVoucher(voucher_data);
                          }}
                          size="small"
                        >
                          <ArrowForwardIosIcon />
                        </IconButton>
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
      </Grid>
    </React.Fragment>
  );
};

export default VoucherList;
