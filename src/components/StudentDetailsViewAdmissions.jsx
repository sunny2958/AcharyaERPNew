import { useEffect, useState } from "react";
import axios from "../services/Api";
import {
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  styled,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import CustomDatePicker from "./Inputs/CustomDatePicker";
import CustomSelect from "./Inputs/CustomSelect";
import CustomTextField from "./Inputs/CustomTextField";
import CustomAutocomplete from "./Inputs/CustomAutocomplete";
import useAlert from "../hooks/useAlert";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { maskMobile } from "../utils/MaskData";

const initialValues = {
  studentName: "",
  mobileNo: "",
  dob: null,
  gender: "",
  fatherName: "",
  motherName: "",
  parentMobile: "+998",
  nationality: null,
  bloodGroup: "",
  passportNo: "",
  permanentCountry: null,
  permanantState: null,
  permanantCity: null,
  permanentAddress: null,
  currentCountry: null,
  currentState: null,
  currentCity: null,
  currentAddress: null,
};

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

const requiredFields = [
  "dob",
  "gender",
  "fatherName",
  "motherName",
  "parentMobile",
  "nationality",
  "passportNo",
  "permanentCountry",
  "permanantState",
  "permanantCity",
  "permanentAddress",
  "currentCountry",
  "currentState",
  "currentCity",
  "currentAddress",
];

const roleName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleName;

if (roleName === "Super Admin") {
  ["studentName", "mobileNo"].forEach((obj) => {
    if (requiredFields.includes(obj) === false) {
      requiredFields.push(obj);
    }
  });
} else {
  ["studentName", "mobileNo"].forEach((obj) => {
    if (requiredFields.includes(obj) === true) {
      requiredFields.splice(requiredFields.indexOf(obj), 1);
    }
  });
}

const StudentDetailsViewDocuments = ({
  state,
  applicantData,
  transcriptData,
  handleRefresh,
}) => {
  const [values, setValues] = useState(initialValues);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState([]);
  const [permanantStates, setPermanantStates] = useState([]);
  const [permanantCities, setPermanantCities] = useState([]);
  const [currentStates, setCurrentStates] = useState([]);
  const [currentCities, setCurrentCities] = useState([]);
  const [nationality, setNationality] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const currentYear = new Date().getFullYear();
  const minSelectableYear = currentYear - 15;
  const minSelectableDate = new Date(minSelectableYear, 0, 1);

  const checks = {
    studentName: [values.studentName !== ""],
    mobileNo: [
      values.mobileNo !== "",
      /^([+])+998+([0-9]){9}$/.test(values.mobileNo),
    ],
    fatherName: [values.fatherName !== ""],
    motherName: [values.motherName !== ""],
    parentMobile: [
      values.parentMobile !== "",
      /^([+])+998+([0-9]){9}$/.test(values.parentMobile),
    ],
    nationality: [values.nationality !== null],
    passportNo: [values.passportNo !== ""],
    permanentAddress: [values.permanentAddress !== ""],
    currentAddress: [values.currentAddress !== ""],
  };

  const errorMessages = {
    studentName: ["This field is required"],
    mobileNo: ["This field is required", "Invalid Mobile No."],
    fatherName: ["This field is required"],
    motherName: ["This field is required"],
    parentMobile: ["This field is required", "Invalid Mobile No."],
    nationality: ["This field is required"],
    passportNo: ["This field is required"],
    permanentAddress: ["This field is required"],
    currentAddress: ["This field is required"],
  };

  useEffect(() => {
    getCountry();
    getNationality();
    if (!applicantData?.candidate_name || !applicantData?.auid) return;
    const nameWithAuid = `${
      applicantData.candidate_name || "Unknown Candidate"
    }-${applicantData.auid || "Unknown AUID"}`;
    if (state) {
      setCrumbs([
        {
          name: "Student Master",
          link: "/student-master",
        },
        { name: nameWithAuid },
      ]);
    } else {
      setCrumbs([
        {
          name: "Student Master",
        },
        { name: nameWithAuid },
      ]);
    }
  }, [applicantData, state]);

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

  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
  };
  const [subTab, setSubTab] = useState("Personal");

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

  const handleRegistrationEdit = () => {
    setValues((prev) => ({
      ...prev,
      ["studentName"]: applicantData.student_name,
      ["mobileNo"]: applicantData.mobile,
      ["dob"]: applicantData.dateofbirth,
      ["gender"]: applicantData.candidate_sex,
      ["fatherName"]: applicantData.father_name,
      ["motherName"]: applicantData.mother_name,
      ["parentMobile"]: applicantData.father_mobile,
      ["nationality"]: applicantData.nationalityId,
      ["bloodGroup"]: applicantData.blood_group,
      ["passportNo"]: applicantData.passport_no,
      ["permanentCountry"]: applicantData.permanantCountryId,
      ["permanantState"]: applicantData.permanantStateId,
      ["permanantCity"]: applicantData.permanantCityId,
      ["permanentAddress"]: applicantData.permanent_address,
      ["currentCountry"]: applicantData.currentCountryId,
      ["currentState"]: applicantData.currentStateId,
      ["currentCity"]: applicantData.currentCityId,
      ["currentAddress"]: applicantData.current_address,
    }));
    setIsEdit(true);
  };

  const editRequiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field] || values[field] === "Invalid Date")
        return false;
    }
    return true;
  };

  const handleCancel = () => {
    setValues(initialValues);
    setIsEdit(false);
  };

  const handleUpdate = async () => {
    const getStudentData = await axios
      .get(`/api/student/Student_Details/${applicantData.student_id}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    if (roleName === "Super Admin") {
      getStudentData.student_name = values.studentName;
      getStudentData.mobile = values.mobileNo;
    }

    getStudentData.dateofbirth =
      moment(values.dob).format("YYYY-MM-DD") + "T00:00:00Z";

    getStudentData.candidate_sex = values.gender;
    getStudentData.father_name = values.fatherName;
    getStudentData.mother_name = values.motherName;
    getStudentData.father_mobile = values.parentMobile;
    getStudentData.nationality = values.nationality;
    getStudentData.blood_group = values.bloodGroup;
    getStudentData.passport_no = values.passportNo;
    getStudentData.permanant_country = values.permanentCountry;
    getStudentData.permanant_state = values.permanantState;
    getStudentData.permanant_city = values.permanantCity;
    getStudentData.permanent_address = values.permanentAddress;
    getStudentData.current_country = values.currentCountry;
    getStudentData.current_state = values.currentState;
    getStudentData.current_city = values.currentCity;
    getStudentData.current_address = values.currentAddress;

    axios
      .put(
        `/api/student/Student_Details/${applicantData.student_id}`,
        getStudentData
      )
      .then((putRes) => {
        if (putRes.data.success === true) {
          setAlertMessage({
            severity: "success",
            message: "Data updated successfully !!",
          });
          setAlertOpen(true);
          setLoading(false);
          handleRefresh(true);
        } else {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!",
          });
          setAlertOpen(true);
          setLoading(false);
        }
        setIsEdit(false);
      })
      .catch((err) => {
        console.error(err);
        setAlertMessage({
          severity: "error",
          message: err.data ? err.data.message : "An error occured",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  return (
    <>
      <Grid container spacing={2} columnSpacing={4} sx={{ marginTop: "1px" }}>
        <Grid item xs={4} md={2}>
          <CustomTabs
            value={subTab}
            onChange={handleSubTabChange}
            orientation="vertical"
            variant="scrollable"
            className="customTabs"
          >
            <CustomTab value="Personal" label="Personal" />
            <CustomTab value="Programme" label="Programme" />
            <CustomTab value="Transcript" label="Transcript" />
          </CustomTabs>
        </Grid>

        <Grid item xs={8} md={10}>
          {subTab === "Programme" && (
            <>
              <Card>
                <CardHeader
                  title="Programme Details"
                  titleTypographyProps={{ variant: "subtitle2" }}
                  sx={{
                    backgroundColor: "rgba(74, 87, 169, 0.1)",
                    color: "#46464E",
                    padding: 1,
                  }}
                />
                <CardContent>
                  <Grid container columnSpacing={1} rowSpacing={1}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">Program Name</Typography>
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {applicantData.program_name}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">
                        Program Specialization Name
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <Typography variant="body2" color="textSecondary">
                        {applicantData.program_specialization_name}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </>
          )}

          {subTab === "Personal" && (
            <>
              <Card>
                <CardHeader
                  title="Personal Details"
                  titleTypographyProps={{ variant: "subtitle2" }}
                  action={
                    roleName !== "Student" ? (
                      <IconButton onClick={() => handleRegistrationEdit()}>
                        <EditIcon />
                      </IconButton>
                    ) : (
                      ""
                    )
                  }
                  sx={{
                    backgroundColor: "rgba(74, 87, 169, 0.1)",
                    color: "#46464E",
                    padding: 1,
                  }}
                />
                <CardContent>
                  {isEdit ? (
                    <Grid container columnSpacing={2} rowSpacing={3}>
                      {roleName === "Super Admin" ? (
                        <>
                          <Grid item xs={12} md={4}>
                            <CustomTextField
                              name="studentName"
                              label="Student Name"
                              value={values.studentName}
                              handleChange={handleChange}
                              checks={checks.studentName}
                              errors={errorMessages.studentName}
                              required
                            />
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <CustomTextField
                              name="mobileNo"
                              label="Mobile"
                              value={values.mobileNo}
                              handleChange={handleChange}
                              checks={checks.mobileNo}
                              errors={errorMessages.mobileNo}
                              required
                            />
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}

                      <Grid item xs={12} md={4}>
                        <CustomDatePicker
                          name="dob"
                          label="Date of birth"
                          value={values.dob}
                          handleChangeAdvance={handleChangeAdvance}
                          maxDate={minSelectableDate}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomSelect
                          name="gender"
                          label="Gender"
                          value={values.gender}
                          items={[
                            {
                              value: "Male",
                              label: "Male",
                            },
                            {
                              value: "Female",
                              label: "Female",
                            },
                          ]}
                          handleChange={handleChange}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name="fatherName"
                          label="Father Name"
                          value={values.fatherName}
                          handleChange={handleChange}
                          checks={checks.fatherName}
                          errors={errorMessages.fatherName}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name="motherName"
                          label="Mother Name"
                          value={values.motherName}
                          handleChange={handleChange}
                          checks={checks.motherName}
                          errors={errorMessages.motherName}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          label="Parent Mobile No."
                          name="parentMobile"
                          value={values.parentMobile}
                          handleChange={handleChange}
                          checks={checks.parentMobile}
                          errors={errorMessages.parentMobile}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomAutocomplete
                          label="Nationality"
                          name="nationality"
                          value={values.nationality}
                          options={nationality}
                          handleChangeAdvance={handleChangeAdvance}
                          checks={checks.nationality}
                          errors={errorMessages.nationality}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          label="Blood Group"
                          name="bloodGroup"
                          value={values.bloodGroup}
                          handleChange={handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          label="Passport No"
                          name="passportNo"
                          value={values.passportNo}
                          handleChange={handleChange}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomAutocomplete
                          name="permanentCountry"
                          label="Permanent Country"
                          value={values.permanentCountry}
                          options={country}
                          handleChangeAdvance={handleChangeAdvance}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomAutocomplete
                          name="permanantState"
                          label="Permanent Province"
                          value={values.permanantState}
                          options={permanantStates}
                          handleChangeAdvance={handleChangeAdvance}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomAutocomplete
                          name="permanantCity"
                          label="Permanent City"
                          value={values.permanantCity}
                          options={permanantCities}
                          handleChangeAdvance={handleChangeAdvance}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name="permanentAddress"
                          label="Permanent Address"
                          value={values.permanentAddress}
                          handleChange={handleChange}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomAutocomplete
                          name="currentCountry"
                          label="Current  Country"
                          value={values.currentCountry}
                          options={country}
                          handleChangeAdvance={handleChangeAdvance}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomAutocomplete
                          name="currentState"
                          label="Current Province"
                          value={values.currentState}
                          options={currentStates}
                          handleChangeAdvance={handleChangeAdvance}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomAutocomplete
                          name="currentCity"
                          label="Current City"
                          value={values.currentCity}
                          options={currentCities}
                          handleChangeAdvance={handleChangeAdvance}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name="currentAddress"
                          label="Current Address"
                          value={values.currentAddress}
                          handleChange={handleChange}
                          required
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Grid
                          container
                          justifyContent="flex-end"
                          columnSpacing={1}
                        >
                          <Grid item xs={12} md={1} align="right">
                            <Button
                              variant="contained"
                              color="error"
                              onClick={handleCancel}
                              sx={{ width: "100%" }}
                            >
                              Cancel
                            </Button>
                          </Grid>

                          <Grid item xs={12} md={1} align="right">
                            <Button
                              variant="contained"
                              color="success"
                              onClick={handleUpdate}
                              sx={{ width: "100%" }}
                              disabled={loading || !editRequiredFieldsValid()}
                            >
                              {loading ? (
                                <CircularProgress
                                  size={25}
                                  color="blue"
                                  style={{ margin: "2px 13px" }}
                                />
                              ) : (
                                <Typography variant="subtitle2">
                                  Save
                                </Typography>
                              )}
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container columnSpacing={1} rowSpacing={1}>
                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">AUID</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {applicantData.auid}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">
                          Date Of Admission
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          {moment(applicantData.date_of_admission).format(
                            "DD-MM-YYYY"
                          )}
                        </Typography>
                      </Grid>

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
                          {maskMobile(applicantData.mobile)}
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
                          {applicantData.acharya_email}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Father Name</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          {applicantData.father_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Mother Name</Typography>
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
                          {maskMobile(applicantData?.father_mobile)}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Nationality</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          {applicantData.nationality}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="subtitle2">Blood Group</Typography>
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
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </>
          )}
          {subTab === "Transcript" && (
            <>
              <Card>
                <CardHeader
                  title="Student Transcript Details"
                  titleTypographyProps={{ variant: "subtitle2" }}
                  sx={{
                    backgroundColor: "rgba(74, 87, 169, 0.1)",
                    color: "#46464E",
                    padding: 1,
                  }}
                />
                <CardContent>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "rgba(74, 87, 169, 0.1)",
                          color: "#46464E",
                        }}
                      >
                        <TableCell>Transcript</TableCell>
                        <TableCell>Date of Submission</TableCell>
                        <TableCell>Last Date of Submission</TableCell>
                        <TableCell>Collected By</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transcriptData.length > 0 ? (
                        transcriptData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.transcript || "-"}</TableCell>
                            <TableCell>
                              {row.submitted_date
                                ? moment(row.submitted_date).format(
                                    "DD-MM-YYYY"
                                  )
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {row.will_submit_by
                                ? moment(row.will_submit_by).format(
                                    "DD-MM-YYYY"
                                  )
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {row.collected_username || "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                            No Records
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default StudentDetailsViewDocuments;
