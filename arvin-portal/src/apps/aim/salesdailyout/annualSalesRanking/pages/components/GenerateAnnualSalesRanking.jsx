import { Grid, Stack } from "@mui/material";
import * as React from "react";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import ComboBox from "../../../../../../components/autoComplete/AutoComplete";
import { Field, change, formValueSelector, reduxForm, reset } from "redux-form";
import InputField from "../../../../../../components/inputFIeld/InputField";
import InputYearPicker from "../../../../../../components/inputFIeld/InputYearPicker";
import ButtonComponent from "../../../../../../components/button/Button";
import configure from "../../../../../configure/configure.json";
import RefCompaniesHooks from "../../../../reference/hooks/RefCompaniesHooks";
import RefBusinessUnitsHooks from "../../../../reference/hooks/RefBusinessUnitsHooks";
import RefTeamsHooks from "../../../../reference/hooks/RefTeamsHooks";
import RefDepartmentsHooks from "../../../../reference/hooks/RefDepartmentsHooks";
import RefSectionsHooks from "../../../../reference/hooks/RefSectionsHooks";
import RefSubSectionsHooks from "../../../../reference/hooks/RefSubSectionsHooks";
import { Constants } from "../../../../../../reducer/Contants";
import SalesDailyOutComponentAnnualSalesRankingHooks from "../../hooks/SalesDailyOutComponentAnnualSalesRankingHooks";
import { getAnnualSalesRanking } from "../../actions/SalesDailyOutComponentAnnualSalesRankingActions";
import moment from "moment";
import swal from "sweetalert";
import RefSalesRankingHooks from "../../../../reference/hooks/RefSalesRankingHooks";
import { decryptaes } from "../../../../../../utils/LightSecurity";
const formName = "GenerateAnnualSalesRanking";
let AddAnnualSettingSale = (props) => {
  const { ...refSalesRanking } = RefSalesRankingHooks();
  const { ...salesDailyOutComponentAnnualSalesRanking } =
    SalesDailyOutComponentAnnualSalesRankingHooks();
  const account_details =
    salesDailyOutComponentAnnualSalesRanking.account_details;
  const submit = async (values, dispatch, props) => {
    try {
      let data = {
        p:
          salesDailyOutComponentAnnualSalesRanking.page == null
            ? 1
            : salesDailyOutComponentAnnualSalesRanking.page,
        q: salesDailyOutComponentAnnualSalesRanking.search,
        l: salesDailyOutComponentAnnualSalesRanking.rowsPerPage,
        f: salesDailyOutComponentAnnualSalesRanking.filterQuery,
        u: account_details.code,
        rc: values?.rank_code,
      };
      const res = await dispatch(getAnnualSalesRanking(data));
      // swal(decrypted.title, decrypted.message, decrypted.status);
      // reset();
      // await dispatch({
      //   type: Constants.ACTION_SALES_DAILY_OUT,
      //   payload: {
      //     addModal: false,
      //   },
      // });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={props.handleSubmit(submit)}>
        {/* <CSRFToken /> */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Field
              id="description"
              name="description"
              label="Rank List"
              options={refSalesRanking?.sales_ranking}
              getOptionLabel={(option) =>
                option?.description ? option?.description : ""
              }
              required={true}
              component={ComboBox}
              onChangeHandle={(e, newValue) => {
                if (newValue?.description) {
                  props.change("rank_code", newValue.code);
                }
              }}
            />
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
                iconType="generate"
                type="submit"
                fullWidth={true}
                children={"Generate Table"}
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
})(AddAnnualSettingSale);
const selector = formValueSelector(formName);
export default connect((state) => {
  const refresh = state.SalesDailyOutReducer.refresh;
  return { refresh };
}, {})(ReduxFormComponent);
