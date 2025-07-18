import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import { convertDateYYYYMMDD } from "../../../utils/Utils";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useDebounce from "../../../hooks/useDebounce";
import moment from "moment";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const initialValues = {
  month: null,
  date: "",
  schoolId: "",
  studentId: "",
  programId: "",
  empId: "",
  acYearId: ""
};

const triggerOption = [
  { value: "Attendance", label: "Attendance All" },
  { value: "AttendanceEmployee", label: "Attendance Employee" },
  { value: "AttendanceSchool", label: "Attendance School" },
  { value: "Salary", label: "Salary" },
  { value: "SalaryEmployee", label: "Salary Employee" },
  { value: "BiometricAttendance", label: "Biometric Attendance" },
  { value: "StudentDueReport", label: "Student Due Report" },
  { value: "EmployeesRejoined", label: "Employees Rejoined leave Pattern" },
  { value: "LeavePattern", label: "Employee Leave Pattern" },
  { value: "BioTransaction", label: "Employee Bio Transaction" },
  { value: "Student", label: "Single Student Due Report" },
  { value: "Hostel", label: "Hostel Due By Student" },
  { value: "School", label: "School Due Report" },
  { value: "EmployeeLeaveKitty", label: "Leave Kitty" },
  { value: "leaveKitty", label: "Employee Leave Kitty" },
];
function EmpAttendanceTrigger() {
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState(initialValues);
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);

  const [studentOptions, setStudentOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const debouncedAuid = useDebounce(values.studentId, 500); // Use debounce with a 500ms delay

  useEffect(() => {
    setCrumbs([{ name: "Scheduler Trigger" }]);
    getSchoolDetails();
  }, []);

  useEffect(() => {
    if (values.schoolId) {
      getProgramDetails();
    }
  }, [values.schoolId]);

  useEffect(() => {
    if (
      data?.trigger === "AttendanceEmployee" ||
      data?.trigger === "SalaryEmployee" ||
      data?.trigger === "leaveKitty"
    ) {
      getEmployeeData();
    } if (data?.trigger === "Hostel") {
      getAcademicYearData();
    }
  }, [data?.trigger]);

  useEffect(() => {
    if (debouncedAuid) {
      getStudentDetails();
    }
  }, [debouncedAuid]);

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getAcademicYearData = async () => {
    try {
      const res = await axios.get("/api/academic/academic_year");
      const data = res.data.data.map((obj) => ({
        value: obj.ac_year_id,
        label: obj.ac_year,
      }));

      setAcademicYearOptions(data);

      if (data.length > 0) {
        setValues((prev) => ({
          ...prev,
          acYearId: data[0]?.value,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeTrigger = async (name, newValue) => {
    setValues(initialValues);
    setStudentDetails([]);
    setData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCreate = async () => {
    const splitMonth = values?.month?.substr(0, 7)?.split("-");
    const temp = {};
    temp.month = parseInt(splitMonth?.[1]);
    temp.year = parseInt(splitMonth?.[0]);
    setLoading(true);
    if (data?.trigger === "Attendance" && temp.month && temp.year) {
      await axios
        .post(
          `/api/employee/employeeAttendanceTrigger?month=${temp.month}&year=${temp.year}`
        )
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Attendace Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
            setValues(initialValues);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
          setData("");
        });
    } else if (
      data?.trigger === "AttendanceSchool" &&
      temp.month &&
      temp.year &&
      values.schoolId
    ) {
      await axios
        .post(
          `/api/employee/employeeAttendanceTrigger?year=${temp.year}&month=${temp.month}&schoolId=${values.schoolId}`
        )
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Attendace School Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
            setValues(initialValues);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
          setData("");
        });
    } else if (
      data?.trigger === "AttendanceEmployee" &&
      temp.month &&
      temp.year &&
      values.empId
    ) {
      await axios
        .post(
          `/api/employee/employeeAttendanceTrigger?year=${temp.year}&month=${temp.month}&empId=${values.empId}`
        )
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Attendace Employee Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
            setValues(initialValues);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
          setData("");
        });
    } else if (data?.trigger === "Salary" && temp.month && temp.year) {
      await axios
        .post(
          `/api/employee/calculateMasterSalaryTrigger?month=${temp.month}&year=${temp.year}`
        )
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Salary Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (
      data?.trigger === "BiometricAttendance" &&
      temp.month &&
      temp.year
    ) {
      await axios
        .post(
          `/api/employee/biometricAttendenceTrigger?month=${temp.month}&year=${temp.year}`
        )
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Biometric Attendance Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (
      data?.trigger === "StudentDueReport" &&
      temp.month &&
      temp.year
    ) {
      await axios
        .post(`/api/student/studentDueReportTrigger`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Student Due Report Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (data?.trigger === "EmployeesRejoined") {
      await axios
        .post(`/api/employee/employeeLeaveTriggerForRejoinedEmployees`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Employee Leave Rejoined Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (data?.trigger === "LeavePattern") {
      await axios
        .post(`/api/employee/employeeLeavePatternTrigger`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Employee Leave Pattern Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (data?.trigger === "BioTransaction" && values.date) {
      await axios
        .post(
          `/api/employee/bioTransactionTrigger?date=${convertDateYYYYMMDD(
            values.date
          )}`
        )
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Bio Transection Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (
      data?.trigger === "School" &&
      values.schoolId &&
      values.programId
    ) {
      await axios
        .post(
          `/api/student/studentDueReportTrigger?programId=${values.programId}`
        )
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Program Wise Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (data?.trigger === "School" && values.schoolId) {
      await axios
        .post(
          `/api/student/studentDueReportTrigger?schoolId=${values.schoolId}`
        )
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "School Wise Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (
      data?.trigger === "Student" &&
      values.studentId &&
      studentDetails?.id
    ) {
      await axios
        .post(
          `/api/student/studentDueReportTrigger?studentId=${studentDetails?.id}`
        )
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Student Wise Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (data?.trigger === "EmployeeLeaveKitty") {
      await axios
        .post(`/api/createEmployeeLeaveKitty`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Leave Kitty Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (
      data?.trigger === "SalaryEmployee" &&
      temp.month &&
      temp.year &&
      values.empId
    ) {
      await axios
        .post(
          `/api/employee/calculateMasterSalaryTrigger?month=${temp.month}&year=${temp.year}&empId=${values.empId}`
        )
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Salary Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (data?.trigger === "Hostel" && values.studentId &&
      values?.acYearId) {
      const payload = [
        {
          auid: values.studentId,
          acYearId: values.acYearId,
        },
      ];
      await axios
        .put(`/api/finance/hostelProcedure`, payload)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Hostel procedure executed successfully! !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else if (data?.trigger === "leaveKitty") {
      await axios
        .post(`/api/createEmployeeLeaveKitty?empId=${values.empId}`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Employee Leave Kitty Query Executed successfully !!",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Execution Failed !!",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    } else {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };
  const getSchoolDetails = async () => {
    try {
      const res = await axios.get(`/api/institute/school`);
      const optionData = res.data.data.map((obj) => ({
        value: obj.school_id,
        label: obj.school_name,
        school_name_short: obj.school_name_short,
      }));
      setSchoolOptions(optionData);
    } catch (err) {
      console.error(err);
    }
  };

  const getProgramDetails = async () => {
    try {
      const res = await axios.get(
        `/api/otherFeeDetails/getProgramsDetails?schoolId=${values.schoolId}`
      );
      const optionData = res.data.data.map((obj) => ({
        value: obj.programId,
        label: obj.programName,
      }));
      setProgramOptions(optionData);
    } catch (err) {
      console.error(err);
    }
  };
  const getStudentDetails = async () => {
    try {
      setLoading(true);
      const containsAlphabetic = /[a-zA-Z]/.test(debouncedAuid);
      const baseUrl = "/api/student/getStudentDetailsBasedOnAuidAndStrudentId";
      const url = `${baseUrl}?${containsAlphabetic ? "auid" : "student_id"
        }=${debouncedAuid}`;
      const response = await axios.get(url);
      setStudentDetails(response?.data?.data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const getEmployeeData = async () => {
    await axios
      .get(`/api/employee/getAllActiveEmployeeDetails`)
      .then((res) => {
        const employeeData = [];
        res.data.data.forEach((obj) => {
          employeeData.push({
            label:
              obj.employee_name + "-" + obj.empcode + "-" + obj.dept_name_short,
            value: obj.emp_id,
          });
        });
        setEmployeeOptions(employeeData);
      })
      .catch((err) => console.error(err));
  };
  const renderDetailRow = (label, value) => {
    return (
      <>
        <Grid item xs={12} md={1.5}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={4.5}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };
  return (
    <Box>
      <FormWrapper>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid
            item
            xs={12}
            md={
              data.trigger === "School" ||
                data.trigger === "AttendanceSchool" ||
                data?.trigger === "AttendanceEmployee" || data?.trigger === "Hostel"
                ? 3
                : 4
            }
          >
            <CustomAutocomplete
              name="trigger"
              label="Type"
              value={data.trigger}
              options={triggerOption}
              handleChangeAdvance={handleChangeTrigger}
            />
          </Grid>
          {data.trigger === "Student" && (
            <Grid item xs={6} md={4}>
              <CustomTextField
                name="studentId"
                label="AUID"
                value={values.studentId}
                handleChange={handleChange}
                helperText=" "
                errors={["This field is required"]}
                required
              />
            </Grid>
          )}
          {(data.trigger === "Hostel") && (
            <>
              <Grid item xs={6} md={3} sm={4}>
                <CustomTextField
                  name="studentId"
                  label="AUID"
                  value={values.studentId}
                  handleChange={handleChange}
                  helperText=" "
                  errors={["This field is required"]}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3} md={2}>
                <CustomAutocomplete
                  name="acYearId"
                  label="Academic Year"
                  value={values.acYearId}
                  options={academicYearOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
            </>

          )}

          {(data?.trigger === "Attendance" ||
            data?.trigger === "Salary" ||
            data?.trigger === "BiometricAttendance" ||
            data.trigger === "AttendanceSchool" ||
            data?.trigger === "AttendanceEmployee" ||
            data?.trigger === "SalaryEmployee") && (
              <Grid item xs={12} md={3}>
                <CustomDatePicker
                  name="month"
                  label="Month"
                  value={values.month}
                  handleChangeAdvance={handleChangeAdvance}
                  views={["month", "year"]}
                  openTo="month"
                  inputFormat="MM/YYYY"
                  helperText="mm/yyyy"
                  disabled={data?.trigger === "StudentDueReport"}
                />
              </Grid>
            )}
          {(data.trigger === "School" ||
            data.trigger === "AttendanceSchool") && (
              <Grid item xs={6} md={3}>
                <CustomAutocomplete
                  name="schoolId"
                  label="School"
                  value={values.schoolId}
                  options={schoolOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
            )}
          {data.trigger === "School" && (
            <Grid item xs={6} md={3}>
              <CustomAutocomplete
                name="programId"
                label="Program"
                value={values.programId}
                options={programOptions}
                handleChangeAdvance={handleChangeAdvance}
              // required
              />
            </Grid>
          )}
          {(data?.trigger === "AttendanceEmployee" ||
            data?.trigger === "SalaryEmployee" ||
            data?.trigger === "leaveKitty") && (
              <Grid item xs={12} md={3}>
                <CustomAutocomplete
                  name="empId"
                  value={values.empId}
                  label="Employee"
                  handleChangeAdvance={handleChangeAdvance}
                  options={employeeOptions}
                />
              </Grid>
            )}
          {data?.trigger === "BioTransaction" && (
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="date"
                label="Requested Date"
                value={values.date}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
          )}
          <Grid
            item
            xs={12}
            md={
              data.trigger === "School" ||
                data.trigger === "AttendanceSchool" ||
                data?.trigger === "AttendanceEmployee"
                ? 3
                : data?.trigger !== "StudentDueReport"
                  ? 4
                  : 8
            }
            align="right"
          >
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={loading || !data?.trigger}
            >
              {loading ? (
                <CircularProgress
                  size={20}
                  color="blue"
                  style={{ margin: "0px 16px" }}
                />
              ) : (
                <Typography variant="subtitle2">Execute</Typography>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
      {studentDetails && Object.keys(studentDetails)?.length > 0 && (
        <Grid container>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Student Details"
                titleTypographyProps={{
                  variant: "subtitle2",
                }}
                sx={{
                  backgroundColor: "rgba(74, 87, 169, 0.1)",
                  color: "#46464E",
                  textAlign: "center",
                  padding: 1,
                }}
              />
              <CardContent>
                <Grid container columnSpacing={2} rowSpacing={1}>
                  {renderDetailRow("AUID", studentDetails.auid)}
                  {renderDetailRow("Student Name", studentDetails.student_name)}
                  {renderDetailRow("USN", studentDetails.usn ?? "-")}
                  {renderDetailRow(
                    "DOA",
                    moment(studentDetails.date_of_admission).format(
                      "DD-MM-YYYY"
                    )
                  )}
                  {renderDetailRow("School", studentDetails.school_name_short)}
                  {renderDetailRow(
                    "Program",
                    `${studentDetails.program_short_name} - ${studentDetails.program_specialization_short_name}`
                  )}
                  {renderDetailRow(
                    "Academic Batch",
                    studentDetails.academic_batch
                  )}
                  {renderDetailRow(
                    "Current Year/Sem",
                    `${studentDetails.current_year}/${studentDetails.current_sem}`
                  )}
                  {renderDetailRow(
                    "Fee Template",
                    studentDetails.fee_template_name
                  )}
                  {renderDetailRow(
                    "Admission Category",
                    `${studentDetails.fee_admission_category_short_name} - ${studentDetails.fee_admission_sub_category_short_name}`
                  )}
                  {renderDetailRow(
                    "Acharya Email",
                    studentDetails.acharya_email
                  )}
                  {renderDetailRow("Mobile No.", studentDetails.mobile)}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default EmpAttendanceTrigger;
