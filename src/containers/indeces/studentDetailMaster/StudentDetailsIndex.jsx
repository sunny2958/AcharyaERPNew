import { useState, useEffect, useRef } from "react";
import axios from "../../../services/Api";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  styled,
  Tab,
  Tabs,
  Tooltip,
  tooltipClasses,
  Typography,
  CircularProgress,
} from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import GridIndex from "../../../components/GridIndex";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { maskEmail, maskMobile } from "../../../utils/MaskData";
import ModalWrapper from "../../../components/ModalWrapper";
import AssignUsnForm from "../../../pages/forms/studentMaster/AssignUsnForm";
import moment from "moment";
import { GridActionsCellItem } from "@mui/x-data-grid";
import PrintIcon from "@mui/icons-material/Print";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";
import { useLocation, useNavigate } from "react-router-dom";
import { HighlightOff } from "@mui/icons-material";
import PortraitIcon from "@mui/icons-material/Portrait";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { Person4Rounded } from "@mui/icons-material";
import { GenerateProvisionalCertificate } from "../../../pages/forms/studentDetailMaster/GenerateProvisionalCertificate";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { GenerateTranscriptPdf } from "../../../pages/forms/studentDetailMaster/GenerateTranscriptPdf";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import { CustomDataExport } from "../../../components/CustomDataExport";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AuditingStatusForm from "../../../pages/forms/studentMaster/AuditingStatusForm";
import { makeStyles } from "@mui/styles";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import PdfUploadModal from "../../../components/PdfUploadModal";

const useStyle = makeStyles((theme) => ({
  applied: {
    background: "#81d4fa !important",
  },
  approved: {
    background: "#a5d6a7 !important",
  },
  cancelled: {
    background: "#ef9a9a !important",
  },
}));

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

const yearList = [
  { value: "1", label: "Year 1", semValue: "0" },
  { value: "2", label: "Year 2", semValue: "0" },
  { value: "3", label: "Year 3", semValue: "0" },
  { value: "4", label: "Year 4", semValue: "0" },
  { value: "5", label: "Year 5", semValue: "0" },
  { value: "6", label: "Year 6", semValue: "0" }
];

const semList = [
  { value: "1", label: "1 yr/sem 1", yearValue: "1" },
  { value: "2", label: "1 yr/sem 2", yearValue: "1" },
  { value: "3", label: "2 yr/sem 3", yearValue: "2" },
  { value: "4", label: "2 yr/sem 4", yearValue: "2" },
  { value: "5", label: "3 yr/sem 5", yearValue: "3" },
  { value: "6", label: "3 yr/sem 6", yearValue: "3" },
  { value: "7", label: "4 yr/sem 7", yearValue: "4" },
  { value: "8", label: "4 yr/sem 8", yearValue: "4" },
  { value: "9", label: "5 yr/sem 9", yearValue: "5" },
  { value: "10", label: "5 yr/sem 10", yearValue: "5" },
  { value: "11", label: "6 yr/sem 11", yearValue: "6" },
  { value: "12", label: "6 yr/sem 12", yearValue: "6" },
];

const initialValues = {
  acyearId: null,
  schoolId: null,
  programId: null,
  programSpeId: null,
  categoryId: null,
  year: null,
  sem: null
};
const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const schoolID = JSON.parse(sessionStorage.getItem("userData"))?.school_id;
const deptID = JSON.parse(sessionStorage.getItem("userData"))?.dept_id;
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

function StudentDetailsIndex() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [paginationData, setPaginationData] = useState({
    rows: [],
    loading: false,
    page: 0,
    pageSize: 100,
    total: 0,
  });
  const [filterString, setFilterString] = useState("");
  const [usnModal, setUsnModal] = useState(false);
  const [yearSemModal, setYearSemModal] = useState(false);
  const [yearSemLoading, setYearSemLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [printLoading, setPrintLoading] = useState(false);
  const [courseWrapperOpen, setCourseWrapperOpen] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [allRecords, setAllrecords] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programData, setProgramData] = useState();
  const [tab, setTab] = useState("Active Student");
  const [auditingWrapperOpen, setAuditingWrapperOpen] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    candidate_id: false,
    application_no_npf: false,
    acharya_email: false,
    mobile: false,
    fee_template_name: false,
    Na_nationality: false,
    religion: false,
    current_state: false,
    current_city: false,
    current_country: false,
    fee_admission_sub_category_short_name: false,
    mentor: pathname.toLowerCase() === "/student-master-user" ? false : true,
    notes: false,
    audit_status: false,
    laptop_status: false,
    feeTemplateRemaks: false,
    // upload: false
  });

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [imageOpen, setImageUploadOpen] = useState(false);

  const classes = useStyle();

  useEffect(() => {
    getAcademicYears();
    getSchoolDetails();
    if (
      pathname.toLowerCase() === "/student-master-user" ||
      pathname.toLowerCase() === "/student-master-inst" ||
      pathname.toLowerCase() === "/student-master-dept"
    ) {
      getUserSchoolDetails();
    }
    setCrumbs([{ name: "Student Master" }, { name: tab }]);
  }, [pathname, tab]);

  useEffect(() => {
    getData();
  }, [
    values.acyearId,
    tab,
  ])


  useEffect(() => {
    getProgram();
    getData();
  }, [values.schoolId]);

  useEffect(() => {
    getData();
    getCategoryDetails();
  }, [values.programId]);

  useEffect(() => {
    getData();
  }, [values.categoryId]);

  const getCategoryDetails = async () => {
    await axios
      .get(`/api/student/FeeAdmissionCategory`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.fee_admission_category_id,
            label: obj.fee_admission_category_short_name,
          });
        });
        setCategoryOptions(optionData);
      })
      .catch((err) => console.error(err));
  };
  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name_short,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };
  const getUserSchoolDetails = async () => {
    setValues((prev) => ({
      ...prev,
      schoolId: schoolID,
    }));
  };
  const getProgram = async () => {
    const { schoolId } = values;
    if (!schoolId) return null;

    try {
      const { data: response } = await axios.get(
        `/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
      );
      const optionData = [];
      const responseData = response.data;
      response.data.forEach((obj) => {
        optionData.push({
          value: obj.program_specialization_id,
          label: `${obj.program_short_name} - ${obj.program_specialization_name}`,
        });
      });
      const programObject = responseData.reduce((acc, next) => {
        acc[next.program_specialization_id] = next;
        return acc;
      }, {});
      setProgramOptions(optionData);
      setProgramData(programObject);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load the programs data",
      });
      setAlertOpen(true);
    }
  };
  const getAcademicYears = async () => {
    try {
      const response = await axios.get("/api/academic/academic_year");
      const optionData = [];
      const ids = [];
      response.data.data.forEach((obj) => {
        optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
        ids.push(obj.current_year);
      });
      const latestYear = Math.max(...ids);
      const latestYearId = response.data.data.filter(
        (obj) => obj.current_year === latestYear
      );
      setAcademicYearOptions(optionData);
      setValues((prev) => ({
        ...prev,
        acyearId: latestYearId[0].ac_year_id,
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the academic years !!",
      });
      setAlertOpen(true);
    }
  };
  const getData = async () => {
    const { acyearId, schoolId, programId, categoryId } = values;
    const { page, pageSize } = paginationData;

    if (!acyearId) return;

    try {
      setPaginationData((prev) => ({
        ...prev,
        loading: true,
      }));

      let params = {
        // page,
        // page_size: pageSize, // remove pagination
        page: 0,
        page_size: 1000000,
        sort: "created_date",
        ac_year_id: acyearId,
        ...(schoolId && { school_id: schoolId }),
        ...(categoryId && { fee_admission_category_id: categoryId }),
        ...(programId && {
          program_id: programData[values?.programId]?.program_id,
        }),
        ...(programId && { program_specialization_id: programId }),
        ...(filterString && { keyword: filterString }),
      };

      let apiEndpoint =
        tab !== "Active Student"
          ? "/api/student/inActiveStudentDetailsIndex"
          : "/api/student/studentDetailsIndex";

      switch (pathname.toLowerCase()) {
        case "/student-master-user":
          params = {
            ...params,
            page: 0,
          };
          break;

        case "/student-master-inst":
          params = {
            ...params,
          };
          break;

        case "/student-master-dept":
          apiEndpoint =
            tab !== "Active Student"
              ? "/api/student/InactiveStudentDetailsByDept"
              : "/api/student/studentDetailsByDept";
          params = {
            ...params,
            pageSize: params.page_size,
            acYearId: params.ac_year_id,
            dept_id: deptID,
          };
          delete params.page_size;
          delete params.ac_year_id;
          break;

        case "/student-master-intl":
          params = {
            ...params,
            fee_admission_category_id: 2,
          };
          break;

        default:
          apiEndpoint =
            tab !== "Active Student"
              ? "/api/student/inActiveStudentDetailsIndex"
              : "/api/student/studentDetailsIndex";
      }

      const response = await axios.get(apiEndpoint, { params });

      const { content, totalElements } = response.data.data.Paginated_data;

      if (totalElements > 0) {
        getAllRecords(totalElements);
      }

      setPaginationData((prev) => ({
        ...prev,
        rows: content,
        total: totalElements,
        loading: false,
      }));
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred";

      setAlertMessage({
        severity: "error",
        message: errorMessage,
      });
      setAlertOpen(true);

      setPaginationData((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const getAllRecords = async (pageSize) => {
    const searchString = filterString !== "" ? "&keyword=" + filterString : "";

    await axios(
      `/api/student/studentDetailsIndexCustomExpoet?page=0&page_size=${pageSize}&sort=created_by&ac_year_id=${values.acyearId}${searchString}`
    )
      .then((res) => {
        setAllrecords(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };
  const handleChangeAdvance = async (name, newValue, rowValues) => {
    getYearSemValue(newValue, rowValues);
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "schoolId" && { programId: "", categoryId: "" }),
      ...(name === "programId" && { categoryId: "" }),
    }));
  };

  const getYearSemValue = (newValue, rowValues) => {
    setValues((prevState) => ({
      ...prevState,
      year: rowValues?.program_type == "Semester" ? semList.find((li) => li.value == newValue)?.yearValue : newValue,
      sem: rowValues?.program_type == "Semester" ? newValue : yearList.find((li) => li.value == newValue)?.semValue
    }))
  };

  const handleOnPageChange = (newPage) => {
    setPaginationData((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleOnPageSizeChange = (newPageSize) => {
    setPaginationData((prev) => ({
      ...prev,
      pageSize: newPageSize,
    }));
  };

  const handleOnFilterChange = (value) => {
    setFilterString(
      value.items.length > 0
        ? value.items[0].value === undefined
          ? ""
          : value.items[0].value
        : value.quickFilterValues.join(" ")
    );
  };

  const handleUpdateUsn = (data) => {
    setRowData(data);
    setUsnModal(true);
  };

  const handleUpdateYearSem = (data) => {
    setValues((prevState) => ({
      ...prevState,
      year: null,
      sem: null
    }));
    setRowData(data);
    setYearSemModal(true);
  };
  const handleProvisionalCertificate = async (data) => {
    setPrintLoading(true);
    const blobFile = await GenerateProvisionalCertificate(data);
    window.open(URL.createObjectURL(blobFile));
    setPrintLoading(false);
  };

  const handleDocumentCollection = async (id) => {
    const transcriptData = await axios
      .get(`/api/student/getDataForTestimonials/${id}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));
    const blobFile = await GenerateTranscriptPdf(
      transcriptData.Student_details,
      transcriptData.Student_Transcript_Details
    );
    window.open(URL.createObjectURL(blobFile));
  };

  const handleCOC = async (id) => {
    const cocPaidData = await axios
      .get(`/api/finance/changeOfCourseFeePaidStatusByStudentId/${id}`)
      .then((res) => res.data.data[0])
      .catch((err) => console.error(err));
    if (roleShortName !== "SAA" && cocPaidData?.cocPaidAmount === null) {
      setAlertMessage({
        severity: "error",
        message: "Change of course fee is not paid!!",
      });
      setAlertOpen(true);
    } else {
      navigate(`/course-change/${id}`, { state: { cocPaidData } });
    }
  };
  const handleInitiatedCOC = async (row) => {
    await axios
      .get(`/api/student/studentDetailsForChangeOfCourse/${row?.id}`)
      .then((res) => res.data.data[0])
      .then((cocDetails) => {
        navigate(`/course-change/${row?.id}`, { state: { cocDetails } });
      })
      .catch((err) => console.error(err));
  };
  const handleCourseAssign = async (data) => {
    setValues((prev) => ({
      ...prev,
      ["courseId"]: [],
    }));
    setCourseWrapperOpen(true);
    setRowData(data);

    await axios
      .get(
        `/api/academic/fetchAllCourseDetail/${data.program_id}/${data.program_specialization_id}/${data.current_sem}`
      )
      .then((res) => {
        setCourseOptions(
          res.data.data.map((obj) => ({
            value: obj.id,
            label: obj.course_name_with_code,
          }))
        );
      })
      .catch((err) => console.error(err));
    await axios
      .get(`/api/academic/getcoursesAssignedToStudent/${data.id}`)
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          ["assignedId"]: res.data.data,
          ["courseId"]: res.data.data,
        }));
      })
      .catch((err) => console.error(err));
  };

  const handleAuditingStatus = (data) => {
    setRowData(data);
    setAuditingWrapperOpen(true);
  };

  const handleAddImage = async (params) => {
    setRowData(params);
    setImageUploadOpen(true);
  };

  const columns = [
    {
      field: "candidate_id",
      headerName: "Candidate ID",
      flex: 1,
      //  hide: true 
    },
    {
      field: "student_name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          onClick={() =>
            navigate(`/student-profile/${params.row.id}`, {
              state: {
                from: pathname, // Current path
                state: true,
              },
            })
          }
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "primary.main",
            textTransform: "capitalize",
            cursor: "pointer",
          }}
        >
          {params.value.toLowerCase()}
        </Typography>
      ),
    },
    { field: "auid", headerName: "AUID", flex: 1, minWidth: 120 },
    {
      field: "usn",
      headerName: "USN",
      flex: 1,
      renderCell: (params) =>
        params.value === null ? (
          <IconButton
            color="primary"
            onClick={() => handleUpdateUsn(params.row)}
            sx={{ padding: 0 }}
          >
            <AddBoxIcon />
          </IconButton>
        ) : (
          <Typography
            variant="subtitle2"
            onClick={() => handleUpdateUsn(params.row)}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "primary.main",
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            {params.value}
          </Typography>
        ),
    },
    {
      field: "application_no_npf",
      headerName: "Application No.",
      flex: 1,
      //  hide: true,
    },
    {
      field: "acharya_email",
      headerName: "Email",
      flex: 1,
      valueGetter: (value, row) =>
        row.acharya_email ? maskEmail(row.acharya_email) : "",
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
      valueGetter: (value, row) =>
        row.mobile ? maskMobile(row.mobile) : "",
    },
    {
      field: "date_of_admission",
      headerName: "DOA",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row.date_of_admission).format("DD-MM-YYYY"),
    },
    {
      field: "school_name_short",
      headerName: "INST",
      flex: 1,
    },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      valueGetter: (value, row) =>
        `${row.program_short_name} - ${row.program_specialization_short_name}`,
    },
    {
      field: "currentYearSem",
      headerName: "Year/Sem",
      flex: 1,
      renderCell: (params) => ((params.row.current_year || params.row.current_sem) ?
        `${params.row.current_year}/${params.row.current_sem || 0}`
        : <IconButton
          color="primary"
          onClick={() => handleUpdateYearSem(params.row)}
          sx={{ padding: 0 }}
        >
          <AddBoxIcon />
        </IconButton>),
      valueGetter: (value, row) => ((row?.current_year || row?.current_sem) ? `${row?.current_year}/${row?.current_sem || 0}` : null)
    },
    {
      field: "fee_template_name",
      headerName: "Fee Template",
      flex: 1,
      // hide: true,
    },
    {
      field: "Na_nationality",
      headerName: "Nationality",
      flex: 1,
      // hide: true
    },
    {
      field: "religion",
      headerName: "Religion",
      flex: 1,
      //  hide: true
    },
    {
      field: "current_state",
      headerName: "State",
      flex: 1,
      hide: true
    },
    {
      field: "current_city",
      headerName: "City",
      flex: 1,
      //  hide: true
    },
    {
      field: "current_country",
      headerName: "Country",
      flex: 1,
      //  hide: true
    },
    {
      field: "fee_admission_category_short_name",
      headerName: "Category",
      flex: 1,
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "fee_admission_sub_category_short_name",
      headerName: "Sub Category",
      flex: 1,
      //   hide: true,
    },
    {
      field: "mentor",
      headerName: "Mentor",
      flex: 1,
      // hide: pathname.toLowerCase() === "/student-master-user" ? true : false,
    },
    {
      field: "Provisional",
      headerName: "Provisional",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleProvisionalCertificate(params.row)}
          title="Approved"
          sx={{ padding: 0 }}
        >
          <RemoveRedEyeIcon color="primary" />
        </IconButton>
      ),
    },
    {
      field: "upload",
      headerName: "Documents",
      type: "actions",
      getActions: (params) => [
        <IconButton
          label="Result"
          color="primary"
          onClick={() => handleAddImage(params?.row)}
        >
          <CloudUploadOutlinedIcon fontSize="small" />
        </IconButton>,
      ],
    },
    {
      field: "laptop_status",
      headerName: "Laptop Status",
      flex: 1,
    },
    {
      field: "feeTemplateRemaks",
      headerName: "Fee Note",
      flex: 1,
    },
    {
      field: "notes",
      headerName: "Notes",
      flex: 1,
      renderCell: (params) => {
        const fullNote = params?.row?.notes || "";
        const width = params.colDef.computedWidth;

        // Estimate how many characters can fit based on width (approx 7.5px per char)
        const charsToShow = Math.floor(width / 7.5);

        const displayText =
          fullNote.length > charsToShow
            ? fullNote.slice(0, charsToShow - 3) + "..."
            : fullNote;

        return (
          <HtmlTooltip title={fullNote}>
            <Typography variant="subtitle2">{displayText}</Typography>
          </HtmlTooltip>
        );
      },
    },
    {
      field: "audit_status",
      headerName: "Audit Status",
      flex: 1,
      //  hide: true
    },
    {
      field: "active",
      headerName: "Action",
      type: "actions",
      hideable: false,
      getActions: (params) => {
        const actionList = [
          <GridActionsCellItem
            icon={<PrintIcon sx={{ color: "primary.main", fontSize: 18 }} />}
            label="Transcript"
            // component={Link}
            // onClick={() => handleDocumentCollection(params.row.id)}
            onClick={() =>
              navigate(`/StudentDocumentCollectionPdf/${params.row.id}`)
            }
            showInMenu
          />,
          <GridActionsCellItem
            icon={
              <LibraryBooksIcon sx={{ color: "primary.main", fontSize: 18 }} />
            }
            label="Document Collection"
            onClick={() =>
              navigate(`/student-master/DocumentCollection/${params.row.id}`)
            }
            showInMenu
          />,
          params.row.course_approver_status === 2 ? (
            <GridActionsCellItem
              icon={
                <HighlightOff
                  sx={{ color: "red", fontSize: 18, cursor: "none" }}
                />
              }
              sx={{ color: "red" }}
              label="COC Initiated"
              onClick={() => handleInitiatedCOC(params.row)}
              showInMenu
            />
          ) : (
            <GridActionsCellItem
              icon={
                <PortraitIcon sx={{ color: "primary.main", fontSize: 18 }} />
              }
              label="Change Of Course"
              onClick={() => handleCOC(params.row.id)}
              showInMenu
            />
          ),
        ];

        if (params.row.reporting_id !== null) {
          actionList.push(
            <GridActionsCellItem
              icon={
                <AssignmentIcon
                  sx={{ color: "primary.main", fontSize: 18 }}
                  fontSize="small"
                />
              }
              label="Assign Course"
              onClick={() => handleCourseAssign(params.row)}
              showInMenu
            />
          );
        }

        if (
          params.row.deassign_status === null ||
          params.row.deassign_status === 2
        ) {
          actionList.push(
            <GridActionsCellItem
              icon={
                <PersonRemoveIcon
                  sx={{ color: "primary.main", fontSize: 18 }}
                />
              }
              label="Cancel Admission"
              onClick={() =>
                navigate(`/initiate-canceladmission/${params.row.id}`)
              }
              showInMenu
            />
          );
        } else {
          actionList.push(
            <GridActionsCellItem
              icon={
                <Person4Rounded sx={{ color: "primary.main", fontSize: 18 }} />
              }
              label="Admission Cancellation Initiated"
              showInMenu
            />
          );
        }
        actionList.push(
          <GridActionsCellItem
            icon={
              <VerifiedUserIcon sx={{ color: "primary.main", fontSize: 18 }} />
            }
            label="Audit Status"
            onClick={() => handleAuditingStatus(params.row)}
            showInMenu
          />
        );
        return actionList;
      },
    },
  ];
  if (roleShortName === "SAA") {
    columns.push({
      field: "edit",
      headerName: "Edit",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/std-update/${params.row.id}`, {
              state: {
                from: pathname, // Current path
              },
            })
          }
        >
          <EditIcon fontSize="small" />
        </IconButton>,
      ],
    });
  }
  const handleCourseCreate = async () => {
    const temp = {};

    const newArray = values.courseId.filter(function (val) {
      return values.assignedId.indexOf(val) == -1;
    });

    temp.active = true;
    temp.stud_id = rowData.id;
    temp.course_assignment_ids = newArray;

    await axios
      .post(`/api/academic/assignMultipleCourseToStudent`, temp)
      .then((res) => {
        if (res.data.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Course assigned successfully !!",
          });
          setAlertOpen(true);
        } else {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!",
          });
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err?.response?.data?.message,
        });
        setAlertOpen(true);
      });
    setCourseWrapperOpen(false);
  };
  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  const getRowClassName = (params) => {
    if (params.row.old_auid_format) {
      return classes.approved;
    } else if (params.row.old_std_id_readmn) {
      return classes.cancelled;
    }
  };

  const onSubmitYearSem = async () => {
    try {
      setYearSemLoading(true);
      const res = await axios.get(
        `api/student/reportingStudentByStudentId/${rowData?.id}`
      );
      if (res.status == 200 || res.status == 201) {
        const payload = {
          "student_id": rowData?.id,
          "current_year": Number(values.year),
          "current_sem": Number(values.sem),
          "reporting_date": new Date(),
          "active": true
        };
        if (res.data.data?.reporting_id) {
          payload["reporting_id"] = res.data.data?.reporting_id;
          const response = await axios.put(
            `api/student/ReportingStudents/${res.data.data.reporting_id}`,
            [payload]
          );
          if (response.status == 200 || response.status == 201) {
            actionAfterResponse()
          }
        } else {
          payload["modified_by"] = userID;
          const response = await axios.post(
            `api/student/ReportingStudents`,
            payload
          );
          if (response.status == 200 || response.status == 201) {
            actionAfterResponse()
          }
        }
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Unable to update the Year Sem !!",
      });
      setAlertOpen(true);
    } finally {
      setYearSemLoading(false);
      setYearSemModal(false);
    }
  };

  const actionAfterResponse = () => {
    setAlertMessage({
      severity: "success",
      message: "Student year sem has been updated successfully !!",
    });
    setAlertOpen(true);
    getData();
  };

  const YearSemComponent = ({ rowData }) => (
    <Box>
      <Grid container sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
        <Grid item xs={12}>
          <CustomAutocomplete
            name="yearSem"
            label="Year/Sem"
            options={rowData.program_type == "YEARLY" ? yearList : semList}
            value={values.yearSem}
            handleChangeAdvance={(name, value) => handleChangeAdvance(name, value, rowData)}
            required
          />
        </Grid>
        <Grid item xs={12} mt={2} align="right">
          <Button
            variant="contained"
            disabled={!(values.year) || yearSemLoading}
            onClick={onSubmitYearSem}
          >
            {yearSemLoading ? (
              <CircularProgress
                size={25}
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <strong>Submit</strong>
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
  return (
    <>
      {/* Assign USN  */}
      <ModalWrapper
        title="Update USN"
        maxWidth={500}
        open={usnModal}
        setOpen={setUsnModal}
      >
        <AssignUsnForm
          rowData={rowData}
          setUsnModal={setUsnModal}
          getData={getData}
        />
      </ModalWrapper>

      {/* Assign Course  */}
      <ModalWrapper
        open={courseWrapperOpen}
        setOpen={setCourseWrapperOpen}
        maxWidth={600}
        title={"Assign Course (" + rowData?.student_name + ")"}
      >
        <Box mt={2} p={3}>
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <CustomMultipleAutocomplete
                name="courseId"
                label="Course"
                options={courseOptions}
                value={values.courseId}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button variant="contained" onClick={handleCourseCreate}>
                Assign
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      {/* Auditing Status */}
      <ModalWrapper
        open={auditingWrapperOpen}
        setOpen={setAuditingWrapperOpen}
        maxWidth={600}
        title={`${rowData.student_name} - Auditing Status`}
      >
        <AuditingStatusForm
          rowData={rowData}
          getData={getData}
          setAuditingWrapperOpen={setAuditingWrapperOpen}
        />
      </ModalWrapper>

      {/* Assign Year Sem */}
      <ModalWrapper
        title="Update Year Sem"
        maxWidth={400}
        open={yearSemModal}
        setOpen={setYearSemModal}
      >
        <YearSemComponent
          rowData={rowData}
          setYearSemModal={setYearSemModal}
        />
      </ModalWrapper>

      <Box sx={{ position: "relative", top: { md: -30 } }}>
        <Stack
          direction="row"
          spacing={1}
          justifyContent={{ md: "right" }}
          alignItems="center"
        >
          <Avatar
            variant="square"
            sx={{ width: 24, height: 24, bgcolor: "#a5d6a7" }}
          >
            <Typography variant="subtitle2"></Typography>
          </Avatar>
          <Typography variant="body2" color="textSecondary">
            COC
          </Typography>
          <Avatar
            variant="square"
            sx={{ width: 24, height: 24, bgcolor: "#ef9a9a" }}
          >
            <Typography variant="subtitle2"></Typography>
          </Avatar>
          <Typography variant="body2" color="textSecondary">
            Readmission
          </Typography>
        </Stack>
      </Box>

      <Tabs value={tab} onChange={handleChange} sx={{ marginTop: { xs: 2, md: -3 } }}>
        <Tab value="Active Student" label="Active Student" />
        <Tab value="InActive Student" label="InActive Student" />
      </Tabs>

      <Box>
        <Grid container alignItems="center" mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid item xs={2} md={2.4}>
            <CustomAutocomplete
              name="acyearId"
              options={academicYearOptions}
              value={values.acyearId}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          {pathname.toLowerCase() !== "/student-master-dept" && (
            <>
              {!(pathname.toLowerCase() === "/student-master-inst") && (
                <Grid item xs={12} md={2.4}>
                  <CustomAutocomplete
                    name="schoolId"
                    label="School"
                    value={values.schoolId}
                    options={schoolOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    disabled={!values.acyearId}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="programId"
                  label="Program"
                  options={programOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  value={values.programId}
                  disabled={!values.schoolId}
                />
              </Grid>
              {pathname.toLowerCase() !== "/student-master-intl" && (
                <Grid item xs={2} md={2.4}>
                  <CustomAutocomplete
                    name="categoryId"
                    label="Category"
                    options={categoryOptions}
                    value={values.categoryId}
                    handleChangeAdvance={handleChangeAdvance}
                    disabled={!values.programId}
                  />
                </Grid>
              )}
            </>
          )}

          <Grid item xs={2} alignItems="right" md={2}>
            {roleShortName === "SAA" && allRecords.length > 0 && (
              <CustomDataExport
                dataSet={allRecords}
                titleText="Student Details"
              />
            )}
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginTop: { xs: 10, md: 2 } }}>
        <GridIndex
          rows={paginationData.rows}
          columns={columns}
          // rowCount={paginationData.total}
          // page={paginationData.page}
          // pageSize={paginationData.pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
          loading={paginationData.loading}
          // handleOnFilterChange={handleOnFilterChange}
          getRowClassName={getRowClassName}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel}
        />
      </Box>
      <PdfUploadModal imageOpen={imageOpen} setImageUploadOpen={setImageUploadOpen} rowData={rowData} />
    </>
  );
}

export default StudentDetailsIndex;
