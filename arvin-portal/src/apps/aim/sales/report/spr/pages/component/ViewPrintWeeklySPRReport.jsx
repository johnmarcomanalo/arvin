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
import PoppinsBold from "../../../../../../../utils/font/Poppins-Bold.ttf";
import PoppinsRegular from "../../../../../../../utils/font/Poppins-Regular.ttf";
import PoppinsSemiBoldItalic from "../../../../../../../utils/font/Poppins-SemiBoldItalic.ttf";

// Register fonts
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
    formattedValue = ViewAmountFormatingDecimals(stringValue);
  } catch (e) {
    // Fallback/Demo: Standard number formatting

    // Check if the cleaned value is a valid number, otherwise default to the string value
    const numericValue = parseFloat(stringValue);
    let tempValue = isNaN(numericValue) ? stringValue : numericValue;

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
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 40,
    fontSize: 10,
    marginTop: 50,
    marginBottom: 50,
  },
  section: { marginBottom: 10 },
  title: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 0,
    fontFamily: "PoppinsBold",
  },
  subtitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 1,
    marginTop: 7,
    fontFamily: "PoppinsBold",
  },
  headerGroup: { marginBottom: 2, textAlign: "left" },
  headerText: { fontSize: 10, margin: 1, fontFamily: "PoppinsRegular" },
  table: {
    display: "flex",
    flexDirection: "column",
    fontSize: 9,
  },
  row: {
    flexDirection: "row",
    minHeight: 18, // Ensures a minimum height for all data rows
  },
  row_no_border: {
    flexDirection: "row",
    paddingVertical: 2,
    minHeight: 18,
  },
  cell: {
    padding: 2,
    flex: 1,
    textAlign: "left",
    fontSize: 9,
    fontFamily: "PoppinsBold",
    border: "0.5px solid black",
    hyphens: "none",
  },
  cell_data: {
    padding: 2,
    flex: 1,
    textAlign: "left",
    fontSize: 9,
    fontFamily: "PoppinsRegular",
    border: "0.5px solid black",
    hyphens: "none",
  },
  cell_no_border: {
    padding: 2,
    flex: 1,
    textAlign: "left",
    fontSize: 9,
    fontFamily: "PoppinsBold",
  },

  // FIX 1: Increase flex for Item Description to give long text more space
  itemDescCell: {
    flex: 5,
    fontFamily: "PoppinsRegular",
    padding: 2,
    border: "0.5px solid black",
    fontSize: 9,
    lineHeight: 1.2, // ✅ keeps spacing clean
    hyphens: "none",
  },
  // FIX 2: Ensure Number cells are right-aligned and keep flex 1
  numberCell: {
    flex: 1,
    textAlign: "right", // Changed from default left/center
    fontFamily: "PoppinsRegular",
    padding: 2,
    border: "0.5px solid black",
    fontSize: 9,
    hyphens: "none",
  },
  // Custom style for Ending Balance cell - using text-align: right for consistency
  endingBalanceCell: {
    flex: 1,
    textAlign: "right", // WAS 'center' - Changed to 'right' for number consistency
    fontFamily: "PoppinsRegular",
    padding: 2,
    border: "0.5px solid black",
    fontSize: 9,
    hyphens: "none",
  },
});

// FIX 3: Update TableHeader flex ratios to match data rows (1.2, 5.0, 1.0, 1.0, 1.0, 1.0)
const TableHeader = () => (
  <View style={[styles.row]} fixed>
    <Text style={[styles.cell, { flex: 1.2 }]}>ITEM CODE</Text>
    <Text style={[styles.cell, { flex: 5.0 }]}>ITEM DESCRIPTION</Text>
    <Text style={[styles.cell, { textAlign: "center", flex: 1.0 }]}>
      BEGINNING BALANCE
    </Text>
    <Text style={[styles.cell, { flex: 1.0 }]}>TOTAL IN</Text>
    <Text style={[styles.cell, { flex: 1.0 }]}>TOTAL OUT</Text>
    <Text style={[styles.cell, { textAlign: "center", flex: 1.0 }]}>
      ENDING BALANCE
    </Text>
  </View>
);

// FIX 4: Refactor IndustrialTable layout to correctly use the 4-column space
const IndustrialTable = ({ wh, data }) => {
  return (
    <View style={styles.table}>
      {/* 4-Column Header: 0.6, 2.2, 1, 1 (Total: 4.8) */}
      <View style={[styles.row]}>
        <Text style={[styles.cell, { flex: 0.6 }]}>ITEM CODE</Text>
        <Text style={[styles.cell, { flex: 2.2 }]}>ITEM DESCRIPTION</Text>
        <Text style={[styles.cell]}>IN</Text>
        <Text style={[styles.cell]}>OUT</Text>
      </View>

      {/* Warehouse Row (0.6 + 2.2 + 1.0 + 1.0 = 4.8) */}
      <View style={styles.row_no_border}>
        <Text
          style={[
            styles.cell_no_border,
            { flex: 4.8, fontFamily: "PoppinsRegular" },
          ]}
        >
          {wh}
        </Text>
      </View>

      {/* Beginning Balance Row (Product Group is in Col 1 & 2 space, BB Label in Col 3, BB Value in Col 4) */}
      <View wrap={false} minPresenceAhead={10}>
        <View style={styles.row_no_border}>
          {/* Col 1 & 2 space for Product Group (0.6 + 2.2 = 2.8) */}
          <Text style={[styles.cell_no_border, { flex: 2.8, textIndent: 5 }]}>
            {data.product_group}
          </Text>
          {/* Col 3: BEGINNING BALANCE Label (1.0) */}
          <Text
            style={[styles.cell_no_border, { flex: 1, textAlign: "right" }]}
          >
            BEGINNING BALANCE
          </Text>
          {/* Col 4: BB Value (1.0) */}
          <Text
            style={[
              styles.cell_no_border,
              {
                flex: 1,
                textAlign: "right",
                backgroundColor: "yellow",
                fontFamily: "PoppinsRegular",
              },
            ]}
          >
            {data.beginning_balance}
          </Text>
        </View>
      </View>

      {/* Example Transaction Rows - Use 0.6, 2.2, 1.0, 1.0 */}
      {data.items?.map((value, index) => {
        return (
          <View style={styles.row} key={index}>
            <Text
              style={[
                styles.cell_data,
                { flex: 0.6, fontFamily: "PoppinsRegular" },
              ]}
            >
              {value.ItemCode}
            </Text>
            <Text
              style={[
                styles.cell_data,
                { flex: 2.2, fontFamily: "PoppinsRegular" },
              ]}
            >
              {value.ItemName}
            </Text>
            <Text style={[styles.cell_data, { textAlign: "right", flex: 1 }]}>
              {formatAmountAndBreak(value.InQty)}
            </Text>
            <Text style={[styles.cell_data, { textAlign: "right", flex: 1 }]}>
              {formatAmountAndBreak(value.OutQty)}
            </Text>
          </View>
        );
      })}

      {/* Summary Block: Total In and Out Row */}
      <View wrap={false} minPresenceAhead={50}>
        <View
          style={[styles.row_no_border, { borderTop: "0.5px solid black" }]}
        >
          {/* Col 1 (0.6) is empty */}
          <Text style={[styles.cell_no_border, { flex: 0.6 }]}></Text>
          {/* Col 2 (2.2) is the label */}
          <Text
            style={[styles.cell_no_border, { flex: 2.2, textAlign: "right" }]}
          >
            TOTAL IN AND OUT
          </Text>
          {/* Col 3 (1.0) for Total In */}
          <Text
            style={[styles.cell_no_border, { textAlign: "right", flex: 1 }]}
          >
            {data.total_in}
          </Text>
          {/* Col 4 (1.0) for Total Out */}
          <Text
            style={[styles.cell_no_border, { textAlign: "right", flex: 1 }]}
          >
            {data.total_out}
          </Text>
        </View>

        {/* Ending Balance Row */}
        <View style={styles.row_no_border}>
          {/* Col 1 & 2 combined space is empty (2.8) */}
          <Text style={[styles.cell_no_border, { flex: 2.8 }]}></Text>
          {/* Col 3: ENDING BALANCE Label (1.0) */}
          <Text
            style={[styles.cell_no_border, { textAlign: "right", flex: 1 }]}
          >
            ENDING BALANCE
          </Text>
          {/* Col 4: EB Value (1.0) */}
          <Text
            style={[
              styles.cell_no_border,
              {
                flex: 1,
                textAlign: "right",
                backgroundColor: "yellow",
                fontFamily: "PoppinsRegular",
              },
            ]}
          >
            {data.ending_balance}
          </Text>
        </View>
      </View>
    </View>
  );
};

// FIX 5: Refactor RiceOthersGroup to use correct flex ratios and simplify group rows
// Renamed to RiceOthersTable to replace the faulty one in the main component.
const RiceOthersTable = ({ warehouseName, categories }) => {
  // The total flex of the TableHeader is 1.2 + 5.0 + 1 + 1 + 1 + 1 = 10.2
  return (
    // minPresenceAhead ensures the header/first row doesn't break alone
    <View wrap={false} minPresenceAhead={100} style={{ marginBottom: 50 }}>
      {/* 🔹 Warehouse Row (Spans all columns) */}
      <View style={styles.row}>
        {/* Combine Item Code (1.2) and Item Description (5.0) for the category label (6.2) 
        plus the 4 number columns (4.0) = 10.2 */}
        <Text style={[styles.cell, { flex: 10.2 }]}>{warehouseName}</Text>
      </View>

      {/* 🔹 Loop categories */}
      {Object.entries(categories).map(([categoryName, items], catIndex) => (
        <View key={catIndex} style={{ marginBottom: 6 }}>
          {/* 🔹 Category Row - This should be a full-width row for the category name */}
          <View style={[styles.row_no_border]}>
            {/* Combine Item Code (1.2) and Item Description (5.0) for the category label (6.2) */}
            <Text
              style={[
                styles.cell_no_border,
                { flex: 6.2, textIndent: 5, fontFamily: "PoppinsBold" },
              ]}
            >
              {categoryName}
            </Text>
            {/* The remaining four columns (4.0) are empty for the category row */}
            <Text style={[styles.cell_no_border, { flex: 4.0 }]} />
          </View>

          {/* 🔹 Items - Must use the 6-column structure (1.2, 5.0, 1.0, 1.0, 1.0, 1.0) */}
          <View>
            {Array.isArray(items) &&
              items.map((item) => (
                <View key={item.ItemCode} style={styles.row}>
                  {/* Item Code (1.2) */}
                  <Text style={[styles.cell_data, { flex: 1.2 }]}>
                    {item.ItemCode}
                  </Text>
                  {/* Item Description (5.0) - Use the multi-line friendly style */}
                  <Text style={styles.itemDescCell}>{item.ItemName}</Text>

                  {/* Beginning Balance (1.0) - Use styles.numberCell */}
                  <Text style={styles.numberCell}>
                    {formatAmountAndBreak(item.BegInvBalance)}
                  </Text>
                  {/* Total In (1.0) - Use styles.numberCell */}
                  <Text style={styles.numberCell}>
                    {formatAmountAndBreak(item.InQty)}
                  </Text>
                  {/* Total Out (1.0) - Use styles.numberCell */}
                  <Text style={styles.numberCell}>
                    {formatAmountAndBreak(item.OutQty)}
                  </Text>
                  {/* Ending Balance (1.0) - Use styles.endingBalanceCell */}
                  <Text style={styles.endingBalanceCell}>
                    {formatAmountAndBreak(item.EndBalance)}
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

  const industrial_data = data?.industrial || {
    product_group: "INDUSTRIAL PRODUCTS",
    beginning_balance: formatAmountAndBreak("123456.78"),
    total_in: formatAmountAndBreak("1000.00"),
    total_out: formatAmountAndBreak("500.00"),
    ending_balance: formatAmountAndBreak("123956.78"),
    items: [],
  }; // Dummy data for compilation

  // Using the remembered data as rice_and_others
  const rice_others_data = data?.rice_and_others || {
    RICE: [
      {
        ItemCode: "FG-20-0346",
        ItemName: "THAI LONG GRAIN WHITE RICE 25 KG - 5% BROKEN",
        BegInvBalance: "2056.0000",
        InQty: 0,
        OutQty: 0,
        EndBalance: 2056,
      },
      {
        ItemCode: "FG-20-0266",
        ItemName: "RICE 50 KLS - SWEEPING",
        BegInvBalance: ".0000",
        InQty: 0,
        OutQty: 0,
        EndBalance: 0,
      },
      {
        ItemCode: "FG-20-0283",
        ItemName: "MYANMAR WHITE RICE 25 KLS - 25% BROKEN -O",
        BegInvBalance: ".0000",
        InQty: 0,
        OutQty: 0,
        EndBalance: 0,
      },
      {
        ItemCode: "FG-20-0135",
        ItemName: "VIETNAMESE GLUTINOUS RICE 50 KLS",
        BegInvBalance: ".0000",
        InQty: 0,
        OutQty: 0,
        EndBalance: 0,
      },
      {
        ItemCode: "FG-20-0236",
        ItemName: "MYANMAR WHITE RICE 25 KLS - 25% BROKEN",
        BegInvBalance: ".0000",
        InQty: 0,
        OutQty: 0,
        EndBalance: 0,
      },
      {
        ItemCode: "FG-20-0332",
        ItemName:
          "VIETNAMESE RICE 25 KLS IN RED COLOR BAGS (DT8) - 5% BROKEN -O",
        BegInvBalance: ".0000",
        InQty: 0,
        OutQty: 0,
        EndBalance: 0,
      },
      {
        ItemCode: "FG-20-0483",
        ItemName: "MYANMAR WHITE RICE 50 KLS - 25% BROKEN -O",
        BegInvBalance: ".0000",
        InQty: 0,
        OutQty: 0,
        EndBalance: 0,
      },
      {
        ItemCode: "FG-20-0460",
        ItemName:
          "VIETNAMESE RICE 25 KLS IN PINK COLOR BAGS (DT8) - 100% HASMIN BROKEN",
        BegInvBalance: ".0000",
        InQty: 0,
        OutQty: 0,
        EndBalance: 0,
      },
      {
        ItemCode: "FG-20-0356",
        ItemName: "MYANMAR WHITE RICE 50 KLS - 25% BROKEN",
        BegInvBalance: ".0000",
        InQty: 0,
        OutQty: 0,
        EndBalance: 0,
      },
      {
        ItemCode: "FG-20-0328",
        ItemName: "VIETNAMESE RICE 25 KLS IN RED COLOR BAGS (DT8) - 5% BROKEN",
        BegInvBalance: "3716.0000",
        InQty: 0,
        OutQty: 1000,
        EndBalance: 2716,
      },
    ],
    LOCAL: [
      {
        ItemCode: "10-100-600-06",
        ItemName: "LOC (R) 40",
        BegInvBalance: "3076.0000",
        InQty: 0,
        OutQty: 0,
        EndBalance: 3076,
      },
      {
        ItemCode: "10-100-600-02",
        ItemName: "LOC (G) 40",
        BegInvBalance: "136.0000",
        InQty: 0,
        OutQty: 0,
        EndBalance: 136,
      },
    ],
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", width: "100%", height: "900px" }}>
        <PDFViewer style={{ width: "100%", height: 900 }}>
          <Document>
            <Page
              size="LEGAL"
              orientation="portrait"
              style={[styles.page]}
              wrap
            >
              {/* Header Group */}
              <View style={styles.headerGroup} wrap={false}>
                <Text style={styles.title}>{header_title} </Text>
                <Text style={styles.headerText}>
                  From {start} - TO {end}
                </Text>

                <Text style={styles.headerText}>{wh}</Text>
              </View>

              {/* Industrial Table (4-Column) */}
              <IndustrialTable wh={wh} data={industrial_data} />

              {/* Rice & Others Table (6-Column) - Using the fixed component */}
              <RiceOthersTable
                warehouseName={wh}
                categories={rice_others_data}
              />

              {/* Force bottom spacing */}
              <View style={{ height: 40 }} />
            </Page>
          </Document>
        </PDFViewer>
      </div>
    </div>
  );
};

export default ViewPrintWeeklySPRReport;
