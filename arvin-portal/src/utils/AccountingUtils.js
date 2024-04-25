import NumberFormat from "react-number-format";
import config from "../config.json";
import { RenderTotalAmountDisplay } from "./renderUtils";

export const CheckDataNumber = (data) => {
  return data == null || data == "" ? 0 : data;
};
export const ViewAmountFormat = (data) => {
  var value = 0;
  if (typeof data !== "undefined") {
    value = parseFloat(data);
  }

  return (
    <NumberFormat
      thousandsGroupStyle="thousand"
      value={value}
      prefix={config.currency}
      decimalSeparator="."
      displayType="text"
      type="text"
      thousandSeparator={true}
      allowNegative={true}
      decimalScale={2}
      fixedDecimalScale={true}
    />
  );
};

export const ViewNumberFormat = (data, decimal = 2) => {
  var value = 0;
  if (typeof data !== "undefined") {
    value = data;
  }
  return (
    <NumberFormat
      thousandsGroupStyle="thousand"
      value={value}
      decimalSeparator="."
      displayType="text"
      type="text"
      thousandSeparator={true}
      allowNegative={true}
      decimalScale={decimal}
      fixedDecimalScale={true}
    />
  );
};

export const GetDownpayment = (amount) => {
  return AmountDecimal(amount / 2);
};

export const GetPaymentTermsAmount = (amount, months) => {
  return AmountDecimal(amount / months);
};
export const AmountDecimal = (data) => {
  return parseFloat(data).toFixed(2);
};

export const AmountFormat = (data) => {
  var result = 0;
  if (typeof data !== "undefined") {
    if (data == null) {
    } else {
      result = data.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
  }
  return result;
};

export const VATAmount = (vatZeroTag, price, vat, vat_energy_percentage) => {
  var vatAmount = 0;
  if (
    typeof price !== "undefined" ||
    typeof vat !== "undefined" ||
    typeof vatZeroTag !== "undefined"
  ) {
    if (vatZeroTag == 1) {
      let totalVatPrice = price * vat;
      let totalVatPricePercentage = vat_energy_percentage / 100;
      vatAmount = totalVatPrice * totalVatPricePercentage;
      return vatAmount;
    }
    vatAmount = price * vat;
  }
  return vatAmount;
};

export const TotalAmount = (price, vat, quantity) => {
  var total_price = 0;
  var total_amount = 0;

  if (
    typeof price !== "undefined" ||
    typeof vat !== "undefined" ||
    typeof quantity !== "undefined"
  ) {
    total_price = parseFloat(price) + parseFloat(vat);
    total_amount = total_price * quantity;
  }

  return total_amount;
};

export const TotalVATAmount = (
  vatZeroTag,
  totalAmount,
  vat,
  vat_energy_percentage
) => {
  var vatAmount = 0;
  if (
    typeof price !== "undefined" ||
    typeof vat !== "undefined" ||
    typeof vatZeroTag !== "undefined"
  ) {
    if (vatZeroTag == 1) {
      let energyVatTimesVat = parseFloat(vat) * (vat_energy_percentage / 100);
      let totalEnergyVatTimesVat = parseFloat(1) + energyVatTimesVat;
      vatAmount = totalAmount / totalEnergyVatTimesVat;
      vatAmount = totalAmount - vatAmount;
      return vatAmount;
    }

    vatAmount = totalAmount / (parseFloat(1) + parseFloat(vat));
    vatAmount = totalAmount - vatAmount;
  }
  return vatAmount;
};

export const SumSelectedAmounts = (Amount, objectName) => {
  var total = 0;
  for (var i = 0; i < Amount.length; i++) {
    if (Amount[i]["selected"] == true) {
      total = parseFloat(total) + parseFloat(Amount[i][objectName]);
    }
  }
  return total;
  // return Amount.reduce(function (a, b) {
  //   if (typeof b.selected == "undefined") return 0;
  //   if (b.selected == true) console.log(a); return a + b[objectName];
  //   if (a >= 0) return a;
  //   if (a.balance == 0) return a + b[objectName];
  // }, 0);
};

export const SumAmounts = (Amount, objectName) => {
  var total = 0;
  for (var i = 0; i < Amount.length; i++) {
    let amount = parseFloat(Amount[i][objectName]).toFixed(2);
    total = parseFloat(total) + parseFloat(amount);
  }
  return total;
  // return Amount.reduce(function (a, b) {
  //   return a + b[objectName];
  // }, 0);
};

export const SumArray = (nums) => {
  var total = nums.reduce(function (a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0);

  return (Math.round(total * 100) / 100).toFixed(2);
};

export const DecimalToPercentage = (data) => {
  return ViewNumberFormat(data * 100);
};

export const DecimalToPercentageComplete = (data) => {
  return data * 100;
};

export const ViewAmountFormatingDecimals = (data, count) => {
  var number = 0;
  var formattedNo = number.toFixed(count);
  if (
    typeof data !== "undefined" &&
    data !== null &&
    data !== ".0000" &&
    data !== ".00"
  ) {
    const value = parseFloat(data);
    if (!isNaN(value)) {
      // Check if the number is negative
      const isNegative = value < 0;
      // Format the absolute value of the number with 4 decimal places and commas as thousands separator
      const formattedNumber = Math.abs(value).toLocaleString(undefined, {
        minimumFractionDigits: count,
        maximumFractionDigits: count,
      });
      // Add parentheses for negative numbers
      if (isNegative) {
        return `(${formattedNumber})`;
      } else {
        return formattedNumber;
      }
    }
  }
  return parseFloat(formattedNo);
};
export const SeparateComma = (val) => {
  // remove sign if negative
  var sign = 1;
  if (val < 0) {
    sign = -1;
    val = -val;
  }
  // trim the number decimal point if it exists
  let num = val.toString().includes(".")
    ? val.toString().split(".")[0]
    : val.toString();
  let len = num.toString().length;
  let result = "";
  let count = 1;

  for (let i = len - 1; i >= 0; i--) {
    result = num.toString()[i] + result;
    if (count % 3 === 0 && count !== 0 && i !== 0) {
      result = "," + result;
    }
    count++;
  }

  // add number after decimal point
  if (val.toString().includes(".")) {
    result = result + "." + val.toString().split(".")[1];
  }
  // return result with - sign if negative
  return sign < 0 ? "-" + result : result;
};

export const TotalAmountConstructive = (price, vat, quantity) => {
  var total_price = 0;
  var total_amount = 0;

  if (
    typeof price !== "undefined" ||
    typeof vat !== "undefined" ||
    typeof quantity !== "undefined"
  ) {
    total_amount = parseFloat(price) * quantity + parseFloat(vat);
  }

  return total_amount;
};
export const ViewAmountFormating = (data) => {
  var value = 0;
  if (typeof data !== "undefined") {
    value = parseFloat(data);
  }

  return (
    <NumberFormat
      thousandsGroupStyle="thousand"
      value={value}
      // prefix={config.currency}
      decimalSeparator="."
      displayType="text"
      type="text"
      thousandSeparator={true}
      allowNegative={true}
      decimalScale={2}
      fixedDecimalScale={true}
    />
  );
};

export const NumberToWords = (num) => {
  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "Ten",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convert = (num) => {
    if (num === 0) return "";
    if (num < 10) return units[num];
    if (num >= 11 && num <= 19) return teens[num - 10];
    if (num === 10) return "Ten";
    if (num > 10 && num < 100 && num % 10 === 0)
      return tens[Math.floor(num / 10)];
    if (num >= 20 && num <= 99)
      return tens[Math.floor(num / 10)] + " " + units[num % 10];
    if (num >= 100 && num <= 999)
      return units[Math.floor(num / 100)] + " Hundred " + convert(num % 100);
    if (num >= 1000 && num <= 999999)
      return (
        convert(Math.floor(num / 1000)) + " Thousand " + convert(num % 1000)
      );
    if (num >= 1000000 && num <= 999999999)
      return (
        convert(Math.floor(num / 1000000)) +
        " Million " +
        convert(num % 1000000)
      );
    if (num >= 1000000000 && num <= 999999999999)
      return (
        convert(Math.floor(num / 1000000000)) +
        " Billion " +
        convert(num % 1000000000)
      );

    return "Invalid Input";
  };

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let result = convert(integerPart) + " PESOS ";
  if (decimalPart > 0) {
    result += " AND " + convert(decimalPart) + " CENTAVOS ONLY";
  } else {
    result += " ONLY ";
  }

  return num === 0 ? "ZERO" : result.toUpperCase();
};
