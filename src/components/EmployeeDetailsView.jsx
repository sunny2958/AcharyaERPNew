import { useState, useEffect } from "react";
import axios from "../services/Api";
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
  TableBody,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useLocation, useParams } from "react-router-dom";
import { Check, HighlightOff } from "@mui/icons-material";
import CustomTextField from "./Inputs/CustomTextField";
import CustomDatePicker from "./Inputs/CustomDatePicker";
import CustomSelect from "./Inputs/CustomSelect";
import EmployeeDetailsViewHRData from "./EmployeeDetailsViewHRData";
import EmployeeDetailsViewAcademics from "./EmployeeDetailsViewAcademics";
import EmployeeDetailsViewMentor from "./EmployeeDetailsViewMentor";
import EmployeeDetailsViewProfessional from "./EmployeeDetailsViewProfessional";
import EmployeeDetailsViewDocuments from "./EmployeeDetailsViewDocuments";
import useAlert from "../hooks/useAlert";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import moment from "moment";
import CustomModal from "./CustomModal";
import { checkAdminAccess, checkFullAccess } from "../utils/DateTimeUtils";
import religionList from "../utils/ReligionList";
import CandidateDetailsView from "./CandidateDetailsView";
import { decryptEncryptedData } from "../utils/decryptData";
import { maskMobile } from "../utils/MaskData";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

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

const initialFamilyValues = {
  name: "",
  relationship: "",
  contactDetails: "",
  age: "",
  familyUniqueId: null,
};

const roleName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleName;
const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;

const initialVisaValues = {
  visaNo: "",
  visaExpiryDate: null,
  remarks: "",
  visaUniqueId: null,
};

const initialExperienceValues = {
  jobId: null,
  organizationWorking: "",
  designation: "",
  monthlySalaryUsd: "",
  experienceInYears: "",
  experienceInMonths: "",
  natureOfWork: "",
  experienceUniqueId: null,
};

const initialQualificationValues = {
  jobId: null,
  qualification: "",
  nameOfDegree: "",
  universityName: "",
  universityScore: "",
  qualificationUniqueId: null,
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const empIdfromSessionStorage = JSON.parse(sessionStorage.getItem("empId"));

const roleIds = [1, 5, 6];

function EmployeeDetailsView() {
  const [values, setValues] = useState({
    personalMedicalHistory: "",
    familyMedicalHistory: "",
    Skills: [{ skills: "" }],
  });
  const [data, setData] = useState([]);
  const [tab, setTab] = useState("Personal");
  const [subTab, setSubTab] = useState("Applicant");
  const [jobDetails, setJobDetails] = useState([]);
  const [familyData, setFamilyData] = useState([initialFamilyValues]);
  const [familyHistory, setFamilyHistory] = useState([]);
  const [visaData, setVisaData] = useState([initialVisaValues]);
  const [visaHistory, setVisaHistory] = useState([]);
  const [graduationOptions, setGraduationOptions] = useState([]);

  const [experienceData, setExperienceData] = useState([
    initialExperienceValues,
  ]);
  const [experienceHistory, setExperienceHistory] = useState([]);
  const [qualificationData, setQualificationData] = useState([
    initialQualificationValues,
  ]);
  const [editSkills, setEditSkills] = useState(false);
  const [jobDetailsData, setJobDetailsData] = useState({
    gender: "",
    maritalStatus: "",
    bloodGroup: "",
    permanentAddress: "",
    currentAddress: "",
    panNo: "",
    aadharNo: "",
  });

  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [isFormVisaDataValid, setIsFormVisaDataValid] = useState(false);
  const [isValidFamily, setIsValidFamily] = useState(false);
  const [qualificationValid, setQualificationValid] = useState(false);
  const [isExperienceValid, setIsExperienceValid] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const { userId, offerId, type } = useParams();

  const setCrumbs = useBreadcrumbs();
  const location = useLocation();
  const state = location?.state;

  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
    setIsEditing(false);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const getEmployeeId = async () => {
    if (userID)
      await axios
        .get(`/api/employee/getEmployeeDetailsByUserID/${userID}`)
        .then((res) => {
          setEmployeeId(res.data.data.emp_id);
        })
        .catch((err) => console.error(err));
  };

  const empId = userId || employeeId;

  const checks = {
    personalEmail: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        jobDetailsData.personalEmail
      ),
    ],
    aadharNo: [/^[0-9]{12}$/.test(jobDetailsData.aadharNo)],
    uanNo: [/^[0-9]{12}$/.test(values.uanNo)],
  };
  const errorMessages = {
    personalEmail: ["Invalid Email"],
    aadharNo: ["Invalid Aadhar"],
    uanNo: ["Invalid UAN No"],
  };

  visaData.forEach((obj, i) => {
    checks[obj.visaNo] = [/[0-9]/.test(obj.visaNo)];
    errorMessages[obj.visaNo] = ["Enter only Numbers"];
  });

  useEffect(() => {
    getEmployeeId();
  }, [userID]);

  useEffect(() => {
    getData();
    getFamilyData();
    getVisaData();
    getGraduation();
  }, [employeeId]);

  useEffect(() => {
    if (state) {
      setCrumbs([
        {
          name: "Employee Index",
          link: type === "user" ? "/employee-userwiseindex" : "/EmployeeIndex",
        },
        { name: data.employee_name + "-" + data.empcode },
      ]);
    } else {
      setCrumbs([
        {
          name: "Employee Profile",
        },
        { name: data.employee_name + "-" + data.empcode },
      ]);
    }
  }, [data]);

  useEffect(() => {
    const isRowValid = visaData.every(
      (obj) => obj.visaNo && obj.visaExpiryDate
    );

    const isFamilyVaild = familyData.every(
      (obj) => obj.name && obj.relationship && obj.contactDetails && obj.age
    );

    const isQualificationValid = qualificationData.every(
      (obj) =>
        obj.qualification &&
        obj.nameOfDegree &&
        obj.universityName &&
        obj.universityScore
    );

    const experienceValid = experienceData.every(
      (obj) =>
        obj.organizationWorking &&
        obj.designation &&
        obj.experienceInYears &&
        obj.experienceInMonths &&
        obj.natureOfWork
    );

    setIsFormVisaDataValid(isRowValid);
    setIsValidFamily(isFamilyVaild);
    setQualificationValid(isQualificationValid);
    setIsExperienceValid(experienceValid);
  }, [visaData, familyData, qualificationData, experienceData]);

  const getData = async () => {
    if (empId)
      await axios
        // .get(`/api/employee/EmployeeDetails/${empId}`)
        .get(`/api/employee/encryptedEmployeeDetails/${empId}`)
        .then(async (res) => {
          // setJobDetailsData({
          //   gender: res.data.data[0].gender,
          //   maritalStatus: res.data.data[0].martial_status,
          //   bloodGroup: res.data.data[0].blood_group,
          //   permanentAddress: res.data.data[0].hometown,
          //   currentAddress: res.data.data[0].current_location,
          //   employee_name: res.data.data[0].employee_name,
          //   mobile: res.data.data[0].mobile,
          //   dateofbirth: res.data.data[0].dateofbirth,
          //   alternateMobileNo: res.data.data[0].alt_mobile_no,
          //   religion: res.data.data[0].religion,
          //   dlNo: res.data.data[0].dlno,
          //   dlExpNo: res.data.data[0].dlexpno,
          //   passportNumber: res.data.data[0].passportno,
          //   passportDate: res.data.data[0].passportexpno,
          //   aadharNo: res.data.data[0].aadhar,
          //   panNo: res.data.data[0].pan_no,
          //   personalEmail: res.data.data[0].personal_email,
          //   casteCategory: res.data.data[0].caste_category,
          // });

          // await axios
          //   .get(
          //     `/api/employee/getAllApplicantDetails/${res.data.data[0].job_id}`
          //   )
          //   .then(async (res) => {
          //     setJobDetails(res.data);

          //     await axios
          //       .get(
          //         `/api/employee/fetchExperienceDetails/${res.data.Job_Profile.job_id}`
          //       )
          //       .then((res) => {
          //         const allExperienceData = [];
          //         if (res.data.length > 0) {
          //           for (let i = 0; i < res.data.length; i++) {
          //             allExperienceData.push({
          //               organizationWorking: res.data[i].employer_name,
          //               designation: res.data[i].designation,
          //               monthlySalaryUsd: res.data[i].annual_salary_lakhs,
          //               experienceInYears: res.data[i].exp_in_years,
          //               experienceInMonths: res.data[i].exp_in_months,
          //               natureOfWork: res.data[i].skills,
          //               experienceUniqueId: res.data[i].exp_id,
          //               jobId: res.data[i].job_id,
          //             });
          //           }
          //           setExperienceData(allExperienceData);
          //         }
          //         setExperienceHistory(res.data);
          //       })
          //       .catch((err) => console.error(err));

          //     await axios
          //       .get(
          //         `/api/employee/fetchEducationDetails/${res.data.Job_Profile.job_id}`
          //       )
          //       .then((res) => {
          //         const allQualificationData = [];
          //         if (res.data.length > 0) {
          //           for (let i = 0; i < res.data.length; i++) {
          //             allQualificationData.push({
          //               qualification: res.data[i].graduation_id,
          //               universityName: res.data[i].graduation,
          //               nameOfDegree: res.data[i].university,
          //               universityScore: res.data[i].academic_score,
          //               jobId: res.data[i].job_id,
          //               qualificationUniqueId: res.data[i].edu_id,
          //             });
          //           }
          //         }
          //         setQualificationData(allQualificationData);
          //       })
          //       .catch((err) => console.error(err));
          //   })
          //   .catch((err) => console.error(err));
          // setData(res.data.data[0]);

          // const temp = [];
          // res.data.data[0].key_skills?.split(",").map((obj) => {
          //   temp.push({ skills: obj });
          // });

          // setValues((prev) => ({
          //   ...prev,
          //   Skills: temp,
          // }));

          const { encryptedEmployeeDetails } = res.data.data;
          const decryptData = decryptEncryptedData(encryptedEmployeeDetails);

          setData(decryptData);
          setJobDetailsData({
            gender: decryptData.gender,
            maritalStatus: decryptData.martial_status,
            bloodGroup: decryptData.blood_group,
            permanentAddress: decryptData.hometown,
            currentAddress: decryptData.current_location,
            employee_name: decryptData.employee_name,
            mobile: decryptData.mobile,
            dateofbirth: decryptData.dateofbirth,
            alternateMobileNo: decryptData.alt_mobile_no,
            religion: decryptData.religion,
            dlNo: decryptData.dlno,
            dlExpNo: decryptData.dlexpno,
            passportNumber: decryptData.passportno,
            passportDate: decryptData.passportexpno,
            aadharNo: decryptData.aadhar,
            panNo: decryptData.pan_no,
            personalEmail: decryptData.personal_email,
            casteCategory: decryptData.caste_category,
          });
          await axios
            .get(`/api/employee/getAllApplicantDetails/${decryptData?.job_id}`)
            .then(async (res) => {
              setJobDetails(res.data);

              await axios
                .get(
                  `/api/employee/fetchExperienceDetails/${res.data.Job_Profile.job_id}`
                )
                .then((res) => {
                  const allExperienceData = [];
                  if (res.data.length > 0) {
                    for (let i = 0; i < res.data.length; i++) {
                      allExperienceData.push({
                        organizationWorking: res.data[i].employer_name,
                        designation: res.data[i].designation,
                        monthlySalaryUsd: res.data[i].annual_salary_lakhs,
                        experienceInYears: res.data[i].exp_in_years,
                        experienceInMonths: res.data[i].exp_in_months,
                        natureOfWork: res.data[i].skills,
                        experienceUniqueId: res.data[i].exp_id,
                        jobId: res.data[i].job_id,
                      });
                    }
                    setExperienceData(allExperienceData);
                  }
                  setExperienceHistory(res.data);
                })
                .catch((err) => console.error(err));

              await axios
                .get(
                  `/api/employee/fetchEducationDetails/${res.data.Job_Profile.job_id}`
                )
                .then((res) => {
                  const allQualificationData = [];
                  if (res.data.length > 0) {
                    for (let i = 0; i < res.data.length; i++) {
                      allQualificationData.push({
                        qualification: res.data[i].graduation_id,
                        universityName: res.data[i].graduation,
                        nameOfDegree: res.data[i].university,
                        universityScore: res.data[i].academic_score,
                        jobId: res.data[i].job_id,
                        qualificationUniqueId: res.data[i].edu_id,
                      });
                    }
                  }
                  setQualificationData(allQualificationData);
                })
                .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
          //  setData(res.data.data[0]);
          // setData(decryptData);

          const temp = [];
          //  res.data.data[0].key_skills?.split(",").map((obj) => {
          decryptData?.key_skills?.split(",").map((obj) => {
            temp.push({ skills: obj });
          });

          setValues((prev) => ({
            ...prev,
            Skills: temp,
          }));
        })
        .catch((err) => console.error(err));
  };

  const getFamilyData = async () => {
    if (empId)
      await axios
        .get(`/api/employee/getFamilyStructureDetailsData/${empId}`)
        .then((res) => {
          const allFamilyData = [];
          if (res.data.data.length > 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              allFamilyData.push({
                active: res.data.data[i].active,
                name: res.data.data[i].name,
                relationship: res.data.data[i].relationship,
                contactDetails: res.data.data[i].contact_number,
                age: res.data.data[i].age,
                familyUniqueId: res.data.data[i].id,
              });
            }
            setFamilyData(allFamilyData);
          }
          setFamilyHistory(res.data.data);
        })
        .catch((err) => console.error(err));
  };

  const getVisaData = async () => {
    if (empId)
      await axios
        .get(`/api/employee/getVisaExpiryHistoryData/${empId}`)
        .then((res) => {
          const allVisaData = [];
          if (res.data.data.length > 0) {
            for (let i = 0; i < res.data.data.length; i++) {
              allVisaData.push({
                active: res.data.data[i].active,
                visaNo: res.data.data[i].visa_document_number,
                visaExpiryDate: res.data.data[i].visa_expiry_date,
                remarks: res.data.data[i].remarks,
                visaUniqueId: res.data.data[i].id,
              });
            }
            setVisaData(allVisaData);
          }

          setVisaHistory(res.data.data);
        })
        .catch((err) => console.error(err));
  };

  const getGraduation = async () => {
    await axios
      .get(`/api/employee/graduation`)
      .then((res) => {
        setGraduationOptions(
          res.data.data.map((obj) => ({
            value: obj.graduation_id,
            label: obj.graduation_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleVisaCreate = async () => {
    const postData = [];
    const putData = [];
    const allIds = [];

    visaData.forEach((obj, i) => {
      allIds.push(obj.visaUniqueId);
      if (obj.visaUniqueId === null) {
        postData.push({
          active: true,
          emp_id: empId,
          visa_document_number: obj.visaNo,
          visa_expiry_date: obj.visaExpiryDate,
          remarks: obj.remarks,
        });
      } else {
        putData.push({
          active: true,
          emp_id: empId,
          visa_expiry_history_id: obj.visaUniqueId,
          visa_document_number: obj.visaNo,
          visa_expiry_date: obj.visaExpiryDate,
          remarks: obj.remarks,
        });
      }
    });

    if (postData.length > 0) {
      await axios
        .post(`/api/employee/saveVisaExpiryHistory`, postData)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Data saved",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
          }
          setAlertOpen(true);
          getVisaData();
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!!",
          });
        });
    }
    if (putData.length > 0) {
      await axios
        .put(
          `/api/employee/updateVisaExpiryHistory/${allIds.toString()}`,
          putData
        )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Data Updated",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
          }
          setAlertOpen(true);
          getVisaData();
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!!",
          });
        });
    }
  };

  const handleChange = (e, index) => {
    if (e.target.name === "skills") {
      setValues((prev) => ({
        ...prev,
        Skills: prev.Skills.map((obj, i) => {
          if (index === i)
            return {
              ...obj,
              [e.target.name]: e.target.value,
            };
          return obj;
        }),
      }));
    } else {
      setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleChangePersonalData = (e) => {
    setJobDetailsData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeDateAdvance = (name, newValue) => {
    setJobDetailsData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleFamilyChange = (e, index) => {
    setFamilyData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const handleQualification = (e, index) => {
    setQualificationData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const handleChangeExperience = (e, index) => {
    setExperienceData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editPersonalDetails, setEditPersonalDetails] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handlePersonalEditClick = () => {
    setEditPersonalDetails(true);
  };

  const handleAddQualificationData = () => {
    setQualificationData((prev) => [...prev, initialQualificationValues]);
  };

  const handleRemoveQualificationData = (obj) => {
    if (obj.qualificationUniqueId === null) {
      const filteredUser = [...qualificationData];
      filteredUser.pop();
      setQualificationData(filteredUser);
    } else if (
      obj.qualificationUniqueId !== null &&
      (roleName === "HR ROLE" ||
        roleName === "Admin" ||
        roleName === "Super Admin")
    ) {
      setModalOpen(true);
      const handleToggle = async () => {
        await axios
          .delete(`/api/employee/EducationDetails/${obj.qualificationUniqueId}`)
          .then((res) => {
            if (res.status === 200) {
              window.location.reload();
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      };

      setModalContent({
        title: "",
        message: "Are you sure you want to delete this data?",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
    } else {
      setAlertMessage({
        severity: "error",
        message: "You cannot delete the data",
      });
      setAlertOpen(true);
    }
  };

  const handleRemoveExperienceData = (obj) => {
    if (obj.experienceUniqueId === null) {
      const filteredUser = [...experienceData];
      filteredUser.pop();
      setExperienceData(filteredUser);
    } else if (
      obj.experienceUniqueId !== null &&
      (roleName === "HR ROLE" ||
        roleName === "Admin" ||
        roleName === "Super Admin")
    ) {
      setModalOpen(true);
      const handleToggle = async () => {
        await axios
          .delete(`/api/employee/ExperienceDetails/${obj.experienceUniqueId}`)
          .then((res) => {
            if (res.status === 200) {
              window.location.reload();
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      };

      setModalContent({
        title: "",
        message: "Are you sure you want to delete this data?",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
    } else {
      setAlertMessage({
        severity: "error",
        message: "You cannot delete the data",
      });
      setAlertOpen(true);
    }
  };

  const handleAddBox2 = () => {
    setExperienceData((prev) => [...prev, initialExperienceValues]);
  };

  const handleRemoveBox2 = (obj) => {
    if (obj.experienceUniqueId === null) {
      const filterdUser = [...experienceData];
      filterdUser.pop();
      setExperienceData(filterdUser);
    } else if (
      obj.experienceUniqueId !== null &&
      (roleName === "HR ROLE" ||
        roleName === "Admin" ||
        roleName === "Super Admin")
    ) {
      setModalOpen(true);
      const handleToggle = async () => {
        await axios
          .delete(`/api/employee/ExperienceDetails/${obj.experienceUniqueId}`)
          .then((res) => {
            if (res.status === 200) {
              window.location.reload();
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      };

      setModalContent({
        title: "",
        message: "Are you sure you want to delete this data?",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
    } else {
      setAlertMessage({
        severity: "error",
        message: "You cannot delete the data",
      });
      setAlertOpen(true);
    }
  };

  const handleAddfamilydetailsBox = () => {
    setFamilyData((prev) => [...prev, initialFamilyValues]);
  };

  const handleAddVisa = () => {
    setVisaData((prev) => [...prev, initialVisaValues]);
  };

  const handleRemovefamilydetailsBox = () => {
    const filterUser = [...familyData];
    filterUser.pop();
    setFamilyData(filterUser);
  };

  const handleRemoveVisadetailsBox = () => {
    const filterUser = [...visaData];
    filterUser.pop();
    setVisaData(filterUser);
  };

  const handleChangeVisa = (e, index) => {
    setVisaData((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const handleChangeVisaAdvance = (name, newValue) => {
    const splitName = name.split("-");
    const index = splitName[1];
    const keyName = splitName[0];
    setVisaData((prev) =>
      prev.map((obj, i) => {
        if (Number(index) === i) return { ...obj, [keyName]: newValue };
        return obj;
      })
    );
  };

  const handleActiveVisa = async (obj) => {
    const id = obj.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (obj.active === true) {
        await axios
          .delete(`/api/employee/deactivateVisaExpiryHistory/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getVisaData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/employee/activateVisaExpiryHistory/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getVisaData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      }
    };
    obj.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const handleActiveFamily = async (obj) => {
    const id = obj.id;

    setModalOpen(true);
    const handleToggle = async () => {
      if (obj.active === true) {
        await axios
          .delete(`/api/employee/familystructure/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getFamilyData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/employee/activatefamilystructure/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getFamilyData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      }
    };
    obj.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const handleAdd = () => {
    const newRow = { skills: "" };
    setValues((prev) => ({ ...prev, Skills: [...prev.Skills, newRow] }));
  };

  const deleteRow = () => {
    if (values.Skills.length > 1) {
      const updatedStockRows = [...values.Skills];

      updatedStockRows.pop();

      setValues((prev) => ({
        ...prev,
        Skills: updatedStockRows,
      }));
    }
  };

  const handleEditPersonalData = async () => {
    const historyData = { ...data };

    const temp = {};

    temp.emp_id = empId;
    temp.gender = jobDetailsData.gender;
    temp.blood_group = jobDetailsData.bloodGroup;
    temp.martial_status = jobDetailsData.maritalStatus;
    temp.employee_name = jobDetailsData.employee_name;
    temp.dateofbirth = moment(jobDetailsData?.dateofbirth).format("YYYY-MM-DD");
    temp.mobile = jobDetailsData?.mobile;
    temp.hometown = jobDetailsData.permanentAddress;
    temp.current_location = jobDetailsData.currentAddress;
    temp.religion = jobDetailsData.religion;
    temp.alt_mobile_no = jobDetailsData.alternateMobileNo;
    temp.dlno = jobDetailsData.dlNo;
    temp.dlexpno = jobDetailsData.dlExpNo;
    temp.passportno = jobDetailsData.passportNumber;
    temp.passportexpno = jobDetailsData.passportDate;
    temp.pan_no = jobDetailsData.panNo;
    temp.aadhar = jobDetailsData.aadharNo;
    temp.personal_email = jobDetailsData.personalEmail;
    temp.caste_category = jobDetailsData.casteCategory;

    jobDetailsData.gender === data.gender
      ? (historyData.gender = jobDetailsData.gender)
      : (historyData.gender = `<font color='blue'>${jobDetailsData.gender}</font>`);

    data.blood_group === jobDetailsData.bloodGroup
      ? (historyData.blood_group = jobDetailsData.bloodGroup)
      : (historyData.blood_group = `<font color='blue'>${jobDetailsData.bloodGroup}</font>`);

    data.martial_status === jobDetailsData.maritalStatus
      ? (historyData.martial_status = jobDetailsData.maritalStatus)
      : (historyData.martial_status = `<font color='blue'>${jobDetailsData.maritalStatus}</font>`);

    data.employee_name === jobDetailsData.employee_name
      ? (historyData.employee_name = jobDetailsData.employee_name)
      : (historyData.employee_name = `<font color='blue'>${jobDetailsData.employee_name}</font>`);

    data.dateofbirth === jobDetailsData.dateofbirth
      ? (historyData.dateofbirth = jobDetailsData.dateofbirth)
      : (historyData.dateofbirth = `<font color='blue'>${moment(
          jobDetailsData?.dateofbirth
        ).format("YYYY-MM-DD")}</font>`);

    data.mobile === jobDetailsData.mobile
      ? (historyData.mobile = jobDetailsData.mobile)
      : (historyData.mobile = `<font color='blue'>${jobDetailsData.mobile}</font>`);

    data.hometown === jobDetailsData.permanentAddress
      ? (historyData.hometown = jobDetailsData.permanentAddress)
      : (historyData.hometown = `<font color='blue'>${jobDetailsData.permanentAddress}</font>`);

    data.current_location === jobDetailsData.currentAddress
      ? (historyData.current_location = jobDetailsData.currentAddress)
      : (historyData.current_location = `<font color='blue'>${jobDetailsData.currentAddress}</font>`);

    data.religion === jobDetailsData.religion
      ? (historyData.religion = jobDetailsData.religion)
      : (historyData.religion = `<font color='blue'>${jobDetailsData.religion}</font>`);

    data.alt_mobile_no === jobDetailsData.alternateMobileNo
      ? (historyData.alt_mobile_no = jobDetailsData.alternateMobileNo)
      : (historyData.alt_mobile_no = `<font color='blue'>${jobDetailsData.alternateMobileNo}</font>`);

    data.dlno === jobDetailsData.dlNo
      ? (historyData.dlno = jobDetailsData.dlNo)
      : (historyData.dlno = `<font color='blue'>${jobDetailsData.dlNo}</font>`);

    data.dlexpno === jobDetailsData.dlExpNo
      ? (historyData.dlexpno = jobDetailsData.dlExpNo)
      : (historyData.dlexpno = `<font color='blue'>${moment(
          jobDetailsData.dlExpNo
        ).format("DD-MM-YYYY")}</font>`);

    data.passportno === jobDetailsData.passportNumber
      ? (historyData.passportno = jobDetailsData.passportNumber)
      : (historyData.passportno = `<font color='blue'>${jobDetailsData.passportNumber}</font>`);

    data.passportexpno === jobDetailsData.passportDate
      ? (historyData.passportexpno = jobDetailsData.passportDate)
      : (historyData.passportexpno = `<font color='blue'>${moment(
          jobDetailsData.passportDate
        ).format("DD-MM-YYYY")}</font>`);

    data.pan_no === jobDetailsData.panNo
      ? (historyData.pan_no = jobDetailsData.panNo)
      : (historyData.pan_no = `<font color='blue'>${jobDetailsData.panNo}</font>`);

    data.aadhar === jobDetailsData.aadharNo
      ? (historyData.aadhar = jobDetailsData.aadharNo)
      : (historyData.aadhar = `<font color='blue'>${jobDetailsData.aadharNo}</font>`);

    jobDetailsData.personalEmail === data.personal_email
      ? (historyData.personal_email = jobDetailsData.personalEmail)
      : (historyData.personal_email = `<font color='blue'>${jobDetailsData.personalEmail}</font>`);

    jobDetailsData.casteCategory === data.caste_category
      ? (historyData.caste_category = jobDetailsData.casteCategory)
      : (historyData.caste_category = `<font color='blue'>${jobDetailsData.casteCategory}</font>`);

    await axios
      .post(`/api/employee/employeeDetailsHistory`, historyData)
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          // Update employee details
          await axios
            .put(
              `/api/employee/updateEmployeeDetailsUpdatableData/${empId}`,
              temp
            )
            .then((putRes) => {
              setAlertMessage({
                severity: "success",
                message: "Updated successfully !!",
              });
              setAlertOpen(true);
              getData();
              setIsEditing(false);
            })
            .catch((putErr) => {
              setAlertMessage({
                severity: "error",
                message: putErr.response
                  ? putErr.response.data.message
                  : "Error",
              });
              setAlertOpen(true);
            });
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "Error",
        });
        setAlertOpen(true);
      });
  };

  const handleCreateFamilyData = async () => {
    const postData = [];
    const putData = [];
    const allIds = [];

    familyData.forEach((obj, i) => {
      allIds.push(obj.familyUniqueId);
      if (obj.familyUniqueId === null) {
        postData.push({
          active: true,
          name: obj.name,
          emp_id: empId,
          relationship: obj.relationship,
          age: obj.age,
          contact_number: obj.contactDetails,
        });
      } else {
        putData.push({
          active: true,
          name: obj.name,
          emp_id: empId,
          family_structure_id: obj.familyUniqueId,
          relationship: obj.relationship,
          age: obj.age,
          contact_number: obj.contactDetails,
        });
      }
    });

    if (postData.length > 0) {
      await axios
        .post(`/api/employee/familystructure`, postData)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Family details created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
          }
          setAlertOpen(true);
          getFamilyData();
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!!",
          });
        });
    }
    if (putData.length > 0) {
      await axios
        .put(
          `/api/employee/updateFamilystructure/${allIds.toString()}`,
          putData
        )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Family details updated",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
          }
          setAlertOpen(true);
          getFamilyData();
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!!",
          });
        });
    }
  };

  const handleCreateExperience = async () => {
    const postData = [];
    const putData = [];
    const allIds = [];

    experienceData.forEach((obj, i) => {
      allIds.push(obj.experienceUniqueId);
      if (obj.experienceUniqueId === null) {
        postData.push({
          active: true,
          employer_name: obj.organizationWorking,
          designation: obj.designation,
          annual_salary_lakhs: obj.monthlySalaryUsd,
          exp_in_years: obj.experienceInYears,
          exp_in_months: obj.experienceInMonths,
          job_id: jobDetails?.Job_Profile?.job_id,
          skills: obj.natureOfWork,
        });
      } else {
        putData.push({
          active: true,
          exp_id: obj.experienceUniqueId,
          employer_name: obj.organizationWorking,
          designation: obj.designation,
          annual_salary_lakhs: obj.monthlySalaryUsd,
          exp_in_years: obj.experienceInYears,
          exp_in_months: obj.experienceInMonths,
          job_id: jobDetails?.Job_Profile?.job_id,
          skills: obj.natureOfWork,
        });
      }
    });

    if (postData.length > 0) {
      await axios
        .post(`/api/employee/createExperienceDetails`, postData)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Experience details created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
          }
          setAlertOpen(true);
          getData();
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!!",
          });
        });
    }
    if (putData.length > 0) {
      await axios
        .put(
          `/api/employee/updateExperienceDetails/${allIds.toString()}`,
          putData
        )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Experience details updated",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
          }
          setAlertOpen(true);
          getData();
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!!",
          });
        });
    }
  };

  const handleCreateQualification = async () => {
    const postData = [];
    const putData = [];
    const allQualificationIds = [];

    qualificationData.forEach((obj, i) => {
      allQualificationIds.push(obj.qualificationUniqueId);
      if (obj.qualificationUniqueId === null) {
        postData.push({
          graduation_id: obj.qualification,
          graduation_name: graduationOptions
            .map((obj1) => {
              if (Number(obj.qualification) === obj1.value) {
                return obj1.label;
              }
            })
            .toString(),
          graduation: obj.nameOfDegree,
          university: obj.universityName,
          academic_score: obj.universityScore,
          job_id: jobDetails?.Job_Profile?.job_id,
        });
      } else {
        putData.push({
          graduation_id: obj.qualification,
          graduation_name: graduationOptions
            .map((obj1) => {
              if (Number(obj.qualification) === obj1.value) {
                return obj1.label;
              }
            })
            .toString(),
          graduation: obj.nameOfDegree,
          university: obj.universityName,
          academic_score: obj.universityScore,
          edu_id: obj.qualificationUniqueId,
          job_id: jobDetails?.Job_Profile?.job_id,
        });
      }
    });

    if (postData.length > 0) {
      await axios
        .post(`/api/employee/createEducationDetails`, postData)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Education details created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
          }
          setAlertOpen(true);
          getData();
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!!",
          });
        });
    }
    if (putData.length > 0) {
      await axios
        .put(
          `/api/employee/updateEducationDetails/${allQualificationIds.toString()}`,
          putData
        )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Education details updated",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
          }
          setAlertOpen(true);
          getData();
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!!",
          });
        });
    }
  };

  const handleEditPersonalDetails = async () => {
    const temp = {};
    temp.employeeId = empId;
    temp.personal_medical_history = values.personalMedicalHistory;
    temp.family_medical_history = values.familyMedicalHistory;

    await axios
      .put(`/api/employee/EmployeeMedicalHistory/${empId}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Medical details updated",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
        }
        setAlertOpen(true);
        getData();
        setEditPersonalDetails(false);
      })
      .catch((err) => console.error(err));
  };

  const handleEditSkillsDetails = async () => {
    const temp = {};
    const allEmpSkills = values.Skills.map((obj) => obj.skills);
    temp.emp_id = empId;
    temp.key_skills = allEmpSkills.toString();

    await axios
      .put(`/api/employee/EmployeeKeySkills/${empId}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Skills updated",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
        }
        setAlertOpen(true);
        getData();
        setEditSkills(false);
      })
      .catch((err) => console.error(err));
  };

  const handleAddRows = () =>
    values?.Skills.reduce((total, obj) => total + obj.skills.length, 0);

  return (
    <>
      {/* <Box m={2}> */}
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          {data.job_type === "Non Teaching" ? (
            <CustomTabsHorizontal
              value={tab}
              onChange={handleTabChange}
              orientation="horizontal"
              variant="fullWidth"
              className="CustomTabsHorizontal"
            >
              <CustomTabHorizontal value="Personal" label="Personal" />
              <CustomTabHorizontal value="hrdata" label="Employment" />
              <CustomTabHorizontal value="Documents" label="Documents" />
              <CustomTabHorizontal value="Professional" label="Professional" />
            </CustomTabsHorizontal>
          ) : (
            <CustomTabsHorizontal
              value={tab}
              onChange={handleTabChange}
              orientation="horizontal"
              variant="scrollable"
              className="CustomTabsHorizontal"
            >
              <CustomTabHorizontal value="Personal" label="Personal" />
              <CustomTabHorizontal value="hrdata" label="Employment" />
              <CustomTabHorizontal value="academics" label="Academics" />
              <CustomTabHorizontal value="mentor" label="Mentor" />
              <CustomTabHorizontal value="Documents" label="Documents" />
              <CustomTabHorizontal value="Professional" label="Professional" />
            </CustomTabsHorizontal>
          )}
        </Grid>
        {tab === "Personal" && (
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
                <CustomTab value="Applicant" label="Personal" />
                <CustomTab value="candidate" label="Registration" />
                {/* <CustomTab value="visadetails" label="Visa Details" /> */}
                <CustomTab value="Family" label="Family" />
                <CustomTab value="Qualification" label="Qualification" />
                <CustomTab value="experience" label="Experience" />
                <CustomTab value="skills" label="Skills" />
                <CustomTab value="medicaldetails" label="Medical Details" />
              </CustomTabs>
            </Grid>
            <Grid item xs={8} md={10}>
              {subTab === "Applicant" && (
                <>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        p: 1,
                      }}
                    >
                      Personal Details
                      {(checkAdminAccess() || roleId === 6) && (
                        <IconButton size="small" onClick={handleEditClick}>
                          <EditIcon />
                        </IconButton>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} component={Paper} elevation={3} p={2}>
                    {isEditing ? (
                      <>
                        <Grid container rowSpacing={1.5} columnSpacing={2}>
                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">Name</Typography>
                          </Grid>
                          <Grid item xs={12} md={4.5}>
                            {checkFullAccess(empId) ? (
                              <CustomTextField
                                name="employee_name"
                                label="Name"
                                value={jobDetailsData.employee_name}
                                handleChange={handleChangePersonalData}
                                disabled
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {data.employee_name}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">Gender</Typography>
                          </Grid>
                          <Grid item xs={12} md={4.5}>
                            <CustomSelect
                              name="gender"
                              label="Gender"
                              value={jobDetailsData.gender}
                              items={[
                                { label: "Male", value: "M" },
                                { label: "Female", value: "F" },
                              ]}
                              handleChange={handleChangePersonalData}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">
                              Marital Status
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4.5}>
                            <CustomSelect
                              name="maritalStatus"
                              label="Marital Status"
                              value={jobDetailsData.maritalStatus}
                              items={[
                                { label: "Married", value: "M" },
                                { label: "Unmarried", value: "U" },
                              ]}
                              handleChange={handleChangePersonalData}
                            />
                          </Grid>
                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">DOB</Typography>
                          </Grid>
                          <Grid item xs={12} md={4.5}>
                            {checkFullAccess(empId) ? (
                              <CustomDatePicker
                                name="dateofbirth"
                                label="Date of Birth"
                                value={jobDetailsData.dateofbirth}
                                handleChangeAdvance={handleChangeDateAdvance}
                                disabled
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {moment(data.dateofbirth).format("DD-MM-YYYY")}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">
                              WhatsApp No.
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4.5}>
                            {checkFullAccess(empId) ? (
                              <CustomTextField
                                name="mobile"
                                label="Mobile"
                                value={jobDetailsData.mobile}
                                handleChange={handleChangePersonalData}
                                disabled
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {data.mobile}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">
                              Alternate Mobile No
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4.5}>
                            {checkFullAccess(empId) ? (
                              <CustomTextField
                                name="alternateMobileNo"
                                label="Alternate Mobile No "
                                value={jobDetailsData.alternateMobileNo}
                                handleChange={handleChangePersonalData}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {data.alternateMobileNo}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">E-mail</Typography>
                          </Grid>
                          <Grid item xs={12} md={4.5}>
                            {checkFullAccess(empId) ? (
                              <CustomTextField
                                name="personalEmail"
                                label="Email"
                                value={jobDetailsData.personalEmail}
                                handleChange={handleChangePersonalData}
                                checks={checks.personalEmail}
                                errors={errorMessages.personalEmail}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {data.alternateMobileNo}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">
                              Blood Group
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4.5}>
                            <CustomTextField
                              name="bloodGroup"
                              label="Blood Group"
                              value={jobDetailsData.bloodGroup}
                              handleChange={handleChangePersonalData}
                            />
                          </Grid>

                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">
                              Permanent Address
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4.5}>
                            <CustomTextField
                              name="permanentAddress"
                              label="Permanent Address"
                              value={jobDetailsData.permanentAddress}
                              handleChange={handleChangePersonalData}
                            />
                          </Grid>
                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">
                              Current Address
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4.5}>
                            <CustomTextField
                              name="currentAddress"
                              label="Current Address"
                              value={jobDetailsData.currentAddress}
                              handleChange={handleChangePersonalData}
                            />
                          </Grid>

                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">
                              Religion
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4.5}>
                            {checkFullAccess(empId) ? (
                              <CustomSelect
                                name="religion"
                                label="Religion"
                                items={religionList}
                                value={jobDetailsData.religion}
                                handleChange={handleChangePersonalData}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {data.religion}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">
                              Caste Category
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4.5}>
                            {checkFullAccess(empId) ? (
                              <CustomTextField
                                name="casteCategory"
                                label="Caste Category"
                                value={jobDetailsData.casteCategory}
                                handleChange={handleChangePersonalData}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {data.religion}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">PAN No</Typography>
                          </Grid>

                          <Grid item xs={12} md={4.5}>
                            {checkFullAccess(empId) ? (
                              <CustomTextField
                                name="panNo"
                                label="PAN No"
                                value={jobDetailsData.panNo}
                                handleChange={handleChangePersonalData}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {data.pan_no}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">
                              Aadhar No
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={4.5}>
                            {checkFullAccess(empId) ? (
                              <CustomTextField
                                name="aadharNo"
                                label="Aadhar No"
                                value={jobDetailsData.aadharNo}
                                handleChange={handleChangePersonalData}
                                checks={checks.aadharNo}
                                errors={errorMessages.aadharNo}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {data.aadhar}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">
                              DL Number
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={4.5}>
                            {checkFullAccess(empId) ? (
                              <CustomTextField
                                name="dlNo"
                                label="DL Number"
                                value={jobDetailsData.dlNo}
                                handleChange={handleChangePersonalData}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {data.dlno}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">
                              DL Expiry Date
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={4.5}>
                            {checkFullAccess(empId) ? (
                              <CustomDatePicker
                                name="dlExpNo"
                                label="DL Expiry Date"
                                value={jobDetailsData.dlExpNo}
                                handleChangeAdvance={handleChangeDateAdvance}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {data.dlexpno}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">
                              Passport No
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={4.5}>
                            {checkFullAccess(empId) ? (
                              <CustomTextField
                                name="passportNumber"
                                label="Passport No"
                                value={jobDetailsData.passportNumber}
                                handleChange={handleChangePersonalData}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {data.passportno}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={1.5}>
                            <Typography variant="subtitle2">
                              Passport Expiry Date
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={4.5}>
                            {checkFullAccess(empId) ? (
                              <CustomDatePicker
                                name="passportDate"
                                label="Passport Expiry Date"
                                value={jobDetailsData.passportDate}
                                handleChangeAdvance={handleChangeDateAdvance}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {data.dlexpno}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} mt={2} align="right">
                            <Button
                              variant="contained"
                              color="error"
                              sx={{ mr: 2, borderRadius: 2 }}
                              onClick={() => setIsEditing(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              sx={{ borderRadius: 2 }}
                              variant="contained"
                              color="success"
                              onClick={handleEditPersonalData}
                            >
                              Save
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid container rowSpacing={1.5} columnSpacing={2}>
                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">Name</Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data.employee_name}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">Gender</Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data.gender === "M" ? "Male" : "Female"}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              Marital Status
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data.martial_status === "M"
                                ? "Married"
                                : "Unmarried"}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">DOB</Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data.dateofbirth
                                ? moment(data.dateofbirth).format("DD-MM-YYYY")
                                : ""}
                            </Typography>
                          </Grid>

                          {/* <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              Father Name
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data.father_name}
                            </Typography>
                          </Grid> */}

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              WhatsApp No.
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {maskMobile(data.mobile)}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              Alternative Mobile No
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {maskMobile(data.alt_mobile_no)}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              Personal E-mail
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data.personal_email}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              Blood Group
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data.blood_group}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              Permanant Address
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ overflowWrap: "break-word" }}
                            >
                              {data.hometown}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              Current Address
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ overflowWrap: "break-word" }}
                            >
                              {data.current_location}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              Religion
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data.religion}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              Caste Category
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data.caste_category}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">PAN No</Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data.pan_no}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              Aadhar No
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data.aadhar}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              Driving License Number
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data.dlno}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              Driving License Valid Till
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data?.dlexpno
                                ? moment(data?.dlexpno).format("DD-MM-YYYY")
                                : ""}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              Passport No
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data.passportno}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">
                              Passport Expiry Date
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">
                              {data.passportexpno
                                ? moment(data.passportexpno).format(
                                    "DD-MM-YYYY"
                                  )
                                : ""}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </>
              )}

              {subTab === "candidate" && (
                <Grid item xs={12}>
                  <CandidateDetailsView id={data.job_id} />
                </Grid>
              )}

              {subTab === "visadetails" && (
                <>
                  <Grid
                    container
                    rowSpacing={0}
                    columnSpacing={2}
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <CustomModal
                      open={modalOpen}
                      setOpen={setModalOpen}
                      title={modalContent.title}
                      message={modalContent.message}
                      buttons={modalContent.buttons}
                    />

                    <Grid item xs={12} mt={2}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          backgroundColor: "rgba(74, 87, 169, 0.1)",
                          color: "#46464E",
                          padding: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Visa Details
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleAddVisa}
                          align="right"
                          sx={{ borderRadius: 2 }}
                        >
                          Add
                        </Button>
                      </Typography>
                    </Grid>

                    {visaHistory.length > 0 ? (
                      <Grid item xs={12} mt={2}>
                        <TableContainer component={Paper}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>Visa No</StyledTableCell>
                                <StyledTableCell>
                                  Visa expiry Date
                                </StyledTableCell>
                                <StyledTableCell>Remarks</StyledTableCell>
                                <StyledTableCell>Created By</StyledTableCell>
                                <StyledTableCell>Created Date</StyledTableCell>
                                {roleName === "Admin" ||
                                roleName === "HR ROLE" ||
                                roleName === "Super Admin" ? (
                                  <StyledTableCell>Active</StyledTableCell>
                                ) : (
                                  <></>
                                )}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {visaHistory.map((obj, i) => {
                                return (
                                  <TableRow key={i}>
                                    <StyledTableCell>
                                      {obj.visa_document_number}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {moment(obj.visa_expiry_date).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {obj.remarks}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {obj.created_username}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {moment(obj.created_date).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </StyledTableCell>
                                    {(roleName === "Admin" ||
                                      roleName === "HR ROLE" ||
                                      roleName === "Super Admin") &&
                                    obj.active === true ? (
                                      <StyledTableCell>
                                        <IconButton
                                          label="Result"
                                          style={{ color: "green" }}
                                          onClick={() => handleActiveVisa(obj)}
                                        >
                                          <Check fontSize="small" />
                                        </IconButton>
                                      </StyledTableCell>
                                    ) : (roleName === "Admin" ||
                                        roleName === "HR ROLE" ||
                                        roleName === "Super Admin") &&
                                      obj.active === false ? (
                                      <StyledTableCell>
                                        <IconButton
                                          label="Result"
                                          style={{ color: "red" }}
                                          onClick={() => handleActiveVisa(obj)}
                                        >
                                          <HighlightOff fontSize="small" />
                                        </IconButton>
                                      </StyledTableCell>
                                    ) : (
                                      <></>
                                    )}
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    ) : (
                      <></>
                    )}

                    {visaData.map((obj, i) => {
                      return (
                        <>
                          <Grid item xs={12} align="right">
                            <IconButton
                              color="error"
                              onClick={handleRemoveVisadetailsBox}
                              disabled={
                                visaData.length === 1 || obj.visaNo !== ""
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <CustomTextField
                              name="visaNo"
                              label="Visa No"
                              value={obj.visaNo}
                              handleChange={(e) => handleChangeVisa(e, i)}
                              checks={checks[obj.visaNo]}
                              errors={errorMessages[obj.visaNo]}
                            />
                          </Grid>

                          <Grid item xs={12} md={4} mt={2}>
                            <CustomDatePicker
                              name={"visaExpiryDate" + "-" + i}
                              label="Visa Expiry Date"
                              value={obj.visaExpiryDate}
                              handleChangeAdvance={handleChangeVisaAdvance}
                            />
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <CustomTextField
                              rows={2}
                              multiline
                              name="remarks"
                              label="Remarks"
                              value={obj.remarks}
                              handleChange={(e) => handleChangeVisa(e, i)}
                            />
                          </Grid>
                        </>
                      );
                    })}

                    <Grid item xs={12} align="right">
                      <Button
                        sx={{ borderRadius: 2 }}
                        variant="contained"
                        color="success"
                        onClick={handleVisaCreate}
                        disabled={!isFormVisaDataValid}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}

              {subTab === "Family" && (
                <>
                  <Grid item xs={12}>
                    <CustomModal
                      open={modalOpen}
                      setOpen={setModalOpen}
                      title={modalContent.title}
                      message={modalContent.message}
                      buttons={modalContent.buttons}
                    />

                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        padding: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Family Details
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleAddfamilydetailsBox}
                        align="right"
                        sx={{ borderRadius: 2 }}
                      >
                        Add
                      </Button>
                    </Typography>
                  </Grid>

                  {familyHistory.length > 0 ? (
                    <Grid item xs={12} mt={2}>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Name</StyledTableCell>
                              <StyledTableCell>Relationship</StyledTableCell>
                              <StyledTableCell>Contact</StyledTableCell>
                              <StyledTableCell>Age</StyledTableCell>
                              <StyledTableCell>Created By</StyledTableCell>
                              <StyledTableCell>Created Date</StyledTableCell>
                              {roleName === "Admin" ||
                              roleName === "HR ROLE" ||
                              roleName === "Super Admin" ? (
                                <StyledTableCell>Active</StyledTableCell>
                              ) : (
                                <></>
                              )}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {familyHistory.map((obj, i) => {
                              return (
                                <TableRow key={i}>
                                  <StyledTableCell>{obj.name}</StyledTableCell>
                                  <StyledTableCell>
                                    {obj.relationship}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {obj.contact_number}
                                  </StyledTableCell>
                                  <StyledTableCell>{obj.age}</StyledTableCell>
                                  <StyledTableCell>
                                    {obj.created_username}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {moment(obj.created_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </StyledTableCell>

                                  {(roleName === "Admin" ||
                                    roleName === "HR ROLE" ||
                                    roleName === "Super Admin") &&
                                  obj.active === true ? (
                                    <StyledTableCell>
                                      <IconButton
                                        label="Result"
                                        style={{ color: "green" }}
                                        onClick={() => handleActiveFamily(obj)}
                                      >
                                        <Check fontSize="small" />
                                      </IconButton>
                                    </StyledTableCell>
                                  ) : (roleName === "Admin" ||
                                      roleName === "HR ROLE" ||
                                      roleName === "Super Admin") &&
                                    obj.active === false ? (
                                    <StyledTableCell>
                                      <IconButton
                                        label="Result"
                                        style={{ color: "red" }}
                                        onClick={() => handleActiveFamily(obj)}
                                      >
                                        <HighlightOff fontSize="small" />
                                      </IconButton>
                                    </StyledTableCell>
                                  ) : (
                                    <></>
                                  )}
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  ) : (
                    <></>
                  )}

                  {familyData.map((obj, i) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        component={Paper}
                        rowSpacing={2}
                        elevation={3}
                        p={2}
                        marginTop={2}
                        key={i}
                      >
                        <>
                          <Grid container rowSpacing={1.5} columnSpacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="h6">
                                Fill the details
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6} align="right">
                              <IconButton
                                color="error"
                                onClick={handleRemovefamilydetailsBox}
                                disabled={
                                  familyData.length === 1 ||
                                  obj.name !== "" ||
                                  obj.relationship !== ""
                                }
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Grid>
                            <Grid item xs={12} md={1.5}>
                              <Typography variant="subtitle2">Name</Typography>
                            </Grid>
                            <Grid item xs={12} md={4.5}>
                              <CustomTextField
                                name="name"
                                label="Name"
                                value={obj.name}
                                handleChange={(e) => handleFamilyChange(e, i)}
                              />
                            </Grid>
                            <Grid item xs={12} md={1.5}>
                              <Typography variant="subtitle2">
                                Relationship
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={4.5}>
                              <CustomSelect
                                name="relationship"
                                label="Relationship"
                                value={obj.relationship}
                                items={[
                                  {
                                    value: "Spouse",
                                    label: "Spouse",
                                  },
                                  {
                                    value: "Father",
                                    label: "Father",
                                  },
                                  {
                                    value: "Mother",
                                    label: "Mother",
                                  },
                                  {
                                    value: "Brother",
                                    label: "Brother",
                                  },
                                  {
                                    value: "Son",
                                    label: "Son",
                                  },
                                  {
                                    value: "Daughter",
                                    label: "Daughter",
                                  },
                                ]}
                                handleChange={(e) => handleFamilyChange(e, i)}
                              />
                            </Grid>
                            <Grid item xs={12} md={1.5}>
                              <Typography variant="subtitle2">
                                Contact Details
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={4.5}>
                              <CustomTextField
                                name="contactDetails"
                                label="contact Details"
                                value={obj.contactDetails}
                                handleChange={(e) => handleFamilyChange(e, i)}
                              />
                            </Grid>
                            <Grid item xs={12} md={1.5}>
                              <Typography variant="subtitle2">Age</Typography>
                            </Grid>
                            <Grid item xs={12} md={4.5}>
                              <CustomTextField
                                name="age"
                                label="Age"
                                value={obj.age}
                                handleChange={(e) => handleFamilyChange(e, i)}
                              />
                            </Grid>
                          </Grid>
                        </>
                      </Grid>
                    );
                  })}

                  <Grid item xs={12} mt={2} align="right">
                    <Button
                      sx={{ borderRadius: 2 }}
                      variant="contained"
                      color="success"
                      onClick={handleCreateFamilyData}
                      disabled={!isValidFamily}
                    >
                      Save
                    </Button>
                  </Grid>
                </>
              )}
              {subTab === "Qualification" && (
                <>
                  <Grid item xs={12}>
                    <Grid container columnSpacing={2}>
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            backgroundColor: "rgba(74, 87, 169, 0.1)",
                            color: "#46464E",
                            p: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          Educational Details
                          <Button
                            variant="contained"
                            color="success"
                            onClick={handleAddQualificationData}
                            align="right"
                          >
                            Add
                          </Button>
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        {jobDetails.Job_Profile !== undefined &&
                        jobDetails.Job_Profile.Educational_Details.length >
                          0 ? (
                          <TableContainer component={Paper}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>
                                    Qualification
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    Name of Degree
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    University Name
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    University Score
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {jobDetails.Job_Profile !== undefined ? (
                                  jobDetails.Job_Profile.Educational_Details.map(
                                    (obj, i) => {
                                      return (
                                        <TableRow key={i}>
                                          <StyledTableCell>
                                            {obj.graduation}
                                          </StyledTableCell>
                                          <StyledTableCell>
                                            {obj.graduation_name}
                                          </StyledTableCell>
                                          <StyledTableCell>
                                            {obj.university}
                                          </StyledTableCell>
                                          <StyledTableCell>
                                            {obj.academic_score}
                                          </StyledTableCell>
                                        </TableRow>
                                      );
                                    }
                                  )
                                ) : (
                                  <></>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <></>
                        )}
                      </Grid>
                    </Grid>

                    {qualificationData.map((obj, i) => {
                      return (
                        <Grid
                          item
                          xs={12}
                          component={Paper}
                          rowSpacing={2}
                          elevation={3}
                          p={2}
                          marginTop={1}
                          key={i}
                        >
                          <>
                            <Grid container rowSpacing={1.5} columnSpacing={2}>
                              <CustomModal
                                open={modalOpen}
                                setOpen={setModalOpen}
                                title={modalContent.title}
                                message={modalContent.message}
                                buttons={modalContent.buttons}
                              />
                              <Grid item xs={12} md={6}>
                                <Typography variant="h6">
                                  Fill the details
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6} align="right">
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    handleRemoveQualificationData(obj)
                                  }
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2">
                                  Qualification
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <CustomSelect
                                  name="qualification"
                                  label="Qualification"
                                  value={obj.qualification}
                                  items={graduationOptions}
                                  handleChange={(e) =>
                                    handleQualification(e, i)
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2">
                                  Name of Degree
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <CustomTextField
                                  name="nameOfDegree"
                                  label="Name of degree"
                                  value={obj.nameOfDegree}
                                  handleChange={(e) =>
                                    handleQualification(e, i)
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2">
                                  University Name
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <CustomTextField
                                  name="universityName"
                                  label="University Name"
                                  value={obj.universityName}
                                  handleChange={(e) =>
                                    handleQualification(e, i)
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2">
                                  University Score(in %)
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <CustomTextField
                                  name="universityScore"
                                  label="University Score"
                                  value={obj.universityScore}
                                  handleChange={(e) =>
                                    handleQualification(e, i)
                                  }
                                />
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                      );
                    })}
                    <Grid item xs={12} mt={1} align="right">
                      <Button
                        color="success"
                        variant="contained"
                        sx={{ borderRadius: 2 }}
                        onClick={handleCreateQualification}
                        disabled={!qualificationValid}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
              {subTab === "experience" && (
                <>
                  <Grid item xs={12}>
                    <Grid container columnSpacing={2}>
                      <Grid item xs={12}>
                        <CustomModal
                          open={modalOpen}
                          setOpen={setModalOpen}
                          title={modalContent.title}
                          message={modalContent.message}
                          buttons={modalContent.buttons}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            backgroundColor: "rgba(74, 87, 169, 0.1)",
                            color: "#46464E",
                            p: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          Experience Details
                          <Button
                            variant="contained"
                            color="success"
                            onClick={handleAddBox2}
                            align="right"
                          >
                            Add
                          </Button>
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        {experienceHistory !== undefined &&
                        experienceHistory.length > 0 ? (
                          <TableContainer component={Paper}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>
                                    Organization
                                  </StyledTableCell>
                                  <StyledTableCell>Designation</StyledTableCell>
                                  <StyledTableCell>
                                    Monthly Salary
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    Experience in years
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    Experience in months
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    Nature of work
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>

                              <TableBody>
                                {experienceHistory !== undefined ? (
                                  experienceHistory.map((obj, i) => {
                                    return (
                                      <TableRow key={i}>
                                        <StyledTableCell>
                                          {obj.employer_name}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {obj.designation}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {obj.annual_salary_lakhs}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {obj.exp_in_years}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {obj.exp_in_months}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {obj.skills}
                                        </StyledTableCell>
                                      </TableRow>
                                    );
                                  })
                                ) : (
                                  <></>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <></>
                        )}
                      </Grid>
                    </Grid>
                    {experienceData.map((obj, i) => {
                      return (
                        <>
                          <Grid
                            item
                            xs={12}
                            component={Paper}
                            elevation={3}
                            p={2}
                            marginTop={1}
                            key={i}
                          >
                            <Grid container rowSpacing={1} columnSpacing={2}>
                              <Grid item xs={12} align="right">
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    handleRemoveExperienceData(obj)
                                  }
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2">
                                  Organization worked/working
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <CustomTextField
                                  name="organizationWorking"
                                  label=" Organization worked/working*"
                                  value={obj.organizationWorking}
                                  handleChange={(e) =>
                                    handleChangeExperience(e, i)
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2">
                                  Designation
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <CustomTextField
                                  name="designation"
                                  label="Designation"
                                  value={obj.designation}
                                  handleChange={(e) =>
                                    handleChangeExperience(e, i)
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2">
                                  Monthly Salary
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <CustomTextField
                                  name="monthlySalaryUsd"
                                  label="Monthly Salary"
                                  value={obj.monthlySalaryUsd}
                                  handleChange={(e) =>
                                    handleChangeExperience(e, i)
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2">
                                  Experience (years)
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <CustomTextField
                                  name="experienceInYears"
                                  label="Experience (years)"
                                  value={obj.experienceInYears}
                                  handleChange={(e) =>
                                    handleChangeExperience(e, i)
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2">
                                  Experience (months)
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <CustomTextField
                                  name="experienceInMonths"
                                  label="Experience (months)"
                                  value={obj.experienceInMonths}
                                  handleChange={(e) =>
                                    handleChangeExperience(e, i)
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2">
                                  Nature of Work
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <CustomTextField
                                  name="natureOfWork"
                                  label="Nature of Work"
                                  value={obj.natureOfWork}
                                  handleChange={(e) =>
                                    handleChangeExperience(e, i)
                                  }
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      );
                    })}
                    <Grid item xs={12} mt={1} align="right">
                      <Button
                        color="success"
                        variant="contained"
                        sx={{ borderRadius: 2 }}
                        onClick={handleCreateExperience}
                        disabled={!isExperienceValid}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
              {subTab === "medicaldetails" && (
                <>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        p: 1,
                      }}
                    >
                      Medical History
                      {checkAdminAccess() && (
                        <IconButton
                          size="small"
                          onClick={handlePersonalEditClick}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Grid
                          container
                          justifyContent="center"
                          alignItems="center"
                          rowSpacing={2}
                          columnSpacing={2}
                        >
                          {editPersonalDetails ? (
                            <>
                              <Grid item xs={12} md={6} align="center">
                                <Typography variant="subtitle2">
                                  Personal Medical History
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6} align="center">
                                <Typography variant="subtitle2">
                                  Family Medical History
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <CustomTextField
                                  rows={2}
                                  multiline
                                  name="personalMedicalHistory"
                                  value={values.personalMedicalHistory}
                                  label=""
                                  handleChange={handleChange}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <CustomTextField
                                  rows={2}
                                  multiline
                                  name="familyMedicalHistory"
                                  value={values.familyMedicalHistory}
                                  label=""
                                  handleChange={handleChange}
                                />
                              </Grid>
                              <Grid item xs={12} align="right">
                                <Button
                                  variant="contained"
                                  sx={{ borderRadius: 2 }}
                                  color="error"
                                  onClick={() => setEditPersonalDetails(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  sx={{ borderRadius: 2, marginLeft: 2 }}
                                  color="success"
                                  onClick={handleEditPersonalDetails}
                                >
                                  SAVE
                                </Button>
                              </Grid>
                            </>
                          ) : (
                            <>
                              <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2">
                                  Personal Medical History
                                </Typography>
                              </Grid>

                              <Grid item xs={12} md={9}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {data.personal_medical_history}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2">
                                  Family Medical History
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={9}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {data.family_medical_history}
                                </Typography>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </>
              )}

              {subTab === "skills" && (
                <>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        p: 1,
                      }}
                    >
                      Skills
                      {checkAdminAccess() ||
                      empId === empIdfromSessionStorage ? (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => setEditSkills(true)}
                          >
                            <EditIcon />
                          </IconButton>
                        </>
                      ) : (
                        <></>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Grid
                          container
                          justifyContent="flex-start"
                          alignItems="center"
                          rowSpacing={2}
                          columnSpacing={2}
                        >
                          {editSkills ? (
                            <>
                              {values?.Skills?.map((obj, i) => {
                                const index = i + 1;
                                return (
                                  <>
                                    <Grid item xs={12} md={6} align="left">
                                      <CustomTextField
                                        name="skills"
                                        label={`Skill` + "  " + index}
                                        value={obj.skills}
                                        handleChange={(e) => handleChange(e, i)}
                                      />
                                    </Grid>
                                  </>
                                );
                              })}

                              <Grid item xs={12} align="left">
                                {values?.Skills?.length > 0 && (
                                  <Button
                                    variant="contained"
                                    color="error"
                                    sx={{
                                      borderRadius: 2,
                                      marginRight: 5,
                                    }}
                                    onClick={deleteRow}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </Button>
                                )}

                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={handleAdd}
                                  disabled={handleAddRows() >= 250}
                                  align="right"
                                  sx={{ borderRadius: 2 }}
                                >
                                  <AddIcon fontSize="small" />
                                </Button>
                              </Grid>

                              <Grid item xs={12} align="right">
                                <Button
                                  variant="contained"
                                  sx={{ borderRadius: 2 }}
                                  color="error"
                                  onClick={() => setEditSkills(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  sx={{ borderRadius: 2, marginLeft: 2 }}
                                  color="success"
                                  onClick={handleEditSkillsDetails}
                                  disabled={
                                    values?.Skills?.every(
                                      (obj) => obj.skills === ""
                                    ) || handleAddRows() > 250
                                  }
                                >
                                  SAVE
                                </Button>
                              </Grid>
                            </>
                          ) : (
                            <>
                              <Grid item xs={12} md={12}>
                                <Typography variant="subtitle2">
                                  Skills
                                </Typography>
                              </Grid>

                              {values?.Skills.map((obj) => {
                                return (
                                  <>
                                    <Grid item xs={12} md={12}>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                      >
                                        <li> {obj.skills}</li>{" "}
                                      </Typography>
                                    </Grid>
                                  </>
                                );
                              })}
                            </>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        )}
        {tab === "Documents" && (
          <>
            <EmployeeDetailsViewDocuments
              state={state}
              type={type}
              data={data}
            />
          </>
        )}
        {tab === "hrdata" && (
          <>
            <EmployeeDetailsViewHRData
              empId={empId}
              offerId={offerId}
              checks={checks}
              errorMessages={errorMessages}
              state={state}
              type={type}
              employeeName={data.employee_name}
              empcode={data.empcode}
            />
          </>
        )}
        {tab === "academics" && (
          <>
            <EmployeeDetailsViewAcademics
              state={state}
              type={type}
              data={data}
            />
          </>
        )}
        {tab === "Professional" && (
          <>
            <EmployeeDetailsViewProfessional
              empId={empId}
              state={state}
              type={type}
              data={data}
            />
          </>
        )}
        {tab === "mentor" && (
          <>
            <EmployeeDetailsViewMentor state={state} type={type} data={data} />
          </>
        )}
      </Grid>
      {/* </Box> */}
    </>
  );
}

export default EmployeeDetailsView;
