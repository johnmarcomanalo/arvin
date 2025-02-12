import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import PoppinsRegular from "../../../../../../../utils/font/Poppins-Regular.ttf";
import PoppinsBold from "../../../../../../../utils/font/Poppins-Bold.ttf";
import PoppinsBoldItalic from "../../../../../../../utils/font/Poppins-BoldItalic.ttf";
import PoppinsSemiBoldItalic from "../../../../../../../utils/font/Poppins-SemiBoldItalic.ttf";
import moment from "moment";
import React,{ useState, useEffect } from "react"; 
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

// Define styles
const styles = StyleSheet.create({
  page: { padding: 15, fontSize: 10 },
  section: { marginBottom: 10 },
  title: { fontSize: 10, fontWeight: "bold", marginBottom: 1, fontFamily: "PoppinsBold" },
  subtitle: { fontSize: 7, fontWeight: "bold", marginBottom: 1,marginTop:8, fontFamily: "PoppinsBold" },
  headerGroup: { marginBottom: 5, textAlign: "center" },
  headerText: { fontSize: 9, margin:1, fontFamily: "PoppinsRegular" },
  table: { display: "flex", flexDirection: "column", border: "0.5px solid black", fontSize: 6 },
  row: { flexDirection: "row", borderBottom: "0.5px solid black",fontWeight: "bold" },
  cell: { padding: 4, borderRight: "0.5px solid black", flex: 1, textAlign: "center", fontSize: 6 },
  footer: {
    marginTop: 20,
    paddingBottom:20,
    padding: 1,
    borderBottom: "1px solid #000",
    // backgroundColor: "#f5f5f5",
    width: "20%",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  footerLabel: {
    fontSize: 8,
    fontFamily: "PoppinsBold",
    color: "black",
  },
  footerValue: {
    fontSize: 8,
    fontFamily: "PoppinsRegular",
    color: "black",
  },
  footerDivider: {
    borderBottom: "1px solid black",
    marginVertical: 5,
  },
});

// Table headers
const headers = [
  {id:"check_date",description:"CHECK DATE"},
  {id:"created_at",description:"DATE DEP/TRANS"},
  {id:"check_number",description:"CHECK NUMBER"}, 
  {id:"bank_description",description:"BANK NAME"},
  {id:"check_amount",description:"CHECK AMOUNT"}, 
  {id:"card_name",description:"CUSTOMER"}, 
  {id:"crpr",description:"OR/PR"}, 
];

const formatMoney = (amount, locale = "en-PH") => {
  return (parseFloat(amount) || 0).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const Table = ({ title, data }) => {
  if (!data || typeof data !== "object") {
    return null; // Prevent rendering if data is undefined or not an object
  }

  return (
    <View style={styles.section}>
      {Object.keys(data).length > 0 && (
        <>
          <Text style={styles.title}>{title}</Text>
          {Object.entries(data).map(([date, rows]) => (
            <View key={date} style={styles.dateSection}>
              <Text style={styles.subtitle}>
                {moment(date).format("MMMM DD, YYYY")} (Count: {rows.length})
              </Text>

              {/* Table Header */}
              <View style={[styles.row, { backgroundColor: "#ddd" }]}>
                {headers.map((header, index) => (
                  <Text key={index} style={styles.cell}>
                    {header.description}
                  </Text>
                ))}
              </View>

              {/* Table Rows */}
              {Array.isArray(rows) &&
                rows.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.row}>
                    {headers.map((header, cellIndex) => (
                      <Text key={cellIndex} style={styles.cell}>
                        {row[header.id] || "N/A"}
                      </Text>
                    ))}
                  </View>
                ))}
              <View style={styles.row}>
                <Text style={[styles.cell]}></Text>
                <Text style={[styles.cell]}></Text>
                <Text style={[styles.cell]}></Text>
                <Text style={[styles.cell]}>TOTAL: </Text>
                <Text style={styles.cell}>
                  {formatMoney(
                    rows.reduce((total, row) => total + (parseFloat(row.check_amount) || 0), 0)
                  )}
                </Text> 
                <Text style={[styles.cell]}></Text>
                <Text style={[styles.cell]}></Text>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
};


const pageWidth = 8.5 * 72; // Convert inches to points
const pageHeight = 13 * 72; // Convert inches to points 
const ViewPrintWeeklyCheckReport = (props) => {
  const footer_summary    = props.data?.summary
  const onhand_data       = props.data?.onhand
  const deposited_data    = props.data?.deposited
  const transmitted_data  = props.data?.transmitted
  const rejected_data     = props.data?.rejected
  const beginning_on_hand = footer_summary?.beginning_on_hand
  const deposited         = footer_summary?.deposited
  const onhand            = footer_summary?.onhand
  const transmitted       = footer_summary?.transmitted
  const rejected          = footer_summary?.rejected

  //header
  const header_data       = props.data?.header;
  const header_date_from  = header_data?.date_from
  const header_date_to    = header_data?.date_to
  const header_subsection = header_data?.sub_section
  const header_title      = "WEEKLY CHECK COUNTER RECEIPT"
   
  const [width, setWidth] = useState(window.innerWidth * 0.9);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth * 0.9);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <PDFViewer style={{ width: "100%", height: 900 }}>
      <Document>
        <Page size={[pageWidth, pageHeight]} style={styles.page} orientation="landscape" wrap>
          {/* Header Group */}
          <View style={styles.headerGroup}>
            <Text style={styles.title}>{header_title}</Text>
            <Text style={styles.headerText}>From {header_date_from} - {header_date_to}</Text>
            <Text style={styles.headerText}>{header_subsection}</Text>
          </View>
  
          {/* Tables */}
          <Table title="DEPOSITED" data={deposited_data}/>
          <Table title="TRANSMITTED" data={transmitted_data}/>
          <Table title="ON-HAND" data={onhand_data} />
          <Table title="REJECTED" data={rejected_data} />
  
          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Beginning ON-HAND:</Text>
              <Text style={styles.footerValue}>{beginning_on_hand}</Text>
            </View>
            <View style={styles.footerDivider} />
            {/* <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Collected:</Text>
              <Text style={styles.footerValue}>0.0</Text>
            </View> */}
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Deposited:</Text>
              <Text style={styles.footerValue}>{deposited}</Text>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Transmitted:</Text>
              <Text style={styles.footerValue}>{transmitted}</Text>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Rejected:</Text>
              <Text style={styles.footerValue}>{rejected}</Text>
            </View>
            <View style={styles.footerDivider} />
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Ending ON-HAND:</Text>
              <Text style={styles.footerValue}>{onhand}</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
};

export default ViewPrintWeeklyCheckReport;