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
    padding: 0,
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
    marginTop: "20px",
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
  studentTableSection: {
    marginTop: "20px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  studentDetailText: {
    fontSize: 11,
    textAlign: "justify",
  },
  studentDetailTableSection: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  feeDetailSection: {
    marginTop: "40px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  feeDetailText: {
    fontSize: 11,
    textAlign: "justify",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColLabel: {
    display: "flex",
    flex: 3,
    padding: "8px",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
  },
  tableCol: {
    display: "flex",
    flex: 4,
    padding: "8px",
    wordWrap: "break-all",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
  },
  tableCellLabel: {
    fontSize: 10,
    textAlign: "left",
  },
  tableCell: {
    fontSize: 10,
    wordWrap: "break-word",
    textAlign: "left",
    paddingLeft: "6px",
  },
});
export const GeneratePassportBonafide = (
  studentBonafideDetail,
  studentDetail,
  letterHeadPrintOrNot,
  stdMisBonafideName
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const HallTicketCopy = (
        <Document title="">
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
              <View style={styles.sectionDetailWidth}>
                <Text style={styles.studentDetailText}>
                  This is to certify that the below mentioned student,{" "}
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
                  , enrolled at{" "}
                  <Text style={styles.boldText}>
                    {studentDetail?.school_name}
                  </Text>
                  , Bangalore affiliated to{" "}
                  <Text style={{...styles.boldText,textTransform:"uppercase"}}>
                    {studentBonafideDetail[0]?.ref_no}
                  </Text>
                  . {studentDetail?.candidate_sex == "Female" ? "She" : "He"} is
                  studying in{" "}
                  <Text
                    style={styles.boldText}
                  >{`${studentDetail?.current_year} year/${studentDetail?.current_sem} sem`}</Text>
                  ,{" "}
                  <Text style={styles.boldText}>
                    {studentDetail?.program_short_name?.toUpperCase() || "-"}-
                    {studentDetail?.program_specialization_name?.toUpperCase() ||
                      "-"}
                  </Text>
                  .
                </Text>
              </View>
            </View>
            <View style={styles.studentTableSection}>
              <View
                style={{
                  width: "90%",
                  borderRadius: "5px",
                  marginLeft: "15px",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: "10px",
                    padding: "8px",
                    backgroundColor: "lightgray",
                  }}
                >
                  Student Details
                </Text>
                <View style={styles.studentDetailTableSection}>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>AUID</Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                          }}
                        >
                          {studentDetail?.auid || "-"}
                        </Text>
                      </View>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>Student Name</Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                          }}
                        >
                          {studentDetail?.student_name?.toUpperCase() || "-"}
                        </Text>
                      </View>
                    </View>

                    {/* new */}

                    <View style={styles.tableRow}>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>USN</Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                          }}
                        >
                          {studentDetail?.usn || "-"}
                        </Text>
                      </View>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>Father Name</Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                          }}
                        >
                          {studentDetail?.father_name?.toUpperCase() || "-"}
                        </Text>
                      </View>
                    </View>

                    {/* new */}

                    <View style={styles.tableRow}>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>DOA</Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                          }}
                        >
                          {moment(studentDetail?.date_of_admission).format(
                            "DD-MM-YYYY"
                          ) || "-"}
                        </Text>
                      </View>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>Program</Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                          }}
                        >{`${studentDetail?.program_short_name?.toUpperCase()} - ${studentDetail?.program_specialization_short_name?.toUpperCase()}`}</Text>
                      </View>
                    </View>

                    {/* new */}

                    <View style={styles.tableRow}>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>
                          Current Year/Sem
                        </Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                          }}
                        >{`${studentDetail?.current_year}/${studentDetail?.current_sem}`}</Text>
                      </View>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>
                          Academic Batch
                        </Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                          }}
                        >
                          {studentDetail?.academic_batch || "-"}
                        </Text>
                      </View>
                    </View>

                    {/* new */}

                    <View style={styles.tableRow}>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>Nationality</Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                          }}
                        >
                          {studentDetail?.nationalityName?.toUpperCase() || "-"}
                        </Text>
                      </View>
                      <View style={styles.tableColLabel}>
                        <Text style={styles.tableCellLabel}>
                          Admission Category
                        </Text>
                      </View>

                      <View style={styles.tableCol}>
                        <Text
                          style={{
                            ...styles.tableCell,
                          }}
                        >{`${studentDetail?.fee_admission_category_short_name} - ${studentDetail?.fee_admission_sub_category_short_name}`}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.feeDetailSection}>
             <View style={{...styles.sectionDetailWidth,display:"flex",flexDirection:"row",gap:"6px"}}>
                <Text
                  style={{
                    fontSize: "12px",
                  }}
                >
                 This certificate is issued based on the request of the student for the purpose of
                </Text>
                <Text  
                 style={{
                    fontSize: "12px",
                    fontFamily:"Times-Bold"
                  }}>{stdMisBonafideName || studentBonafideDetail[0]?.bonafide_type}.</Text>
              </View>
            </View>
            <View style={styles.feeDetailSection}>
              <View style={styles.sectionDetailWidth}>
                {studentDetail?.school_name_short?.toLowerCase() == "ait" &&
                  <Image
                    style={{ width: 100 }}
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
