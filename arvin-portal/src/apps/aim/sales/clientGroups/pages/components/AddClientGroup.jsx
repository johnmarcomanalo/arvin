import {
  ButtonGroup,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import { connect, useDispatch } from "react-redux";
import { change, Field, formValueSelector, reduxForm } from "redux-form";
import ButtonComponent from "components/button/Button";
import InputField from "components/inputFIeld/InputField";
import configure from "apps/configure/configure.json";
import AddClientGroupsHooks from "../../hooks/AddClientGroupsHooks";
import Modal from "components/modal/Modal";
import Customers from "../../../../settings/accessrights/customerrights/pages/components/Customers";
import { postClientGroup } from "../../actions/ClientGroupsActions";
import { Constants } from "../../../../../../reducer/Contants";
import CSRFToken from "security/csrftoken";
import ComboBox from "components/autoComplete/AutoComplete";
import AccountList from "apps/aim/humanresource/employeeList/pages/components/AccountList";
import InputFieldButton from "components/inputFIeld/InputFieldButton";
import CloseIcon from "@mui/icons-material/Close";
const formName = "AddClientGroup";
const submit = async (values, dispatch, props) => {
  try {
    const res = await dispatch(postClientGroup(values));
    await dispatch({
      type: Constants.ACTION_SALES_DAILY_OUT,
      payload: {
        refresh: !props.refresh,
        addModal: false,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

let AddClientGroup = (props) => {
  const { ...addClientGroups } = AddClientGroupsHooks(props);
  const matches = useMediaQuery("(min-width:600px)");
  const state = addClientGroups.state;
  props.dispatch(change(formName, "sub_group", state?.sub_group));

  return (
    <React.Fragment>
      <Modal
        open={addClientGroups?.viewModal}
        fullScreen={matches ? false : true}
        title={"Client List"}
        size={"md"}
        action={undefined}
        handleClose={addClientGroups.onClickCloseViewModal}
      >
        <Customers onClickSelect={addClientGroups.onClickSelectClientList} />
      </Modal>
      <Modal
        open={addClientGroups.employeeModal}
        fullScreen={matches ? false : true}
        title={"Account Search"}
        size={"md"}
        action={undefined}
        handleClose={addClientGroups.onClickCloseEmployeeViewModal}
      >
        <AccountList onClickSelect={addClientGroups.onClickSelectEmployee} />
      </Modal>
      <form onSubmit={props.handleSubmit}>
        <CSRFToken />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Field
              id="description"
              name="description"
              label="Description"
              required={true}
              component={InputField}
              multiline={true}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Field
              id="type"
              name="type"
              label="Type"
              options={addClientGroups?.type}
              getOptionLabel={(option) =>
                option?.description ? option?.description : ""
              }
              required={true}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  props.change("bdo", "");
                  props.change("subsection", "");
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Field
              id="bdo"
              name="bdo"
              label="BDO"
              component={InputFieldButton}
              readOnly={true}
              required={true}
              multiline={1}
              onClick={() => {
                addClientGroups.onClickOpenEmployeeViewModal();
              }}
              handleClick={() => {
                addClientGroups.onClickSelectResetEmployee();
              }}
              inputIcon={<CloseIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Field
              id="subsection"
              name="subsection"
              label="Warehouse"
              options={addClientGroups?.user_access_organization_rights}
              getOptionLabel={(option) =>
                option?.description
                  ? option.description
                  : props.subsection
                  ? props.subsection
                  : ""
              }
              required={true}
              // disable={props.type !== "Provincial" ? true : false}
              component={ComboBox}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography
              align="left"
              gutterBottom
              sx={{ color: configure.primary_color }}
            >
              Selected Clients
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TableContainer
              sx={{
                // maxHeight: screenHeight - 300,
                whiteSpace: "nowrap",
                overflowX: "auto",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Code
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: configure.primary_table_color,
                        color: configure.primary_table_text_color,
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.sub_group?.map((value, index) => {
                    return (
                      <TableRow>
                        <TableCell>{value.customer_code}</TableCell>
                        <TableCell>{value.description}</TableCell>
                        <TableCell>{value.type}</TableCell>
                        <TableCell>{value.status}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={2}
            >
              <ButtonGroup disableElevation aria-label="Disabled button group">
                <ButtonComponent
                  stx={configure.default_button}
                  iconType="add"
                  type="button"
                  fullWidth={true}
                  children={"Add Client"}
                  click={addClientGroups.onClickOpenViewModal}
                />
                <ButtonComponent
                  stx={configure.default_button}
                  iconType="delete"
                  type="button"
                  fullWidth={true}
                  children={"Remove Client"}
                  click={addClientGroups.onClickRemoveClientList}
                />
              </ButtonGroup>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={2}
            >
              <ButtonComponent
                stx={configure.default_button}
                iconType="submit"
                type="submit"
                fullWidth={true}
                children={"Add Group"}
              />
            </Stack>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(AddClientGroup);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  const type = selector(state, "type");
  const subsection = selector(state, "subsection");
  return {
    refresh,
    type,
    subsection,
  };
}, {})(ReduxFormComponent);
