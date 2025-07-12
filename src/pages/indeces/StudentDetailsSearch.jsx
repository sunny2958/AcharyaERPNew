import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Box, Button, CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import CustomTextField from "../../components/Inputs/CustomTextField";
import { maskEmail, maskMobile } from "../../utils/MaskData";
import AddBoxIcon from "@mui/icons-material/AddBox";
import moment from "moment";
import ModalWrapper from "../../components/ModalWrapper";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import AssignUsnForm from "../forms/studentMaster/AssignUsnForm";


const OverlayLoader = lazy(() => import("../../components/OverlayLoader"));
const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const initialValues = { searchKey: "" };

const ELIGIBLE_REPORTED_STATUS = {
  1: "No status",
  2: "Not Eligible",
  3: "Eligible",
  4: "Not Reported",
  5: "Pass Out",
  6: "Promoted",
};
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

function StudentDetailsSearch() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const { pathname } = useLocation();
  const [rowData, setRowData] = useState([]);
  const [usnModal, setUsnModal] = useState(false);
  const [yearSemModal, setYearSemModal] = useState(false);
  const [yearSemLoading, setYearSemLoading] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    mother_name: false,
    father_name: false,
    username: false,
    requested_by: false,
    fee_admission_sub_category_name: false,
    permanent_address: false,
    acharya_email: false,
    mobile: false,
    fee_template_name: false,
    Na_nationality: false,
    religion: false,
    current_city: false,
    current_state: false
  });

  useEffect(() => {
    setCrumbs([{}])
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      if (values.searchKey.length > 2) {
        getData();
      } else {
        setRows([]);
      }
    }, 500);

    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [values.searchKey]);

  const handleUpdateYearSem = (data) => {
    setValues((prevState) => ({
      ...prevState,
      year: null,
      sem: null
    }));
    setRowData(data);
    setYearSemModal(true);
  };
  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/student/getStudentDataBasedOnName?student_name=${values.searchKey}`
      );
      setRows(response.data.data || []);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the data!",
      });
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateUsn = (data) => {
    setRowData(data);
    setUsnModal(true);
  };
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const columns = [
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
    // {
    //   field: "application_no_npf",
    //   headerName: "Application No.",
    //   flex: 1,
    //   //  hide: true,
    // },
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
    {
      field: "username",
      headerName: "Created By",
      flex: 1,
    },
    {
      field: "requested_by",
      headerName: "Requested By",
      flex: 1,
      hide: true,
    },
    {
      field: "eligible_status",
      headerName: "Eligible Status",
      flex: 1,
      valueGetter: (value, row) =>
        row.eligible_reported_status
          ? ELIGIBLE_REPORTED_STATUS[row.eligible_reported_status]
          : "",
    },
  ];
  const getYearSemValue = (newValue, rowValues) => {
    setValues((prevState) => ({
      ...prevState,
      year: rowValues?.program_type == "Semester" ? semList.find((li) => li.value == newValue)?.yearValue : newValue,
      sem: rowValues?.program_type == "Semester" ? newValue : yearList.find((li) => li.value == newValue)?.semValue
    }))
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
  return (
    <>
      <Grid container spacing={1} mt={1}>
        <Grid item xs={12} md={3}>
          <CustomTextField
            name="searchKey"
            label="Search by Name"
            value={values.searchKey}
            handleChange={handleChange}
            fullWidth
            helperText=" "
          />
        </Grid>
      </Grid>
      <GridIndex columnVisibilityModel={columnVisibilityModel}
        setColumnVisibilityModel={setColumnVisibilityModel} rows={rows} columns={columns} />

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
    </>
  );
}

export default StudentDetailsSearch;
