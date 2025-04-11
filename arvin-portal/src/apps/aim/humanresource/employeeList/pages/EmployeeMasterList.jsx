import UpgradeIcon from "@mui/icons-material/Upgrade";
import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import ButtonComponent from "components/button/Button";
import SearchField from "components/inputFIeld/SearchField";
import Page from "components/pagination/Pagination";
import Table from "components/table/Table";
import configure from "apps/configure/configure.json";
import EmployeeMasterListHooks from "../hooks/EmployeeMasterListHooks";
import Modal from "components/modal/Modal";
import UploadEmployee from "./components/UploadEmployee";
import AddEmployee from "./components/AddEmployee";
export default function EmployeeMasterList(props) {
  const { ...employeeMasterList } = EmployeeMasterListHooks(props);
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={employeeMasterList?.uploadModal}
        fullScreen={matches ? false : true}
        title={"Upload Employee"}
        size={"xs"}
        action={undefined}
        handleClose={employeeMasterList.onClickCloseUploadModal}
      >
        <UploadEmployee />
      </Modal>
      <Modal
        open={employeeMasterList?.addModal}
        fullScreen={matches ? false : true}
        title={"Add Employee"}
        size={"xs"}
        action={undefined}
        handleClose={employeeMasterList.onClickCloseAddModal}
      >
        <AddEmployee />
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
              iconType="import"
              type="button"
              fullWidth={true}
              children={"Upload Employee"}
              click={employeeMasterList.onClickOpenUploadModal}
            />
            <ButtonComponent
              stx={configure.default_button}
              iconType="add"
              type="button"
              fullWidth={true}
              children={"Add Employee"}
              click={employeeMasterList.onClickOpenAddModal}
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
              value={employeeMasterList.search}
              onChange={employeeMasterList.onChangeSearch}
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
              page={employeeMasterList?.page}
              limit={employeeMasterList?.dataListCount}
              status={""}
              onHandleChange={employeeMasterList.handleChangePage}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={employeeMasterList.columns}
            dataList={employeeMasterList.dataList}
            page={employeeMasterList.page}
            rowsPerPage={employeeMasterList.rowsPerPage}
            handleChangePage={employeeMasterList.handleChangePage}
            handleChangeRowsPerPage={employeeMasterList.handleChangeRowsPerPage}
            onSelectItem={employeeMasterList.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={employeeMasterList.dataListCount}
            actionshow={true}
            paginationShow={false}
            action={(row) => {
              return null;
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
