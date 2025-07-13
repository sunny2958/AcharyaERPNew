import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf
} from "@react-pdf/renderer";
import moment from "moment";

const styles = StyleSheet.create({
  pageLayout: {
    fontSize: 8,
    fontFamily: "Times-Roman",
  },
  layout: { margin: "30px 30px 0px 60px" },
  borderTable: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
  },
  tableRow: {
    flexDirection: "row",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "20px"
  },
  userDetailStyle: {
    fontSize: 12,
    fontFamily: "Times-Roman",
  }
});


export const GenerateSchoolCounterSummary = (
  data, startDate, endDate, cashTotal, ddTotal, onlineTotal, paymentTotal, closingTotal, usdCashTotal
) => {

  const DispayRow = ({ children }) => (
    <View style={styles.tableRow}>{children}</View>
  );

  const DisplayCells = ({
    label,
    style,
    right,
    bottom,
    type,
    align,
    padding,
    customWidth = 1,
    labelType,
    fontSize
  }) => (
    <View
      style={{
        flex: customWidth,
        borderStyle: "solid",
        borderRightWidth: right,
        borderBottomWidth: bottom,
        borderColor: "black",
        outline: "none",
        padding: "2px",
        fontSize: fontSize || 9,
        marginRight: right === 0 ? 1 : 0,
        backgroundColor: type == "h" ? "#33495E" : "",
        color: type == "h" ? "#fff" : "",
        height: "30px"
      }}
    >
      {labelType == "text" ? <Text style={{
        fontFamily: style,
        textAlign: align,
        paddingleft: padding
      }}>{label}</Text> : label}
    </View>
  );

  const ReportData = ({ listData, pageIndex, cashTotal, ddTotal, onlineTotal, paymentTotal, closingTotal }) => (
    <View style={{ ...styles.layout }}>
      <View>
        <Text style={{ backgroundColor: "#33495E", color: "#fff", padding: "8px", fontSize: 14, textAlign: "center", fontWeight: "heavy", fontFamily: "Times-Bold" }}>{`JMJ EDUCATION SOCIETY`}</Text>
      </View>
      <View style={{ marginBottom: "5px" }}>
        <Text style={{ backgroundColor: "#33495E", color: "#fff", padding: "4px", fontSize: 12, textAlign: "center", fontWeight: "heavy", fontFamily: "Times-Bold" }}>{`COLLECTION SUMMARY FROM ${moment(startDate).format("DD-MM-YYYY")} TO ${moment(endDate).format("DD-MM-YYYY")}`}</Text>
      </View>
      <View style={[styles.borderTable]}>
        <DispayRow>
          <DisplayCells
            label="S.No."
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            labelType="text"
          />
          <DisplayCells
            label="Inst"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label="Receipt_Total"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label="DD"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={2}
            labelType="text"
          />
          <DisplayCells
            label="Online"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label="INR"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label="INR1"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label="Payment"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={3}
            labelType="text"
          />
          <DisplayCells
            label="Closing Cash"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={4}
            labelType="text"
          />
          {/* <DisplayCells
            label="RPT Summary"
            style="Times-Bold"
            right={1}
            bottom={1}
            type="h"
            align="center"
            customWidth={4}
            labelType="text"
          /> */}
        </DispayRow>
        {listData.map((obj, i) => {
          return (
            <DispayRow key={i}>
              <DisplayCells
                key={i}
                label={(i + 1)}
                style="Times-Roman"
                right={1}
                bottom={1}
                align="center"
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={(obj?.schoolName)}
                style={(obj?.schoolName?.toLowerCase() == "total" || obj?.schoolName?.toLowerCase() == "nrc" || obj?.schoolName?.toLowerCase() == "hos") ? "Times-Bold" : "Times-Roman"}
                right={1}
                bottom={1}
                align="left"
                customWidth={3}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={Number((obj.INRDD % 1 !== 0 || (obj.INRONLINE % 1 !== 0) ||
                  (obj.INRCASH % 1 !== 0) || (obj.USDCASH % 1 !== 0)) ? (obj.INRDD + obj.INRONLINE + obj.INRCASH + obj.USDCASH)?.toFixed(2) : (obj.INRDD + obj.INRONLINE + obj.INRCASH + obj.USDCASH) || 0)}
                style={(obj?.schoolName?.toLowerCase() == "total" || obj?.schoolName?.toLowerCase() == "nrc" || obj?.schoolName?.toLowerCase() == "hos") ? "Times-Bold" : "Times-Roman"}
                right={1}
                bottom={1}
                align="left"
                customWidth={3}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={Number((obj.INRDD % 1 !== 0) ? (obj.INRDD)?.toFixed(2) : (obj.INRDD) || 0)}
                style={(obj?.schoolName?.toLowerCase() == "total" || obj?.schoolName?.toLowerCase() == "nrc" || obj?.schoolName?.toLowerCase() == "hos") ? "Times-Bold" : "Times-Roman"}
                right={1}
                bottom={1}
                align="right"
                padding="15px"
                customWidth={2}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={Number((obj.INRONLINE % 1 !== 0) ? (obj.INRONLINE)?.toFixed(2) : (obj.INRONLINE) || 0)}
                style={(obj?.schoolName?.toLowerCase() == "total" || obj?.schoolName?.toLowerCase() == "nrc" || obj?.schoolName?.toLowerCase() == "hos") ? "Times-Bold" : "Times-Roman"}
                right={1}
                bottom={1}
                align="right"
                padding="15px"
                customWidth={3}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={Number((obj.INRCASH % 1 !== 0) ? (obj.INRCASH)?.toFixed(2) : (obj.INRCASH) || 0)}
                style={(obj?.schoolName?.toLowerCase() == "total" || obj?.schoolName?.toLowerCase() == "nrc" || obj?.schoolName?.toLowerCase() == "hos") ? "Times-Bold" : "Times-Roman"}
                right={1}
                bottom={1}
                align="right"
                padding="15px"
                customWidth={3}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={Number((obj.USDCASH % 1 !== 0) ? (obj.USDCASH)?.toFixed(2) : (obj.USDCASH) || 0)}
                style={(obj?.schoolName?.toLowerCase() == "total" || obj?.schoolName?.toLowerCase() == "nrc" || obj?.schoolName?.toLowerCase() == "hos") ? "Times-Bold" : "Times-Roman"}
                right={1}
                bottom={1}
                align="right"
                padding="15px"
                customWidth={3}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={Number((obj?.payment % 1 !== 0) ? (obj.payment)?.toFixed(2) : (obj.payment) || 0)}
                style={(obj?.schoolName?.toLowerCase() == "total" || obj?.schoolName?.toLowerCase() == "nrc" || obj?.schoolName?.toLowerCase() == "hos") ? "Times-Bold" : "Times-Roman"}
                right={1}
                bottom={1}
                align="right"
                customWidth={3}
                labelType="text"
              />
              <DisplayCells
                key={i}
                label={Number((obj?.INRCASH) - (obj?.payment)) % 1 !== 0 ? ((obj?.INRCASH) - (obj?.payment))?.toFixed(2) : ((obj?.INRCASH) - (obj?.payment)) || 0}
                style={(obj?.schoolName?.toLowerCase() == "total" || obj?.schoolName?.toLowerCase() == "nrc" || obj?.schoolName?.toLowerCase() == "hos") ? "Times-Bold" : "Times-Roman"}
                right={1}
                bottom={1}
                align="right"
                customWidth={4}
                labelType="text"
              />
              {/* <DisplayCells
                key={i}
                label={Number((obj?.INRCASH + obj?.INRDD + obj?.INRONLINE + obj?.USDCASH) % 1 !== 0 ? (obj?.INRCASH + obj?.INRDD + obj?.INRONLINE + obj?.USDCASH)?.toFixed(2) : (obj?.INRCASH + obj?.INRDD + obj?.INRONLINE + obj?.USDCASH)) || 0}
                style={(obj?.schoolName?.toLowerCase() == "total" || obj?.schoolName?.toLowerCase() == "nrc" || obj?.schoolName?.toLowerCase() == "hos") ? "Times-Bold" : "Times-Roman"}
                right={1}
                bottom={1}
                align="right"
                customWidth={4}
                labelType="text"
              /> */}
            </DispayRow>
          );
        })}
        <DispayRow>
          <DisplayCells
            label={""}
            style="Times-Roman"
            right={1}
            bottom={1}
            align="center"
            labelType="text"
            fontSize="10"
          />
          <DisplayCells
            label={"GRAND TOTAL"}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="left"
            customWidth={3}
            labelType="text"
            fontSize="10"
          />
          <DisplayCells
            label={Number((ddTotal % 1 !== 0 || (onlineTotal % 1 !== 0) ||
              (cashTotal % 1 !== 0) || (usdCashTotal % 1 !== 0)) ? (ddTotal + onlineTotal + cashTotal + usdCashTotal)?.toFixed(2) : (ddTotal + onlineTotal + cashTotal + usdCashTotal) || 0)}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="left"
            customWidth={3}
            labelType="text"
            fontSize="10"
          />
          <DisplayCells
            label={Number(ddTotal % 1 !== 0 ? ddTotal?.toFixed(2) : ddTotal) || 0}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="right"
            padding="15px"
            customWidth={2}
            labelType="text"
            fontSize="10"
          />
          <DisplayCells
            label={Number(onlineTotal % 1 !== 0 ? onlineTotal?.toFixed(2) : onlineTotal) || 0}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="right"
            padding="15px"
            customWidth={3}
            labelType="text"
            fontSize="10"
          />

          <DisplayCells
            label={Number(cashTotal % 1 !== 0 ? cashTotal?.toFixed(2) : cashTotal) || 0}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="right"
            padding="15px"
            customWidth={3}
            labelType="text"
            fontSize="10"
          />

          <DisplayCells
            label={Number(usdCashTotal % 1 !== 0 ? usdCashTotal?.toFixed(2) : usdCashTotal) || 0}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="right"
            padding="15px"
            customWidth={3}
            labelType="text"
            fontSize="10"
          />

          <DisplayCells
            label={Number(paymentTotal % 1 !== 0 ? paymentTotal?.toFixed(2) : paymentTotal) || 0}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="right"
            customWidth={3}
            labelType="text"
            fontSize="10"
          />

          <DisplayCells
            label={Number(closingTotal % 1 !== 0 ? closingTotal?.toFixed(2) : closingTotal) || 0}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="right"
            customWidth={4}
            labelType="text"
            fontSize="10"
          />
          {/* <DisplayCells
            label={Number((cashTotal + ddTotal + onlineTotal + usdCashTotal) % 1 !== 0 ? (cashTotal + ddTotal + onlineTotal + usdCashTotal)?.toFixed(2) : (cashTotal + ddTotal + onlineTotal + usdCashTotal)) || 0}
            style="Times-Bold"
            right={1}
            bottom={1}
            align="right"
            customWidth={4}
            labelType="text"
            fontSize="10"
          /> */}
        </DispayRow>
      </View>
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title={`INSTITUTE RECEIPT SUMMARY`}>
          <Page
            size="A4"
            style={{ ...styles.pageLayout }}
          >
            <ReportData listData={data} cashTotal={cashTotal} ddTotal={ddTotal} onlineTotal={onlineTotal} paymentTotal={paymentTotal} closingTotal={closingTotal} />
          </Page>
        </Document>
      );
      const blob = await pdf(HallTicketCopy).toBlob();
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
};