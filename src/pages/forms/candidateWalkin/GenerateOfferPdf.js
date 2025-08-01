import domainUrl from "../../../services/Constants";
import {
  Document,
  Image,
  Link,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import moment from "moment";
import sign from "../../../assets/vSignNew.jpg";
import seal from "../../../assets/offerseal2.jpg";

const styles = StyleSheet.create({
  pageLayout: {
    fontSize: 11,
    fontFamily: "Times-Roman",
  },
  image: { position: "absolute", width: "100%" },
  layout: { margin: "135px 45px 45px 45px" },
  subLayout: { margin: "45px" },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  margin: { marginTop: "14px" },
  subMargin: { marginTop: "9px" },
  subLeftMargin: { marginLeft: "16px" },
  paragraphMargin: { marginTop: "2px" },
  paragraph: { textAlign: "justify", lineHeight: 1.4 },
  policyParagraph: {
    textAlign: "justify",
    lineHeight: 1.4,
    fontSize: 10,
    fontFamily: "Times-Bold",
  },
  alignCenter: { alignItems: "center" },
  textLeft: { textAlign: "left" },
  textRight: { textAlign: "right" },
  textCenter: { textAlign: "center" },
  topBorder: {
    borderStyle: "solid",
    borderTopWidth: 1,
    borderColor: "#bfbfbf",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    paddingTop: "10px",
  },
  footerText: {
    color: "grey",
    fontSize: 14,
    textAlign: "center",
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
  },
  footerImage: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
  },
  heading: { fontSize: 14, fontFamily: "Times-Bold", textAlign: "center" },
  subHeading: { fontSize: 12, fontFamily: "Times-Bold" },
  boldParagraph: { fontSize: 11, fontFamily: "Times-Bold" },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
  },
  tableRow: {
    flexDirection: "row",
  },
  borderTable: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
  },
  marginBottom: { marginBottom: "10px" },
  link: { fontFamily: "Times-Bold", fontSize: 14, textDecoration: "none" },
  acceptText: {
    textAlign: "center",
    fontSize: 12,
    color: "grey",
    fontFamily: "Times-Bold",
    paddingLeft: 20,
    paddingRight: 20,
  },
});

const refundTable = [
  {
    firstValue: "Registration",
    secondValue: "Non-refundable Any time of notice",
  },
  {
    firstValue: "100% of Tuition fee",
    secondValue: "15 days or more before the commencement of classes",
  },
  {
    firstValue: "90% of Tuition fee",
    secondValue: "Less than 15 days before the commencement of classes",
  },
  {
    firstValue: "80% of Tuition fee",
    secondValue: "Less than 15 days after the commencement of classes",
  },
  {
    firstValue: "50% of Tuition fee",
    secondValue:
      "More than 15 days and less than 30 days after the commencement of classes",
  },
  {
    firstValue: "0%",
    secondValue: "More than 30 days after the commencement of classes",
  },
];

const acceptanceDetail = [
  { label: "Candidate Name", value: "candidateName" },
  { label: "DOB", value: "dateOfBirth" },
  { label: "Parent Name", value: "fatherName" },
  { label: "Application No", value: "application_no_npf" },
  { label: "Candidate ID", value: "candidateId" },
];

const bankDetails = [
  { label: "Bank Name", value: "YES BANK" },
  { label: "Account Name", value: "ACHARYA INST CMS A/C" },
  { label: "Account No", value: "002294600002503" },
  { label: "IFSC Code", value: "YESB0000022" },
  { label: "Swift Code", value: "YESBINBB" },
];

const feeTemplateHeads = ["campusFee", "registrationFee", "compositeFee"];

// const logos = require.context("../../../assets", true);

const logos = (org_type,school_name_short) => {
  try {
    if (!org_type || !school_name_short) {
      throw new Error("schoolShortName is not defined");
    }
    return require(`../../../assets/${org_type}${school_name_short}.jpg`);
  } catch (error) {
    console.error(
      "Image not found for schoolShortName:",
      school_name_short,
      "Error:",
      error.message
    );
     return require(`../../../assets/aisjmj.jpg`);
  }
};

export const GenerateOfferPdf = (data, feeTemplateData, noOfYears, remarks) => {
  const {
    permanentPincode: pincode,
    application_no_npf: applicationNo,
    candidateName,
    candidateEmail,
    program_short_name: programshortName,
    program_specialization_name: specialization,
    school_name: school,
    ac_year: acYear,
    fatherName,
    npf_status: npfStatus,
    candidateId,
    candidateSex: gender,
    presentCityName: cityName,
    presentStateName: stateName,
    presentCountryName: countryName,
    ip_address: ipAddress,
    offerAcceptedDate,
    laptop_status: laptopStatus,
    school_name_short: schoolShortName,
    org_type: orgType,
    fee_admission_category_id: admissionCategory,
    preAdmissionCreatedDate: preAdmissionCreatedDate,
  } = data;

  const { scholarShip, addOnFee, uniformFee, curreny } = feeTemplateData;
  const scholarShipAmount = scholarShip
    ? Object.values(scholarShip)
        ?.slice(1)
        ?.reduce((a, b) => a + b) > 0
    : false;
  const uniformFeeAmount = uniformFee
    ? Object.values(uniformFee)
        ?.slice(1)
        ?.reduce((a, b) => a + b) > 0
    : false;
  const addOnFeeAmount = addOnFee
    ? Object.values(addOnFee)
        ?.slice(1)
        ?.reduce((a, b) => a + b) > 0
    : false;

  const fullAddress = [stateName, pincode, countryName]
    .filter(Boolean)
    .join(", ");
  const program = `${programshortName} - ${specialization}`;
  const fullName =
    gender === "Male" ? `Mr. ${candidateName}` : `Ms. ${candidateName}`;

  const DisplayDate = () => (
    <View style={styles.row}>
      <View>
        <Text>Ref.No: {applicationNo}</Text>
      </View>
      <View style={styles.textRight}>
        <Text>{`Date: ${moment(preAdmissionCreatedDate).format(
          "DD-MM-YYYY"
        )}`}</Text>
      </View>
    </View>
  );

  const Address = () => (
    <View style={{ marginTop: "17px" }}>
      <View>
        <Text style={{ ...styles.bold, textTransform: "capitalize" }}>
          {fullName}
        </Text>
      </View>
      <View>
        <Text style={styles.paragraph}>
          {[cityName].filter(Boolean).join(", ")}
        </Text>
      </View>
      <View>
        <Text style={styles.paragraph}>{fullAddress}</Text>
      </View>
      <View>
        <Text>{candidateEmail}</Text>
      </View>
    </View>
  );

  const Subject = () => (
    <View style={styles.margin}>
      <View>
        <Text style={{ ...styles.bold, textTransform: "capitalize" }}>
          {`Dear ${fullName}`},
        </Text>
      </View>
      <View style={styles.subMargin}>
        <Text style={styles.paragraph}>
          Congratulations! We are delighted to inform you that you have been
          accepted into the <Text style={styles.bold}>{` ${program} `}</Text>
          Program at <Text style={styles.bold}>{` ${school}`}</Text> for the
          academic session <Text style={styles.bold}>{` ${acYear}`}.</Text>  We
          appreciate the effort you have put into your application, and we are
          excited to welcome you to our institution. Please note that this
          formal offer is subject to your fulfilment of the academic
          requirements set by the University and its constituent bodies. To
          confirm your place in the program, please accept this offer
          digitally by clicking the ‘Accept Now’ button in the attached
          Acceptance Letter.
        </Text>
      </View>
    </View>
  );

  const FeeCommitment = () => (
    <View style={styles.subMargin}>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Fee Commitment and Payment: </Text>By
        accepting this offer, you are committing to the payment of the
        prescribed fees as outlined below. We strongly recommend that you
        carefully review the terms and conditions associated with the payment
        process, as well as the rules and regulations of <Text>{school}</Text>.
        It is important to adhere to these to ensure a smooth start to your
        academic journey.
      </Text>
    </View>
  );

  const PaymentSchedule = () => (
    <View style={styles.subMargin}>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Text>Payment Schedule-</Text>
        <Text style={styles.bold}>1st Semester/Year Fees:</Text>
      </View>
      <View style={{ marginTop: "2px" }}>
        <Text style={{ ...styles.paragraph, ...styles.subLeftMargin }}>
          • &nbsp; &nbsp; Registration Fee: To be paid immediately upon
          acceptance of the Offer Letter.
        </Text>
        {/* <Text style={{ ...styles.paragraph, ...styles.subLeftMargin }}>
          • &nbsp; &nbsp; 50% of Total Fees: Must be settled within 3 working
          days from acceptance.
        </Text> */}
        <Text style={{ ...styles.paragraph, ...styles.subLeftMargin }}>
          • &nbsp; &nbsp; Remaining Balance: Must be settled within <Text style={styles.boldParagraph}> 3 working days from payment of the Registration Fee</Text>.
        </Text>
      </View>
    </View>
  );

  const FeeBreakDown = () => (
    <View style={{marginTop:"10px"}}>
      <View>
        <Text style={styles.bold}>Fee Breakdown:</Text>
      </View>
      <Text style={[styles.textRight, { fontSize: 9 }]}>
        (Amount in {curreny})
      </Text>
      <View style={styles.paragraphMargin}>{<FeeTemplate />}</View>
      <Text
        style={[
          styles.paragraphMargin,
          { textAlign: "justify", lineHeight: 1.4, fontSize: 9 },
        ]}
      >
        *The composite fee includes Tuition, University Registration,
        Eligibility Fee, Laboratory Fee, Library Fee, Sports Fee, and other
        miscellaneous fees specific to your program. The exact fee breakup may
        vary depending on the course. For more details, please reach out to your
        counsellor.
      </Text>
    </View>
  );

  const Note = () => (
    <View>
      <Text>Please Note:</Text>
      <View
        style={{
          ...styles.subMargin,
          ...styles.subLeftMargin,
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <Text width="15px">•</Text> &nbsp; &nbsp;{" "}
        <Text style={{ ...styles.paragraph }}>
          Late payment of fees will incur an additional late fee.
        </Text>
      </View>

      <View
        style={{
          ...styles.subLeftMargin,
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <Text width="15px">•</Text> &nbsp; &nbsp;{" "}
        <Text style={{ ...styles.paragraph }}>
          Registration fees must be paid only through the payment link provided
          in the Acceptance Letter.
        </Text>
      </View>

      <View
        style={{
          ...styles.subLeftMargin,
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <Text width="15px">•</Text> &nbsp; &nbsp;{" "}
        <Text style={{ ...styles.paragraph }}>
          Remaining fees should be paid via the ERP Portal / ACERP App. Cash
          payments are not accepted.
        </Text>
      </View>

      <View
        style={{
          ...styles.subLeftMargin,
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <Text width="15px">•</Text> &nbsp; &nbsp;{" "}
        <Text style={{ ...styles.paragraph }}>
          Students will be responsible for paying any exam and convocation fees
          as specified by the University or Board.
        </Text>
      </View>
    </View>
  );

  const AdmissionConfirmation = () => (
    <View style={styles.margin}>
      <Text style={styles.bold}>Admission Confirmation:</Text>
      <View style={styles.subMargin}>
        <Text style={{ ...styles.paragraph }}>
          Your Admission ID will be generated after successful payment of the
          registration fee. Once generated, a Provisional Admission Letter will
          be sent to you, along with your official Acharya email ID & ERP login
          credentials. Please note that your email & ERP account will be
          deactivated upon completion of your program.
        </Text>
      </View>
    </View>
  );

  const Important = () => (
    <View style={styles.margin}>
      <Text style={styles.bold}>Important:</Text>
      <View
        style={{
          ...styles.subMargin,
          ...styles.subLeftMargin,
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <Text width="15px">•</Text> &nbsp; &nbsp;{" "}
        <Text style={{ ...styles.paragraph }}>
        The Institution reserves the right to withdraw the offer or cancel the provisional admission, if the candidate fails to submit all requisite document and / or fail to pay prescribed fee within the stipulated time and / or fail to report to classes on the date of class commencement; The withdrawal cancellation shall be done without prior information.
        </Text>
      </View>
      <View
        style={{
          ...styles.subMargin,
          ...styles.subLeftMargin,
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <Text width="15px">•</Text> &nbsp; &nbsp;{" "}
        <Text style={{ ...styles.paragraph }}>
          Admission is subject to the submission and verification of original
          documents and approval by the respective Board/University.
        </Text>
      </View>
      <View
        style={{
          ...styles.subMargin,
          ...styles.subLeftMargin,
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <Text width="15px">•</Text> &nbsp; &nbsp;{" "}
        <Text style={{ ...styles.paragraph }}>
          To complete the enrolment process, please submit your original
          documents (including mark sheets of the relevant academic years) and
          two sets of photocopies to the Admissions Office prior to the
          commencement of classes.
        </Text>
      </View>
      <View
        style={{
          ...styles.subMargin,
          ...styles.subLeftMargin,
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <Text width="15px">•</Text> &nbsp; &nbsp;{" "}
        <Text style={{ ...styles.paragraph }}>
          Failure to submit the required documents within the stipulated
          timeframe may result in the cancellation of your admission.
        </Text>
      </View>
      {!!laptopStatus && (
        <View
          style={{
            ...styles.subMargin,
            ...styles.subLeftMargin,
            display: "flex",
            flexDirection: "row",
            gap: "10px",
          }}
        >
          <Text width="15px">•</Text> &nbsp; &nbsp;{" "}
          <Text style={{ ...styles.paragraph }}>
            A complimentary laptop will be issued, subject to program
            eligibility. The usage of this laptop is mandatory for both
            theoretical and practical sessions. The laptop cannot be returned.
            In case of admission cancellation post-laptop issuance, a penalty of
            INR 50,000/- will be applicable.
          </Text>
        </View>
      )}
      <View
        style={{
          ...styles.subMargin,
          ...styles.subLeftMargin,
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <Text width="15px">•</Text> &nbsp; &nbsp;{" "}
        <Text style={{ ...styles.paragraph }}>
          University examination fees are not included and must be paid each
          semester or year as applicable.
        </Text>
      </View>
      <View
        style={{
          ...styles.subMargin,
          ...styles.subLeftMargin,
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <Text width="15px">•</Text> &nbsp; &nbsp;{" "}
        <Text style={{ ...styles.paragraph }}>
          If you encounter any challenges or need an extension for document
          submission, please contact the Admissions Office as soon as possible
          at admissions@acharya.ac.in
        </Text>
      </View>
      <View
        style={{
          ...styles.subMargin,
          ...styles.subLeftMargin,
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <Text width="15px">•</Text> &nbsp; &nbsp;{" "}
        <Text style={{ ...styles.paragraph }}>
          Please be aware that failure to complete the admission formalities or
          payment as required may result in the withdrawal of your provisional
          admission.
        </Text>
      </View>
      {remarks.length > 0 &&
        remarks.map((li, index) => (
          <View
            key={index + 1}
            style={{
              ...styles.subMargin,
              ...styles.subLeftMargin,
              display: "flex",
              flexDirection: "row",
              gap: "10px",
            }}
          >
            <Text width="15px">•</Text> &nbsp; &nbsp;{" "}
            <Text style={{ ...styles.paragraph }}>{li}</Text>
          </View>
        ))}
    </View>
  );

  const FirstPage = () => (
    <View>
      <DisplayDate />
      <Address />
      <Subject />
      <FeeCommitment />
      <PaymentSchedule />
      <FeeBreakDown />
    </View>
  );

  const PageData = () => (
    <View style={{ ...styles.pageLayout }}>
      <Image
        style={styles.image}
        src={logos(orgType.toLowerCase(),schoolShortName.toLowerCase())}
      />
      <View style={styles.layout}>
        <FirstPage />
      </View>
    </View>
  );

  const DispayRow = ({ children }) => (
    <View style={styles.tableRow}>{children}</View>
  );

  const DisplayCells = ({
    label,
    value,
    style,
    right,
    bottom,
    align,
    customWidth = 1,
  }) => (
    <View
      style={{
        flex: value === "SINo" ? 0.2 : customWidth,
        borderStyle: "solid",
        borderRightWidth: right,
        borderBottomWidth: bottom,
        borderColor: "black",
        outline: "none",
        padding: "3px",
        fontSize: 10,
        marginRight: right === 0 ? 1 : 0,
      }}
    >
      <Text style={{ fontFamily: style, textAlign: align }}>{label}</Text>
    </View>
  );

  const DisplayTableheader = () => (
    <DispayRow>
      <DisplayCells
        label="Sl No"
        value="SINo"
        style="Times-Bold"
        right={1}
        bottom={1}
        align="center"
      />
      <DisplayCells
        label="Fee Type & Percentage of Refund"
        value="Fee_Type_Percentage_of_Refund"
        style="Times-Bold"
        right={1}
        bottom={1}
        align="center"
      />
      <DisplayCells
        label="Point of notice"
        value="Point_of_notice"
        style="Times-Bold"
        right={0}
        bottom={1}
        align="center"
      />
    </DispayRow>
  );

  const RefundData = () => (
    <View style={[styles.borderTable]}>
      <DisplayTableheader />
      {refundTable.map((obj, i) => (
        <DispayRow key={i}>
          <DisplayCells
            label={i + 1}
            value="SINo"
            style="Times-Roman"
            right={1}
            bottom={i !== 5 ? 1 : 0}
            align="center"
          />
          <DisplayCells
            label={obj.firstValue}
            value="Fee_Type_Percentage_of_Refund"
            style="Times-Roman"
            right={1}
            bottom={i !== 5 ? 1 : 0}
            align="justify"
          />

          <DisplayCells
            label={obj.secondValue}
            value="Point_of_notice"
            style="Times-Roman"
            right={0}
            bottom={i !== 5 ? 1 : 0}
            align="justify"
          />
        </DispayRow>
      ))}
    </View>
  );

  const Contact = () => (
    <View style={styles.margin}>
      <Text style={styles.subHeading}>Contact Us:</Text>
      <View style={styles.paragraphMargin}>
        <Text style={styles.paragraph}>
          For further clarifications or assistance regarding your admission
          process, please feel free to contact us at: Phone: +91 74066 44449 /
          +9172040 36555 Email: admissions@acharya.ac.in.
        </Text>
      </View>
      <Text style={styles.paragraph}>
        For International Admissions Contact +91 97317-79233 Email:
        international@acharya.ac.in.
      </Text>
      <View style={{ marginTop: "30px" }}>
        <Text style={[styles.paragraph, styles.marginBottom]}>
          We look forward to welcoming you to <Text>{school}</Text> and wish you
          every success in your academic endeavours.
        </Text>
      </View>
    </View>
  );

  const SignatureSection = () => (
    <View>
      <View
        style={{
          ...styles.alignCenter,
          marginTop: "20px",
          display: "flex",
          flexDirection: "row",
          gap: "20px",
        }}
      >
        <Image src={sign} style={{ width: "120px" }} />
        <Image src={seal} style={{ width: "80px" }} />
      </View>
      <View>
        <Text style={styles.bold}>Director of Admissions</Text>
        <Text style={{ fontSize: 9, fontFamily: "Times-Bold" }}>{school}</Text>
      </View>
    </View>
  );

  const Disclaimer = () => (
    <View style={{ marginTop: "40px", ...styles.topBorder }}>
      <Text>Disclaimer:</Text>
      <Text style={{ ...styles.paragraph }}>
        The terms and conditions mentioned in this offer are subject to change.
        All fees, including registration, tuition, and other charges, are
        non-refundable except as outlined in the refund policy. Admission will
        be finalized only upon submission of original documents and payment of
        fees as per the schedule.
      </Text>
    </View>
  );

  const CancelPolicy = () => (
    <View style={{ marginTop: "20px" }}>
      <Text style={styles.subHeading}>Cancellation and Refund Policy:</Text>
      <View style={styles.paragraphMargin}>
        <Text style={styles.paragraph}>
          If you decide to cancel your admission, a written request must be
          submitted to the Director of Admissions, stating the reason for
          cancellation, along with supporting documentary proof.
        </Text>
      </View>

      <View style={styles.paragraphMargin}>
        <Text style={[styles.policyParagraph, styles.marginBottom]}>
          Any claims shall be raised as per the UGC Latest Regulations,
          Jurisdiction Bangalore.
        </Text>
      </View>
      <RefundData />
    </View>
  );

  const FeeTemplate = () => (
    <>
      <View style={[styles.borderTable]}>
        <DispayRow>
          <DisplayCells
            label="Particulars"
            style="Times-Bold"
            right={1}
            bottom={1}
            align="center"
            customWidth={2}
          />
          {noOfYears?.map((obj, i) => (
            <DisplayCells
              key={i}
              label={obj.value}
              style="Times-Bold"
              right={i === noOfYears.length - 1 ? 0 : 1}
              bottom={1}
              align="center"
            />
          ))}
        </DispayRow>

        {feeTemplateHeads.map(
          (obj, i) =>
            Object.values(feeTemplateData[obj])
              ?.slice(1)
              ?.reduce((a, b) => a + b) > 0 && (
              <DispayRow key={i}>
                <DisplayCells
                  label={
                    obj === "compositeFee"
                      ? `${feeTemplateData[obj]?.feeType}*`
                      : feeTemplateData[obj]?.feeType
                  }
                  style="Times-Roman"
                  right={1}
                  bottom={1}
                  align="left"
                  customWidth={2}
                />
                {noOfYears?.map((yearSem, j) => (
                  <DisplayCells
                    key={j}
                    label={feeTemplateData?.[obj]?.[`year${yearSem.key}`]}
                    style="Times-Roman"
                    right={j === noOfYears.length - 1 ? 0 : 1}
                    bottom={1}
                    align="right"
                  />
                ))}
              </DispayRow>
            )
        )}

        <DispayRow>
          <DisplayCells
            label="Total"
            style="Times-Bold"
            right={1}
            bottom={
              (curreny === "INR" && uniformFeeAmount) || scholarShipAmount
                ? 1
                : 0
            }
            align="center"
            customWidth={2}
          />
          {noOfYears?.map((obj, i) => (
            <DisplayCells
              key={i}
              label={feeTemplateData[`sem${obj.key}Total`]}
              style="Times-Bold"
              right={i === noOfYears.length - 1 ? 0 : 1}
              bottom={
                (curreny === "INR" && uniformFeeAmount) || scholarShipAmount
                  ? 1
                  : 0
              }
              align="right"
            />
          ))}
        </DispayRow>

        {scholarShipAmount && (
          <DispayRow>
            <DisplayCells
              label={feeTemplateData["scholarShip"]?.feeType}
              style="Times-Roman"
              right={1}
              bottom={1}
              align="left"
              customWidth={2}
            />
            {noOfYears?.map((yearSem, j) => (
              <DisplayCells
                key={j}
                label={feeTemplateData["scholarShip"][`year${yearSem.key}`]}
                style="Times-Roman"
                right={j === noOfYears.length - 1 ? 0 : 1}
                bottom={1}
                align="right"
              />
            ))}
          </DispayRow>
        )}

        {curreny === "INR" && uniformFeeAmount && scholarShipAmount && (
          <DispayRow>
            <DisplayCells
              label="Total"
              style="Times-Bold"
              right={1}
              bottom={1}
              align="center"
              customWidth={2}
            />
            {noOfYears?.map((yearSem, j) => (
              <DisplayCells
                key={j}
                label={feeTemplateData[`sem${yearSem.key}GrantTotal`]}
                style="Times-Bold"
                right={j === noOfYears.length - 1 ? 0 : 1}
                bottom={1}
                align="right"
              />
            ))}
          </DispayRow>
        )}

        {curreny === "INR" && uniformFeeAmount && (
          <DispayRow>
            <DisplayCells
              label={feeTemplateData["uniformFee"]?.feeType}
              style="Times-Roman"
              right={1}
              bottom={1}
              align="left"
              customWidth={2}
            />
            {noOfYears?.map((yearSem, j) => (
              <DisplayCells
                key={j}
                label={feeTemplateData["uniformFee"][`year${yearSem.key}`]}
                style="Times-Roman"
                right={j === noOfYears.length - 1 ? 0 : 1}
                bottom={1}
                align="right"
              />
            ))}
          </DispayRow>
        )}

        {((curreny === "INR" && (uniformFeeAmount || scholarShipAmount)) ||
          (curreny === "USD" && scholarShipAmount)) && (
          <DispayRow>
            <DisplayCells
              label="Grand Total"
              style="Times-Bold"
              right={1}
              bottom={0}
              align="center"
              customWidth={2}
            />
            {noOfYears?.map((obj, i) => (
              <DisplayCells
                key={i}
                label={
                  curreny === "INR"
                    ? feeTemplateData[`sem${obj.key}FinalGrantTotal`]
                    : feeTemplateData[`sem${obj.key}GrantTotal`]
                }
                style="Times-Bold"
                right={i === noOfYears.length - 1 ? 0 : 1}
                bottom={0}
                align="right"
              />
            ))}
          </DispayRow>
        )}
      </View>

      {curreny === "USD" && (
        <>
          {addOnFeeAmount && (
            <>
              <View style={styles.paragraphMargin}>
                <Text style={[styles.textRight, { fontSize: 9 }]}>
                  (Amount in INR)
                </Text>
              </View>

              <View style={styles.paragraphMargin}>
                <View style={[styles.borderTable]}>
                  <DispayRow>
                    <DisplayCells
                      label="Particulars"
                      style="Times-Bold"
                      right={1}
                      bottom={1}
                      align="center"
                      customWidth={2}
                    />
                    {noOfYears?.map((obj, i) => (
                      <DisplayCells
                        key={i}
                        label={obj.value}
                        style="Times-Bold"
                        right={i === noOfYears.length - 1 ? 0 : 1}
                        bottom={1}
                        align="center"
                      />
                    ))}
                  </DispayRow>
                  <DispayRow>
                    <DisplayCells
                      label={addOnFee?.feeType}
                      style="Times-Roman"
                      right={1}
                      bottom={0}
                      align="left"
                      customWidth={2}
                    />
                    {noOfYears?.map((obj, i) => (
                      <DisplayCells
                        key={i}
                        label={addOnFee?.[`year${obj.key}`]}
                        style="Times-Roman"
                        right={i === noOfYears.length - 1 ? 0 : 1}
                        bottom={0}
                        align="right"
                      />
                    ))}
                  </DispayRow>
                </View>
              </View>
            </>
          )}

          {uniformFeeAmount && (
            <>
              <View style={styles.paragraphMargin}>
                <Text style={[styles.textRight, { fontSize: 9 }]}>
                  (Amount in INR)
                </Text>
              </View>

              <View style={styles.paragraphMargin}>
                <View style={[styles.borderTable]}>
                  <DispayRow>
                    <DisplayCells
                      label="Particulars"
                      style="Times-Bold"
                      right={1}
                      bottom={1}
                      align="center"
                      customWidth={2}
                    />
                    {noOfYears?.map((obj, i) => (
                      <DisplayCells
                        key={i}
                        label={obj.value}
                        style="Times-Bold"
                        right={i === noOfYears.length - 1 ? 0 : 1}
                        bottom={1}
                        align="center"
                      />
                    ))}
                  </DispayRow>
                  <DispayRow>
                    <DisplayCells
                      label={uniformFee?.feeType}
                      style="Times-Roman"
                      right={1}
                      bottom={0}
                      align="left"
                      customWidth={2}
                    />
                    {noOfYears?.map((obj, i) => (
                      <DisplayCells
                        key={i}
                        label={uniformFee?.[`year${obj.key}`]}
                        style="Times-Roman"
                        right={i === noOfYears.length - 1 ? 0 : 1}
                        bottom={0}
                        align="right"
                      />
                    ))}
                  </DispayRow>
                </View>
              </View>
            </>
          )}
        </>
      )}
    </>
  );

  const SecondPage = () => (
    <View>
      <Note />
      <AdmissionConfirmation />
      <Important />
    </View>
  );

  const SecondPageData = () => (
    <View style={styles.pageLayout}>
      <Image
        style={styles.image}
        src={logos(orgType.toLowerCase(),schoolShortName.toLowerCase())}
      />
      <View style={styles.layout}>
        <SecondPage />
      </View>
    </View>
  );

  const CancelPageData = () => (
    <View style={styles.pageLayout}>
      <Image
        style={styles.image}
        src={logos(orgType.toLowerCase(),schoolShortName.toLowerCase())}
      />
      <View style={styles.layout}>
        <CancelPolicy />
        <Contact />
        <SignatureSection />
        <Disclaimer />
      </View>
    </View>
  );

  const AcceptancePageData = () => (
    <View style={styles.pageLayout}>
      <Image
        style={styles.image}
        src={logos(orgType.toLowerCase(),schoolShortName.toLowerCase())}
      />
      <View style={styles.layout}>
        <AcceptanceData />
      </View>
    </View>
  );

  const displayName = (index, value) => {
    if (index === 0)
      return gender === "Male" ? `Mr.${data[value]}` : `Ms.${data[value]}`;
    if (index === 2) return `Mr.${data[value]}`;
    return data[value];
  };

  const Accept = () => (
    <View>
      <Text style={styles.heading}>Annexure 1 - Letter of Acceptance</Text>
      <View style={{ marginTop: "20px" }}>
        <Text style={{ ...styles.bold, textAlign: "right" }}>{`Date: ${moment(
          preAdmissionCreatedDate
        ).format("DD-MM-YYYY")}`}</Text>
      </View>
      <View style={{ marginTop: "20px" }}>
        <Text>To,</Text>
        <Text style={styles.bold}>Director Admissions</Text>
        <Text>Acharya Institutes</Text>
        <Text>Soldevanahalli, Bengaluru</Text>
        <Text>Karnataka, India</Text>
      </View>

      <View
        style={{
          ...styles.margin,
          display: "flex",
          flexDirection: "row",
          gap: "5px",
        }}
      >
        <Text style={styles.bold}>Subject : </Text>
        <Text style={{ ...styles.paragraph, width: "90%" }}>
          Acceptance of Offer for Admission to{" "}
          <Text style={styles.bold}>{program}</Text> Program at{" "}
          <Text style={styles.bold}>{school}</Text>
        </Text>
      </View>

      <View style={styles.margin}>
        <Text>Dear Sir,</Text>
        <Text style={{ ...styles.paragraph, marginTop: "10px" }}>
          I,{" "}
          <Text style={{ ...styles.bold, textTransform: "capitalize" }}>
            {fullName}
          </Text>
          , son/daughter of {`Mr.${fatherName}`}, have carefully reviewed the
          Offer Letter and the accompanying Terms and Conditions for admission
          to the {program} at <Text>{school}</Text> for the Academic Year{" "}
          {acYear}.
        </Text>
      </View>

      <View style={styles.paragraphMargin}>
        <Text style={styles.paragraph}>
          By digitally accepting this offer, I confirm the following:
        </Text>
      </View>

      <View style={styles.paragraphMargin}>
        <View
          style={{
            ...styles.subLeftMargin,
            display: "flex",
            flexDirection: "row",
            gap: "10px",
          }}
        >
          <Text width="15px">1</Text> &nbsp; &nbsp;{" "}
          <Text style={{ ...styles.paragraph }}>
            I have understood all the details outlined in the Offer Letter and
            the attached Terms and Conditions.
          </Text>
        </View>

        <View
          style={{
            ...styles.subLeftMargin,
            display: "flex",
            flexDirection: "row",
            gap: "10px",
          }}
        >
          <Text width="15px">2</Text> &nbsp; &nbsp;{" "}
          <Text style={{ ...styles.paragraph }}>
            I willingly commit to paying the prescribed fees as specified in the
            Offer Letter.
          </Text>
        </View>

        <View
          style={{
            ...styles.subLeftMargin,
            display: "flex",
            flexDirection: "row",
            gap: "10px",
          }}
        >
          <Text width="15px">3</Text> &nbsp; &nbsp;{" "}
          <Text style={{ ...styles.paragraph }}>
            I agree to comply with the rules, regulations, and terms set forth
            by <Text>{school}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.paragraphMargin}>
        <Text style={styles.paragraph}>
          I hereby formally accept the offer for admission to the {program} for
          the Academic Year {acYear}, acknowledging that I am bound by all the
          terms and conditions.
        </Text>
      </View>

      {npfStatus === 3 && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.margin}>
            <Text style={styles.bold}>Digital Acceptance Details</Text>
            <View style={styles.subMargin}>
              <Text style={styles.paragraph}>
                Date & Time:{moment(offerAcceptedDate).format("DD-MM-YYYY LT")}
              </Text>
              <Text style={styles.paragraph}>{`IP Address: ${ipAddress}`}</Text>
            </View>

            <View style={styles.subMargin}>
              <Link
                src={`${domainUrl}registration-payment/${candidateId}`}
                style={styles.link}
              >
                Pay Now
              </Link>
            </View>
          </View>

          {admissionCategory === 2 && npfStatus === 3 && (
            <View style={{ width: "50%", marginTop: "10px" }}>
              <Text
                style={[styles.subHeading, { textDecoration: "underline" }]}
              >
                Bank Details For Payment Transfer
              </Text>
              <View
                style={{
                  ...styles.borderTable,
                  ...styles.marginBottom,
                  marginTop: "5px",
                }}
              >
                {bankDetails?.map((obj, i) => (
                  <DispayRow key={i}>
                    <DisplayCells
                      label={obj.label}
                      style="Times-Bold"
                      right={1}
                      bottom={i === 4 ? 0 : 1}
                      align="left"
                    />
                    <DisplayCells
                      label={obj.value}
                      style="Times-Roman"
                      right={0}
                      bottom={i === 4 ? 0 : 1}
                      align="left"
                    />
                  </DispayRow>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {npfStatus !== 3 && (
        <View
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Text style={styles.bold}>Acceptance:</Text>
          <Text>
            <Link
              src={`${domainUrl}offer-acceptance/${candidateId}`}
              style={styles.link}
            >
              Accept Offer
            </Link>
          </Text>
        </View>
      )}

      <View style={{ marginTop: "20px" }}>
        <Text>Student Signature:</Text>
        <Text style={{ textTransform: "capitalize" }}>{fullName}</Text>
        <Text>{`Date: ${moment().format("DD-MM-YYYY")}`}</Text>
      </View>

      <View style={{ marginTop: "20px", ...styles.topBorder }}>
        <Text>Disclaimer:</Text>
        <Text style={{ ...styles.paragraph }}>
          This Letter of Acceptance is a legally binding document. Any breach of
          the terms and conditions may result in the withdrawal of admission.
        </Text>
      </View>
    </View>
  );

  const AcceptanceData = () => (
    <View>
      <Accept />
    </View>
  );

  return new Promise(async (resolve, reject) => {
    try {
      const generateDocument = (
        <Document title="Offer Letter">
          <Page
            size="A4"
            style={{ ...styles.pageLayout, position: "relative" }}
          >
            <PageData />
            <View
              style={{
                position: "absolute",
                bottom: 15,
                right: 0,
                left: 0,
                textAlign: "center",
              }}
            >
              <Text>1 of 3</Text>
            </View>
          </Page>
          <Page
            size="A4"
            style={{ ...styles.pageLayout, position: "relative" }}
          >
            <SecondPageData />
            <View
              style={{
                position: "absolute",
                bottom: 15,
                right: 0,
                left: 0,
                textAlign: "center",
              }}
            >
              <Text>2 of 3</Text>
            </View>
          </Page>
          <Page
            size="A4"
            style={{ ...styles.pageLayout, position: "relative" }}
          >
            <CancelPageData />
            <View
              style={{
                position: "absolute",
                bottom: 15,
                right: 0,
                left: 0,
                textAlign: "center",
              }}
            >
              <Text>3 of 3</Text>
            </View>
          </Page>
          <Page
            size="A4"
            style={{ ...styles.pageLayout, position: "relative" }}
          >
            <AcceptancePageData />
          </Page>
        </Document>
      );
      const blob = await pdf(generateDocument).toBlob();
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
};