import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = {
  acYearId: "",
  roomNumber: "",
  standardAccessories: "",
  roomType: "",
  hostelBlockName: "",
  hostelFloorName: "",
  active: true,
};

const requiredFields = [
  "acYearId",
  "roomNumber",
  "standardAccessories",
  "roomType",
  "hostelBlockName",
  "hostelFloorName",
];

function HostelRoomForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [hostelBlocks, setHostelBlocks] = useState([]);
  console.log(hostelBlocks, "hostelBlocks", values, "values");
  const [hostelFloors, setHostelFloors] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [acYearOptions, setAcyearOptions] = useState([]);

  const checks = {
    acYearId: [values.acYearId !== ""],
    roomNumber: [values.roomNumber !== "", /^[0-9]+$/.test(values.roomNumber)],
    standardAccessories: [values.standardAccessories !== ""],
    roomType: [values.roomType !== ""],
    hostelBlockName: [values.hostelBlockName !== ""],
    hostelFloorName: [values.hostelFloorName !== ""],
  };

  const errorMessages = {
    acYearId: ["This field is required"],
    roomNumber: ["This field is required", "Enter only numbers"],
    standardAccessories: ["This field is required"],
    roomType: ["This field is required"],
    hostelBlockName: ["This field is required"],
    hostelFloorName: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/hostelcreationmaster/hostelroom/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Hostel Master", link: "/HostelCreationMaster/HostelBlock" },
        { name: "Room" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getRoomData();
    }
    getAcYearData()
    getHostelBlocks();
  }, [pathname]);

  useEffect(() => {
    if (values?.hostelBlockName) {
      getHostelFloors();

    }
  }, [values?.hostelBlockName]);

  const getHostelBlocks = async () => {
    await axios
      .get(`/api/hostel/HostelBlocks`)
      .then((res) => {
        console.log(res, "res");
        const hostelBlocks = res.data.data.map((obj) => ({
          value: obj.hostelBlockId,
          label: obj.blockName,
        }));
        setHostelBlocks(hostelBlocks);
      })
      .catch((err) => console.error(err));
  };
  const getAcYearData = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
        });

        setAcyearOptions(optionData);
      })
      .catch((error) => console.error(error));
  };

  const getHostelFloors = async () => {
    try {
      const res = await axios.get(`/api/hostel/getHostelFloorDetails/${values?.hostelBlockName}`);
      console.log(res, "res");

      const floorData = res?.data?.data;
      const hostelFloors = Object.values(floorData)?.flat()?.map((floor) => ({
        value: floor.hostel_floor_id,
        label: floor.floor_name,
      }));

      setHostelFloors(hostelFloors);
    } catch (err) {
      console.error(err);
    }
  };

  const getRoomData = async () => {
    await axios
      .get(`/api/hostel/HostelRooms/${id}`)
      .then((res) => {
        setValues({
          hostelRoomId: id,
          roomNumber: res.data.data.room_creation_number,
          standardAccessories: res.data.data.standardAccessories,
          roomType: res.data.data.roomTypeId,
          hostelBlockName: res.data.data.hostelsBlockId,
          hostelFloorName: res.data.data.hostelsFloorId,
          active: res.data.data.active,
          roomName: res.data.data.roomName,
          templateId: res.data.data.templateId,
          acYearId:res.data.data.ac_year_id
        });
        setCrumbs([
          { name: "Hostel Master", link: "/HostelCreationMaster/HostelBlock" },
          { name: "Room" },
          { name: "Update" },
          { name: res.data.data.roomNumber },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });
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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {
        room_creation_number: values.roomNumber,
        standardAccessories: values.standardAccessories,
        roomTypeId: values.roomType,
        hostelsBlockId: values.hostelBlockName,
        hostelsFloorId: values.hostelFloorName,
        active: true,
        ac_year_id: values.acYearId
      };

      await axios
        .post(`/api/hostel/HostelRooms`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/HostelCreationMaster/HostelRoom", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Room created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occurred",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occurred",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {
        hostelRoomId: Number(values?.hostelRoomId),
        room_creation_number: values.roomNumber,
        standardAccessories: values.standardAccessories,
        roomTypeId: values.roomType,
        hostelsBlockId: values.hostelBlockName,
        hostelsFloorId: values.hostelFloorName,
        active: values.active,
        templateId: values.templateId,
        roomName: values.roomName,
        ac_year_id: values.acYearId
      };

      try {
        const res = await axios.put(`/api/hostel/HostelRooms/${id}`, temp);
        const data = await axios.post(`/api/hostel/hostelRoomsHistory`, temp);
        setLoading(false);

        if (res.status === 200 || res.status === 201) {
          navigate("/HostelCreationMaster/HostelRoom", { replace: true });
          setAlertMessage({
            severity: "success",
            message: "Room updated",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: res?.data ? res?.data?.message : "An error occurred",
          });
        }
        setAlertOpen(true);
      } catch (err) {
        setLoading(false);

        // Handle error response
        const errorMessage =
          err?.response?.status === 500 && err?.response?.data?.data
            ? err?.response?.data?.data
            : "An error occurred";

        setAlertMessage({
          severity: "error",
          message: typeof errorMessage === "string" ? errorMessage : "An error occurred",
        });
        setAlertOpen(true);
      }
    }
  };


  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="acYearId"
              label="Ac Year"
              value={values.acYearId}
              options={acYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.acYearId}
              errors={errorMessages.acYearId}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="roomNumber"
              label="Room Number"
              value={values.roomNumber}
              handleChange={handleChange}
              checks={checks.roomNumber}
              errors={errorMessages.roomNumber}
              required
              disabled={!isNew}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomSelect
              name="roomType"
              label="Room Type"
              value={values.roomType}
              items={[
                { value: 1, label: "SINGLE OCCUPANCY" },
                { value: 2, label: "DOUBLE OCCUPANCY" },
                { value: 3, label: "TRIPLE OCCUPANCY" },
                { value: 4, label: "QUADRUPLE OCCUPANCY" },
                { value: 6, label: "SIXTAPLE OCCUPANCY" },
                { value: 7, label: "SEVEN OCCUPANCY" },
                { value: 8, label: "Eight OCCUPANCY" },
              ]}
              handleChange={handleChange}
              checks={checks.roomType}
              errors={errorMessages.roomType}
              required
            // disabled ={!isNew}
            />
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="standardAccessories"
              label="Standard Accessories"
              value={values.standardAccessories}
              options={[
                { value: "WARDROBE", label: "WARDROBE" },
              ]}
              handleChangeAdvance={handleChangeAdvance}
              multiple
              checks={checks.standardAccessories}
              errors={errorMessages.standardAccessories}
              required
            />
          </Grid> */}
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="standardAccessories"
              label="Standard Accessories"
              value={values.standardAccessories}
              handleChange={handleChange}
              checks={checks.standardAccessories}
              errors={errorMessages.standardAccessories}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="hostelBlockName"
              label="Hostel Block"
              value={values.hostelBlockName}
              options={hostelBlocks}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.hostelBlockName}
              errors={errorMessages.hostelBlockName}
              required
              disabled={!isNew}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            {/* <CustomSelect
              name="hostelFloorName"
              label="Hostel Floor"
              value={values.hostelFloorName}
              items={hostelFloors.map((floor) => ({
                value: floor.floorName,
                label: floor.floorName,
              }))}
              handleChange={handleChange}
              checks={checks.hostelFloorName}
              errors={errorMessages.hostelFloorName}
              required
            /> */}
            <CustomAutocomplete
              name="hostelFloorName"
              label="Hostel Floor"
              value={values.hostelFloorName}
              options={hostelFloors}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.hostelFloorName}
              errors={errorMessages.hostelFloorName}
              required
              disabled={!isNew}
            />
          </Grid>

          {/* <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Checkbox
                  name="active"
                  checked={values.active}
                  onChange={handleChange}
                />
              }
              label="Active"
            />
          </Grid> */}

          <Grid item xs={12} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={isNew ? handleCreate : handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isNew ? (
                "Create"
              ) : (
                "Update"
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default HostelRoomForm;
