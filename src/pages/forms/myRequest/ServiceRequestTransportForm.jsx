import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress, Typography } from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDateTimePicker from "../../../components/Inputs/CustomDateTimePicker";
import moment from "moment";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import dayjs from 'dayjs';

const initialValues = {
  typeOfVehicle: "",
  pickUpdateAndTime: null,
  droppingDateAndTime: null,
  reportingPlace: "",
  reportingPerson: "",
  contactNumber: "",
  placeofVisit: "",
  purpose: "",
  duration: "",
};
const requiredFields = [
  "typeOfVehicle",
  "pickUpdateAndTime",
  "droppingDateAndTime",
  "reportingPerson",
  "contactNumber",
  "placeofVisit",
];

function ServiceRequestTransport() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const startDate = dayjs(values.pickUpdateAndTime);
  const endDate = startDate.add(7, 'day');

  const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
  const superAdminRole = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;
  const transportDeptId = JSON.parse(sessionStorage.getItem("userData"))?.dept_id;

  const checks = {
    typeOfVehicle: [values.typeOfVehicle !== ""],
    reportingPlace: [values.reportingPlace !== ""],
    reportingPerson: [values.reportingPerson !== ""],
    contactNumber: [/^[0-9]{10}$/.test(values.contactNumber)],
    placeofVisit: [values.placeofVisit !== ""],

    droppingDateAndTime: [
      values.droppingDateAndTime > values.pickUpdateAndTime,
    ],
  };

  const errorMessages = {
    typeOfVehicle: ["This field required"],
    reportingPlace: ["This field required"],
    reportingPerson: ["This field is required"],
    contactNumber: ["Invalid Number"],
    placeofVisit: ["This field is required"],
    droppingDateAndTime: values.pickUpdateAndTime
      ? [`Must be after Pick up date and time`]
      : [],
  };

  useEffect(() => {
    setCrumbs([{ name: "Service Request Transport", link: "/ServiceRequestTransport" },
      { name: "Create" }
    ]);
  }, [pathname]);

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if(name == "pickUpdateAndTime"){
          setValues((prev) => ({
      ...prev,
      ["droppingDateAndTime"]: null,
    }))
    };
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeAdvanceDropdate = (name, newValue) => {
    if (newValue > values.pickUpdateAndTime && name === "droppingDateAndTime") {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.type_of_vehicle = values.typeOfVehicle;
      temp.requesting_from_datetime = values.pickUpdateAndTime;
      temp.requesting_to_datetime = values.droppingDateAndTime;
      temp.duration = days + " Days" + " " + hours + " " + "hours";
      temp.user_id = userId;
      temp.reporting_place = values.reportingPlace;
      temp.report_to_person = values.reportingPerson;
      temp.report_to_person_number = values.contactNumber;
      temp.remarks = values.remarks;
      temp.place_of_visit = values.placeofVisit;
      temp.purpose = values.purpose;

      await axios
        .post(`/api/saveTransportMaintenance`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            // navigate(
            //   `/ServiceTransportView/${res.data.data.transport_maintenance_id}`,
            //   {
            //     replace: true,
            //   }
            // );
             navigate(
               `/ServiceRequestTransport`,
               {
                 replace: true,
              }
             );
            setAlertMessage({
              severity: "success",
              message: "Service request created successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  const start = moment(values.pickUpdateAndTime);
  const end = moment(values.droppingDateAndTime);
  const duration = moment.duration(end.diff(start));
  const differenceInHours = duration.asHours();

  const days = parseInt(Math.round(differenceInHours) / 24);

  const hours = Math.round(differenceInHours) - days * 24;

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          rowSpacing={{ xs: 2, md: 4 }}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={2.4}>
            <CustomSelect
              name="typeOfVehicle"
              label="Type of vehicle"
              value={values.typeOfVehicle}
              handleChange={handleChange}
              items={[
                { label: "Car", value: "Car" },
                { label: "Bus", value: "Bus" },
              ]}
              checks={checks.typeOfVehicle}
              errors={errorMessages.typeOfVehicle}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomTextField
              rows={2}
              multiline
              name="reportingPlace"
              label="Reporting Place"
              value={values.reportingPlace}
              checks={checks.reportingPlace}
              errors={errorMessages.reportingPlace}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomDateTimePicker
              name="pickUpdateAndTime"
              label="Pickup time"
              value={values.pickUpdateAndTime}
              handleChangeAdvance={handleChangeAdvance}
              seconds
              checks={checks.enterDateTime}
              errors={errorMessages.enterDateTime}
              minDateTime={(transportDeptId==25 || superAdminRole==1)? dayjs() : dayjs().add(24, 'hour').add(1, 'minute')}
              required
            />
            <Typography sx={{fontSize:"12px",textAlign:"justify"}}>Transport indents must be submitted at least 24 hours in advance to ensure timely arrangements <span style={{color:"red",fontSize:"12px"}}>*</span></Typography> 
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomDateTimePicker
              name="droppingDateAndTime"
              label="Approx. Droping time"
              value={values.droppingDateAndTime}
              handleChangeAdvance={handleChangeAdvanceDropdate}
              checks={checks.droppingDateAndTime}
              errors={errorMessages.droppingDateAndTime}
              disabled={!values.pickUpdateAndTime}
              minDateTime={startDate}
              maxDateTime={endDate}
              seconds
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomTextField
              name="duration"
              label="Duration"
              value={
                values.droppingDateAndTime
                  ? days + " Days" + " " + hours + " " + "hours"
                  : ""
              }
              handleChange={handleChange}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomTextField
              name="reportingPerson"
              label="Reporting Person"
              value={values.reportingPerson}
              handleChange={handleChange}
              checks={checks.reportingPerson}
              errors={errorMessages.reportingPerson}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomTextField
              name="contactNumber"
              label="Contact Number"
              value={values.contactNumber}
              handleChange={handleChange}
              checks={checks.contactNumber}
              errors={errorMessages.contactNumber}
              required
            />
          </Grid>

          <Grid item xs={12} md={3.6}>
            <CustomTextField
              rows={4}
              multiline
              name="placeofVisit"
              label="Place of visit"
              value={values.placeofVisit}
              handleChange={handleChange}
              checks={checks.placeofVisit}
              errors={errorMessages.placeofVisit}
              required
            />
          </Grid>

          <Grid item xs={12} md={3.6}>
            <CustomTextField
              rows={4}
              multiline
              name="purpose"
              label="Purpose"
              value={values.purpose}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{"Create"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ServiceRequestTransport;
