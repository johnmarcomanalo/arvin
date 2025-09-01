import {
  Document,
  Font,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
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
    fontSize: 15, 
  },
  section: { marginBottom: 10 },
  title: { fontSize: 11, fontWeight: "bold", marginBottom: 0, fontFamily: "PoppinsBold" },
  warehouseTitle: { fontSize: 11, fontWeight: "bold", marginBottom: 0, fontFamily: "PoppinsBold" },
  subtitle: { fontSize: 9, fontWeight: "bold", marginBottom: 1,marginTop:7, fontFamily: "PoppinsBold" },
  headerGroup: { marginBottom: 2, textAlign: "left" },
  headerText: { fontSize: 10, margin:1, fontFamily: "PoppinsRegular" },
  table: { display: "flex", flexDirection: "column", 
    // border: "0.5px solid black", 
    fontSize: 10 },
  row: { flexDirection: "row", 
    // borderBottom: "0.5px solid black",
    fontWeight: "bold" },
  cell: { padding: 3, 
    // borderBottom: "0.5px solid black", 
    flex: 1.5, textAlign: "left", fontSize: 9, },
    tinyCell: { padding: 2, 
      // borderBottom: "0.5px solid black", 
      flex:.3, textAlign: "left", fontSize: 9, },
  smallCell: { flex: 1, padding: 3, 
    // borderBottom: "0.5px solid black", 
    textAlign: "left", fontSize:9,  },
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
  {id:"created_at",description:"POSTING DATE"},
  {id:"account_number",description:"ACCOUNT NO"},
  {id:"check_number",description:"CHECK NO."},
  {id:"check_date",description:"CHECK DATE"}, 
  {id:"check_amount",description:"CHECK AMOUNT"},
  {id:"card_name",description:"CUSTOMER"},
  {id:"prefix_crpr",description:"CRPR"},
  {id:"bank_description",description:"CHECK BANK"}, 
  {id:"deposited_date",description:"DATE DEPOSITED"}, //8
  {id:"deposited_bank",description:"BANK DEPOSITED"}, //9
  {id:"received_date",description:"DATE RECEIVED"}, // 10
  {id:"check_status_date",description:"STATUS DATE"}, //11
];

 
  const Table = ({ data, group, status }) => {
    return (
      <View style={styles.section}>
        {group ? (
          data && typeof data === 'object' ? (
            Object.entries(data).map(([warehouse, rows], index) => (
              <View key={index}>
                {/* Warehouse Header */}
                <Text style={styles.warehouseTitle}>{warehouse}</Text>
  
                {/* Table Header */}
                <View style={[styles.row, { backgroundColor: "#ddd" }]}>
                  <Text style={styles.tinyCell}>#</Text>
                  <Text style={styles.smallCell}>{headers[0]?.description}</Text>
                  <Text style={styles.smallCell}>{headers[1]?.description}</Text>
                  <Text style={styles.smallCell}>{headers[2]?.description}</Text>
                  <Text style={styles.smallCell}>{headers[3]?.description}</Text>
                  <Text style={styles.smallCell}>{headers[4]?.description}</Text>
                  <Text style={styles.cell}>{headers[5]?.description}</Text>
                  <Text style={styles.smallCell}>{headers[6]?.description}</Text>
                  <Text style={styles.smallCell}>{headers[7]?.description}</Text>
                  {status === 'DEPOSITED' && (
                    <>
                      <Text style={styles.smallCell}>{headers[8]?.description}</Text>
                      <Text style={styles.cell}>{headers[9]?.description}</Text>
                    </>
                  )}
                  {status === 'TRANSMITTED' && (
                    <Text style={styles.smallCell}>{headers[10]?.description}</Text>
                  )}
                  <Text style={styles.smallCell}>{headers[11]?.description}</Text>
                </View>
  
                {/* Table Rows */}
                {Array.isArray(rows) &&
                  rows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                      <Text style={styles.tinyCell}>{rowIndex + 1}</Text>
                      <Text style={styles.smallCell}>{row.created_at}</Text>
                      <Text style={styles.smallCell}>{row.account_number}</Text>
                      <Text style={styles.smallCell}>{row.check_number}</Text>
                      <Text style={styles.smallCell}>{row.check_date}</Text>
                      <Text style={styles.smallCell}>{row.check_amount}</Text>
                      <Text style={styles.cell}>{row.card_name}</Text>
                      <Text style={styles.smallCell}>{row.prefix_crpr}</Text>
                      <Text style={styles.smallCell}>{row.bank_description}</Text>
                      {status === 'DEPOSITED' && (
                        <>
                          <Text style={styles.smallCell}>{row.deposited_date}</Text>
                          <Text style={styles.cell}>{row.deposited_bank}</Text>
                        </>
                      )}
                      {status === 'TRANSMITTED' && (
                        <Text style={styles.smallCell}>{row.received_date}</Text>
                      )}
                      <Text style={styles.smallCell}>{row.check_status_date}</Text>
                    </View>
                  ))}
              </View>
            ))
          ) : (
            <Text>No data available</Text>
          )
        ) : (
          <>
            {/* Table Header */}
            <View style={[styles.row, { backgroundColor: "#ddd" }]}>
              <Text style={styles.tinyCell}>#</Text>
              <Text style={styles.smallCell}>{headers[0]?.description}</Text>
              <Text style={styles.smallCell}>{headers[1]?.description}</Text>
              <Text style={styles.smallCell}>{headers[2]?.description}</Text>
              <Text style={styles.smallCell}>{headers[3]?.description}</Text>
              <Text style={styles.smallCell}>{headers[4]?.description}</Text>
              <Text style={styles.cell}>{headers[5]?.description}</Text>
              <Text style={styles.smallCell}>{headers[6]?.description}</Text>
              <Text style={styles.smallCell}>{headers[7]?.description}</Text>
              {status === 'DEPOSITED' && (
                <>
                  <Text style={styles.smallCell}>{headers[8]?.description}</Text>
                  <Text style={styles.cell}>{headers[9]?.description}</Text>
                </>
              )}
              {status === 'TRANSMITTED' && (
                <Text style={styles.smallCell}>{headers[10]?.description}</Text>
              )}
              <Text style={styles.smallCell}>{headers[11]?.description}</Text>
            </View>
  
            {/* Table Rows */}
            {Array.isArray(data) &&
              data.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  <Text style={styles.tinyCell}>{rowIndex + 1}</Text>
                  <Text style={styles.smallCell}>{row.created_at}</Text>
                  <Text style={styles.smallCell}>{row.account_number}</Text>
                  <Text style={styles.smallCell}>{row.check_number}</Text>
                  <Text style={styles.smallCell}>{row.check_date}</Text>
                  <Text style={styles.smallCell}>{row.check_amount}</Text>
                  <Text style={styles.cell}>{row.card_name}</Text>
                  <Text style={styles.smallCell}>{row.prefix_crpr}</Text>
                  <Text style={styles.smallCell}>{row.bank_description}</Text>
                  {status === 'DEPOSITED' && (
                    <>
                      <Text style={styles.smallCell}>{row.deposited_date}</Text>
                      <Text style={styles.cell}>{row.deposited_bank}</Text>
                    </>
                  )}
                  {status === 'TRANSMITTED' && (
                    <Text style={styles.smallCell}>{row.received_date}</Text>
                  )}
                  <Text style={styles.smallCell}>{row.check_status_date}</Text>
                </View>
              ))}
          </>
        )}
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
  const header_status      = header_data?.status 
  const header_group       = header_data?.group 

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
            <Text style={styles.headerText}>{header_subsection} | {header_status}</Text> 
          </View>
  
          {/* Tables */}
          <Table data={body} group={header_group} status={header_status}/>
   
        </Page>

       
      </Document>
    </PDFViewer>
    </div>
    </div>
  );
};

export default ViewPrintWeeklyCheckReport;
