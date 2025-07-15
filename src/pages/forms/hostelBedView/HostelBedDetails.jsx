import React, { lazy, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Button,
  CircularProgress,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Hotel";
import { makeStyles } from "@mui/styles";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { convertToDMY } from "../../../utils/DateTimeUtils";
import useDebounce from "../../../hooks/useDebounce";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import { useParams } from "react-router-dom";
const StudentDetails = lazy(() => import("../../../components/StudentDetails"));

const occupancy = [
  { value: 1, label: "SINGLE OCCUPANCY" },
  { value: 2, label: "DOUBLE OCCUPANCY" },
  { value: 3, label: "TRIPLE OCCUPANCY" },
  { value: 4, label: "QUADRUPLE OCCUPANCY" },
  { value: 6, label: "SIXTAPLE OCCUPANCY" },
  { value: 7, label: "SEVEN OCCUPANCY" },
  { value: 8, label: "EIGHT OCCUPANCY" },
];

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
    textAlign: "center",
  },
  blockContainer: {
    border: "2px solid #ccc",
    borderRadius: 4,
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  blockName: {
    padding: theme.spacing(1),
    borderBottom: "1px solid #ccc",
    display: "flex",
    alignItems: "center",
  },
  roomContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(2),
    padding: theme.spacing(1),
  },
  roomBox: {
    border: "2px solid #ccc",
    borderRadius: 4,
    padding: theme.spacing(1),
    flex: "1 0 100px",
  },
  bedIcon: {
    fontSize: "1.5rem",
    marginRight: theme.spacing(0.5),
  },
  iconsContainer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  numbersContainer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  bedNumber: {
    marginRight: theme.spacing(0.5),
  },
  bedCount: {
    textAlign: "center",
    marginTop: theme.spacing(0.5),
  },
}));
const getStatusColor = (status) => {
  switch (status) {
    case "Vacant":
      return "#32CD32";
    case "Occupied":
      return "#F08080";
    case "Assigned":
      return "#87CEEB";
    case "Blocked":
      return "#FFDE21";
    case "Occupied-Blocked":
      return "#af601a";
    case "Occupied-Assigned":
      return "#af601a";
    default:
      return "#32CD32";
  }
};

const initialValues = { auid: "", doj: "", remarks: "" };
const requiredFields = ["auid", "doj"];

const groupBedsByBedName = (bedDetails) => {
  const grouped = {};
  Object.entries(bedDetails).forEach(([roomName, beds]) => {
    beds.forEach((bed) => {
      if (!grouped[bed.bedName]) {
        grouped[bed.bedName] = {
          roomName,
          beds: [],
        };
      }
      grouped[bed.bedName].beds.push(bed);
    });
  });
  return grouped;
};

const BedDetails = ({ bedDetails, selectedValues, getBedDetials }) => {
  const classes = useStyles();
  const [bedOpen, setBedOpen] = useState(false);
  const [bed, setBedDetail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isBedAssign, setIsBedAssign] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingAssignmentData, setPendingAssignmentData] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [studentDetails, setStudentDetails] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const { id } = useParams();
  const groupedBeds = groupBedsByBedName(bedDetails);

  const debouncedAuid = useDebounce(values.auid, 500); // Use debounce with a 500ms delay
  const firstRoomKey = Object.keys(bedDetails)[0];
  const blockName = bedDetails[firstRoomKey][0].blockName;

  const checks = {
    // type: [values.type !== ""],
    auid: [values.auid !== ""],
    doj: [values.doj !== ""],
  };
  const getStudentDetails = async () => {
    try {
      setLoading(true);
      const containsAlphabetic = /[a-zA-Z]/.test(debouncedAuid);
      const baseUrl = "/api/student/getStudentDetailsBasedOnAuidAndStrudentId";
      const url = `${baseUrl}?${containsAlphabetic ? "auid" : "student_id"
        }=${debouncedAuid}`;
      const response = await axios.get(url);
      const studentData = response?.data?.data?.[0];

      if (studentData) {
        setStudentDetails(studentData);

        if (selectedValues?.acYearId && studentData?.id) {
          const checkBed = await axios.get(
            `/api/hostel/isHostelBedAssignedByAcademicYearAndStudentId/${selectedValues.acYearId}/${studentData.id}`
          );
          if (checkBed?.data?.data === true) {
            setAlertMessage({
              severity: "error",
              message: "The bed has already been assigned to this student",
            });
            setAlertOpen(true);
            setIsBedAssign(true);
          } else {
            setIsBedAssign(false);
          }
        }
      } else {
        setStudentDetails(null);
        setIsBedAssign(false);
      }
    } catch (err) {
      console.error(err);
      setIsBedAssign(false);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (debouncedAuid) {
      getStudentDetails();
    }
  }, [debouncedAuid]);

  const onClosePopUp = () => {
    setBedOpen(false);
    setValues(initialValues);
    setStudentDetails([]);
  };

  const onOpenPopUp = (bed) => {
    if (
      (bed?.bedStatus === "Occupied" &&
        bed?.cancelledRemarksStatus === null &&
        bed?.occupiedStatusOfBed === true) ||
      bed?.bedStatus === null ||
      bed?.bedStatus === "" ||
      bed?.bedStatus === "Free" ||
      bed?.bedStatus === "Blocked"
    ) {
      setBedDetail(bed);
      setBedOpen(true);
    } else {
      setAlertMessage({
        severity: "error",
        message: "Bed Occupied",
      });
      setAlertOpen(true);
    }
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

  const prepareCreate = () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
      return;
    }

    const temp = {
      hostelBlockId: selectedValues?.blockName,
      hostelFloorId: bed?.hostelFloorId,
      acYearId: selectedValues?.acYearId,
      hostelFeeTemplateId: selectedValues?.feeTemplate,
      hostelRoomId: bed?.hostelRoomId,
      hostelBedId: bed?.hostelBedId,
      studentId: studentDetails?.id,
      expectedJoiningDate: moment(values?.doj).format("YYYY-MM-DD"),
      remarks: values?.remarks,
      active: true,
      bedStatus: bed?.bedStatus === "Occupied" ? "Occupied-Blocked" : "Blocked",
    };

    if (bed?.BlockedDate && bed?.bedStatus === "Blocked") {
      setPendingAssignmentData(temp);
      setOpenDialog(true);
    } else {
      handleCreate(temp);
    }
  };

  const handleCreate = async (temp) => {
    setLoading(true);

    try {
      if (bed?.BlockedDate && bed?.bedStatus === "Blocked") {
        await axios.delete(
          `/api/hostel/deactiveHostelBedAssignment/${bed?.hostelBedAssignmentId}`
        );
      }

      await axios.post(`/api/hostel/hostelBedAssignment`, temp);

      setAlertMessage({
        severity: "success",
        message: "Assigned Successfully",
      });
      setAlertOpen(true);
      onClosePopUp();
      getBedDetials();
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response?.data?.message || "Error",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
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
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPendingAssignmentData(null);
  };
  return (
    <>
      <ModalWrapper
        title=""
        maxWidth={1000}
        open={bedOpen}
        setOpen={() => onClosePopUp()}
      >
        <Typography variant="subtitle2" className={classes.bg}>
          BED ASSIGN - {bed?.roomName} -{" "}
          {
            occupancy.find((occupancy) => occupancy.value === bed?.roomTypeId)
              ?.label
          }
        </Typography>
        <Grid container rowSpacing={2} columnSpacing={4} mt={1}>
          {/* <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="type"
              label="Type"
              value={values.type}
              items={[
                { value: "auid", label: "AUID" },
                { value: "Withoutauid", label: "Without AUID" },
                { value: "Guest", label: "Guest" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid> */}
          <Grid item xs={12} md={4} mt={2}>
            <CustomTextField
              name="auid"
              label="AUID"
              value={values.auid}
              handleChange={handleChange}
              helperText=" "
              errors={["This field is required"]}
              checks={[values.auid !== ""]}
              required
            />
          </Grid>
          <Grid item xs={12} md={4} mt={2}>
            <CustomDatePicker
              name="doj"
              label="Expected date of joining"
              value={values.doj}
              minDate={new Date()}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
        {/* <StudentDetails id={values?.auid} /> */}
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
                    {renderDetailRow(
                      "Student Name",
                      studentDetails.student_name
                    )}
                    {renderDetailRow("USN", studentDetails.usn ?? "-")}
                    {renderDetailRow(
                      "DOA",
                      moment(studentDetails.date_of_admission).format(
                        "DD-MM-YYYY"
                      )
                    )}
                    {renderDetailRow(
                      "School",
                      studentDetails.school_name_short
                    )}
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
        <Grid item xs={12} align="right" mt={2}>
          <Button
            sx={{ borderRadius: 2 }}
            variant="contained"
            onClick={() => prepareCreate()}
            disabled={
              !(
                !isBedAssign &&
                values.auid &&
                values.doj &&
                studentDetails &&
                Object.keys(studentDetails)?.length > 0
              )
            }
          >
            {isLoading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Assign"
            )}
          </Button>
        </Grid>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
        >
          <DialogTitle id="confirm-dialog-title">Confirm Bed Assign</DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-dialog-description">
              This bed is already {bed?.bedStatus ? bed?.bedStatus : "blocked"}. Do you want to deactivate the previous assignment and continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleCreate(pendingAssignmentData);
                handleCloseDialog();
              }}
              color="primary"
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

      </ModalWrapper>

      <Grid container direction="column">
        <Grid item className={classes.blockContainer}>
          <Grid item className={classes.blockName}>
            <Typography
              variant="h6"
              style={{ fontWeight: "bold", textAlign: "center" }}
            >
              {blockName}
            </Typography>
          </Grid>

          <Grid item className={classes.roomContainer}>
            {Object.entries(bedDetails)
              .sort(([aRoomName], [bRoomName]) =>
                aRoomName.localeCompare(bRoomName)
              ) // Sort rooms by name in ascending order
              .map(([roomName, beds]) => {
                // Group beds by bedName
                const groupedBeds = beds.reduce((acc, bed) => {
                  if (!acc[bed.bedName]) {
                    acc[bed.bedName] = [];
                  }
                  acc[bed.bedName].push(bed); // Group beds by bedName
                  return acc;
                }, {});

                return (
                  <Box key={roomName} className={classes.roomBox}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      color="black"
                      style={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      {roomName}
                    </Typography>

                    <Box className={classes.iconsContainer}>
                      {Object.values(groupedBeds).map((bedGroup, index) => (
                        <Box key={bedGroup[0].hostelBedId} textAlign="center">
                          <Tooltip
                            title={
                              <React.Fragment>
                                {bedGroup.map((bed, i) => (
                                  bed.BlockedDate && (<div key={i}>
                                    <Typography color="inherit">
                                      Name: {bed.studentName}
                                    </Typography>
                                    <Typography color="inherit">
                                      AUID: {bed.auid}
                                    </Typography>

                                    <Typography color="inherit">
                                      Blocked Date:{" "}
                                      {moment(
                                        new Date(
                                          bed.BlockedDate
                                        ).toLocaleDateString()
                                      ).format("DD/MM/YYYY")}
                                    </Typography>
                                    {i < bedGroup.length - 1 && <hr />}{" "}
                                    {/* Divider between students */}
                                  </div>
                                  )
                                ))}
                              </React.Fragment>
                            }
                          >
                            <IconButton>
                              <BedIcon
                                className={classes.bedIcon}
                                style={{
                                  color: getStatusColor(
                                    bedGroup[0].bedStatus,
                                  ), // Use the status of the first bed in the group
                                }}
                                onClick={() => onOpenPopUp(bedGroup[0])} // Use the first bed for popup handling
                              />
                            </IconButton>
                          </Tooltip>

                          <Typography
                            variant="body2"
                            className={classes.bedCount}
                          >
                            {index + 1}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                );
              })}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default BedDetails;
