import { Grid, Stack, useMediaQuery } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import ButtonComponent from "../../../../../components/button/Button";
import InputField from "../../../../../components/inputFIeld/InputField";
import Modal from "../../../../../components/modal/Modal";
import configure from "../../../../configure/configure.json";
import ClientGroupsHooks from "../hooks/ClientGroupsHooks";
import AddClientGroup from "./components/AddClientGroup";
import Table from "../../../../../components/table/Table";
const formName = "ClientGroups";
let ClientGroups = (props) => {
  const { ...clientGroups } = ClientGroupsHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
      <Modal
        open={clientGroups?.addModal}
        fullScreen={matches ? false : true}
        title={"Add Group"}
        size={"md"}
        action={undefined}
        handleClose={clientGroups.onClickOpenCloseModal}
      >
        <AddClientGroup />
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
              children={"Add Group"}
              click={clientGroups.onClickOpenAddModal}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table
            columns={clientGroups.columns}
            dataList={clientGroups.dataList}
            page={clientGroups.page}
            rowsPerPage={clientGroups.rowsPerPage}
            handleChangePage={clientGroups.handleChangePage}
            handleChangeRowsPerPage={clientGroups.handleChangeRowsPerPage}
            onSelectItem={clientGroups.onSelectItem}
            id={"home_attendance"}
            localStorage={""}
            rowCount={clientGroups.dataListCount}
            actionshow={true}
            paginationShow={false}
            subAction1Show={true}
            subAction2Show={false}
            action={(row) => {
              return null;
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: "",
})(ClientGroups);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;

  return {
    refresh,
  };
}, {})(ReduxFormComponent);
