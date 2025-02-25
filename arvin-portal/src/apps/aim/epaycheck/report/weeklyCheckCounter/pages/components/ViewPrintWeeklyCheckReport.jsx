import React, { useState, useEffect } from "react";
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
import { ViewAmountFormatingDecimals } from 'utils/AccountingUtils'
import PoppinsBoldItalic from "../../../../../../../utils/font/Poppins-BoldItalic.ttf";
import PoppinsSemiBoldItalic from "../../../../../../../utils/font/Poppins-SemiBoldItalic.ttf";
import { CircularProgress } from "@mui/material";
import moment from "moment";
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
  page: { 
    padding: 15, 
    fontSize: 10,
    backgroundColor: "#f0f0f0", // Light gray background while loading
  },
  section: { marginBottom: 10 },
  title: { fontSize: 10, fontWeight: "bold", marginBottom: 0, fontFamily: "PoppinsBold" },
  subtitle: { fontSize: 7, fontWeight: "bold", marginBottom: 1,marginTop:8, fontFamily: "PoppinsBold" },
  headerGroup: { marginBottom: 3, textAlign: "center" },
  headerText: { fontSize: 9, margin:1, fontFamily: "PoppinsRegular" },
  table: { display: "flex", flexDirection: "column", border: "0.5px solid black", fontSize: 6 },
  row: { flexDirection: "row", borderBottom: "0.5px solid black",fontWeight: "bold" },
  cell: { padding: 2, borderRight: "0.5px solid black", flex: 1, textAlign: "center", fontSize: 6 },
  smallCell: { flex: 0.4, padding: 2, borderRight: "0.5px solid black", textAlign: "center", fontSize: 6 },
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
    fontFamily: "PoppinsBold",
    color: "black",
  },
  footerDivider: {
    borderBottom: "1px solid black",
    marginVertical: 5,
  },
});

// Table headers
const headers = [
  {id:"created_at",description:"POSTING DATE"},
  {id:"check_date",description:"CHECK DATE"},
  {id:"check_status_date",description:"DATE DEP/TRANS"},
  {id:"check_number",description:"CHECK NUMBER"}, 
  {id:"bank_description",description:"BANK NAME"},
  {id:"check_amount",description:"CHECK AMOUNT"}, 
  {id:"card_name",description:"CUSTOMER"}, 
  {id:"crpr",description:"OR/PR"}, 
];



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
                  <Text key={index} style={index < 4 || index === 7 ? styles.smallCell : styles.cell}>
                    {header.description}
                  </Text>
                ))}
              </View>

              {/* Table Rows */}
              {Array.isArray(rows) &&
                rows.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.row}>
                    {headers.map((header, cellIndex) => (
                      <Text key={cellIndex}  style={cellIndex < 4 || cellIndex === 7 ? styles.smallCell : styles.cell}>
                        {row[header.id] || ""}
                      </Text>
                    ))}
                  </View>
                ))}
              <View style={styles.row}>
                <Text style={[styles.smallCell]}></Text>
                <Text style={[styles.smallCell]}></Text>
                <Text style={[styles.smallCell]}></Text>
                <Text style={[styles.smallCell]}></Text>
                <Text style={[styles.cell]}>TOTAL: </Text>
                <Text style={styles.cell}>
                  {ViewAmountFormatingDecimals(
                    rows.reduce((total, row) => total + (parseFloat(row.check_amount) || 0), 0)
                  ,4)}
                </Text> 
                <Text style={[styles.cell]}></Text>
                <Text style={[styles.smallCell]}></Text>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
};
// Table Component (keep your existing Table component)

const Summary = ({data})=>{
    const beginning_on_hand = data?.beginning_on_hand ? data?.beginning_on_hand : "-"
    const ending_on_hand    = data?.ending_on_hand ? data?.ending_on_hand :"-"
    const deposited         = data?.deposited ? data?.deposited :"-"
    const collected         = data?.collected ? data?.collected :"-"
    const transmitted       = data?.transmitted ? data?.transmitted :"-"
    const rejected          = data?.rejected ? data?.rejected :"-"
    return (  <View style={styles.footer}>
      <View style={styles.footerRow}>
        <Text style={styles.footerLabel}>Beginning ON-HAND:</Text>
        <Text style={styles.footerValue}>{beginning_on_hand}</Text>
      </View>
      <View style={styles.footerDivider} />
      <View style={styles.footerRow}>
        <Text style={styles.footerLabel}>Collected:</Text>
        <Text style={styles.footerValue}>{collected}</Text>
      </View>
      <View style={styles.footerDivider} />
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
        <Text style={styles.footerValue}>{ending_on_hand}</Text>
      </View>
    </View>)
}

const pageWidth = 8.5 * 72; // Convert inches to points
const pageHeight = 13 * 72; // Convert inches to points

const ViewPrintWeeklyCheckReport = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500); // Simulating API delay
  }, [props.data]);

  const footer_summary    = props.data?.footer
  const body_data         = props.data?.body
  const onhand_data       = body_data?.onhand
  const deposited_data    = body_data?.deposited
  const transmitted_data  = body_data?.transmitted
  const rejected_data     = body_data?.rejected

  // FOOTER DATA
 

  //HEADER DATA
  const header_data       = props.data?.header;
  const header_date_from  = header_data?.date_from
  const header_date_to    = header_data?.date_to
  const header_subsection = header_data?.sub_section
  const header_title      = "WEEKLY CHECK COUNTER RECEIPT"

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", width: "100%", height: "900px" }}> {/* PDF size */}
        {loading && (
          <div style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)", // Light overlay
            zIndex: 10,
            border: "1px solid black", // Ensure border is visible
            fontSize:12
          }}>
            <span>Loading PDF...</span>
          </div>
        )}
       <PDFViewer style={{ width: "100%", height: 900, backgroundColor: "#f3f3f3" }}>
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
          <Summary data={footer_summary} />
        </Page>
      </Document>
    </PDFViewer>
    </div>
    </div>
  );
};

export default ViewPrintWeeklyCheckReport;
