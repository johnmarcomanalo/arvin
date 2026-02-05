import {
  Document,
  Font,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import moment from "moment";
// Assuming these utilities and fonts are correctly configured at their paths
import { ViewAmountFormatingDecimals } from "utils/AccountingUtils";
import CenturyGothicBold from "../../../../../../../utils/font/century_gothic/centurygothic_bold.ttf";
import CenturyGothic from "../../../../../../../utils/font/century_gothic/centurygothic.ttf";
import PoppinsSemiBoldItalic from "../../../../../../../utils/font/Poppins-SemiBoldItalic.ttf";

// Register fonts
Font.register({
  family: "CenturyGothic",
  src: CenturyGothic,
});
Font.register({
  family: "CenturyGothicBold",
  src: CenturyGothicBold,
});
Font.register({
  family: "PoppinsSemiBoldItalic",
  src: PoppinsSemiBoldItalic,
});

// Utility to make long numbers breakable using Zero-Width Space (\u200b)
const makeBreakable = (numberString) => {
  // Add a check to ensure it is a string before calling replace
  if (typeof numberString !== "string") {
    return String(numberString); // Fallback to string conversion
  }
  return numberString.replace(/,/g, ",\u200b");
};

// Helper function to format amount and make it breakable
const formatAmountAndBreak = (value) => {
  let formattedValue;
  // Ensure the value is stringified for safety, especially if it's 0 or null
  const stringValue = String(value || 0).replace(/^.\s*$/, "0"); // Handle single dot from data as 0

  try {
    // Assuming ViewAmountFormatingDecimals is available and returns a string
    formattedValue = ViewAmountFormatingDecimals(value);
  } catch (e) {
    // Fallback/Demo: Standard number formatting

    // Check if the cleaned value is a valid number, otherwise default to the string value
    const numericValue = parseFloat(value);
    let tempValue = isNaN(numericValue) ? value : numericValue;

    formattedValue = (
      typeof tempValue === "number" ? tempValue.toFixed(4) : tempValue
    ) // Use fixed(4) to match the data precision
      .toString() // Explicitly convert to string
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // FIX: Ensure whatever is passed to makeBreakable is definitely a string
  return makeBreakable(String(formattedValue));
};

// Define styles
const styles = StyleSheet.create({
  page: {
    // padding:40,
    paddingTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
    // paddingBottom: 20,
    fontSize: 10,
    // marginTop: 50,
    // margin: 50,
  },
  section: { marginTop: 50 },
  title: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 0,
    fontFamily: "CenturyGothicBold",
  },
  subtitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 1,
    marginTop: 7,
    fontFamily: "CenturyGothicBold",
  },
  headerGroup: { marginBottom: 2, textAlign: "left" },
  headerText: { fontSize: 10, margin: 1, fontFamily: "CenturyGothic" },
  table: {
    display: "flex",
    flexDirection: "column",
    fontSize: 9,
  },
  row: {
    flexDirection: "row",
    // minHeight: 18, // Ensures a minimum height for all data rows
  },
  row_no_border: {
    flexDirection: "row",
    // paddingVertical: 2,
    // minHeight: 18,
  },
  cell: {
    padding: 2,
    flex: 1,
    textAlign: "left",
    fontSize: 9,
    fontFamily: "CenturyGothicBold",
    border: "0.5px solid black",
    // hyphens: "none",
  },
  cell_data: {
    padding: 2,
    flex: 1,
    textAlign: "left",
    fontSize: 9,
    fontFamily: "CenturyGothic",
    border: "0.5px solid black",
    // hyphens: "none",
  },
  cell_no_border: {
    padding: 2,
    flex: 1,
    textAlign: "left",
    fontSize: 9,
    fontFamily: "CenturyGothicBold",
  },
  cell_bottomborder: {
    padding: 2,
    flex: 1,
    textAlign: "left",
    fontSize: 9,
    fontFamily: "CenturyGothicBold",
    borderBottom: "0.5px solid black",
    // hyphens: "none",
  },
  cell_double_bottomborder: {
    padding: 2,
    flex: 1,
    textAlign: "left",
    fontSize: 9,
    fontFamily: "CenturyGothicBold",
    borderBottom: "0.5px double black",
    // hyphens: "none",
  },
  // FIX 1: Increase flex for Item Description to give long text more space
  itemDescCell: {
    flex: 5,
    fontFamily: "CenturyGothic",
    padding: 2,
    border: "0.5px solid black",
    fontSize: 9,
    lineHeight: 1.2, // ✅ keeps spacing clean
    // hyphens: "none",
  },
  // FIX 2: Ensure Number cells are right-aligned and keep flex 1
  numberCell: {
    flex: 1,
    textAlign: "right", // Changed from default left/center
    fontFamily: "CenturyGothic",
    padding: 2,
    border: "0.5px solid black",
    fontSize: 9,
    // hyphens: "none",
  },
  // Custom style for Ending Balance cell - using text-align: right for consistency
  endingBalanceCell: {
    flex: 1,
    textAlign: "right", // WAS 'center' - Changed to 'right' for number consistency
    fontFamily: "CenturyGothic",
    padding: 2,
    border: "0.5px solid black",
    fontSize: 9,
    // hyphens: "none",
  },
});

// FIX 3: Update TableHeader flex ratios to match data rows (1.2, 5.0, 1.0, 1.0, 1.0, 1.0)
const TableHeader = () => (
  <View style={[styles.row]}>
    <Text style={[styles.cell_bottomborder, { flex: 1.2 }]}>ITEM CODE</Text>
    <Text style={[styles.cell_bottomborder, { flex: 5.0 }]}>
      ITEM DESCRIPTION
    </Text>
    <Text
      style={[styles.cell_bottomborder, { textAlign: "center", flex: 1.0 }]}
    >
      BEGINNING BALANCE
    </Text>
    <Text style={[styles.cell_bottomborder, { flex: 1.0 }]}>TOTAL IN</Text>
    <Text style={[styles.cell_bottomborder, { flex: 1.0 }]}>TOTAL OUT</Text>
    <Text
      style={[styles.cell_bottomborder, { textAlign: "center", flex: 1.0 }]}
    >
      ENDING BALANCE
    </Text>
  </View>
);

// FIX 4: Refactor IndustrialTable layout to correctly use the 4-column space
const IndustrialTable = ({ wh, data = [] }) => {
  const filteredData = data.filter(
    (value) => parseFloat(value.BeginningBalance) > 0,
  );

  if (filteredData.length === 0) {
    return null; // Don't render anything if no data has a beginning balance
  }
  return (
    <View style={styles.table}>
      {Array.isArray(data) && data.length > 0 && (
        <View style={[styles.row]}>
          <Text style={[styles.cell_bottomborder, { flex: 0.6 }]}>
            ITEM CODE
          </Text>
          <Text style={[styles.cell_bottomborder, { flex: 2.2 }]}>
            ITEM DESCRIPTION
          </Text>
          <Text style={[styles.cell_bottomborder]}>IN</Text>
          <Text style={[styles.cell_bottomborder]}>OUT</Text>
        </View>
      )}

      {filteredData?.map((value, index) => {
        return (
          <View>
            <View style={styles.row_no_border}>
              <Text
                style={[
                  styles.cell_no_border,
                  { flex: 4.8, fontFamily: "CenturyGothic" },
                ]}
              >
                {value.Warehouse}
              </Text>
            </View>
            <View wrap={true} minPresenceAhead={10}>
              <View style={styles.row_no_border}>
                <Text
                  style={[styles.cell_no_border, { flex: 2.8, textIndent: 5 }]}
                >
                  {value.Product}
                </Text>
                <Text
                  style={[
                    styles.cell_no_border,
                    { flex: 1, textAlign: "right" },
                  ]}
                >
                  BEGINNING BALANCE
                </Text>
                <Text
                  style={[
                    styles.cell_bottomborder,
                    {
                      flex: 1,
                      textAlign: "right",
                      backgroundColor: "yellow",
                      fontFamily: "CenturyGothic",
                    },
                  ]}
                >
                  {value.BeginningBalance}
                </Text>
              </View>
            </View>
            {value.Items?.map((value, index) => {
              return (
                <View style={[styles.row, { marginTop: 2 }]} key={index}>
                  <Text
                    style={[
                      styles.cell_data,
                      { flex: 0.6, fontFamily: "CenturyGothic" },
                    ]}
                  >
                    {value.ItemCode}
                  </Text>
                  <Text
                    style={[
                      styles.cell_data,
                      { flex: 2.2, fontFamily: "CenturyGothic" },
                    ]}
                  >
                    {value.ItemName}
                  </Text>
                  <Text
                    style={[styles.cell_data, { textAlign: "right", flex: 1 }]}
                  >
                    {value.InQty}
                  </Text>
                  <Text
                    style={[styles.cell_data, { textAlign: "right", flex: 1 }]}
                  >
                    {value.OutQty}
                  </Text>
                </View>
              );
            })}
            // {/* Summary Block: Total In and Out Row */}
            <View wrap={true} minPresenceAhead={50}>
              <View
                style={[
                  styles.row_no_border,
                  { borderTop: "0.5px solid black" },
                ]}
              >
                {/* Col 1 (0.6) is empty */}
                <Text style={[styles.cell_no_border, { flex: 0.6 }]}></Text>
                {/* Col 2 (2.2) is the label */}
                <Text
                  style={[
                    styles.cell_no_border,
                    { flex: 2.2, textAlign: "right" },
                  ]}
                >
                  TOTAL IN AND OUT
                </Text>
                {/* Col 3 (1.0) for Total In */}
                <Text
                  style={[
                    styles.cell_double_bottomborder,
                    { textAlign: "right", flex: 1, margin: 1 },
                  ]}
                >
                  {value.TotalIn}
                </Text>
                {/* Col 4 (1.0) for Total Out */}
                <Text
                  style={[
                    styles.cell_double_bottomborder,
                    { textAlign: "right", flex: 1, margin: 1 },
                  ]}
                >
                  {value.TotalOut}
                </Text>
              </View>

              {/* Ending Balance Row */}
              <View style={styles.row_no_border}>
                {/* Col 1 & 2 combined space is empty (2.8) */}
                <Text style={[styles.cell_no_border, { flex: 2.8 }]}></Text>
                {/* Col 3: ENDING BALANCE Label (1.0) */}
                <Text
                  style={[
                    styles.cell_no_border,
                    { textAlign: "right", flex: 1 },
                  ]}
                >
                  ENDING BALANCE
                </Text>
                {/* Col 4: EB Value (1.0) */}
                <Text
                  style={[
                    styles.cell_bottomborder,
                    {
                      flex: 1,
                      textAlign: "right",
                      backgroundColor: "yellow",
                      fontFamily: "CenturyGothic",
                    },
                  ]}
                >
                  {value.EndingBalance}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
  // <View style={styles.table}>
  //   {/* 4-Column Header: 0.6, 2.2, 1, 1 (Total: 4.8) */}
  //   <View style={[styles.row]}>
  //     <Text style={[styles.cell, { flex: 0.6 }]}>ITEM CODE</Text>
  //     <Text style={[styles.cell, { flex: 2.2 }]}>ITEM DESCRIPTION</Text>
  //     <Text style={[styles.cell]}>IN</Text>
  //     <Text style={[styles.cell]}>OUT</Text>
  //   </View>

  //   {/* Warehouse Row (0.6 + 2.2 + 1.0 + 1.0 = 4.8) */}
  //   <View style={styles.row_no_border}>
  //     <Text
  //       style={[
  //         styles.cell_no_border,
  //         { flex: 4.8, fontFamily: "CenturyGothic" },
  //       ]}
  //     >
  //       {wh}
  //     </Text>
  //   </View>

  //   {/* Beginning Balance Row (Product Group is in Col 1 & 2 space, BB Label in Col 3, BB Value in Col 4) */}
  //   <View wrap={false} minPresenceAhead={10}>
  //     <View style={styles.row_no_border}>
  //       {/* Col 1 & 2 space for Product Group (0.6 + 2.2 = 2.8) */}
  //       <Text style={[styles.cell_no_border, { flex: 2.8, textIndent: 5 }]}>
  //         {data.product_group}
  //       </Text>
  //       {/* Col 3: BEGINNING BALANCE Label (1.0) */}
  //       <Text
  //         style={[styles.cell_no_border, { flex: 1, textAlign: "right" }]}
  //       >
  //         BEGINNING BALANCE
  //       </Text>
  //       {/* Col 4: BB Value (1.0) */}
  //       <Text
  //         style={[
  //           styles.cell_no_border,
  //           {
  //             flex: 1,
  //             textAlign: "right",
  //             backgroundColor: "yellow",
  //             fontFamily: "CenturyGothic",
  //           },
  //         ]}
  //       >
  //         {data.beginning_balance}
  //       </Text>
  //     </View>
  //   </View>

  //   {/* Example Transaction Rows - Use 0.6, 2.2, 1.0, 1.0 */}
  //   {data.items?.map((value, index) => {
  //     return (
  //       <View style={styles.row} key={index}>
  //         <Text
  //           style={[
  //             styles.cell_data,
  //             { flex: 0.6, fontFamily: "CenturyGothic" },
  //           ]}
  //         >
  //           {value.ItemCode}
  //         </Text>
  //         <Text
  //           style={[
  //             styles.cell_data,
  //             { flex: 2.2, fontFamily: "CenturyGothic" },
  //           ]}
  //         >
  //           {value.ItemName}
  //         </Text>
  //         <Text style={[styles.cell_data, { textAlign: "right", flex: 1 }]}>
  //           {formatAmountAndBreak(value.InQty)}
  //         </Text>
  //         <Text style={[styles.cell_data, { textAlign: "right", flex: 1 }]}>
  //           {formatAmountAndBreak(value.OutQty)}
  //         </Text>
  //       </View>
  //     );
  //   })}

  //   {/* Summary Block: Total In and Out Row */}
  //   <View wrap={false} minPresenceAhead={50}>
  //     <View
  //       style={[styles.row_no_border, { borderTop: "0.5px solid black" }]}
  //     >
  //       {/* Col 1 (0.6) is empty */}
  //       <Text style={[styles.cell_no_border, { flex: 0.6 }]}></Text>
  //       {/* Col 2 (2.2) is the label */}
  //       <Text
  //         style={[styles.cell_no_border, { flex: 2.2, textAlign: "right" }]}
  //       >
  //         TOTAL IN AND OUT
  //       </Text>
  //       {/* Col 3 (1.0) for Total In */}
  //       <Text
  //         style={[styles.cell_no_border, { textAlign: "right", flex: 1 }]}
  //       >
  //         {data.total_in}
  //       </Text>
  //       {/* Col 4 (1.0) for Total Out */}
  //       <Text
  //         style={[styles.cell_no_border, { textAlign: "right", flex: 1 }]}
  //       >
  //         {data.total_out}
  //       </Text>
  //     </View>

  //     {/* Ending Balance Row */}
  //     <View style={styles.row_no_border}>
  //       {/* Col 1 & 2 combined space is empty (2.8) */}
  //       <Text style={[styles.cell_no_border, { flex: 2.8 }]}></Text>
  //       {/* Col 3: ENDING BALANCE Label (1.0) */}
  //       <Text
  //         style={[styles.cell_no_border, { textAlign: "right", flex: 1 }]}
  //       >
  //         ENDING BALANCE
  //       </Text>
  //       {/* Col 4: EB Value (1.0) */}
  //       <Text
  //         style={[
  //           styles.cell_no_border,
  //           {
  //             flex: 1,
  //             textAlign: "right",
  //             backgroundColor: "yellow",
  //             fontFamily: "CenturyGothic",
  //           },
  //         ]}
  //       >
  //         {data.ending_balance}
  //       </Text>
  //     </View>
  //   </View>
  // </View>
};

// FIX 5: Refactor RiceOthersGroup to use correct flex ratios and simplify group rows
// Renamed to RiceOthersTable to replace the faulty one in the main component.
const RiceOthersTable = ({ warehouseName, categories }) => {
  // The total flex of the TableHeader is 1.2 + 5.0 + 1 + 1 + 1 + 1 = 10.2
  return (
    // minPresenceAhead ensures the header/first row doesn't break alone

    <View wrap={true}>
      {/* 🔹 Warehouse Row (Spans all columns) */}
      <View style={{ marginTop: 10 }}>
        {/* Combine Item Code (1.2) and Item Description (5.0) for the category label (6.2) 
        plus the 4 number columns (4.0) = 10.2 */}
        <TableHeader />
        <View style={[styles.row, { marginTop: 10 }]}>
          <Text
            style={[
              {
                flex: 10.2,
                fontFamily: "CenturyGothicBold",
                fontWeight: "bold",
              },
            ]}
          >
            {warehouseName}
          </Text>
        </View>
      </View>

      {/* 🔹 Loop categories */}
      {Object.entries(categories)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([categoryName, items], catIndex) => (
          // <View key={catIndex} style={{ marginBottom: 6 }}>
          <View key={catIndex} wrap={false}>
            {/* 🔹 Category Row - This should be a full-width row for the category name */}
            {Array.isArray(items) && (
              <View style={[styles.row_no_border]}>
                {/* Combine Item Code (1.2) and Item Description (5.0) for the category label (6.2) */}
                <Text
                  style={[
                    styles.cell_no_border,
                    {
                      flex: 6.2,
                      textIndent: 2,
                      fontFamily: "CenturyGothicBold",
                    },
                  ]}
                >
                  {categoryName}
                </Text>
                {/* The remaining four columns (4.0) are empty for the category row */}
                <Text style={[styles.cell_no_border, { flex: 4.0 }]} />
              </View>
            )}

            {/* 🔹 Items - Must use the 6-column structure (1.2, 5.0, 1.0, 1.0, 1.0, 1.0) */}
            <View wrap={false}>
              {Array.isArray(items) &&
                items
                  .sort((a, b) => a.ItemName.localeCompare(b.ItemName))
                  .map((item) => (
                    <View key={item.ItemCode} style={styles.row}>
                      {/* Item Code (1.2) */}
                      <Text style={[styles.cell_data, { flex: 1.2 }]}>
                        {item.ItemCode}
                      </Text>
                      {/* Item Description (5.0) - Use the multi-line friendly style */}
                      <Text style={styles.itemDescCell}>{item.ItemName}</Text>

                      <Text style={styles.numberCell}>
                        {/* {formatAmountAndBreak(item.BegInvBalance)} */}
                        {item.BegInvBalance}
                      </Text>
                      <Text style={styles.numberCell}>
                        {/* {formatAmountAndBreak(item.InQty)} */}
                        {item.InQty}
                      </Text>
                      <Text style={styles.numberCell}>
                        {/* {formatAmountAndBreak(item.OutQty)} */}
                        {item.OutQty}
                      </Text>
                      <Text style={styles.endingBalanceCell}>
                        {/* {formatAmountAndBreak(item.EndBalance)} */}
                        {item.EndBalance}
                      </Text>
                    </View>
                  ))}
            </View>
          </View>
        ))}
    </View>
  );
};

const ViewPrintWeeklySPRReport = ({
  warehouse,
  date_start,
  date_end,
  data,
}) => {
  const header_title = "STOCK POSITION REPORT - SUMMARY";
  // Use dummy values if not provided for testing
  const wh = warehouse || "DEFAULT WAREHOUSE";
  const start = date_start || moment().subtract(7, "days").format("MM/DD/YYYY"); // Dummy date start
  const end = date_end || moment().format("MM/DD/YYYY"); // Dummy date end
  console.log(data);
  const industrial_data = data?.industrial || []; // Dummy data for compilation

  // Using the remembered data as rice_and_others
  const rice_others_data = data?.rice_and_others || {};
  return (
    <PDFViewer style={{ width: "100%", height: 900 }}>
      <Document>
        <Page
          size="LEGAL"
          orientation="portrait"
          style={[styles.page]}
          // wrap
        >
          {/* Header Group */}
          <View style={styles.headerGroup} wrap={true}>
            <Text style={styles.title}>{header_title} </Text>
            <Text style={styles.headerText}>
              From {start} - TO {end}
            </Text>

            <Text style={styles.headerText}>{wh}</Text>
          </View>
          <View style={{ padding: 10 }}>
            {/* Industrial Table (4-Column) */}
            <IndustrialTable wh={wh} data={industrial_data} />

            {/* Rice & Others Table (6-Column) - Using the fixed component */}
            {Object.entries(rice_others_data)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([categoryName, items], catIndex) => (
                <>
                  <RiceOthersTable
                    warehouseName={categoryName}
                    categories={items}
                  />
                </>
              ))}
          </View>

          {/* Force bottom spacing */}
          {/* <View style={{ height: 40 }} /> */}
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default ViewPrintWeeklySPRReport;
