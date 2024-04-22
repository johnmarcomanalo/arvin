import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import ButtonComponent from "../../../../../components/button/Button";
import SearchField from "../../../../../components/inputFIeld/SearchField";
import Table from "../../../../../components/table/Table";
import configure from "../../../../configure/configure.json";
import QuotationComponentAnnualQuotaHooks from "../hooks/QuotationComponentAnnualQuotaHooks";
import Modal from "../../../../../components/modal/Modal";
import AddAnnualQuota from "./components/AddAnnualQuota";
export default function AnnualQuota(props) {
  const { ...quotationComponentAnnualQuota } =
    QuotationComponentAnnualQuotaHooks(props);
    const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={quotationComponentAnnualQuota?.addModal}
        fullScreen={matches ? false : true}
        title={"Annual Quota"}
        size={"xs"}
        action={undefined}
        handleClose={quotationComponentAnnualQuota.onClickCloseAddModal}
      >
        <AddAnnualQuota />
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
              click={quotationComponentAnnualQuota.onClickOpenAddModal}
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
              value={quotationComponentAnnualQuota.search}
              onChange={quotationComponentAnnualQuota.onChangeSearch}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={quotationComponentAnnualQuota.columns}
            dataList={quotationComponentAnnualQuota.dataList}
            page={quotationComponentAnnualQuota.page}
            rowsPerPage={quotationComponentAnnualQuota.rowsPerPage}
            handleChangePage={quotationComponentAnnualQuota.handleChangePage}
            handleChangeRowsPerPage={
              quotationComponentAnnualQuota.handleChangeRowsPerPage
            }
            onSelectItem={quotationComponentAnnualQuota.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={quotationComponentAnnualQuota.dataListCount}
            action={(row) => {
              return (
                <Tooltip title="Delete">
                  <DeleteOutlineIcon
                    onClick={() =>
                      quotationComponentAnnualQuota.onDeleteDeduction(row)
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
