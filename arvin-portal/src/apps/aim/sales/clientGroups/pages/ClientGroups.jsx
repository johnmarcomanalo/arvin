import { Grid, Stack, useMediaQuery } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import ButtonComponent from "components/button/Button";
import Modal from "components/modal/Modal";
import configure from "apps/configure/configure.json";
import ClientGroupsHooks from "../hooks/ClientGroupsHooks";
import AddClientGroup from "./components/AddClientGroup";
import Table from "components/table/Table";
import ViewClientGroup from "./components/ViewClientGroup";
import Page from "components/pagination/Pagination";
import SearchField from "components/inputFIeld/SearchField";
import ComboBox from "components/autoComplete/AutoComplete";
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
      <Modal
        open={clientGroups?.viewModal}
        fullScreen={matches ? false : true}
        title={"View Group"}
        size={"md"}
        action={undefined}
        handleClose={clientGroups.onClickCloseViewModal}
      >
        <ViewClientGroup />
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
        <Grid item xs={12} sm={12} md={4} lg={4}>
          {/* <Stack
            direction="row"
            justifyContent="space-start"
            alignItems="flex-end"
            spacing={2}
          > */}
          <SearchField
            value={clientGroups.search}
            onChange={clientGroups.onChangeSearch}
            textHidden={false}
            fullwidth={true}
          />
          {/* </Stack> */}
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          {/* <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            spacing={2}
          > */}
          <Field
            id="type"
            name="type"
            label="Type"
            options={clientGroups?.type}
            getOptionLabel={(option) =>
              option?.description ? option?.description : ""
            }
            required={true}
            component={ComboBox}
            onChangeHandle={(e, newValue) => {
              if (newValue?.description) {
                clientGroups.onChangeFilter(newValue?.description);
              } else {
                clientGroups.onChangeFilter("");
              }
            }}
          />
          {/* </Stack> */}
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Stack justifyContent="flex-end" alignItems="flex-end">
            <Page
              page={clientGroups?.page}
              limit={clientGroups?.dataListCount}
              onHandleChange={clientGroups.handleChangePage}
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
  const type = selector(state, "type");
  return {
    refresh,
    type,
  };
}, {})(ReduxFormComponent);
