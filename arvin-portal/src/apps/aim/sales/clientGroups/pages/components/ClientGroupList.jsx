import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import Page from "components/pagination/Pagination";
import * as React from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, reduxForm } from "redux-form";
import Modal from "components/modal/Modal";
import Table from "components/table/Table";
import ClientGroupsListHooks from "../../hooks/ClientGroupsListHooks";
import ViewClientGroup from "./ViewClientGroup";
import SearchField from "components/inputFIeld/SearchField";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import configure from "apps/configure/configure.json";
import ComboBox from "components/autoComplete/AutoComplete";
const formName = "ClientGroups";
let ClientGroups = (props) => {
  const { ...clientGroups } = ClientGroupsListHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <React.Fragment>
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
        {/* <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent={"space-around"}
            alignItems={"flex-end"}
            spacing={2}
          >
            <SearchField
              value={clientGroups.search}
              onChange={clientGroups.onChangeSearch}
              textHidden={false}
              fullwidth={false}
            />
            <Page
              page={clientGroups?.page}
              limit={clientGroups?.dataListCount}
              status={""}
              onHandleChange={clientGroups.handleChangePage}
            />
          </Stack>
        </Grid> */}

        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            spacing={2}
          >
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
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Stack
            direction="row"
            justifyContent="space-start"
            alignItems="flex-end"
            spacing={2}
          >
            <SearchField
              value={clientGroups.search}
              onChange={clientGroups.onChangeSearch}
              textHidden={false}
              fullwidth={true}
            />
          </Stack>
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
            subAction2Show={true}
            action={(row) => {
              return (
                <Tooltip title="Select">
                  <AddCircleIcon
                    onClick={() => props.onClickSelect(row)}
                    style={{
                      color: configure.secondary_color,
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
