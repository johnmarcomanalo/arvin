import * as React from "react";
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
  page: { padding: 10, fontSize: 10 },
  section: { marginBottom: 10 },
  title: { fontSize: 10, fontWeight: "bold", marginBottom: 1, fontFamily: "PoppinsBold" },
  headerGroup: { marginBottom: 10, textAlign: "center" },
  headerText: { fontSize: 9, margin:1, fontFamily: "PoppinsRegular" },
  table: { display: "flex", flexDirection: "column", border: "0.5px solid black", fontSize: 6 },
  row: { flexDirection: "row", borderBottom: "0.5px solid black",fontWeight: "bold" },
  cell: { padding: 4, borderRight: "0.5px solid black", flex: 1, textAlign: "center", fontSize: 7 },
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
  "POSTING DATE", "CHECK DATE", "DATE DEP/TRANS", "CHECK NUMBER",
  "BANK NAME", "CHECK AMOUNT", "CUSTOMER", "INVOICE AMOUNT", "OR/PR", "REMARKS", "STATUS"
];

const Table = ({ title }) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.table}>
      <View style={[styles.row, { backgroundColor: "#ddd" }]}>
        {headers.map((header, index) => (
          <Text key={index} style={styles.cell}>{header}</Text>
        ))}
      </View>
      <View style={styles.row}>
        {headers.map((_, index) => (
          <Text key={index} style={styles.cell}> </Text>
        ))}
      </View>
    </View>
  </View>
);

const pageWidth = 8.5 * 72; // Convert inches to points
const pageHeight = 13 * 72; // Convert inches to points

const ViewPrintWeeklyCheckReport = () => (
  <PDFViewer style={{ width: "100%", height: 900 }}>
    <Document>
      <Page size={[pageWidth, pageHeight]} style={styles.page} orientation="landscape" wrap>
        {/* Header Group */}
        <View style={styles.headerGroup}>
          <Text style={styles.title}>WEEKLY CHECK COUNTER RECEIPT</Text>
          <Text style={styles.headerText}>From 2/2/2025 - 2/5/2025</Text>
          <Text style={styles.headerText}>BACOLOD</Text>
        </View>

        {/* Tables */}
        <Table title="ON-HAND" />
        <Table title="DEPOSITED" />
        <Table title="TRANSMITTED" />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Beginning ON-HAND:</Text>
            <Text style={styles.footerValue}>0.0</Text>
          </View>
          <View style={styles.footerDivider} />
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Collected:</Text>
            <Text style={styles.footerValue}>0.0</Text>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Deposited:</Text>
            <Text style={styles.footerValue}>0.0</Text>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Transmitted:</Text>
            <Text style={styles.footerValue}>0.0</Text>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Rejected:</Text>
            <Text style={styles.footerValue}>0.0</Text>
          </View>
          <View style={styles.footerDivider} />
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Ending ON-HAND:</Text>
            <Text style={styles.footerValue}>0.0</Text>
          </View>
        </View>
      </Page>
    </Document>
  </PDFViewer>
);

export default ViewPrintWeeklyCheckReport;