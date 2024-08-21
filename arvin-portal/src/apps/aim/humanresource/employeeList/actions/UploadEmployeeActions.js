import { Constants } from "../../../../../reducer/Contants";
import {
  GetMultiSpecificDefaultServices,
  GetSpecificDefaultServices,
  PostDefaultServices,
} from "../../../../../services/apiService";
import { decryptaes } from "../../../../../utils/LightSecurity";

export function RateModel(data) {
  var model = [];

  for (var i = 0; i < data.length; i++) {
    {
      data[i][0] !== "" &&
        model.push({
          cycle: data[i][0],
          rate_class: data[i][1],
          cost_of_energy: data[i][2],
          wesm_adjustment_and_other_charges: data[i][3],
          transmission_charge: data[i][4],
          other_charges: data[i][5],
          demand_charge: data[i][6],
          distribution_energy_charge: data[i][7],
          supply_energy_charge: data[i][8],
          supply_per_customer_month: data[i][9],
          metering_charge: data[i][10],
          metering_per_meter_month: data[i][11],
          system_loss_charge: data[i][12],
          power_factor_adjustment: data[i][13],
          cez_power_factor_adjustment: data[i][14],
          missionary_electrification_for_npc_spug: data[i][15],
          missionary_electrification_for_red_ci: data[i][16],
          environmental_fund: data[i][17],
          stranded_contract_cost: data[i][18],
          stranded_debt: data[i][19],
          fit_all_renewable_charge: data[i][20],
          vat_generation_transmission_and_others: data[i][21],
          vat_distribution: data[i][22],
          vat_rate: data[i][23],
        });
    }
  }
  return model;
}

export function PostRates(formValues, dispatch, props) {
  for (var i = 0; i < formValues.rates.length; i++) {
    Papa.parse(formValues.rates[i], {
      complete: function (results) {
        var data = {
          rates: [],
          request_remarks: formValues.request_remarks,
        };
        data.rates = RateModel(results.data);
        const response = PostDefaultServices(
          "api/billing/for-approval/electric-rates",
          data
        );
        Loading();
        return response
          .then((response) => {
            var map = BillingRatesAttachmentsModel(formValues, response);
            PostBillingRatesAttachments(map);
          })
          .catch((error) => {
            swal.close();
            var title = config.error_message.default;
            var message = "";
            if (typeof error.response.data.message !== "undefined")
              title = error.response.data.message;
            if (typeof error.response.data.errors !== "undefined") {
              const formattedErrors = Object.entries(error.response.data.errors)
                .map(([key, value]) => `${value.join(", ")}`)
                .join("\n");
              message = formattedErrors;
            }
            swal
              .fire({
                title: title,
                text: message,
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn font-weight-bold btn-light-primary",
                },
              })
              .then(function () {});
            const processedError = processServerError(error.response.data);
            throw new SubmissionError(processedError);
          });
      },
    });
  }
}
