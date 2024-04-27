import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import ButtonComponent from "../../../../../components/button/Button";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import Table from "../../../../../components/table/Table";
import configure from "../../../../configure/configure.json";
import SalesDailyOutComponentAnnualSettingSaleHooks from "../hooks/SalesDailyOutComponentAnnualSettingSaleHooks";
import Modal from "../../../../../components/modal/Modal";
import AddAnnualSettingSale from "./components/AddAnnualSettingSale";
export default function AnnualQuota(props) {
  const { ...salesDailyOutComponentAnnualSettingSale } =
    SalesDailyOutComponentAnnualSettingSaleHooks(props);
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={salesDailyOutComponentAnnualSettingSale?.addModal}
        fullScreen={matches ? false : true}
        title={"Annual Quota"}
        size={"xs"}
        action={undefined}
        handleClose={
          salesDailyOutComponentAnnualSettingSale.onClickCloseAddModal
        }
      >
        <AddAnnualSettingSale />
      </Modal>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent={matches ? "flex-end" : "center"}
            alignItems={matches ? "flex-end" : "center"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
          >
            <ButtonComponent
              stx={configure.default_button}
              iconType="add"
              type="button"
              fullWidth={true}
              children={"Add Quota"}
              click={
                salesDailyOutComponentAnnualSettingSale.onClickOpenAddModal
              }
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent={matches ? "flex-start" : "center"}
            alignItems={matches ? "flex-start" : "center"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
          >
            <SearchField
              value={salesDailyOutComponentAnnualSettingSale.search}
              onChange={salesDailyOutComponentAnnualSettingSale.onChangeSearch}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={salesDailyOutComponentAnnualSettingSale.columns}
            dataList={salesDailyOutComponentAnnualSettingSale.dataList}
            page={salesDailyOutComponentAnnualSettingSale.page}
            rowsPerPage={salesDailyOutComponentAnnualSettingSale.rowsPerPage}
            handleChangePage={
              salesDailyOutComponentAnnualSettingSale.handleChangePage
            }
            handleChangeRowsPerPage={
              salesDailyOutComponentAnnualSettingSale.handleChangeRowsPerPage
            }
            onSelectItem={salesDailyOutComponentAnnualSettingSale.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={salesDailyOutComponentAnnualSettingSale.dataListCount}
            actionShow={false}
            action={(row) => {
              return (
                <Tooltip title="Delete">
                  <DeleteOutlineIcon
                    onClick={() =>
                      salesDailyOutComponentAnnualSettingSale.onDeleteDeduction(
                        row
                      )
                    }
                    style={{
                      color: "#009197",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              );
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
