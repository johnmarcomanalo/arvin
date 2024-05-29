import UpgradeIcon from "@mui/icons-material/Upgrade";
import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import ButtonComponent from "../../../../../components/button/Button";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import Modal from "../../../../../components/modal/Modal";
import Page from "../../../../../components/pagination/Pagination";
import Table from "../../../../../components/table/Table";
import configure from "../../../../configure/configure.json";
import SalesRankingPointsHooks from "../hooks/SalesRankingPointsHooks";
import AddRankingSetup from "./components/AddRankingSetup";
import UpdateRankingSetup from "./components/UpdateRankingSetup";
import ViewRankingSetup from "./components/ViewRankingSetup";
export default function SalesRankingPoints(props) {
  const { ...salesRankingPoints } = SalesRankingPointsHooks(props);
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={salesRankingPoints?.addModal}
        fullScreen={matches ? false : true}
        title={"Ranking Setup"}
        size={"xs"}
        action={undefined}
        handleClose={salesRankingPoints.onClickCloseAddModal}
      >
        <AddRankingSetup />
      </Modal>
      <Modal
        open={salesRankingPoints?.addModal2}
        fullScreen={matches ? false : true}
        title={"Ranking Placements"}
        size={"sm"}
        action={undefined}
        handleClose={salesRankingPoints.onClickCloseAddModal2}
      >
        <ViewRankingSetup />
      </Modal>
      <Modal
        open={salesRankingPoints?.addModal3}
        fullScreen={matches ? false : true}
        title={"Update Ranking Placement"}
        size={"xs"}
        action={undefined}
        handleClose={salesRankingPoints.onClickCloseAddModal3}
      >
        <UpdateRankingSetup />
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
              children={"Ranking Setup"}
              click={salesRankingPoints.onClickOpenAddModal}
            />
          </Stack>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Stack
            direction="row"
            justifyContent={matches ? "flex-start" : "center"}
            alignItems={matches ? "flex-start" : "center"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
          >
            <SearchField
              value={salesRankingPoints.search}
              onChange={salesRankingPoints.onChangeSearch}
            />
          </Stack>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Stack
            direction="row"
            justifyContent={"flex-end"}
            alignItems={"flex-end"}
            flexDirection={matches ? "row" : "column"}
            spacing={2}
          >
            <Page
              page={salesRankingPoints?.page}
              limit={salesRankingPoints?.dataListCount}
              status={""}
              onHandleChange={salesRankingPoints.handleChangePage}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={salesRankingPoints.columns}
            dataList={salesRankingPoints.dataList}
            page={salesRankingPoints.page}
            rowsPerPage={salesRankingPoints.rowsPerPage}
            handleChangePage={salesRankingPoints.handleChangePage}
            handleChangeRowsPerPage={salesRankingPoints.handleChangeRowsPerPage}
            onSelectItem={salesRankingPoints.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={salesRankingPoints.dataListCount}
            actionshow={true}
            paginationShow={false}
            action={(row) => {
              return (
                <Tooltip title="Update">
                  <UpgradeIcon
                    onClick={() => salesRankingPoints.onSelectItemtoUpdate(row)}
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
