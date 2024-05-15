import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import ButtonComponent from "../../../../../components/button/Button";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import Table from "../../../../../components/table/Table";
import configure from "../../../../configure/configure.json";
import SalesDailyOutComponentAnnualSettingSalesRankingHooks from "../hooks/SalesDailyOutComponentAnnualSettingSalesRankingHooks";
import Modal from "../../../../../components/modal/Modal";
import AddAnnualSettingSalesRanking from "./components/AddAnnualSettingSalesRanking";
import ViewAnnualSettingSalesRankingPlacement from "./components/ViewAnnualSettingSalesRankingPlacement";
import Page from "../../../../../components/pagination/Pagination";
export default function AnnualSettingSalesRanking(props) {
  const { ...salesDailyOutComponentAnnualSettingSalesRanking } =
    SalesDailyOutComponentAnnualSettingSalesRankingHooks(props);
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={salesDailyOutComponentAnnualSettingSalesRanking?.addModal}
        fullScreen={matches ? false : true}
        title={"Annual Ranking"}
        size={"xs"}
        action={undefined}
        handleClose={
          salesDailyOutComponentAnnualSettingSalesRanking.onClickCloseAddModal
        }
      >
        <AddAnnualSettingSalesRanking />
      </Modal>
      <Modal
        open={salesDailyOutComponentAnnualSettingSalesRanking?.addModal2}
        fullScreen={matches ? false : true}
        title={"Ranking Placement"}
        size={"sm"}
        action={undefined}
        handleClose={
          salesDailyOutComponentAnnualSettingSalesRanking.onClickCloseAddModal2
        }
      >
        <ViewAnnualSettingSalesRankingPlacement />
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
              children={"Add Annual Ranking"}
              click={
                salesDailyOutComponentAnnualSettingSalesRanking.onClickOpenAddModal
              }
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
              value={salesDailyOutComponentAnnualSettingSalesRanking.search}
              onChange={
                salesDailyOutComponentAnnualSettingSalesRanking.onChangeSearch
              }
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
              page={salesDailyOutComponentAnnualSettingSalesRanking?.page}
              limit={
                salesDailyOutComponentAnnualSettingSalesRanking?.dataListCount
              }
              status={""}
              onHandleChange={
                salesDailyOutComponentAnnualSettingSalesRanking.handleChangePage
              }
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={salesDailyOutComponentAnnualSettingSalesRanking.columns}
            dataList={salesDailyOutComponentAnnualSettingSalesRanking.dataList}
            page={salesDailyOutComponentAnnualSettingSalesRanking.page}
            rowsPerPage={
              salesDailyOutComponentAnnualSettingSalesRanking.rowsPerPage
            }
            handleChangePage={
              salesDailyOutComponentAnnualSettingSalesRanking.handleChangePage
            }
            handleChangeRowsPerPage={
              salesDailyOutComponentAnnualSettingSalesRanking.handleChangeRowsPerPage
            }
            onSelectItem={
              salesDailyOutComponentAnnualSettingSalesRanking.onSelectItem
            }
            id={"home_attendance"}
            localStorage={""}
            rowCount={
              salesDailyOutComponentAnnualSettingSalesRanking.dataListCount
            }
            actionshow={true}
            paginationShow={false}
            action={(row) => {
              return null;
              // <Tooltip title="Delete">
              //   <DeleteOutlineIcon
              //     onClick={() =>
              //       salesDailyOutComponentAnnualSettingSalesRanking.onDeleteDeduction(
              //         row
              //       )
              //     }
              //     style={{
              //       color: "#009197",
              //       cursor: "pointer",
              //     }}
              //   />
              // </Tooltip>
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
