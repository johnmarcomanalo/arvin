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
  section: { marginBottom: 10 },
  title: { fontSize: 11, fontWeight: "bold", marginBottom: 0, fontFamily: "PoppinsBold" },
  subtitle: { fontSize: 9, fontWeight: "bold", marginBottom: 1,marginTop:7, fontFamily: "PoppinsBold" },
  headerGroup: { marginBottom: 2, textAlign: "left" },
  headerText: { fontSize: 10, margin:1, fontFamily: "PoppinsRegular" },
  table: { display: "flex", flexDirection: "column", 
    // border: "0.5px solid black", 
    fontSize: 9 },
  row: { flexDirection: "row", 
    // borderBottom: "0.5px solid black",
    fontWeight: "bold" },
  cell: { 
    adding: 1.8, 
    // borderRight: "0.5px solid black", 
    flex: 0.7, 
    textAlign: "left", 
    fontSize: 8 },
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
  {id:"check_status_date",description:"DATE DEP/TRANS"},
  {id:"check_number",description:"CHECK NO."}, 
  {id:"card_name",description:"CUSTOMER"}, 
  {id:"bank_description",description:"BANK NAME"},
  {id:"prefix_crpr",description:"OR/PR"}, 
  {id:"check_amount",description:"CHECK AMOUNT"}, 
  {id:"sum_doc_total",description:"SI AMOUNT"}, 
  {id:"count_sales_invoice",description:"SI COUNT"}, 
  {id:"stale_check",description:"STALE CHECK"}, 
  {id:"check_status",description:"STATUS"}, 
  {id:"payment_terms",description:"TERMS"}, 
  {id:"remarks",description:"REMARKS"}, 
];



const Table = ({ title, data, grandTotal,grandCount,grandSumTotal }) => {
  if (!data || typeof data !== "object") {
    return null; // Prevent rendering if data is undefined or not an object
  }

  // Compute grand totals from all rows
  // const allRows = Object.values(data).flat();
  // const grandCheckAmount = allRows.reduce(
  //   (total, row) => total + (parseFloat(row.check_amount) || 0),
  //   0
  // );
  // const grandDocTotal = allRows.reduce(
  //   (total, row) => total + (parseFloat(row.sum_doc_total) || 0),
  //   0
  // );

  return (
    <View style={styles.section}>
      {Object.keys(data).length > 0 && (
        <>
          <Text style={styles.title}>{title}</Text>
          {Object.entries(data).map(([date, rows]) => (
            console.log(rows),
            
            <View key={date} style={styles.dateSection}>
              <Text style={styles.subtitle}>
                {moment(date).format("MMMM DD, YYYY")} (Count: {rows.length})
              </Text>

              {/* Table Header */}
              <View style={[styles.row, { backgroundColor: "#ddd" }]}>
                {headers.map((header, index) => (
                  <Text key={index} style={index < 4 || index > 4 ? styles.smallCell : styles.cell}>
                    {header.description}
                  </Text>
                ))}
              </View>

              {/* Table Rows */}
              {Array.isArray(rows) &&
                rows.map((row, rowIndex) => (
                  <View key={rowIndex} style={[styles.row ]}>
                    {headers.map((header, cellIndex) => (
                      // <Text key={cellIndex}  style={cellIndex < 4 ||  cellIndex>4 ? rowIndex % 2 === 1 ? [styles.smallCell,style.trwBG]  : {rowIndex % 2 === 1 ? [styles.cell,style.trwoBG]} }>
                      <Text
                        key={cellIndex}
                        style={[
                          cellIndex < 4 || cellIndex > 4
                            ? rowIndex % 2 === 1
                              ? [styles.smallCell, styles.trwBG]
                              : styles.smallCell
                            : rowIndex % 2 === 1
                              ? [styles.cell, styles.trwBG]
                              : styles.cell
                        ]}
                      >  
                      {row[header.id] || ""}
                      </Text>
                    ))}
                  </View>
                ))}
                
              <View style={styles.row}> 
                <Text style={[styles.smallCell,styles.footerHighlightTop]}>NO OF CHECKS</Text>
                <Text style={[styles.smallCell,styles.footerHighlightTop]}>{rows.length}</Text> 
                {[1 ,2].map((_, index) => (
                  <Text key={index} style={[styles.cell]}>.</Text>
                ))} 
                <Text style={[styles.smallCell,styles.footerHighlightTop]}>TOTAL</Text> 
                <Text style={[styles.smallCell,styles.footerHighlightTop]}>
                  {ViewAmountFormatingDecimals(
                    rows.reduce((total, row) => total + (parseFloat(row.check_amount) || 0), 0)
                  ,2)}
                </Text> 
                <Text style={[styles.smallCell,styles.footerHighlightTop]}>
                  {ViewAmountFormatingDecimals(
                    rows.reduce((total, row) => total + (parseFloat(row.sum_doc_total) || 0), 0)
                  ,2)}
                </Text>
                {[1, 2,3,4,5].map((_, index) => (
                  <Text key={index} style={[styles.smallCell]}> </Text>
                ))}
              </View>
            </View>
          ))}


          {/* Grand Total Row */}
          <View style={[styles.row]}>
          <Text style={[styles.smallCell,styles.footerHighlight]}>NO OF CHECKS</Text>
          {/* <Text style={[styles.smallCell,styles.footerHighlight]}>{allRows.length}</Text> */}
          <Text style={[styles.smallCell,styles.footerHighlight]}>{grandCount}</Text>
            
            {[1, 2].map((_, index) => (
              <Text key={`g2-${index}`} style={styles.cell}></Text>
            ))}
             <Text style={[styles.smallCell,styles.footerHighlight]}>GRAND TOTAL</Text>
            <Text style={[styles.smallCell,styles.footerHighlight]}>
              {/* {ViewAmountFormatingDecimals(grandCheckAmount, 2)} */}
              {ViewAmountFormatingDecimals(grandTotal, 2)}
            </Text>
            <Text style={[styles.smallCell,styles.footerHighlight]}>
              {/* {ViewAmountFormatingDecimals(grandDocTotal, 2)} */}
              {ViewAmountFormatingDecimals(grandSumTotal, 2)}
            </Text>
            {[1, 2,3,4,5].map((_, index) => (
              <Text key={`g3-${index}`} style={styles.smallCell}></Text>
            ))}
          </View>
        </>
      )}
    </View>
  );
};
// Table Component (keep your existing Table component)

const Summary = ({data,onhand})=>{
    const beginning_on_hand = data?.beginning_on_hand ? data?.beginning_on_hand : "-"
    const ending_on_hand    = data?.ending_on_hand ? data?.ending_on_hand :"-"
    const deposited         = data?.deposited ? data?.deposited :"-"
    const collected         = data?.collected ? data?.collected :"-"
    const transmitted       = data?.transmitted ? data?.transmitted :"-"
    const rejected          = data?.rejected ? data?.rejected :"-"
    const open_rejected     = data?.open_rejected ? data?.open_rejected :"-"
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
      <View style={styles.footerDivider} />
      <View style={styles.footerRow}>
        <Text style={styles.footerLabel}>Open Rejected:</Text>
        <Text style={styles.footerValue}>{open_rejected}</Text>
      </View>
    </View>)
}

// const pageWidth = 13 * 72;   // 936 pt
// const pageHeight = 8.5 * 72; // 612 pt

const ViewPrintWeeklyCheckReport = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500); // Simulating API delay
  }, [props.data]);

  const footer_summary          = props.data?.footer
  const body_data               = props.data?.body
  const onhand_data             = body_data?.onhand
  const onhand_grand_total   = body_data?.onhand_grand_total
  const onhand_grand_count   = body_data?.onhand_grand_count
  const onhand_grand_sum_doc_total   = body_data?.onhand_grand_sum_doc_total
  
  const deposited_data          = body_data?.deposited
  const deposited_grand_total   = body_data?.deposited_grand_total
  const deposited_grand_count   = body_data?.deposited_grand_count
  const deposited_grand_sum_doc_total   = body_data?.deposited_grand_sum_doc_total

  const transmitted_data        = body_data?.transmitted
  const transmitted_grand_total = body_data?.transmitted_grand_total
  const transmitted_grand_count = body_data?.transmitted_grand_count
  const transmitted_grand_sum_doc_total = body_data?.transmitted_grand_sum_doc_total

  const rejected_data      = body_data?.rejected
  const rejected_grand_total = body_data?.rejected_grand_total
  const rejected_grand_count = body_data?.rejected_grand_count
  const rejected_grand_sum_doc_total = body_data?.rejected_grand_sum_doc_total

  const open_rejected_data = body_data?.open_rejected
  const open_rejected_grand_total = body_data?.open_rejected_grand_total
  const open_rejected_grand_count = body_data?.open_rejected_grand_count
  const open_rejected_grand_sum_doc_total = body_data?.open_rejected_grand_sum_doc_total

  // FOOTER DATA
 

  //HEADER DATA
  const header_data        = props.data?.header;
  const header_date_from   = header_data?.date_from
  const header_date_to     = header_data?.date_to
  const header_subsection  = header_data?.sub_section
  const header_title       = "WEEKLY CHECK COUNTER RECEIPT"

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
          <Table title="DEPOSITED" 
                 data={deposited_data} 
                 grandTotal={deposited_grand_total} 
                 grandCount={deposited_grand_count} 
                 grandSumTotal={deposited_grand_sum_doc_total}
          />
          <Table title="TRANSMITTED" 
                 data={transmitted_data}
                 grandTotal={transmitted_grand_total} 
                 grandCount={transmitted_grand_count} 
                 grandSumTotal={transmitted_grand_sum_doc_total}
          />
          <Table title="ON-HAND" 
                 data={onhand_data} 
                 grandTotal={onhand_grand_total} 
                 grandCount={onhand_grand_count} 
                 grandSumTotal={onhand_grand_sum_doc_total}
          />
          <Table title="REJECTED" 
                 data={rejected_data} 
                 grandTotal={rejected_grand_total} 
                 grandCount={rejected_grand_count} 
                 grandSumTotal={rejected_grand_sum_doc_total} 
          />
  
          {/* Footer */}
          <Summary data={footer_summary} onhand={onhand_grand_count}/>
        </Page>

        {/* OPEN REJECTED */}
        <>
        {open_rejected_data && open_rejected_data.length!==0 && (
          <Page size="FOLIO" style={styles.page} orientation="landscape" wrap>
            <Table title="OPEN REJECTED" 
                   data={open_rejected_data} 
                   grandTotal={open_rejected_grand_total} 
                   grandCount={open_rejected_grand_count} 
                   grandSumTotal={open_rejected_grand_sum_doc_total} 
            />
          </Page>
        )}
        </>
      </Document>
    </PDFViewer>
    </div>
    </div>
  );
};

export default ViewPrintWeeklyCheckReport;
