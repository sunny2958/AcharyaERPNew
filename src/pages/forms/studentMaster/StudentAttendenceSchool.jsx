import { useState, lazy, useEffect, useRef } from "react";
import axios from "../../../services/Api";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import {
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  styled,
  tableCellClasses,
  TableBody,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import GridIndex from "../../../components/GridIndex";
import ModalWrapper from "../../../components/ModalWrapper";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import { useDownloadExcel } from "react-export-table-to-excel";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    borderBottom: 0,
    textAlign: "center",
  },
}));

const StyledTableCell1 = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    borderBottom: 0,
    textAlign: "center",
  },
}));

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const StudentAttendenceSchool = () => {
  const [acYearOptions, setAcyearOptions] = useState([]);
  const [SectionOptions, setSectionOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [programOptions, setprogramOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [Data, setData] = useState([]);
  const [dynamicHeaders, setDynamicHeaders] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const [ModalData, setModalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [values, setValues] = useState({
    schoolId: null,
    academicYear: "",
    program: "",
    sem: "",
    section: "",
    batch: "",
    batchSec: "Section",
  });

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setData(Data);
    setDynamicHeaders(dynamicHeaders);
  }, [Data, dynamicHeaders]);

  const columns = [
    {
      field: "slNo",
      headerName: "Sl No",
      flex: 1,
      hideable: false,
      renderCell: (params) => params.api.getRowIndex(params.id) + 1,
    },
    {
      field: "employee_name_code",
      headerName: " Employee Name-Code",
      flex: 1,
      hideable: false,
    },
    {
      field: "selected_date",
      headerName: "Selected Date",
      flex: 1,
    },
    {
      field: "time_slot",
      headerName: "Time Slots",
      flex: 1,
      hideable: false,
    },
    {
      field: "roomcode",
      headerName: "Room Code",
      flex: 1,
      hideable: false,
    },
    {
      field: "batch_short_name",
      headerName: "Section/Batch",
      flex: 1,
      hideable: false,
    },
    {},
  ];

  useEffect(() => {
    setCrumbs([
      {
        name: "Student Attendance Report",
      },
    ]);
    getacyear();
    getSchoolDetails();
  }, []);

  useEffect(() => {
    getsection();
  }, [values.academicYear, values.program, values.batchSec, values.sem]);

  useEffect(() => {
    getPrograms();
  }, [values.schoolId]);

  useEffect(() => {
    getEmployeeDetails();
  }, []);

  const getEmployeeDetails = async () => {
    try {
      const response = await axios.get(
        `/api/employee/getEmployeeDetailsBasedOnUserID/${userID}`
      );

      if (response.data.data) {
        setEmployeeData(response.data.data);
        setValues((prev) => ({
          ...prev,
          ["schoolId"]: response.data.data.school_id,
        }));
      } else {
        setAlertMessage({
          severity: "error",
          message: "School not found for this employee",
        });
        setAlertOpen(true);
      }
    } catch {
      setAlertMessage({
        severity: "error",
        message: "Error Occured",
      });
      setAlertOpen(true);
    }
  };

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj?.school_id,
            label: obj?.school_name,
            school_name_short: obj?.school_name_short,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getsection = async (params) => {
    if (
      values.batchSec === "Section" &&
      values.academicYear &&
      values.program &&
      values.sem
    ) {
      await axios
        .get(
          `/api/academic/sectionDetailsByAcademicYearAndSpecializationId/${values.academicYear}/${values.program}/${values.sem}`
        )
        .then((res) => {
          setSectionOptions(
            res.data.data.map((obj) => ({
              value: obj.section_id,
              label: obj.section_name,
            }))
          );
        })
        .catch((error) => console.error(error));
    }
    if (values.batchSec === "Batch" && values.academicYear && values.sem) {
      await axios
        .get(
          `/api/academic/batchByAcademicYear/${values.academicYear}/${values.sem}`
        )
        .then((res) => {
          const batchData = [];
          res.data.data.forEach((obj) => {
            batchData.push({
              value: obj.batch_id,
              label: obj.batch_name,
            });
          });
          setBatchOptions(batchData);
        })
        .catch((error) => console.error(error));
    }
  };

  const getacyear = async (params) => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcyearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getPrograms = async () => {
    if (!values.schoolId) return null;

    try {
      const { data: response } = await axios.get(
        `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
      );
      const optionData = [];
      const responseData = response.data;
      response.data.forEach((obj) => {
        optionData.push({
          value: obj.program_specialization_id,
          label: `${obj.program_short_name} - ${obj.program_specialization_name}`,
          program_assignment_id: obj.program_assignment_id,
          program_id: obj.program_id,
        });
      });
      const programObject = responseData.reduce((acc, next) => {
        acc[next.program_specialization_id] = next;
        return acc;
      }, {});

      setprogramOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load the programs data",
      });
      setAlertOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleSubmit = async () => {
    const selectedProgram = programOptions.find(
      (program) => program.value === values.program
    );

    let apiEndpoint;

    if (values.section) {
      apiEndpoint = `/api/student/studentAttendanceReportSectionwise/${values.academicYear}/${selectedProgram.program_assignment_id}/${selectedProgram.program_id}/${selectedProgram.value}/${values.section}/${values.sem}`;
    } else if (values.batch) {
      apiEndpoint = `/api/student/getStudentAttendanceReportBatchwise/${values.academicYear}/${values.batch}/${values.sem}`;
    } else {
      apiEndpoint = `/api/student/getStudentAttendanceReportByAcademicYearSpecializationAndCurrentYearSem/${values.academicYear}/${selectedProgram.value}/${values.sem}`;
    }

    try {
      setLoading(true);

      const res = await axios.get(apiEndpoint);

      setData(res.data.data);
      setLoading(false);
      const studentAttendanceDetail = res.data.data.map((data) => {
        return data?.studentAttendanceDetail;
      });

      const flattenedData = studentAttendanceDetail.flat();

      const groupedData = flattenedData.reduce((acc, obj) => {
        const courseId = obj.course_id;
        if (!acc.has(courseId)) {
          acc.set(courseId, obj);
        }
        return acc;
      }, new Map());

      const result = Array.from(groupedData.values());

      setDynamicHeaders(result);
    } catch (err) {
      setLoading(false);
      console.error(err);
      setAlertMessage({
        severity: "error",
        message: err.response.data.message,
      });
      setAlertOpen(true);
    }
  };

  const getModalData = async (
    studentId,
    courseId,
    present_status,
    batchAssignmentIds,
    absentCount
  ) => {
    try {
      if (values.batch) {
        const response = await axios.get(
          `/api/student/getStudentAttendanceDetailsByStudentIdAndBatchAssignmentIds/${studentId}/${
            values.academicYear
          }/${courseId}/${values.sem}/${batchAssignmentIds.toString()}`
        );

        // const employeeNames = Object.keys(response.data?.data);

        // const firstEmployeeName = employeeNames[0];
        // const employeeAttendanceData = response.data?.data[firstEmployeeName];

        const mergedData = Object.values(response?.data?.data).flat();

        // Filter records based on present_status
        const filteredData = mergedData.filter(
          (obj) => obj.present_status === true
        );

        const filteredData2 = mergedData.filter(
          (obj) => obj.present_status === false
        );

        const getAbsenteesData = await axios
          .get(
            `/api/student/absentDetailOfStudentForBatch?acYearId=${18}&batchAssignmentIds=${batchAssignmentIds.toString()}&currentYearOrSem=${
              values.sem
            }&courseId=${courseId}&studentId=${studentId}&batchId=${
              values.batch
            }`
          )
          .then((res) => {
            return res.data.data;
          });

        let data = present_status
          ? filteredData
          : !present_status && absentCount !== filteredData2.length
          ? getAbsenteesData
          : filteredData2;

        const modalRows = data?.map((item, index) => ({
          id: index + 1,
          employee_name_code: item.employee_name_code,
          selected_date: moment(item.selected_date).format("DD-MM-YYYY"),
          time_slot: item.time_slot,
          interval_time: item.interval_type_short,
          roomcode: item.roomcode,
          batch_short_name: item.batch_short_name,
          time_table_id: item?.time_table_id,
        }));
        setModalData(modalRows);
        setModalOpen(true);
      } else {
        const response = await axios.get(
          `/api/student/getStudentAttendanceDetailsByStudentIdAndSectionAssignmentIds/${studentId}/${
            values.academicYear
          }/${courseId}/${values.sem}/${batchAssignmentIds.toString()}`
        );

        // const employeeNames = Object.keys(response.data?.data);

        // const firstEmployeeName = employeeNames[0];
        // const employeeAttendanceData = response.data?.data[firstEmployeeName];

        const mergedData = Object.values(response?.data?.data).flat();

        // Filter records based on present_status
        const filteredData = mergedData.filter(
          (obj) => obj.present_status === true
        );

        const filteredData2 = mergedData.filter(
          (obj) => obj.present_status === false
        );

        const getAbsenteesData = await axios
          .get(
            `/api/student/absentDetailOfStudentForSetion?acYearId=${18}&sectionAssignmentIds=${batchAssignmentIds.toString()}&currentYearOrSem=${
              values.sem
            }&courseId=${courseId}&studentId=${studentId}&sectionId=${
              values.section
            }`
          )
          .then((res) => {
            return res.data.data;
          });

        let data = present_status
          ? filteredData
          : !present_status && absentCount !== filteredData2.length
          ? getAbsenteesData
          : filteredData2;

        const modalRows = data?.map((item, index) => ({
          id: index + 1,
          employee_name_code: item.employee_name_code,
          selected_date: moment(item.selected_date).format("DD-MM-YYYY"),
          time_slot: item.time_slot,
          interval_time: item.interval_type_short,
          roomcode: item.roomcode,
          batch_short_name: item.batch_short_name,
          time_table_id: item?.time_table_id,
        }));
        setModalData(modalRows);
        setModalOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Grid item xs={12} align="right">
        <IconButton onClick={() => window.location.reload()}>
          <RefreshIcon sx={{ color: "primary.main" }} fontSize="large" />
        </IconButton>
      </Grid>
      <Grid container>
        <Grid
          item
          xs={12}
          component={Paper}
          rowSpacing={2}
          columnSpacing={2}
          elevation={3}
          p={2}
          marginTop={1}
        >
          <Grid container rowSpacing={1.5} columnSpacing={2}>
            {/* <Grid item xs={12} md={2.4}>
              <CustomSelect
                name="batchSec"
                value={values.batchSec}
                label="Batch/Section"
                items={[
                  { label: "Batch", value: "Batch" },
                  { label: "Section", value: "Section" },
                ]}
                handleChange={handleChange}
                disabled={Data.length > 0}
              />
            </Grid> */}

            <Grid item xs={12} md={2.4}>
              <CustomSelect
                name="academicYear"
                label="Academic Year*"
                value={values.academicYear}
                items={acYearOptions}
                handleChange={handleChange}
                disabled={Data.length > 0}
              />
            </Grid>

            {values.batchSec === "Section" ? (
              <>
                <Grid item xs={12} md={2.4}>
                  <CustomAutocomplete
                    name="schoolId"
                    label="School*"
                    value={values.schoolId}
                    options={schoolOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} md={2.4}>
                  <CustomAutocomplete
                    name="program"
                    label="Program Major*"
                    value={values.program}
                    options={programOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    disabled={Data.length > 0}
                  />
                  {/* <CustomSelect
                  name="program"
                  label="Program Major*"
                  value={values.program}
                  items={programOptions}
                  handleChange={handleChange}
                  disabled={Data.length > 0}
                /> */}
                </Grid>
              </>
            ) : (
              <></>
            )}

            <Grid item xs={12} md={2.4}>
              <CustomSelect
                name="sem"
                value={values.sem}
                label="Sem*"
                items={[
                  { label: 1, value: 1 },
                  { label: 2, value: 2 },
                  { label: 3, value: 3 },
                  { label: 4, value: 4 },
                  { label: 5, value: 5 },
                  { label: 6, value: 6 },
                  { label: 7, value: 7 },
                  { label: 8, value: 8 },
                ]}
                handleChange={handleChange}
                disabled={Data.length > 0}
              />
            </Grid>

            {values.batchSec === "Section" ? (
              <Grid item xs={12} md={2.4}>
                <CustomSelect
                  name="section"
                  label="Section"
                  value={values.section}
                  items={SectionOptions}
                  handleChange={handleChange}
                  disabled={
                    !values.academicYear || !values.program || Data.length > 0
                  }
                />
              </Grid>
            ) : values.batchSec === "Batch" ? (
              <Grid item xs={12} md={2.4}>
                <CustomSelect
                  name="batch"
                  label="Batch"
                  value={values.batch}
                  items={batchOptions}
                  handleChange={handleChange}
                  disabled={!values.academicYear || Data.length > 0}
                />
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
          <Grid item xs={12} mt={1} align="right">
            <Button
              color="success"
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={handleSubmit}
              disabled={Data.length > 0 || loading}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{"Submit"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {Data?.length > 0 && (
        <StudentTable
          Data={Data}
          dynamicHeaders={dynamicHeaders}
          getModalData={getModalData}
        />
      )}

      <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={850}
        title="More Details"
      >
        <GridIndex rows={ModalData} columns={columns} />
      </ModalWrapper>
    </>
  );
};

export default StudentAttendenceSchool;

const StudentTable = ({ Data, dynamicHeaders, getModalData }) => {
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Student Attendence",
    sheet: "Student Attendence",
  });

  return (
    <>
      <Grid item xs={12} mt={2} align="right">
        <Button variant="contained" onClick={onDownload}>
          Export to excel
        </Button>
      </Grid>
      <Grid item xs={12} mt={2} mb={4}>
        <TableContainer component={Paper}>
          <Table
            size="small"
            sx={{ borderCollapse: "separate", borderSpacing: "1px" }}
            ref={tableRef}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell rowSpan={3}>Sl.No.</StyledTableCell>
                <StyledTableCell rowSpan={3}>Auid</StyledTableCell>
                <StyledTableCell rowSpan={3}>Student Name</StyledTableCell>
                <StyledTableCell rowSpan={3}>DOR</StyledTableCell>
                {dynamicHeaders?.map((row, index) => (
                  <>
                    <StyledTableCell1 colSpan={3} key={index}>
                      {row.course_name}
                    </StyledTableCell1>
                  </>
                ))}
              </TableRow>
              <TableRow>
                {dynamicHeaders?.map((row, index) => (
                  <>
                    <StyledTableCell1 colSpan={3} key={index}>
                      {row.course_assignment_coursecode}
                    </StyledTableCell1>
                  </>
                ))}
              </TableRow>
              <TableRow>
                {dynamicHeaders.map((row, index) => (
                  <>
                    <StyledTableCell>Present</StyledTableCell>
                    <StyledTableCell>Absent</StyledTableCell>
                    <StyledTableCell>%</StyledTableCell>
                  </>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {Data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ outline: "1px solid rgba(224, 224, 224, 1)" }}
                >
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.auid}</StyledTableCell>
                  <StyledTableCell>{row.studentName}</StyledTableCell>
                  {row.dateOfReporting ? (
                    <StyledTableCell>
                      {moment(row.dateOfReporting).format("DD-MM-YYYY")}
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell></StyledTableCell>
                  )}
                  {row.studentAttendanceDetail.map((subject, subIndex) => (
                    <>
                      <StyledTableCell1
                        onClick={() =>
                          getModalData(
                            subject.student_id,
                            subject.course_id,
                            true,
                            row.batchAssignmentIds || row.sectionAssignmentIds
                          )
                        }
                        style={{
                          color: "green",
                          cursor: "pointer",
                        }}
                      >
                        {subject.present}
                      </StyledTableCell1>
                      <StyledTableCell1
                        onClick={() =>
                          getModalData(
                            subject.student_id,
                            subject.course_id,
                            false,
                            row.batchAssignmentIds || row.sectionAssignmentIds,
                            subject.total - subject.present
                          )
                        }
                        style={{
                          color: "red",
                          cursor: "pointer",
                        }}
                      >
                        {subject.total - subject.present}
                      </StyledTableCell1>
                      <StyledTableCell1>{subject.percentage}</StyledTableCell1>
                    </>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};
