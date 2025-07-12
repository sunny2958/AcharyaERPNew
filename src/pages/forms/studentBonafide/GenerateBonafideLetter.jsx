import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import LetterheadImage from "../../../assets/aisait.jpg";
import rightCursor from "../../../assets/rightCursor.png";
import rupeesSymbol from "../../../assets/rupeesSymbol.png";
import RobotoBold from "../../../fonts/Roboto-Bold.ttf";
import RobotoItalic from "../../../fonts/Roboto-Italic.ttf";
import RobotoLight from "../../../fonts/Roboto-Light.ttf";
import RobotoRegular from "../../../fonts/Roboto-Regular.ttf";
import moment from "moment";
const sign = require.context("../../../assets/principalSignature", true);

Font.register({
  family: "Roboto",
  fonts: [
    { src: RobotoBold, fontStyle: "bold", fontWeight: 700 },
    { src: RobotoItalic, fontStyle: "italic", fontWeight: 200 },
    { src: RobotoLight, fontStyle: "light", fontWeight: 300 },
    { src: RobotoRegular, fontStyle: "normal" },
  ],
});

const getSchoolTemplate = (studentDetail) => {
  try {
    if (!studentDetail || !studentDetail.school_name_short) {
      throw new Error("schoolShortName is not defined");
    }
    return require(`../../../assets/${studentDetail?.org_type?.toLowerCase()}${studentDetail?.school_name_short?.toLowerCase()}.jpg`);
  } catch (error) {
    console.error(
      "Image not found for schoolShortName:",
      studentDetail?.school_name_short,
      "Error:",
      error.message
    );
    return LetterheadImage;
  }
};

const styles = StyleSheet.create({
  body: {
    margin: 0,
    fontFamily: "Times-Roman",
  },
  image: { position: "absolute", width: "99%" },
  boldText: {
    fontWeight: "heavy",
    fontSize: 10,
    fontFamily: "Times-Bold",
  },
  topSection: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerSection: {
    width: "90%",
    marginLeft: "15px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    textAlign: "center",
    fontWeight: "heavy",
    fontSize: 10,
    fontFamily: "Times-Roman",
  },
  concernSection: {
    marginTop: "10px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  concernText: {
    marginLeft: "35px",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    borderBottomStyle: "solid",
  },
  studentDetailSection: {
    marginTop: "20px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    lineHeight: 1.5,
  },
  sectionDetailWidth: {
    width: "90%",
    marginLeft: "15px",
    lineHeight: 1.5,
  },
  feeDetailSection: {
    marginTop: "10px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  studentDetailText: {
    width: "90%",
    marginLeft: "15px",
    fontSize: 11,
    textAlign: "justify",
  },
  feeTemplateSection: {
    width: "100%",
  },
  feeDetailText: {
    fontSize: 11,
    textAlign: "justify",
  },
  amtText: {
    fontSize: "8px",
    textAlign: "right",
    width: "95%",
  },
  table: {
    display: "table",
    width: "90%",
    marginLeft: "15px",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeaderCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flex: 1,
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    display: "flex",
    flex: 1,
  },
  particularTableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    display: "flex",
    flex: 2,
  },
  particularTableHeaderCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flex: 2,
  },
  tableCellHeader: {
    padding: 2,
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Roboto",
    textTransform: "capitalize",
  },
  particularTableCellHeader: {
    padding: 2,
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Roboto",
  },
  tableCell: {
    margin: 2,
    fontSize: 10,
    wordWrap: "break-word",
    maxWidth: "100%",
    textAlign: "left",
  },
  tableAmountCell: {
    margin: 2,
    fontSize: 10,
    textAlign: "right",
  },
});

export const GenerateBonafideLetter = (
  studentBonafideDetail,
  studentDetail,
  semesterHeaderList,
  bonafideAddOnDetail,
  addOnSemesterHeaderList,
  hostelFeeTemplateData,
  letterHeadPrintOrNot
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title="Student Bonafide">
          return (
          <Page size="a4" style={styles.body}>
            {!letterHeadPrintOrNot && (
              <Image
                style={styles.image}
                src={getSchoolTemplate(studentDetail)}
              />
            )}
            <View style={styles.topSection}>
            <View style={{ ...styles.headerSection, marginTop: "150px" }}>
                <Text style={{ fontSize: "10px" }}>
                  RefNo:{" "}
                  <Text
                    style={styles.boldText}
                  >{`${studentBonafideDetail[0]?.bonafide_number}`}</Text>
                </Text>
                <Text style={{ fontSize: "10px" }}>
                  Date:{" "}
                  <Text style={styles.boldText}>{`${moment(
                    studentBonafideDetail[0]?.created_Date
                  ).format("DD/MM/YYYY")}`}</Text>
                </Text>
              </View>
            </View>
            <View style={styles.concernSection}>
              <Text style={{ ...styles.concernText, ...styles.boldText }}>
                TO WHOM SO EVER IT MAY CONCERN
              </Text>
            </View>
            <View style={styles.studentDetailSection}>
              <Text style={styles.studentDetailText}>
                This is to certify that{" "}
                <Text style={styles.boldText}>
                  {studentDetail?.candidate_sex == "Female" ? "Ms." : "Mr."}
                </Text>{" "}
                <Text style={styles.boldText}>
                  {studentDetail?.student_name?.toUpperCase() || "-"}
                </Text>
                ,{" "}
                <Text style={styles.boldText}>
                  {studentDetail?.candidate_sex == "Female" ? "D/o." : "S/o."}
                </Text>{" "}
                <Text style={styles.boldText}>
                  {studentDetail?.father_name?.toUpperCase() || "-"}
                </Text>
                , AUID No.{" "}
                <Text style={styles.boldText}>
                  {studentDetail?.auid || "-"}
                </Text>
                ,{!!studentDetail?.usn ? " " + "USN No." + " " : ""}
                <Text style={styles.boldText}>
                  {!!studentDetail?.usn ? studentDetail?.usn + " " : ""}
                </Text>{" "}
                is admitted to{" "}
                <Text
                  style={{ ...styles.boldText, textTransform: "uppercase" }}
                >
                  {studentBonafideDetail[0]?.school_name}
                </Text>{" "}
                in{" "}
                <Text style={styles.boldText}>
                  {(studentDetail?.program_short_name?.toUpperCase() || "-") +
                    "-" +
                    (studentDetail?.program_specialization_name?.toUpperCase() ||
                      "-")}
                </Text>
                . {studentDetail?.candidate_sex == "Female" ? "She" : "He"} is
                studying in{" "}
                <Text
                  style={styles.boldText}
                >{`${studentDetail?.current_year} year/${studentDetail?.current_sem} sem`}</Text>
                . The fee payable during the Academic Batch{" "}
                <Text style={styles.boldText}>
                  {studentDetail?.academic_batch}
                </Text>{" "}
                is given below.
              </Text>
            </View>

            <View
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                margin: "8px 0px 0px 8px",
              }}
            >
              <Text style={styles.amtText}>{`(Amount in ${
                studentBonafideDetail[0]?.currency_type_name == "INR"
                  ? "Rupees"
                  : "USD"
              })`}</Text>
            </View>
            <View style={styles.feeTemplateSection}>
              <View
                style={{
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <View style={styles.particularTableHeaderCol}>
                      <Text
                        style={{
                          ...styles.particularTableCellHeader,
                          ...styles.boldText,
                        }}
                      >
                        Particulars
                      </Text>
                    </View>
                    {semesterHeaderList.length > 0 &&
                      semesterHeaderList.map((obj, index) => (
                        <View style={styles.tableHeaderCol} key={index}>
                          <Text
                            style={{
                              ...styles.tableCellHeader,
                              ...styles.boldText,
                            }}
                          >
                            {obj.label}
                            {"\n"}
                            {obj.acYear}
                          </Text>
                        </View>
                      ))}
                  </View>
                  {studentBonafideDetail.length > 0 &&
                    studentBonafideDetail[0]?.acerpAmount.map((obj, index) => (
                      <View style={styles.tableRow} key={index}>
                        <View style={styles.particularTableCol}>
                          <Text style={styles.tableCell}>{obj.particular}</Text>
                        </View>
                        {semesterHeaderList.length > 0 &&
                          semesterHeaderList.map((list, i) => (
                            <View style={styles.tableCol} key={index}>
                              <Text style={styles.tableAmountCell}>
                                {obj[list["value"]]}
                              </Text>
                            </View>
                          ))}
                      </View>
                    ))}
                  <View style={styles.tableRow}>
                    <View style={styles.particularTableCol}>
                      <Text
                        style={{
                          ...styles.tableCell,
                          textAlign: "center",
                          ...styles.boldText,
                        }}
                      >
                        Total
                      </Text>
                    </View>

                    {semesterHeaderList.length > 0 &&
                      semesterHeaderList.map((li, i) => (
                        <View key={i} style={styles.tableCol}>
                          <Text
                            style={{
                              ...styles.tableAmountCell,
                              ...styles.boldText,
                            }}
                          >
                            {" "}
                            {studentBonafideDetail[0]?.acerpAmount.reduce(
                              (sum, current) => {
                                return sum + Number(current[li["value"]]);
                              },
                              0
                            )}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>
              </View>
              {!!bonafideAddOnDetail[0]?.feeType && (
                <View
                  style={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    margin: "8px 0px 0px 8px",
                  }}
                >
                  <Text style={styles.amtText}>(Amount in Rupees)</Text>
                </View>
              )}
              {!!bonafideAddOnDetail[0]?.feeType && (
                <View
                  style={{
                    width: "100%",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <View style={{...styles.tableCol,flex: 2}}>
                        <Text
                          style={{
                            ...styles.particularTableCellHeader,
                            ...styles.boldText,
                          }}
                        >
                          Particulars
                        </Text>
                      </View>
                      {addOnSemesterHeaderList.length > 0 &&
                        addOnSemesterHeaderList.map((obj, index) => (
                          <View key={index} style={styles.tableHeaderCol}>
                            <Text
                              style={{
                                ...styles.tableCellHeader,
                                ...styles.boldText,
                              }}
                            >
                              {obj.label}
                              {"\n"}
                              {obj.acYear}
                            </Text>
                          </View>
                        ))}
                    </View>
                    {bonafideAddOnDetail.length > 0 &&
                      bonafideAddOnDetail[0]?.addOnAmountList?.map(
                        (obj, index) => (
                          <View key={index} style={styles.tableRow}>
                            <View style={{...styles.tableCol,flex: 2}}>
                              <Text style={styles.tableCell}>
                                {obj.particular}
                              </Text>
                            </View>
                            {addOnSemesterHeaderList.length > 0 &&
                              addOnSemesterHeaderList.map((list, i) => (
                                <View key={i} style={styles.tableCol}>
                                  <Text style={styles.tableAmountCell}>
                                    {obj[list["value"]]}
                                  </Text>
                                </View>
                              ))}
                          </View>
                        )
                      )}
                    <View style={styles.tableRow}>
                      <View style={{...styles.tableCol,flex: 2}}>
                        <Text
                          style={{
                            ...styles.tableCell,
                            textAlign: "center",
                            ...styles.boldText,
                          }}
                        >
                          Total
                        </Text>
                      </View>

                      {addOnSemesterHeaderList.length > 0 &&
                        addOnSemesterHeaderList.map((li, i) => (
                          <View key={i} style={styles.tableCol}>
                            <Text
                              style={{
                                ...styles.tableAmountCell,
                                ...styles.boldText,
                              }}
                            >
                              {" "}
                              {bonafideAddOnDetail[0]?.addOnAmountList?.reduce(
                                (sum, current) => {
                                  return sum + Number(current[li["value"]]);
                                },
                                0
                              )}
                            </Text>
                          </View>
                        ))}
                    </View>
                  </View>
                </View>
              )}
              {hostelFeeTemplateData.length > 0 && (
                <View style={{
                  width: "100%",
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop:"5px"}}>
                  <View style={styles.table}>
                    {hostelFeeTemplateData?.map(
                      (obj, index) => (
                        <View key={index} style={styles.tableRow}>
                          <View
                            style={{ ...styles.tableCol, flex: 3 }}
                          >
                            <Text style={{ ...styles.tableCell, textAlign: "left" }}>
                              {`Hostel Accommodation Per Annum - ${obj.template_name}`}
                            </Text>
                          </View>

                          <View
                            style={{ ...styles.tableCol, flex: 1 }}
                          >
                            <Text style={styles.tableCell}>
                              {`${obj.hostel_room_type_id} Occupancy`}
                            </Text>
                          </View>
                          <View
                            style={{ ...styles.tableCol, flex: 1 }}
                          >
                            <Text style={styles.tableAmountCell}>
                              <Image
                                src={rupeesSymbol}
                                alt="rupeesSymbolImage"
                                style={{ width: "10px", height: "10px" }}
                              />
                              {`${obj.total_amount}`}
                            </Text>
                          </View>
                        </View>
                      )
                    )}
                  </View>
                </View>
              )}
              {hostelFeeTemplateData.length > 0 && <View style={{ ...styles.feeDetailSection, marginTop: studentBonafideDetail?.length > 8 && bonafideAddOnDetail?.length > 0 ? "2px" : "5px" }}>
                <View style={styles.sectionDetailWidth}>
                  <Text style={{ ...styles.feeDetailText }}>
                    *Hostel fee mentioned is only for current year.
                  </Text>
                </View>
              </View>}
              <View style={{...styles.feeDetailSection, marginTop: studentBonafideDetail?.length > 8 && bonafideAddOnDetail?.length > 0 && hostelFeeTemplateData.length > 0 ? "2px" :
                  studentBonafideDetail?.length < 8 && bonafideAddOnDetail?.length > 0 && hostelFeeTemplateData.length ==0 ?  "10px" :
                  studentBonafideDetail?.length > 1 && bonafideAddOnDetail?.length == 0 && hostelFeeTemplateData.length ==0 ? "10": "2px" }}>
                <View style={styles.sectionDetailWidth}>
                  <Text style={{ ...styles.feeDetailText }}>
                    *please note that the given fee is applicable only for the
                    prescribed Academic Batch.This Bonafide is issued only for
                    the purpose of Bank loan.
                  </Text>
                </View>
              </View>

              <View style={styles.feeDetailSection}>
                <View style={styles.sectionDetailWidth}>
                  <Text
                    style={{
                      ...styles.feeDetailText,
                      fontWeight: "heavy",
                      fontFamily: "Times-Bold",
                      fontSize: "11px",
                      marginTop: "4px",
                    }}
                  >
                    Payment Instructions:
                  </Text>
                  <View
                    style={{
                      ...styles.feeDetailText,
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: "20px",
                    }}
                  >
                    <Image src={rightCursor} alt="rightCursorImage" style={{width:"15px",height:"15px"}}/>
                    <Text style={{ paddingLeft: "10px",paddingRight:"10px" }}>
                      Student can pay all fees through Acharya ERP APP.
                    </Text>
                  </View>

                  <View
                    style={{
                      ...styles.feeDetailText,
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: "20px",
                    }}
                  >
                    <Image src={rightCursor} alt="rightCursorImage" style={{width:"15px",height:"15px"}}/>
                    <Text style={{ paddingLeft: "10px",paddingRight:"10px" }}>
                      If student opts for Bank loan, DD can be drawn in favor
                      of {" "}“
                      <Text>{studentDetail?.school_name == "SMT NAGARATHNAMMA SCHOOL OF NURSING"?"SMT NAGARATHNAMMA COLLEGE OF NURSING": studentDetail?.school_name?.toUpperCase()}</Text>”
                      payable at Bangalore for college fee OR
                    </Text>
                  </View>

                  <View
                    style={{
                      ...styles.feeDetailText,
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: "20px",
                    }}
                  >
                    <Image src={rightCursor} alt="rightCursorImage" style={{width:"15px",height:"15px"}}/>
                    <Text style={{ paddingLeft: "10px" ,paddingRight:"10px"}}>
                      If bank prefers to make RTGS Transfer, bank can contact
                      Institution via e-mail{" "}
                      <Text>{studentDetail?.school_name == "SMT NAGARATHNAMMA SCHOOL OF NURSING" ? "principalanr@acharya.ac.in":`principal${(studentDetail?.school_name_short).toLowerCase()}@acharya.ac.in`}</Text>{" "}
                      for bank details.
                    </Text>
                  </View>

                  <View
                    style={{
                      ...styles.feeDetailText,
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: "20px",
                    }}
                  >
                    <Image src={rightCursor} alt="rightCursorImage" style={{width:"15px",height:"15px"}}/>
                    <Text style={{ paddingLeft: "10px",paddingRight:"10px" }}>
                      DD can be drawn in favour of  “Nini Skillup Pvt Ltd” for
                      Add-on Programme Fee.
                    </Text>
                  </View>

                  <View
                    style={{
                      ...styles.feeDetailText,
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: "20px",
                    }}
                  >
                    <Image src={rightCursor} alt="rightCursorImage" style={{width:"15px",height:"15px"}}/>
                    <Text style={{ paddingLeft: "10px" ,paddingRight:"10px"}}>
                    Uniform & Stationery to be paid through ERP APP only.
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.feeDetailSection}>
                <View style={styles.sectionDetailWidth}>
                  {studentDetail?.school_name_short?.toLowerCase() == "ait" &&
                   <Image
                    style={{ width: 100}}
                    src={sign(`./Facsimile_Principal.png`)}
                    alt="Facsimile_Principal"
                  />}
                  <Text
                    style={{
                      ...styles.feeDetailText,
                      ...styles.boldText,
                      marginTop: studentDetail?.school_name_short?.toLowerCase() == "ait" ? "0px" : "40px"
                    }}
                  >
                    PRINCIPAL
                  </Text>
                  <Text style={{ ...styles.feeDetailText, ...styles.boldText }}>
                    AUTHORIZED SIGNATORY
                  </Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                ...styles.feeDetailText,
                padding: "6px 0px",
                fontSize: "9px",
                textTransform: "capitalize",
                position: "absolute",
                right: 10,
                bottom: 10,
              }}
            >
              Prepared By - {studentBonafideDetail[0]?.created_username || "-"}
            </Text>
          </Page>
          )
        </Document>
      );
      const blob = await pdf(HallTicketCopy).toBlob();
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
};
