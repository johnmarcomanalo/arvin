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
    fontSize: 15, 
  },
  section: { marginBottom: 10 },
  title: { fontSize: 11, fontWeight: "bold", marginBottom: 0, fontFamily: "PoppinsBold" },
  subtitle: { fontSize: 9, fontWeight: "bold", marginBottom: 1,marginTop:7, fontFamily: "PoppinsBold" },
  headerGroup: { marginBottom: 2, textAlign: "left" },
  headerText: { fontSize: 9, margin:1, fontFamily: "PoppinsRegular" },
  table: { display: "flex", flexDirection: "column", 
    // border: "0.5px solid black", 
    fontSize: 9 },
  row: { 
    flexDirection: "row", 
    fontWeight: "bold" 
    // borderBottom: "0.5px solid black",
  },
  cell: { 
    padding: 3, 
    flex: 2.4,
    textAlign: "left",
    fontSize: 9,
    // borderBottom: "0.5px solid black", 
  },
  tinyCell: { 
    padding: 2, 
    flex:.25, 
    textAlign: "left",
    fontSize: 9,
    // borderBottom: "0.5px solid black", 
  },
  smallCell: { 
      flex: .6, 
      padding: 3, 
      textAlign: "left", 
      fontSize:9,  
      // borderBottom: "0.5px solid black", 
  },
  footer: {
    marginTop: 15,
    paddingBottom:15,
    padding: 1.8,
    borderBottom: "1px solid #000",
    width: "20%",
    // backgroundColor: "#f5f5f5",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  footerLabel: {
    fontSize: 10,
    fontFamily: "PoppinsBold",
    color: "black",
  },
  footerValue: {
    fontSize: 10,
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
    padding:1
  },
  footerHighlightTop: { 
    borderTop: "1px solid black",
    marginVertical: 5,
    padding:1
  },
});

// Table headers
const headers = [
  {id:"received_date",description:"RECEIVED DATE"}, 
  {id:"created_at",description:"POSTING DATE"},
  {id:"check_status_date",description:"TRANSMIT DATE"}, 
  {id:"account_number",description:"ACCOUNT NO"},
  {id:"check_number",description:"CHECK NO."},
  {id:"check_date",description:"CHECK DATE"}, 
  {id:"check_amount",description:"CHECK AMOUNT"},
  {id:"card_name",description:"CUSTOMER"}, 
];


const Table = ({ data,status }) => {
  
  return (
    <View style={styles.section}>
      <View>
        {/* Table Header */}
        <View style={[styles.row, { backgroundColor: "#ddd" }]}> 
        <Text style={styles.tinyCell}>#</Text>
          {headers.map((header, index) => (
            <Text key={index} style={index < 7? styles.smallCell : styles.cell}>
              {header.description}
            </Text>
          ))}
      </View> 
        {/* Table Rows */}
        {Array.isArray(data) &&
          data.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              <Text style={styles.tinyCell}>{++rowIndex}</Text>
              <Text style={styles.smallCell}>{row.received_date}</Text>
              <Text style={styles.smallCell}>{row.created_at}</Text>
              <Text style={styles.smallCell}>{row.check_status_date}</Text>
              <Text style={styles.smallCell}>{row.account_number}</Text>
              <Text style={styles.smallCell}>{row.check_number}</Text>
              <Text style={styles.smallCell}>{row.check_date}</Text>
              <Text style={styles.smallCell}>{row.check_amount}</Text>
              <Text style={styles.cell}>{row.card_name}</Text>
            </View>
          ))}
      </View>
    </View>
  );
};
 
 
const pageWidth = 13 * 72;   // 936 pt
const pageHeight = 8.5 * 72; // 612 pt

const ViewPrintWeeklyCheckReport = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500); // Simulating API delay
  }, [props.data]);

  const footer_summary     = props.data?.footer
  const body_data          = props.data?.body
  const body               = body_data 

  // FOOTER DATA
 

  //HEADER DATA
  const header_data        = props.data?.header;
  const header_date_from   = header_data?.date_from
  const header_date_to     = header_data?.date_to
  const header_subsection  = header_data?.sub_section
  const header_title       = header_data?.title 
  const header_status       = header_data?.status 

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
          {/* Header Group */}
          <View style={styles.headerGroup}>
            <Text style={styles.title}>{header_title}</Text>
            <Text style={styles.headerText}>From {header_date_from} - {header_date_to}</Text>
            <Text style={styles.headerText}>{header_subsection}</Text> 
          </View>
  
          {/* Tables */}
          <Table data={body} status={header_status}/>
   
        </Page>

       
      </Document>
    </PDFViewer>
    </div>
    </div>
  );
};

export default ViewPrintWeeklyCheckReport;
