import { Grid, Tooltip, Stack } from "@mui/material";
import * as React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Table from "../../../../../components/table/Table";
import HomeComponentAttendanceHooks from "../../hooks/HomeComponentAttendanceHooks";
import FormTitle from "../../../../../components/formTItle/FormTitle";
export default function Attendance(props) {
  const { ...homeComponentAttendance } = HomeComponentAttendanceHooks(props);
  console.log(homeComponentAttendance);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Stack direction="row" justifyContent="flex-start" spacing={2}>
            <FormTitle title="Attendance" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={homeComponentAttendance.columns}
            dataList={homeComponentAttendance.dataList}
            page={homeComponentAttendance.page}
            rowsPerPage={homeComponentAttendance.rowsPerPage}
            handleChangePage={homeComponentAttendance.handleChangePage}
            handleChangeRowsPerPage={
              homeComponentAttendance.handleChangeRowsPerPage
            }
            onSelectItem={homeComponentAttendance.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={homeComponentAttendance.dataListCount}
            action={(row) => {
              return (
                <Tooltip title="Delete">
                  <DeleteOutlineIcon
                    onClick={() =>
                      homeComponentAttendance.onDeleteDeduction(row)
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
