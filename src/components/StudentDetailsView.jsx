import { useState, useEffect } from "react";
import axios from "../services/Api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Grid,
  Tabs,
  Tab,
  Card,
  CardHeader,
  IconButton,
  CardContent,
  Typography,
  Button,
  styled,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import SchoolIcon from "@mui/icons-material/School";
import StudentDetailsViewAcademics from "./StudentDetailsViewAcademics";
import useAlert from "../hooks/useAlert";
import StudentDetailsViewAccounts from "./StudentDetailsViewAccounts";
import StudentDetailsViewAdmissions from "./StudentDetailsViewAdmissions";
import StudentDetailsViewProctorial from "./StudentDetailsViewProctorial";
import StudentDetailsViewDocuments from "./StudentDetailsViewDocuments";
import { useLocation, useParams } from "react-router-dom";
import CustomDatePicker from "./Inputs/CustomDatePicker";
import CustomTextField from "./Inputs/CustomTextField";
import moment from "moment";
import CandidateFollowUpNote from "../pages/indeces/CandidateFollowUpNote";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { checkFullAccess } from "../utils/DateTimeUtils";
import StudentLibraryDetailsView from "./StudentLibraryDetailsView";
import CustomRadioButtons from "./Inputs/CustomRadioButtons";
import CustomAutocomplete from "./Inputs/CustomAutocomplete";
import AddressForm from "./AddressForm";
import AcademicForm from "./AcademicForm";

const CustomTabsHorizontal = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    flexDirection: "row",
  },
});

const CustomTabHorizontal = styled(Tab)(({ theme }) => ({
  height: "55px",
  fontSize: "14px",
  flex: 1,
  transition: "background-color 0.3s",
  backgroundColor: "rgba(74, 87, 169, 0.1)",
  color: "#46464E",
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  "&:hover": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
  },
}));

const CustomTabs = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    flexDirection: "column",
  },
});

const CustomTab = styled(Tab)(({ theme }) => ({
  fontSize: "14px",
  transition: "background-color 0.3s",
  backgroundColor: "rgba(74, 87, 169, 0.1)",
  color: "#46464E",
  "&.Mui-selected": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
    color: "orange",
  },
  "&:hover": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
  },
  [theme.breakpoints.up("xs")]: {
    fontSize: "11px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "12px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "14px",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "14px",
  },
}));

const initialValues = {
  followRemarks: "",
  followDate: null,
  lead_status: "Untouched",
  counselor_name: null,
  counselor_id: null,
};

const editStudentValues = {
  studentName: "",
  dob: null,
  gender: "",
  mobile: "",
  alternateMobile: "",
  whatsAppNo: "",
  studentEmail: "",
  religion: "",
  casteCategory: "",
  bloodGroup: "",
  nationality: "",
  bankName: "",
  accountHolderName: "",
  accountNumber: "",
  bankBranch: "",
  ifscCode: "",
  aadharNo: "",

  fatherName: "",
  fatherMobile: "",
  fatherEmail: "",
  fatherOccupation: "",
  fatherQualification: "",
  fatherIncome: "",

  motherName: "",
  motherMobile: "",
  motherEmail: "",
  motherOccupation: "",
  motherQualification: "",
  motherIncome: "",

  guardianName: "",
  guardianMobile: "",
  guardianEmail: "",
  guardianOccupation: "",
  guardianQualification: "",
  guardianIncome: "",
};

const addressInitialValues = {
  permanentAddress: "",
  permanentAddressTwo: "",
  permanentCountry: "",
  permanantState: "",
  permanantCity: "",
  permanentPincode: "",
  currentAddress: "",
  currentAddressTwo: "",
  currentCountry: "",
  currentState: "",
  currentCity: "",
  currentPincode: "",
  localAddress: "",
  localAddressTwo: "",
  localCountry: "",
  localState: "",
  localCity: "",
  localPincode: "",
};

const requiredFields = ["followRemarks"];

const academicInitialValues = [
  {
    qualification: "SSLC",
    university: "",
    collegeName: "",
    passingYear: "",
    maxMarks: "",
    scoredMarks: "",
    percentage: "",
    disabled: true,
  },
  {
    qualification: "PUC",
    university: "",
    collegeName: "",
    passingYear: "",
    maxMarks: "",
    scoredMarks: "",
    percentage: "",
    disabled: true,
  },
  {
    qualification: "UG",
    university: "",
    collegeName: "",
    passingYear: "",
    maxMarks: "",
    scoredMarks: "",
    percentage: "",
    disabled: true,
  },
  {
    qualification: "PG",
    university: "",
    collegeName: "",
    passingYear: "",
    maxMarks: "",
    scoredMarks: "",
    percentage: "",
    disabled: true,
  },
];

const optionalInitialValues = {
  optionalSubject: null,
  optionalMaxMarks: "",
  optionalScoredMarks: "",
  optionalPercentage: "",
  isEntranceExam: "",
  entranceExamName: "",
  rank: "",
  area: "",
};

function StudentDetailsView() {
  const [tab, setTab] = useState("Registration");
  const [subTab, setSubTab] = useState("Applicant");
  const [Image, setImage] = useState(null);
  const [followUpdata, setFollowUpData] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [applicantData, setApplicantData] = useState([]);
  const [courseData, setcourseData] = useState([]);
  const [transcriptData, settranscriptData] = useState([]);
  const [reportingData, setreportingData] = useState([]);
  const [registrationData, setRegistrationData] = useState([]);
  const [candidateProfilePhoto, setCandidateProfilePhoto] = useState();
  const [refreshData, setRefreshData] = useState(false);
  const [editStudentDetails, setEditStudentDetails] =
    useState(editStudentValues);
  const [country, setCountry] = useState([]);
  const [permanantStates, setPermanantStates] = useState([]);
  const [permanantCities, setPermanantCities] = useState([]);
  const [currentStates, setCurrentStates] = useState([]);
  const [currentCities, setCurrentCities] = useState([]);
  const [nationality, setNationality] = useState([]);
  const [addressValues, setAddressValues] = useState(addressInitialValues);
  const [optionalValues, setOptionalValues] = useState(optionalInitialValues);
  const [academicValues, setAcademicValues] = useState(academicInitialValues);

  const { auid, id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const state = location?.state?.state;
  const pathFrom = location?.state?.from;

  const Id = id || sessionStorage.getItem("empId");

  const userType = sessionStorage.getItem("usertype");

  const checks = {
    followRemarks: [
      values.followRemarks !== "",
      /^.{1,250}$/.test(values.followRemarks),
    ],

    mobile: [/^[0-9]{10}$/.test(editStudentDetails.mobile)],
    whatsAppNo: [/^[0-9]{10}$/.test(editStudentDetails.whatsAppNo)],
    alternateMobile: [/^[0-9]{10}$/.test(editStudentDetails.alternateMobile)],
    fatherMobile: [/^[0-9]{10}$/.test(editStudentDetails.fatherMobile)],
    motherMobile: [/^[0-9]{10}$/.test(editStudentDetails.motherMobile)],
    guardianMobile: [/^[0-9]{10}$/.test(editStudentDetails.guardianMobile)],

    studentEmail: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        editStudentDetails.studentEmail
      ),
    ],
    fatherEmail: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        editStudentDetails.fatherEmail
      ),
    ],
    motherEmail: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        editStudentDetails.motherEmail
      ),
    ],
    guardianEmail: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        editStudentDetails.guardianEmail
      ),
    ],
  };

  const addressChecks = {
    permanentAddress: [addressValues.permanentAddress !== ""],
    permanentPincode: [addressValues.permanentPincode !== ""],
    currentAddress: [addressValues.currentAddress !== ""],
    currentPincode: [addressValues.currentPincode !== ""],
    localAddress: [addressValues.localAddress !== ""],
    localPincode: [addressValues.localPincode !== ""],
  };

  const addressErrorMessages = {
    permanentAddress: ["This field is required"],
    permanentPincode: ["This field is required"],
    currentAddress: ["This field is required"],
    currentPincode: ["This field is required"],
    localAddress: ["This field is required"],
    studelocalPincodentName: ["This field is required"],
  };

  const errorMessages = {
    mobile: ["Invalid Mobile"],
    whatsAppNo: ["Invalid Mobile"],
    alternateMobile: ["Invalid Mobile"],
    fatherMobile: ["Invalid Mobile"],
    motherMobile: ["Invalid Mobile"],
    guardianMobile: ["Invalid Mobile"],
    studentEmail: ["Invalid Email"],
    fatherEmail: ["Invalid Email"],
    motherEmail: ["Invalid Email"],
    guardianEmail: ["Invalid Email"],
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getCountry();
    getNationality();
  }, []);

  useEffect(() => {
    getState();
  }, [values.permanentCountry]);

  useEffect(() => {
    getCurrentState();
  }, [values.currentCountry]);

  useEffect(() => {
    getCity();
  }, [values.permanantState]);

  useEffect(() => {
    getCurrentCity();
  }, [values.currentState]);

  const getCountry = async () => {
    await axios(`/api/Country`)
      .then((res) => {
        setCountry(
          res.data.map((obj) => ({
            value: obj.id,
            label: obj.name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getState = async () => {
    if (values.permanentCountry) {
      await axios(`/api/State1/${values.permanentCountry}`)
        .then((res) => {
          setPermanantStates(
            res.data.map((obj) => ({
              value: obj.id,
              label: obj.name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getCurrentState = async () => {
    if (values.currentCountry) {
      await axios(`/api/State1/${values.currentCountry}`)
        .then((res) => {
          setCurrentStates(
            res.data.map((obj) => ({
              value: obj.id,
              label: obj.name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getCity = async () => {
    if (values.permanentCountry && values.permanantState) {
      await axios(
        `/api/City1/${values.permanantState}/${values.permanentCountry}`
      )
        .then((res) => {
          setPermanantCities(
            res.data.map((obj) => ({
              value: obj.id,
              label: obj.name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getCurrentCity = async () => {
    if (values.currentCountry && values.currentState) {
      await axios(`/api/City1/${values.currentState}/${values.currentCountry}`)
        .then((res) => {
          setCurrentCities(
            res.data.map((obj) => ({
              value: obj.id,
              label: obj.name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getNationality = async () => {
    await axios(`/api/nationality`)
      .then((res) => {
        setNationality(
          res.data.map((obj) => ({
            value: obj.nationality_id,
            label: obj.nationality,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const CustomAccordianSummary = ({ Icon, title }) => (
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton sx={{ padding: 0 }}>
          <Icon color="primary" sx={{ fontSize: 30 }} />
        </IconButton>
        <Typography variant="subtitle2" color="primary" sx={{ fontSize: 14 }}>
          {title}
        </Typography>
      </Box>
    </AccordionSummary>
  );

  useEffect(() => {
    const studentName = applicantData?.student_name || "Unknown Student";
    const auid = applicantData?.auid || "Unknown AUID";

    const nameWithAuid = `${studentName} - ${auid}`;
    if (
      [
        "/student-master-inst",
        "/student-master-user",
        "/student-master-dept",
        "/student-master-intl",
      ].includes((pathFrom || "").toLowerCase())
    ) {
      setCrumbs([
        {
          name: "Student Master",
          link: pathFrom || "",
        },
        {
          name: nameWithAuid,
        },
      ]);
    } else if (state) {
      setCrumbs([
        {
          name: "Student Master",
          link: `/student-master`,
        },
        {
          name: nameWithAuid,
        },
      ]);
    } else if (pathname?.toLowerCase() === `/studentdetailsview/${Id}`) {
      setCrumbs([
        {
          name: "Student Master",
          link: "/ProctorStudentMaster/Proctor",
        },
        {
          name: nameWithAuid,
        },
      ]);
    } else {
      setCrumbs([
        {
          name: "Student Master",
          link: "/ProctorMaster/Proctor",
        },
        {
          name: nameWithAuid,
        },
      ]);
    }
  }, [state, pathname, applicantData]);

  useEffect(() => {
    if (refreshData) {
      getData();
      setRefreshData(false);
    }
  }, [refreshData]);

  const getData = async () => {
    await axios
      .get(`/api/student/getAllStudentDetailsData/${Id}`)
      .then((res) => {
        const data = res?.data?.data?.Student_details;
        setEditStudentDetails((prev) => ({
          ...prev,
          studentName: data?.student_name,
          dob: data?.dateofbirth,
          gender: data?.candidate_sex,
          mobile: data?.mobile,
          alternateMobile: data?.alternate_number,
          whatsAppNo: data?.whatsapp_number,
          studentEmail: data?.student_email,
          religion: data?.religion,
          casteCategory: data?.caste,
          bloodGroup: data?.blood_group,
          nationality: data?.nationality,
          bankName: data?.bank_name,
          accountHolderName: data?.account_holder_name,
          bankBranch: data?.bank_branch,
          ifscCode: data?.ifsc_code,
          aadharNo: data?.adhar_number,
          accountNumber: data?.account_number,

          fatherName: data?.father_name,
          fatherMobile: data?.father_mobile,
          fatherEmail: data?.father_email,
          fatherOccupation: data?.father_occupation,
          fatherQualification: data?.father_qualification,
          fatherIncome: data?.father_income ?? 0.0,

          motherName: data?.mother_name ?? 0,
          motherMobile: data?.mother_mobile,
          motherEmail: data?.mother_email,
          motherOccupation: data?.mother_occupation,
          motherQualification: data?.mother_qualification,
          motherIncome: data?.mother_income ?? 0.0,

          guardianName: data?.guardian_name,
          guardianMobile: data?.guardian_mobile,
          guardianEmail: data?.guardian_email,
          guardianOccupation: data?.guardian_occupation,
          guardianQualification: data?.guardian_qualification,
          guardianIncome: data?.guardian_income,
        }));

        setAddressValues((prev) => ({
          ...prev,
          permanentAddress: data.permanent_address ?? "",
          permanentAddressTwo: data.permanant_adress1 ?? "",
          permanentCountry: data.permanant_country_id ?? "",
          permanantState: data.permanant_state_id ?? "",
          permanantCity: data.permanant_city_id1 ?? "",
          permanentPincode: data.permanant_pincode ?? "",

          currentAddress: data.current_address ?? "",
          currentAddressTwo: data.current_adress1 ?? "",
          currentCountry: data.current_country_id ?? "",
          currentState: data.current_state_id ?? "",
          currentCity: data.current_city_id ?? "",
          currentPincode: data.current_pincode ?? "",

          localAddress: data.local_adress1 ?? "",
          localAddressTwo: data.local_adress1 ?? "",
          localCountry: data.local_country_id ?? "",
          localState: data.local_state_id ?? "",
          localCity: data.local_city_id ?? "",
          localPincode: data.local_pincode ?? "",
        }));

        setApplicantData(res.data.data.Student_details);
        setcourseData(res.data.data.course[0]);
        settranscriptData(
          res.data.data.Student_Transcript_Details.filter(
            (obj) => obj.not_applicable !== "YES"
          )
        );
        setreportingData(res.data.data.reporting_students);
        // getRegistrationData(
        //   res.data.data.Student_details.application_no_npf,
        //   res.data.data.Student_details.candidate_id
        // );
        getStudentImage(data?.student_image_path)
      });
  };
  const getStudentImage = async (imagePath) => {
    try {
      if (imagePath) {
        const studentImageResponse = await axios.get(
          `/api/student/studentImageDownload?student_image_attachment_path=${imagePath}`,
          { responseType: "blob" }
        );
        if (
          studentImageResponse.status === 200 ||
          studentImageResponse.status === 201
        ) {
          setImage(URL.createObjectURL(studentImageResponse.data))
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: "Something went wrong! Unable to find the Image !!",
      });
      setAlertOpen(true);
    }
  };
  const handleChangeEditStudent = (e) => {
    setEditStudentDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvanceEdit = (name, newValue) => {
    setEditStudentDetails((prev) => ({ ...prev, [name]: newValue }));
  };

  const getFollowUpData = async () => {
    await axios
      .get(
        `/api/student/getCandidateFollowUpByCandidateId/${applicantData?.candidate_id}`
      )
      .then((res) => {
        const temp = res.data.data.sort((a, b) => {
          if (a.candidate_followup_id > b.candidate_followup_id) return -1;
          if (a.candidate_followup_id < b.candidate_followup_id) return 1;
          return 0;
        });

        setFollowUpData(temp);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    const hasFullAccess = checkFullAccess();

    const nameWithAuid = `${applicantData?.candidate_name || "Unknown Candidate"} - ${applicantData?.auid || "Unknown AUID"}`;

    const pathList = [
      "/student-master-inst",
      "/student-master-user",
      "/student-master-dept",
      "/student-master-intl",
    ];

    if (pathList.includes((pathFrom || "").toLowerCase())) {
      setCrumbs([
        {
          name: "Student Master",
          link: pathFrom || "",
        },
        {
          name: nameWithAuid,
        },
      ]);
    } else if (
      pathname.toLowerCase() === `/studentdetailsmaster/studentsdetailsview/${Id}` ||
      pathname.toLowerCase() === `/studentdetailsmaster/studentsdetails/${Id}`
    ) {
      if (hasFullAccess && state) {
        setCrumbs([
          {
            name: "Student Master",
            link: "/student-master",
          },
          { name: nameWithAuid },
        ]);
      } else {
        setCrumbs([
          { name: "My Profile" },
          { name: nameWithAuid },
        ]);
      }
    }
  }, [applicantData]);


  const getRegistrationData = async (applicationNo, candidateId) => {
    await axios
      .get(
        `/api/student/candidateWalkinDetails?application_no_npf=${applicationNo}`
      )
      .then((res) => {
        setRegistrationData(res.data.data[0]);
      })
      .catch((err) => console.error(err));

    // fetch candidate photo
    await axios
      .get(`/api/student/CandidateAttachmentDetails/${candidateId}`)
      .then((res) => {
        const getImagePath = res.data.data.filter(
          (obj) => obj.attachment_purpose === "photo"
        );

        if (getImagePath.length > 0) {
          const imagePath = getImagePath[0].attachment_path;
          // Fetch image
          axios
            .get(
              `/api/student/imageDownloadOfCandidateAttachment?attachment_path=${imagePath}`,
              {
                responseType: "blob",
              }
            )
            .then((fileRes) => {
              setCandidateProfilePhoto(URL.createObjectURL(fileRes.data));
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCreate = async () => {
    const temp = {};
    temp.active = true;
    temp.follow_up_remarks = values.followRemarks;
    temp.follow_up_date = values.followDate?.substr(0, 19) + "Z";
    temp.candidate_id = applicantData?.candidate_id;

    await axios
      .post(`/api/student/saveCandidateFollowUp`, temp)
      .then((res) => {
        if (res.data.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Data updated successfully !!",
          });
          setAlertOpen(true);
          setValues(initialValues);
          getFollowUpData();
        }
      })
      .catch((err) => console.error(err));
  };

  const handleRefresh = () => {
    setRefreshData(true);
  };

  const updateApplicantData = async () => {
    try {
      const payload = [];
      const applicantIds = [];
      academicValues.map((obj) => {
        applicantIds.push(obj.applicant_id);
        payload.push({
          applicant_id: obj.applicant_id,
          course: obj.qualification,
          board_university: obj.university,
          college_name: obj.collegeName,
          subjects_studied: obj.subject,
          marks_total: obj.maxMarks,
          total_obtained: obj.scoredMarks,
          percentage_scored: obj.percentage,
          passed_year: obj.passingYear,
          acharya_email: obj.acharya_email,
          active: true,
          auid: obj.auid,
          board_university_id: obj.board_university_id,
          board_university_type: obj.board_university_type,
          candidate_id: obj.candidate_id,
          entrance_exam_date: obj.entrance_exam_date,
          entrance_exam_name:
            obj.qualification === "PUC"
              ? optionalValues.entranceExamName
              : obj.entrance_exam_name,
          entrance_score: obj.entrance_score,
          first_language: obj.first_language,
          optional_max_mark:
            obj.qualification === "PUC"
              ? optionalValues.optionalMaxMarks
              : obj.optional_max_mark,
          optional_min_mark:
            obj.qualification === "PUC"
              ? optionalValues.optionalScoredMarks
              : obj.optional_min_mark,
          optional_percentage:
            obj.qualification === "PUC"
              ? optionalValues.optionalPercentage
              : obj.optional_percentage,
          optional_subject:
            obj.qualification === "PUC"
              ? optionalValues.optionalSubject
              : obj.optional_subject,
          pdf_content: obj.pdf_content,
          qualifying_exam_year: obj.qualifying_exam_year,
          rank_obtained:
            obj.course === "PUC" ? optionalValues.rank : obj.rank_obtained,
          remarks: obj.remarks,
          second_language: obj.second_language,
          state: obj.state,
          std_id: obj.std_id,
          student_name: obj.student_name,
          subjects_studied: obj.subjects_studied,
          total_obtained: obj.total_obtained,
          year_of_entrance: obj.year_of_entrance,
        });
      });

      const putResponse = await axios.put(
        `/api/student/ApplicantDetails/${applicantIds?.toString()}`,
        payload
      );
      if (putResponse.status === 200 || putResponse.status === 201) {
        setAlertMessage({
          severity: "success",
          message: "Updated Successfully",
        });
      } else {
        setAlertMessage({
          severity: "error",
          message: "Error Occured While Updating Applicant Details",
        });
      }

      setAlertOpen(true);
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response.data.message,
      });
      setAlertOpen(true);
    }
  };

  const handleStudentEdit = async () => {
    try {
      const payload = {};

      payload.active = true;
      payload.student_name = editStudentDetails.studentName;
      payload.alternate_number = editStudentDetails.alternateMobile;
      payload.dateofbirth = moment(editStudentDetails.dob).format("YYYY-MM-DD");
      payload.account_number = editStudentDetails.accountNumber;
      payload.candidate_sex = editStudentDetails.gender;
      payload.mobile = editStudentDetails.mobile;
      payload.student_email = editStudentDetails.studentEmail;
      payload.religion = editStudentDetails.religion;
      payload.caste = editStudentDetails.casteCategory;
      payload.blood_group = editStudentDetails.bloodGroup;
      payload.nationality = editStudentDetails?.nationality?.toString();
      payload.whatsapp_number = editStudentDetails.whatsAppNo;
      payload.marital_status = editStudentDetails.maritalStatus;

      payload.father_name = editStudentDetails.fatherName;
      payload.father_mobile = editStudentDetails.fatherMobile;
      payload.father_email = editStudentDetails.fatherEmail;
      payload.father_occupation = editStudentDetails.fatherOccupation;
      payload.father_qualification = editStudentDetails.fatherQualification;
      // payload.father_income =
      //   parseFloat(editStudentDetails.fatherIncome) || 0.0;

      payload.mother_name = editStudentDetails.motherName;
      payload.mother_mobile = editStudentDetails.motherMobile;
      payload.mother_email = editStudentDetails.motherEmail;
      payload.mother_occupation = editStudentDetails.motherOccupation;
      payload.mother_qualification = editStudentDetails.motherQualification;
      // payload.mother_income =
      //   parseFloat(editStudentDetails.motherIncome) || 0.0;

      payload.guardian_name = editStudentDetails.motherName;
      payload.guardian_phone = editStudentDetails.motherMobile;

      payload.permanent_address = addressValues.permanentAddress;
      payload.permanant_adress1 = addressValues.permanentAddressTwo;
      payload.permanant_country = addressValues?.permanentCountry?.toString();
      payload.permanant_state = addressValues?.permanantState?.toString();
      payload.permanant_city = addressValues?.permanantCity?.toString();
      payload.permanant_pincode = addressValues.permanentPincode;

      payload.current_address = addressValues.currentAddress;
      payload.current_adress1 = addressValues.currentAddressTwo;
      payload.current_country = addressValues?.currentCountry?.toString();
      payload.current_state = addressValues?.currentState?.toString();
      payload.current_city = addressValues?.currentCity?.toString();
      payload.current_pincode = addressValues.currentPincode;

      payload.local_adress1 = addressValues.localAddress;
      payload.local_adress1 = addressValues.localAddressTwo;
      payload.local_country = addressValues?.localCountry?.toString();
      payload.local_state = addressValues?.localState?.toString();
      payload.local_city = addressValues?.localCity?.toString();
      payload.local_pincode = addressValues.localPincode;

      payload.bank_name = editStudentDetails.bankName;
      payload.account_holder_name = editStudentDetails.accountHolderName;
      payload.account_number = editStudentDetails.accountNumber;
      payload.bank_branch = editStudentDetails.bankBranch;
      payload.ifsc_code = editStudentDetails.ifscCode;
      payload.adhar_number = editStudentDetails.aadharNo;

      const response = await axios.patch(
        `/api/student/updateStudentDetailsPartially/${applicantData.student_id}`,
        payload
      );
      if (response.status === 200 || response.status === 201) {
        updateApplicantData();
        setAlertMessage({
          severity: "success",
          message: "Updated successfully",
        });
        setAlertOpen(true);
        getData();
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred. Please try again.";
      setAlertMessage({
        severity: "error",
        message: errorMessage,
      });
      setAlertOpen(true);
    } finally {
    }
  };

  return (
    <>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <CustomTabsHorizontal
            value={tab}
            onChange={handleTabChange}
            orientation="horizontal"
            variant="scrollable"
            className="CustomTabsHorizontal"
          >
            <CustomTabHorizontal value="Registration" label="Registration" />
            <CustomTabHorizontal value="Admissions" label="Admissions" />
            <CustomTabHorizontal value="Academics" label="Academics" />
            <CustomTabHorizontal value="Proctorial" label="Proctorial" />
            <CustomTabHorizontal value="Accounts" label="Accounts" />
            <CustomTabHorizontal value="Documents" label="Documents" />
            <CustomTabHorizontal value="Library" label="Library" />
          </CustomTabsHorizontal>
        </Grid>
        {tab === "Registration" && (
          <Grid
            container
            spacing={2}
            columnSpacing={4}
            sx={{ marginTop: "1px" }}
          >
            <Grid item xs={4} md={2}>
              <CustomTabs
                value={subTab}
                onChange={handleSubTabChange}
                orientation="vertical"
                variant="scrollable"
                className="customTabs"
              >
                {/* <CustomTab value="Personal Details" label="Personal Details" /> */}
                <CustomTab value="Applicant" label="Applicant Details" />
                <CustomTab value="Follow up Notes" label="Follow up Notes" />
              </CustomTabs>
            </Grid>
            <Grid item xs={8} md={10}>
              {subTab === "Personal Details" && (
                <>
                  <Card>
                    <CardHeader
                      title="Personal Details"
                      titleTypographyProps={{ variant: "subtitle2" }}
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        padding: 1,
                      }}
                    />

                    <CardContent>
                      <Grid container rowSpacing={1}>
                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Student Name
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {applicantData.student_name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">Mobile</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.mobile}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Date Of Birth
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {moment(applicantData.dateofbirth).format(
                              "DD-MM-YYYY"
                            )}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">Gender</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.candidate_sex}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">Email</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.student_email}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Father Name
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.father_name}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Mother Name
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.mother_name}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Parent Mobile
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.father_mobile}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Nationality
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.nationality}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Blood Group
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.blood_group}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Passport Number
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.passport_no}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Current Address
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.current_address +
                              ", " +
                              applicantData.current_city_name +
                              ", " +
                              applicantData.current_state_name +
                              ", " +
                              applicantData.current_country_name}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Permanent Address
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.permanent_address +
                              ", " +
                              applicantData.permanant_city_name +
                              ", " +
                              applicantData.permanant_state_name +
                              ", " +
                              applicantData.permanant_country_name}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">Bank Name</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {applicantData.bank_name}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">
                            Account No.
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.account_number}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">Branch</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {applicantData.bank_branch}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Typography variant="subtitle2">IFSC Code</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" color="textSecondary">
                            {applicantData.ifsc_code}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </>
              )}

              {subTab === "Applicant" && (
                <>
                  <Card>
                    <CardHeader
                      title="Applicant Details"
                      titleTypographyProps={{ variant: "subtitle2" }}
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        padding: 1,
                      }}
                    />

                    <CardContent>
                      <Grid container rowSpacing={1}>
                        <Grid item xs={12}>
                          <Accordion
                            sx={{ borderLeft: 4, borderColor: "primary.main" }}
                          >
                            <CustomAccordianSummary
                              Icon={ContactPageIcon}
                              title="Personal Details"
                            />
                            <AccordionDetails>
                              <Grid container rowSpacing={3} columnSpacing={3}>
                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    name="studentName"
                                    label="Student Name"
                                    value={editStudentDetails.studentName}
                                    handleChange={handleChangeEditStudent}
                                    checks={checks.studentName}
                                    errors={errorMessages.studentName}
                                    required
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomDatePicker
                                    name="dob"
                                    label="Date of Birth"
                                    value={editStudentDetails.dob}
                                    handleChangeAdvance={
                                      handleChangeAdvanceEdit
                                    }
                                    maxDate={
                                      new Date(
                                        `12/31/${new Date().getFullYear() - 15}`
                                      )
                                    }
                                    required
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomRadioButtons
                                    name="gender"
                                    label="Gender"
                                    value={editStudentDetails.gender}
                                    items={[
                                      { label: "Male", value: "Male" },
                                      { label: "Female", value: "Female" },
                                    ]}
                                    handleChange={handleChangeEditStudent}
                                    required
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    type="number"
                                    name="mobile"
                                    label="Mobile No."
                                    value={editStudentDetails.mobile}
                                    handleChange={handleChangeEditStudent}
                                    checks={checks.mobileNo}
                                    errors={errorMessages.mobileNo}
                                    required
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    name="alternateMobile"
                                    label="Alternate Mobile No."
                                    value={editStudentDetails.alternateMobile}
                                    handleChange={handleChangeEditStudent}
                                    checks={checks.alternateMobile}
                                    errors={errorMessages.alternateMobile}
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    name="whatsAppNo"
                                    label="Whatapp No."
                                    value={editStudentDetails.whatsAppNo}
                                    handleChange={handleChangeEditStudent}
                                    checks={checks.whatsAppNo}
                                    errors={errorMessages.whatsAppNo}
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    name="studentEmail"
                                    label="Personal Email"
                                    value={editStudentDetails.studentEmail}
                                    handleChange={handleChangeEditStudent}
                                    checks={checks.studentEmail}
                                    errors={errorMessages.studentEmail}
                                    required
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    name="religion"
                                    label="Religion"
                                    value={editStudentDetails.religion}
                                    handleChange={handleChangeEditStudent}
                                    required
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    name="casteCategory"
                                    label="Caste Category"
                                    value={editStudentDetails.casteCategory}
                                    handleChange={handleChangeEditStudent}
                                    required
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    name="bloodGroup"
                                    label="Blood Group"
                                    value={editStudentDetails.bloodGroup}
                                    handleChange={handleChangeEditStudent}
                                    required
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomAutocomplete
                                    name="nationality"
                                    label="Nationality"
                                    value={Number(
                                      editStudentDetails.nationality
                                    )}
                                    options={nationality}
                                    handleChangeAdvance={
                                      handleChangeAdvanceEdit
                                    }
                                    required
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    name="bankName"
                                    label="Bank Name"
                                    value={editStudentDetails.bankName}
                                    handleChange={handleChangeEditStudent}
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    name="accountHolderName"
                                    label="Name As Per Bank"
                                    value={editStudentDetails.accountHolderName}
                                    handleChange={handleChangeEditStudent}
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    name="accountNumber"
                                    label="Account Number"
                                    value={editStudentDetails.accountNumber}
                                    handleChange={handleChangeEditStudent}
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    name="bankBranch"
                                    label="Branch"
                                    value={editStudentDetails.bankBranch}
                                    handleChange={handleChangeEditStudent}
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    name="ifscCode"
                                    label="Ifsc Code"
                                    value={editStudentDetails.ifscCode}
                                    handleChange={handleChangeEditStudent}
                                  />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    name="aadharNo"
                                    label="Aadhar No."
                                    value={editStudentDetails.aadharNo}
                                    handleChange={handleChangeEditStudent}
                                    checks={checks.aadharNo}
                                    errors={errorMessages.aadharNo}
                                  />
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          <Accordion
                            sx={{ borderLeft: 4, borderColor: "primary.main" }}
                          >
                            <CustomAccordianSummary
                              Icon={PersonAddAlt1Icon}
                              title="Additional Information"
                            />

                            <AccordionDetails>
                              <Grid container rowSpacing={2} columnSpacing={3}>
                                {/* Father  */}
                                <Grid item xs={12} md={4}>
                                  <Grid
                                    container
                                    rowSpacing={3}
                                    columnSpacing={2}
                                  >
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="fatherName"
                                        label="Father Name"
                                        value={editStudentDetails.fatherName}
                                        handleChange={handleChangeEditStudent}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="fatherMobile"
                                        label="Father Mobile"
                                        value={editStudentDetails.fatherMobile}
                                        handleChange={handleChangeEditStudent}
                                        checks={checks.fatherMobile}
                                        errors={errorMessages.fatherMobile}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="fatherEmail"
                                        label="Father Email"
                                        value={editStudentDetails.fatherEmail}
                                        handleChange={handleChangeEditStudent}
                                        checks={checks.fatherEmail}
                                        errors={errorMessages.fatherEmail}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="fatherOccupation"
                                        label="Father Occupation"
                                        value={
                                          editStudentDetails.fatherOccupation
                                        }
                                        handleChange={handleChangeEditStudent}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="fatherQualification"
                                        label="Father Qualification"
                                        value={
                                          editStudentDetails.fatherQualification
                                        }
                                        handleChange={handleChangeEditStudent}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="fatherIncome"
                                        label="Father Income"
                                        value={editStudentDetails.fatherIncome}
                                        handleChange={handleChangeEditStudent}
                                      />
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {/* Mother  */}
                                <Grid item xs={12} md={4}>
                                  <Grid
                                    container
                                    rowSpacing={3}
                                    columnSpacing={2}
                                  >
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="motherName"
                                        label="Mother Name"
                                        value={editStudentDetails.motherName}
                                        handleChange={handleChangeEditStudent}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="motherMobile"
                                        label="Mother Mobile"
                                        value={editStudentDetails.motherMobile}
                                        handleChange={handleChangeEditStudent}
                                        checks={checks.motherMobile}
                                        errors={errorMessages.motherMobile}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="motherEmail"
                                        label="Mother Email"
                                        value={editStudentDetails.motherEmail}
                                        handleChange={handleChangeEditStudent}
                                        checks={checks.motherEmail}
                                        errors={errorMessages.motherEmail}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="motherOccupation"
                                        label="Mother Occupation"
                                        value={
                                          editStudentDetails.motherOccupation
                                        }
                                        handleChange={handleChangeEditStudent}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="motherQualification"
                                        label="Mother Qualification"
                                        value={
                                          editStudentDetails.motherQualification
                                        }
                                        handleChange={handleChangeEditStudent}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="motherIncome"
                                        label="Mother Income"
                                        value={editStudentDetails.motherIncome}
                                        handleChange={handleChangeEditStudent}
                                      />
                                    </Grid>
                                  </Grid>
                                </Grid>
                                {/*Guardian */}
                                <Grid item xs={12} md={4}>
                                  <Grid
                                    container
                                    rowSpacing={3}
                                    columnSpacing={2}
                                  >
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="guardianName"
                                        label="Guardian Name"
                                        value={editStudentDetails.guardianName}
                                        handleChange={handleChangeEditStudent}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="guardianMobile"
                                        label="Guardian Mobile"
                                        value={
                                          editStudentDetails.guardianMobile
                                        }
                                        handleChange={handleChangeEditStudent}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="guardianEmail"
                                        label="Guardian Email"
                                        value={editStudentDetails.guardianEmail}
                                        handleChange={handleChangeEditStudent}
                                      />
                                    </Grid>

                                    <Grid item xs={12}>
                                      <CustomTextField
                                        name="guardianOccupation"
                                        label="Guardian Occupation"
                                        value={
                                          editStudentDetails.guardianOccupation
                                        }
                                        handleChange={handleChangeEditStudent}
                                      />
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          <Accordion
                            sx={{ borderLeft: 4, borderColor: "primary.main" }}
                          >
                            <CustomAccordianSummary
                              Icon={HomeIcon}
                              title="Address"
                            />
                            <AccordionDetails>
                              <AddressForm
                                addressValues={addressValues}
                                setAddressValues={setAddressValues}
                                addressChecks={addressChecks}
                                addressErrorMessages={addressErrorMessages}
                              />
                            </AccordionDetails>
                          </Accordion>

                          <Accordion
                            sx={{ borderLeft: 4, borderColor: "primary.main" }}
                          >
                            <CustomAccordianSummary
                              Icon={SchoolIcon}
                              title="Academic Background"
                            />
                            <AccordionDetails>
                              <AcademicForm
                                academicValues={academicValues}
                                setAcademicValues={setAcademicValues}
                                optionalValues={optionalValues}
                                setOptionalValues={setOptionalValues}
                                id={Id}
                              />
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                        <Grid item xs={12} align="right">
                          <Button
                            variant="contained"
                            sx={{ borderRadius: 2 }}
                            onClick={handleStudentEdit}
                          >
                            Update
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </>
              )}

              {subTab === "Follow up Notes" &&
                userType.toLowerCase() !== "student" ? (
                <Card>
                  <CardHeader
                    title="Notes"
                    titleTypographyProps={{ variant: "subtitle2" }}
                    sx={{
                      backgroundColor: "rgba(74, 87, 169, 0.1)",
                      color: "#46464E",
                      padding: 1,
                    }}
                  />
                  <CardContent>
                    <Box mt={2}>
                      <Grid
                        container
                        justifyContent="flex-start"
                        columnSpacing={4}
                        rowSpacing={2}
                      >
                        <Grid item xs={12}>
                          <CustomTextField
                            name="followRemarks"
                            label="Note"
                            value={values.followRemarks}
                            handleChange={handleChange}
                            multiline
                            rows={4}
                            checks={checks.followRemarks}
                            required
                          />
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <CustomDatePicker
                            name="followDate"
                            label="Follow Up Date"
                            value={values.followDate}
                            handleChangeAdvance={handleChangeAdvance}
                            disablePast
                          />
                        </Grid>
                        <Grid item xs={12} align="right">
                          <Button
                            variant="contained"
                            onClick={handleCreate}
                            disabled={!requiredFieldsValid()}
                          >
                            Save
                          </Button>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item xs={12} md={3.4}>
                          <Typography variant="h6" color="primary">
                            Follow-up History
                          </Typography>
                        </Grid>
                        <Grid item xs={12} mr={20}>
                          <CandidateFollowUpNote
                            getFollowUpData={getFollowUpData}
                            followUpdata={followUpdata}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {subTab === "Follow up Notes" ? (
                    <>
                      <Alert severity="error">
                        You do not have permission!
                      </Alert>
                    </>
                  ) : (
                    ""
                  )}
                </>
              )}
            </Grid>
          </Grid>
        )}
        {tab === "Admissions" && (
          <>
            <StudentDetailsViewAdmissions
              applicantData={applicantData}
              transcriptData={transcriptData}
              handleRefresh={handleRefresh}
              state={state}
            />
          </>
        )}
        {tab === "Academics" && (
          <>
            <StudentDetailsViewAcademics
              courseData={courseData}
              reportingData={reportingData}
              applicantData={applicantData}
              id={id}
              state={state}
            />
          </>
        )}
        {tab === "Proctorial" && (
          <>
            <StudentDetailsViewProctorial state={state} id={id} />
          </>
        )}
        {tab === "Accounts" && (
          <>
            <StudentDetailsViewAccounts
              applicantData={applicantData}
              state={state}
            />
          </>
        )}
        {tab === "Documents" && (
          <>
            <StudentDetailsViewDocuments
              id={id}
              applicantData={applicantData}
              getData={getData}
              Image={Image}
              state={state}
            />
          </>
        )}
        {tab === "Library" && (
          <>
            <StudentLibraryDetailsView state={state} />
          </>
        )}
      </Grid>
    </>
  );
}

export default StudentDetailsView;
