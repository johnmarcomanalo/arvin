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
import { useEffect, useState } from "react";
import { ViewAmountFormatingDecimals } from 'utils/AccountingUtils';
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

// Define styles
const styles = StyleSheet.create({
  page: { 
    padding: 15, 
    fontSize: 10, 
  },
  section: { marginBottom: 8 },
  title: { fontSize: 11, fontWeight: "bold", marginBottom: 0, fontFamily: "PoppinsBold" },
  subtitle: { fontSize: 9, fontWeight: "bold", marginBottom: 1,marginTop:7, fontFamily: "PoppinsBold" },
  headerGroup: { marginBottom: 2, textAlign: "left" },
  headerText: { fontSize: 10, margin:0, fontFamily: "PoppinsRegular" },
  table: { display: "flex", flexDirection: "column", 
    // border: "0.5px solid black", 
    fontSize: 9 },
  row: { flexDirection: "row", 
    // borderBottom: "0.5px solid black",
    fontWeight: "bold" },
    BigCell: { 
      adding: 1.8, 
      // borderRight: "0.5px solid black", 
      flex: 1.5, 
      textAlign: "left", 
      fontSize: 8 
    },
    cell: { 
    adding: 1.8, 
    // borderRight: "0.5px solid black", 
    flex: 0.7, 
    textAlign: "left", 
    fontSize: 8 
  },
  smallCell: { 
    flex: 0.2, padding: 1.5, 
    // borderRight: "0.5px solid black", 
    textAlign: "left", fontSize: 8 },
  footer: {
    marginTop: 15,
    paddingBottom:15,
    padding: 1.8,
    borderBottom: "1px solid #000",
    // backgroundColor: "#f5f5f5",
    width: "20%",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  footerLabel: {
    fontSize: 9,
    fontFamily: "PoppinsBold",
    color: "black",
  },
  footerValue: {
    fontSize: 9,
    fontFamily: "PoppinsBold",
    color: "black",
  },
  footerDivider: {
    borderBottom: "1px solid black",
    marginVertical: 4,
  },

  footerHighlight: {
    borderBottom: "1px solid black",
    borderTop: "1px solid black",
    marginVertical: 5,
    padding:2
  },
  footerHighlightTop: { 
    borderTop: "1px solid black",
    marginVertical: 5,
    padding:2
  }, 
  trwBG:{
    backgroundColor: "#f4f2f2",
  },
});

// Table headers
const headers = [
  {id:"created_at",description:"POSTING DATE"},
  {id:"check_date",description:"CHECK DATE"},
  {id:"check_number",description:"CHECK NO."}, 
  {id:"card_name",description:"CUSTOMER"}, 
  {id:"bank_description",description:"BANK NAME"},
  {id:"prefix_crpr",description:"OR/PR"}, 
  {id:"check_amount",description:"CHECK AMOUNT"}
];

 

// const pageWidth = 13 * 72;   // 936 pt
// const pageHeight = 8.5 * 72; // 612 pt

const ViewPrintCollectorReport = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500); // Simulating API delay
  }, [props.data]);

  const header          = props.data?.header
  const body            = props.data?.body 
  const footer          = props.data?.footer
 
  //HEADER DATA
  const header_date_from        = header?.date_from
  const header_date_to          = header?.date_to
  const header_date_generated   = header?.date_generated
  const header_title            = header?.title
  const header_sap              = header?.sap

  //FOOTER DATA
  const footer_total_check     = footer?.total_check

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", width: "100%", height: "900px" }}> {/* PDF size */}
        {loading && (
          <div style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "rgba(82, 86, 89, 0.8)", // Light overlay
            zIndex: 10,
            border: "1px solid black", // Ensure border is visible
            fontSize:12,
            color:'white'
          }}>
            <span>Loading PDF...</span>
          </div>
        )}
       <PDFViewer style={{ width: "100%", height: 900 }}>
      <Document>
        <Page size="FOLIO" orientation="landscape" style={styles.page}   wrap>
            {/* Report Title */}
            <Text style={styles.title}>{header_title}</Text>

            {/* Date Range */}
            <View style={styles.headerGroup}>
              <Text style={styles.headerText}>Date From: {moment(header_date_from).format("MMM DD, YYYY")} - {moment(header_date_to).format("MMM DD, YYYY")}</Text>
              <Text style={styles.headerText}>Generated: {moment().format("MMM DD, YYYY hh:mm A")}</Text>
              <Text style={styles.headerText}>SAP: {header_sap}</Text>
            </View>
            {/* Loop: Group by username */}
            {body && Object.entries(body).map(([username, records], userIndex) => (
              <View key={userIndex} style={styles.section}>
                {/* Username title */}
                <Text style={styles.subtitle}>Collector: {username} | Total Checks: {records['count']}</Text>

                {/* Table Header */}
                <View style={[styles.row, styles.trwBG]}>
                  {headers.map((h, hi) => (
                    <Text key={hi}  style={hi <= 2 || hi >= 4 ? styles.smallCell : styles.cell}>{h.description}</Text>
                  ))}
                </View>

                {/* Table Body */}
                {records['data'].map((item, i) => (
                  <View key={i} style={styles.row}>
                    <Text style={styles.smallCell}>{moment(item.created_at).format("MM/DD/YYYY")}</Text>
                    <Text style={styles.smallCell}>{moment(item.check_date).format("MM/DD/YYYY")}</Text>
                    <Text style={styles.smallCell}>{item.check_number}</Text>
                    <Text style={styles.cell}>{item.card_name}</Text>
                    <Text style={styles.smallCell}>{item.bank_description}</Text>
                    <Text style={styles.smallCell}>{item.prefix_crpr}</Text>
                    <Text style={styles.smallCell}>{ViewAmountFormatingDecimals(item.check_amount)}</Text>
                  </View>
                ))}
              </View>
            ))}
            <View style={{ height: 5 }} />
            {/* Footer Section */}
              <View style={styles.footer}>
                <View style={styles.footerRow}>
                  <Text style={styles.footerLabel}>TOTAL CHECKS:</Text>
                  <Text style={styles.footerValue}>{footer_total_check || 0}</Text>
                </View>
              </View>
        </Page> 
      </Document>
    </PDFViewer>
    </div>
    </div>
  );
};

export default ViewPrintCollectorReport;
