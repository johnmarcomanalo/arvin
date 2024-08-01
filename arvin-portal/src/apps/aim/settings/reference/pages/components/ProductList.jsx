import { Grid, Stack, Tooltip, useMediaQuery } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import LaunchIcon from "@mui/icons-material/Launch";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import SearchField from "../../../../../../components/inputFIeld/SearchField";
import Page from "../../../../../../components/pagination/Pagination";
import RefProductsHooks from "../../hooks/RefProductsHooks";
import configure from "../../../../../configure/configure.json";
const formName = "ProductList";
const submit = async (values, dispatch, props) => {
  try {
    await console.log(values);
  } catch (error) {
    console.log(error);
  }
};

let ProductList = (props) => {
  const matches = useMediaQuery("(min-width:600px)");
  const { ...refProducts } = RefProductsHooks(props);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stack
            direction="row"
            justifyContent={"space-between"}
            alignItems={"flex-end"}
            spacing={2}
            sx={{ margin: 1 }}
          >
            <SearchField
              value={refProducts.search}
              onChange={refProducts.onChangeSearch}
            />
            <Page
              page={refProducts?.page}
              limit={refProducts?.dataListCount}
              status={""}
              onHandleChange={refProducts.handleChangePage}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TableContainer>
            <Table size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      backgroundColor: configure.primary_table_color,
                      color: configure.primary_table_text_color,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Actions
                  </TableCell>
                  {refProducts.columns.map((value) => {
                    return (
                      <TableCell
                        style={{
                          backgroundColor: configure.primary_table_color,
                          color: configure.primary_table_text_color,
                          textAlign: value.align,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {value.label}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {props.productList.map((row) => (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">
                      <Tooltip title="View">
                        <LaunchIcon
                          onClick={() => props.onClickFunction(row)}
                          style={{
                            color: "#009197",
                            cursor: "pointer",
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left">{row.code}</TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="left">{row.weight}</TableCell>
                    <TableCell align="left">{row.tax_code}</TableCell>
                    <TableCell align="left">{row.brand}</TableCell>
                    <TableCell align="left">{row.branch}</TableCell>
                    <TableCell align="left">{row.groups}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ReduxFormComponent = reduxForm({
  form: formName,
  onSubmit: submit,
})(ProductList);
const selector = formValueSelector(formName);
export default connect((state) => {
  const productList = state.ReferenceReducer.productList;
  const dataListCount = state.ReferenceReducer.dataListCount;
  return { productList, dataListCount };
}, {})(ReduxFormComponent);
