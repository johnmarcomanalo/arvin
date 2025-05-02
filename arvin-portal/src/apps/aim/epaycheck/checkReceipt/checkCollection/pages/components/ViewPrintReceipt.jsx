import {
  Document,
  Font,
  Page,
  PDFViewer,
  StyleSheet,
  Text
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { NumberToWords, ViewAmountFormatingDecimals } from "utils/AccountingUtils";
import PoppinsBold from "../../../../../../../utils/font/Poppins-Bold.ttf";
import PoppinsRegular from "../../../../../../../utils/font/Poppins-Regular.ttf";
import PoppinsSemiBoldItalic from "../../../../../../../utils/font/Poppins-SemiBoldItalic.ttf";
import CourierPrimeRegular from "../../../../../../../utils/font/CourierPrime-Regular.ttf";
// Register fonts
Font.register({
  family: "CourierPrimeRegular",
  src: CourierPrimeRegular,
}); 

const fullWidth = 8.27 * 72; // A4 width in points
const halfHeight = 11.69 * 72; // A4 height in points
const ViewPrintReceipt = (props) => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500); // Simulating API delay
  }, [props.data]);
  const data  = props?.data;
  const styles = StyleSheet.create(data?.format || {}); // Use database styles 
  const check_amount = data?.check_amount ? ViewAmountFormatingDecimals(data?.check_amount) : ""
  const numtoword    = data?.check_amount ? NumberToWords(parseFloat(data?.check_amount)) : ""
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
    <div style={{ position: "relative", width: "100%", height: "500" }}> {/* PDF size */}
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
    <PDFViewer style={{ width: "100%", height: 500, backgroundColor: "#f3f3f3" }}> 
      <Document> 
        <Page size="Letter" style={styles.page} wrap>
          <Text style={styles?.datePay}>{data?.date_pay}</Text>
          <Text style={styles?.name}>{data?.card_name}</Text>
          <Text style={styles?.lictradnum}>{data?.lictradnum}</Text>
          <Text style={styles?.address}>{data?.address}</Text>
          <Text style={styles?.numberToWords}>{numtoword}</Text>
          <Text style={styles?.amount}>{check_amount}</Text>
          <Text style={styles?.sales_invoice}>{data?.sales_invoice}</Text>
          <Text style={styles?.username}>{data?.username}</Text>
        </Page>
      </Document>
    </PDFViewer> 
    </div>
    </div>
  );
};

export default ViewPrintReceipt;

