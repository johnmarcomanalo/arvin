import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import ButtonComponent from "../../../../../components/button/Button";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import Table from "../../../../../components/table/Table";
import configure from "../../../../configure/configure.json";
import QuotationComponentDailyQuotaHooks from "../hooks/QuotationComponentDailyQuotaHooks";
import Modal from "../../../../../components/modal/Modal";
import AddDailyQuota from "./components/AddDailyQuota";
export default function DailyQuota(props) {
  const { ...quotationComponentDailyQuota } =
    QuotationComponentDailyQuotaHooks(props);
  console.log(quotationComponentDailyQuota);
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={quotationComponentDailyQuota?.addModal}
        fullScreen={matches ? false : true}
        title={"Daily Quota"}
        size={"sm"}
        action={undefined}
        handleClose={quotationComponentDailyQuota.onClickCloseAddModal}
      >
        <AddDailyQuota />
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
              click={quotationComponentDailyQuota.onClickOpenAddModal}
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
              value={quotationComponentDailyQuota.search}
              onChange={quotationComponentDailyQuota.onChangeSearch}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={quotationComponentDailyQuota.columns}
            dataList={quotationComponentDailyQuota.dataList}
            page={quotationComponentDailyQuota.page}
            rowsPerPage={quotationComponentDailyQuota.rowsPerPage}
            handleChangePage={quotationComponentDailyQuota.handleChangePage}
            handleChangeRowsPerPage={
              quotationComponentDailyQuota.handleChangeRowsPerPage
            }
            onSelectItem={quotationComponentDailyQuota.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={quotationComponentDailyQuota.dataListCount}
            action={(row) => {
              return (
                <Tooltip title="Delete">
                  <DeleteOutlineIcon
                    onClick={() =>
                      quotationComponentDailyQuota.onDeleteDeduction(row)
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
