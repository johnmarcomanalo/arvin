import { Grid, Tooltip } from "@mui/material";
import * as React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Table from "../../../../../components/table/Table";
import HomeComponentRequestsHooks from "../../hooks/HomeComponentRequestsHooks";
export default function Requests(props) {
  const { ...homeComponentRequests } = HomeComponentRequestsHooks(props);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={homeComponentRequests.columns}
            dataList={homeComponentRequests.dataList}
            page={homeComponentRequests.page}
            rowsPerPage={homeComponentRequests.rowsPerPage}
            handleChangePage={homeComponentRequests.handleChangePage}
            handleChangeRowsPerPage={
              homeComponentRequests.handleChangeRowsPerPage
            }
            onSelectItem={homeComponentRequests.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={homeComponentRequests.dataListCount}
            action={(row) => {
              return (
                <Tooltip title="Delete">
                  <DeleteOutlineIcon
                    onClick={() => homeComponentRequests.onDeleteDeduction(row)}
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
