import * as React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import PoppinsRegular from "../../../../../../utils/font/Poppins-Regular.ttf";
import PoppinsBold from "../../../../../../utils/font/Poppins-Bold.ttf";
import PoppinsBoldItalic from "../../../../../../utils/font/Poppins-BoldItalic.ttf";
import PoppinsSemiBoldItalic from "../../../../../../utils/font/Poppins-SemiBoldItalic.ttf";
// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: "#fff",
//     paddingBottom: 50,
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
//   body: {
//     paddingTop: 130,
//     paddingBottom: 65,
//     paddingHorizontal: 35,
//   },
// });

// const Content = () => (
//   <Document>
//     <Page size="A4" style={styles.body} wrap>
//       <View style={{ display: "flex", flexDirection: "row" }}>
//         <Text style={{ fontSize: 7 }}>
//           17th Flr., Ayala Avenue, Brgy. San Lorenzo, Makati City, Metro Manila
//           1226 Philippines
//         </Text>
//       </View>
//     </Page>
//   </Document>
// );

// const generatePDF = async () => {
//   // Generate the PDF blob
//   const blob = await pdf(<Content />).toBlob();

//   // Create a Blob URL
//   const url = URL.createObjectURL(blob);
//   // Create an anchor element to download the file
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "custom-file-name.pdf"; // Set your custom filename here
//   document.body.appendChild(a);
//   a.click();

//   // Clean up
//   document.body.removeChild(a);
//   URL.revokeObjectURL(url);
// };

// const ViewPrintQuotation = (props) => {
//   return (
//     <div>
//       <button onClick={() => generatePDF(props)}>Open PDF in New Tab</button>
//     </div>
//   );
// };

// export default ViewPrintQuotation;
Font.register({
  family: "PoppinsRegular",
  src: PoppinsRegular,
});
Font.register({
  family: "PoppinsBold",
  src: PoppinsBold,
});
Font.register({
  family: "PoppinsSemiBoldItalic",
  src: PoppinsSemiBoldItalic,
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    paddingBottom: 50,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  body: {
    paddingTop: 135,
    paddingBottom: 135,
    paddingHorizontal: 100,
  },
  margin_bottom_spacing: {
    marginBottom: 10,
  },
  text_font: {
    fontSize: 9,
  },
  poppins_regular: {
    fontFamily: "PoppinsRegular", // Use the registered Poppins font
  },
  poppins_bold: {
    fontFamily: "PoppinsBold", // Use the registered Poppins font
  },
  poppins_bold_italic: {
    fontFamily: "PoppinsSemiBoldItalic", // Use the registered Poppins font
  },
  text_center: {
    textAlign: "center",
  },
  text_underline: {
    textDecoration: "underline",
  },

  table: {
    width: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  column: {
    borderWidth: 1, // Add borderWidth for all sides
    borderColor: "#EEE",
  },
  header: {
    borderTop: "none",
  },
  bold: {
    fontWeight: "bold",
  },
  // So Declarative and unDRY 👌
  col: {
    width: "100%",
    border: 0.5,
    padding: 5,
  },
  indent_left: {
    paddingLeft: 10,
  },
});
const ProductTable = (props) => {
  const { ...param } = props;
  return (
    <View style={[styles.table, styles.margin_bottom_spacing]}>
      <View style={[styles.row, styles.bold, styles.header]}>
        <Text
          style={[
            styles.col,
            styles.text_font,
            styles.text_center,
            styles.poppins_bold_italic,
          ]}
        >
          Product Description
        </Text>
        {param.products[0].projected_quantity_unit !== "" && (
          <Text
            style={[
              styles.col,
              styles.text_font,
              styles.text_center,
              styles.poppins_bold_italic,
            ]}
          >
            Projected Quantity
          </Text>
        )}
        {param.products[0].destination !== "" && (
          <Text
            style={[
              styles.col,
              styles.text_font,
              styles.text_center,
              styles.poppins_bold_italic,
            ]}
          >
            Destination
          </Text>
        )}
        {param.products[0].minimum_order_quantity_unit !== "" && (
          <Text
            style={[
              styles.col,
              styles.text_font,
              styles.text_center,
              styles.poppins_bold_italic,
            ]}
          >
            Minimum Order Quantity
          </Text>
        )}
        {param.products[0].pickup_price_unit !== "" && (
          <Text
            style={[
              styles.col,
              styles.text_font,
              styles.text_center,
              styles.poppins_bold_italic,
            ]}
          >
            Pickup Price
          </Text>
        )}
        {param.products[0].price_unit !== "" && (
          <Text
            style={[
              styles.col,
              styles.text_font,
              styles.text_center,
              styles.poppins_bold_italic,
            ]}
          >
            Price per Unit
          </Text>
        )}
        {param.products[0].tax_code !== "" && (
          <Text
            style={[
              styles.col,
              styles.text_font,
              styles.text_center,
              styles.poppins_bold_italic,
            ]}
          >
            Tax Code
          </Text>
        )}
      </View>

      {param.products.map((value, index) => {
        console.log(value);
        return (
          <View style={styles.row} wrap={false}>
            <Text
              style={[
                styles.col,
                styles.text_font,
                styles.text_center,
                styles.poppins_regular,
              ]}
            >
              {value.product_description}
            </Text>
            {param.products[0].projected_quantity_unit !== "" && (
              <Text
                style={[
                  styles.col,
                  styles.text_font,
                  styles.text_center,
                  styles.poppins_regular,
                ]}
              >
                {value.projected_quantity + " " + value.projected_quantity_unit}
              </Text>
            )}
            {param.products[0].destination !== "" && (
              <Text
                style={[
                  styles.col,
                  styles.text_font,
                  styles.text_center,
                  styles.poppins_regular,
                ]}
              >
                {value.destination}
              </Text>
            )}
            {param.products[0].minimum_order_quantity_unit !== "" && (
              <Text
                style={[
                  styles.col,
                  styles.text_font,
                  styles.text_center,
                  styles.poppins_regular,
                ]}
              >
                {value.minimum_order_quantity +
                  " " +
                  value.minimum_order_quantity_unit}
              </Text>
            )}
            {param.products[0].pickup_price_unit !== "" && (
              <Text
                style={[
                  styles.col,
                  styles.text_font,
                  styles.text_center,
                  styles.poppins_regular,
                ]}
              >
                {value.pickup_price + " " + value.pickup_price_unit}
              </Text>
            )}
            {param.products[0].price_unit !== "" && (
              <Text
                style={[
                  styles.col,
                  styles.text_font,
                  styles.text_center,
                  styles.poppins_regular,
                ]}
              >
                {value.price_per_unit + " " + value.price_unit}
              </Text>
            )}
            {param.products[0].tax_code !== "" && (
              <Text
                style={[
                  styles.col,
                  styles.text_font,
                  styles.text_center,
                  styles.poppins_regular,
                ]}
              >
                {value.tax_code}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const Notes = (props) => {
  const { ...param } = props;
  return (
    <View style={[styles.margin_bottom_spacing]}>
      <View style={{ display: "flex", flexDirection: "column" }}>
        <Text
          style={[
            styles.text_font,
            styles.poppins_regular,
            styles.margin_bottom_spacing,
          ]}
        >
          Note:
        </Text>

        <View style={[styles.indent_left]}>
          {param.notes.map((value, index) => {
            return (
              <Text style={[styles.text_font, styles.poppins_regular]}>
                {index + 1 + ".    " + value.description}
              </Text>
            );
          })}
        </View>
      </View>
    </View>
  );
};
export default function ViewPrintQuotation(props) {
  const { ...param } = props;
  const data = param.selected_data;

  return (
    <PDFViewer style={{ width: "100%", height: 1000 }}>
      <Document>
        <Page size="A4" style={styles.body} wrap>
          <View style={{ display: "flex", flexDirection: "column" }}>
            <Text
              style={[
                styles.text_font,
                styles.poppins_regular,
                styles.margin_bottom_spacing,
              ]}
            >
              {data.request_date}
            </Text>
            <Text style={[styles.text_font, styles.poppins_bold]}>
              {data.customer_description}
            </Text>
            <Text
              style={[
                styles.text_font,
                styles.poppins_regular,
                styles.margin_bottom_spacing,
              ]}
            >
              {data.customer_address}
            </Text>
          </View>
          <View>
            <Text
              style={[
                styles.text_font,
                styles.poppins_bold,
                styles.text_center,
                styles.text_underline,
                styles.margin_bottom_spacing,
              ]}
            >
              {"ATTENTION: " +
                data.representative_salutation +
                " " +
                data.customer_representative}
            </Text>
          </View>
          <View style={{ display: "flex", flexDirection: "column" }}>
            <Text
              style={[
                styles.text_font,
                styles.poppins_regular,
                styles.margin_bottom_spacing,
              ]}
            >
              {"Dear " +
                data.representative_salutation +
                " " +
                data.representative_nickname +
                ","}
            </Text>
            <Text
              style={[
                styles.text_font,
                styles.poppins_regular,
                styles.margin_bottom_spacing,
              ]}
            >
              {data.quotation_opening_letter}
            </Text>
          </View>
          <ProductTable products={data.products} />
          <Notes notes={data.notes} />
          <View style={{ display: "flex", flexDirection: "column" }}>
            <Text
              style={[
                styles.text_font,
                styles.poppins_regular,
                styles.margin_bottom_spacing,
              ]}
            >
              {data.quotation_closing_letter}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                margin: 5,
              }}
            >
              <Text
                style={[
                  styles.text_font,
                  styles.poppins_regular,
                  styles.margin_bottom_spacing,
                ]}
              >
                Sincerely,
              </Text>
              <Text style={[styles.text_font, styles.poppins_bold]}>
                {data.requestor_name}
              </Text>
              <Text style={[styles.text_font, styles.poppins_regular]}>
                {data.requestor_position}
              </Text>
            </View>
            {data.noted_by.length > 0 &&
              data.noted_by.map((value, index) => {
                return (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      margin: 5,
                    }}
                  >
                    <Text
                      style={[
                        styles.text_font,
                        styles.poppins_regular,
                        styles.margin_bottom_spacing,
                      ]}
                    >
                      {index == 0 ? "Noted By" : " "}
                    </Text>
                    <Text style={[styles.text_font, styles.poppins_bold]}>
                      {value.signatory}
                    </Text>
                    <Text style={[styles.text_font, styles.poppins_regular]}>
                      {value.signatory_position}
                    </Text>
                  </View>
                );
              })}

            {data.approved_by.length > 0 &&
              data.approved_by.map((value, index) => {
                return (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      margin: 5,
                    }}
                  >
                    <Text
                      style={[
                        styles.text_font,
                        styles.poppins_regular,
                        styles.margin_bottom_spacing,
                      ]}
                    >
                      {index == 0 ? "Approved By" : " "}
                    </Text>

                    <Text style={[styles.text_font, styles.poppins_bold]}>
                      {value.signatory}
                    </Text>
                    <Text style={[styles.text_font, styles.poppins_regular]}>
                      {value.signatory_position}
                    </Text>
                  </View>
                );
              })}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
