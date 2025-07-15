import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import VacateBed from "./VacateBed";
import CancelBed from "./CancelBed";
import CancelIcon from "@mui/icons-material/Cancel";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ChangeBed from "./ChangeBed";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  foodType: "",
  occupiedDate: "",
  acyearId: null,
  schoolId: null,
  blockName: null
};
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

function HostelBedViewIndex({ tab }) {
  const [rows, setRows] = useState([]);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [foodTypeOpen, setFoodTypeOpen] = useState(false);
  const [occupiedTypeOpen, setOccupiedTypeOpen] = useState(false);
  const [vacateBedOpen, setVacateBedOpen] = useState(false);
  const [cancelBedOpen, setCancelBedOpen] = useState(false);
  const [changeBedOpen, setChangeBedOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [rowDetails, setRowDetails] = useState();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [hostelBlocks, setHostelBlocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    type: false,
    created_date: false,
    paid: false,
    waiverAmount: false
  });
  const occupancy = [
    { value: 1, label: "SINGLE OCCUPANCY" },
    { value: 2, label: "DOUBLE OCCUPANCY" },
    { value: 3, label: "TRIPLE OCCUPANCY" },
    { value: 4, label: "QUADRUPLE OCCUPANCY" },
    { value: 6, label: "SIXTAPLE OCCUPANCY" },
    { value: 7, label: "SEVEN OCCUPANCY" },
    { value: 8, label: "EIGHT OCCUPANCY" },
  ];
  const foodTypeOptions = [
    { value: "VEG", label: "VEG" },
    { value: "NON-VEG", label: "NON-VEG" },
  ];
  const handleChangeFoodStatus = (params) => {
    const row = params?.row || {};
    setFoodTypeOpen(true);
    setRowDetails(row);
    setValues((prev) => ({
      ...prev,
      foodType: row.foodStatus || "",
    }));
  };

  const handleChangeOccupied = (params) => {
    setOccupiedTypeOpen(true);
    setRowDetails(params?.row);
  };
  const handleVacateBed = (params) => {
    setVacateBedOpen(true);
    setRowDetails(params?.row);
  };
  const handleCancelBed = (params) => {
    setCancelBedOpen(true);
    setRowDetails(params?.row);
  };
  const handleChangeBed = (params) => {
    setChangeBedOpen(true);
    setRowDetails(params?.row);
  };
  const columns = [
    {
      field: "foodStatus",
      headerName: "Food Status",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row?.foodStatus !== null && params.row?.foodStatus !== "" ? (
          <div
            onClick={() => handleChangeFoodStatus(params)}
            style={{
              color: params.row?.foodStatus === "VEG" ? "green" : "red",
              cursor: "pointer",
            }}
          >
            {params.row?.foodStatus}
          </div>
        ) : (
          <IconButton
            onClick={() => handleChangeFoodStatus(params)}
            sx={{ padding: 0 }}
            color="primary"
          >
            <AddCircleOutlineSharpIcon />
          </IconButton>
        ),
      ],
    },
    { field: "studentName", headerName: "Name", flex: 1 },
    { field: "auid", headerName: "Auid", flex: 1, minWidth: 130 },
    {
      field: "Year/sem",
      headerName: "Year/sem",
      flex: 1,
      renderCell: (params) => {
        return (
          <>{`${params?.row?.currentYear} / ${params?.row?.currentSem}`}</>
        );
      },
    },
    { field: "acYear", headerName: "Ac Year", flex: 1 },
    { field: "blockName", headerName: "Block", flex: 1 },
    { field: "bedName", headerName: "Bed", flex: 1 },
    { field: "templateName", headerName: "Template", flex: 1 },
    // { field: "floorName", headerName: "Floor", flex: 1 },
    // {
    //   field: "hostel_room_type_id",
    //   headerName: "Room Type",
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         {occupancy.find(
    //           (occupancy) => occupancy.value === params.row?.hostel_room_type_id
    //         )?.label || ""}
    //       </>
    //     );
    //   },
    // },
    {
      field: "totalAmount", headerName: "Fixed", flex: 1, align: "right",
      headerAlign: "right"
    },
    { field: "type", headerName: "Type", flex: 1, hide: true },
    {
      field: "paid",
      headerName: "Paid",
      flex: 1,
      valueGetter: (value, row) => row.paid || 0,
      hide: true,
      align: "right",
      headerAlign: "right"
    },
    {
      field: "waiverAmount",
      headerName: "Waiver",
      flex: 1,
      valueGetter: (value, row) => row.waiverAmount || 0,
      align: "right",
      headerAlign: "right"
    },
    {
      field: "due",
      headerName: "Due",
      flex: 1,
      valueGetter: (value, row) => row.due || 0,
      align: "right",
      headerAlign: "right"
    },
    {
      field: "created_date",
      headerName: "Assigned Date",
      flex: 1,
      valueFormatter: (value) => moment(value).format("DD-MM-YYYY"),
      renderCell: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
      hide: true,
    },
    // {
    //   field: "fromDate",
    //   headerName: "Occupied Date",
    //   flex: 1,
    //   valueFormatter: (value) => moment(value).format("DD-MM-YYYY"),
    //   renderCell: (params) => moment(params.row.fromDate).format("DD-MM-YYYY"),
    // },
    {
      field: "fromDate",
      headerName: "Occupied Date",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.fromDate !== null ? (
          <div
          // onClick={() => handleChangeOccupied(params)}
          // style={{
          //   cursor: "pointer",
          // }}
          >
            {moment(params?.row?.fromDate).format("DD-MM-YYYY")}
          </div>
        ) : roleShortName === "SAA" ? (
          <IconButton
            onClick={() => handleChangeOccupied(params)}
            sx={{ padding: 0 }}
            color="primary"
          >
            <AddCircleOutlineSharpIcon />
          </IconButton>
        ) : roleShortName !== "SAA" && params?.row?.due == 0 ? (
          <IconButton
            onClick={() => handleChangeOccupied(params)}
            sx={{ padding: 0 }}
            color="primary"
          >
            <AddCircleOutlineSharpIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => handleChangeOccupied(params)}
            sx={{ padding: 0 }}
            color="primary"
            disabled
          >
            <AddCircleOutlineSharpIcon />
          </IconButton>
        ),
      ],
    },
    { field: "toDate", headerName: "Vacate Date", flex: 1, hide: true },
    {
      field: "vacate",
      headerName: "Vacate",
      type: "actions",
      flex: 1,
      hide: tab === "InActive Bed" ? true : false,
      getActions: (params) => [
        params.row.toDate ? (
          // Show EyeIcon if toDate is present
          <IconButton color="primary" onClick={() => handleVacateBed(params)}>
            <VisibilityOutlinedIcon />
          </IconButton>
        ) : (params.row.fromDate &&
          (params?.row?.due === 0 && roleShortName !== "SAA")) ||
          (params.row.fromDate && roleShortName === "SAA") ? (
          // Show ExitToAppIcon for vacating
          <IconButton color="primary" onClick={() => handleVacateBed(params)}>
            <ExitToAppIcon />
          </IconButton>
        ) : (
          <></>
        ),
      ],
    },
    {
      field: "Change Bed",
      headerName: "Change Bed",
      flex: 1,
      type: "actions",
      hide: tab === "InActive Bed" ? true : false,
      getActions: (params) => [
        <IconButton color="primary" onClick={() => handleChangeBed(params)}>
          <ChangeCircleOutlinedIcon />
        </IconButton>,
      ],
    },
    {
      field: "Cancel Bed",
      headerName: "Cancel Bed",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        tab === "InActive Bed" ? (
          <IconButton color="primary" onClick={() => handleCancelBed(params)}>
            <VisibilityOutlinedIcon />
          </IconButton>
        ) : (
          <IconButton color="primary" onClick={() => handleCancelBed(params)}>
            <CancelIcon />
          </IconButton>
        ),
      ],
    },
    {
      field: "createdUsername",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },
  ];
  useEffect(() => {
    setCrumbs([{}]);
    getAcademicYears()
    getSchoolDetails()
    getHostelBlocks()
  }, []);


  useEffect(() => {
    if (values.acyearId) {
      getData();
    }
  }, [values.acyearId, values.schoolId, values.blockName]);

  const getHostelBlocks = async () => {
    await axios
      .get(`/api/hostel/HostelBlocks`)
      .then((res) => {
        const hostelBlocks = res?.data?.data?.map((obj) => ({
          value: obj.hostelBlockId,
          label: obj.blockName,
        }));
        setHostelBlocks(hostelBlocks);
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
      console.log(err, "err");
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: 0,
        pageSize: 100000,
        sort: "createdDate",
        acYearId: values?.acyearId || "",
      });

      if (values?.schoolId) params.append("schoolId", values.schoolId);
      if (values?.blockName) params.append("blockId", values.blockName);

      if (tab === "InActive Bed") {
        params.append("active", "false");
      } else {
        params.append("active", "true");
        params.append(
          "cancelledStatus",
          tab === "Active Bed" ? "NOT CANCELLED" : "CANCELLED"
        );
      }
      const url = `/api/hostel/fetchAllHostelBedAssignment?${params.toString()}`;
      const response = await axios.get(url);
      onClosePopUp();
      setRows(response?.data?.data?.Paginated_data?.content || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onClosePopUp = () => {
    setFoodTypeOpen(false);
    setOccupiedTypeOpen(false);
    setVacateBedOpen(false);
    setCancelBedOpen(false);
    setChangeBedOpen(false);
    setValues((prev) => ({
      ...prev,
      foodType: "",
      occupiedDate: "",
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const updateFoodType = async () => {
    const temp = {};
    temp.hostelBlockId = rowDetails?.hostelBlockId;
    temp.hostelFloorId = rowDetails?.hostelFloorId;
    temp.hostelRoomId = rowDetails?.hostelRoomId;
    temp.acYearId = rowDetails?.acYearId;
    temp.hostelBedId = rowDetails?.hostelBedId;
    temp.studentId = rowDetails?.studentId;
    temp.hostelFeeTemplateId = rowDetails?.hostelFeeTemplateId;
    temp.fromDate = rowDetails?.fromDate;
    temp.toDate = rowDetails?.toDate;
    temp.foodStatus = values?.foodType;
    // temp.vacateBy = 1;
    temp.expectedJoiningDate = rowDetails?.expectedJoiningDate;
    temp.active = true;
    const response = await axios.get(`/api/hostel/hostelBedAssignment/${rowDetails?.id}`);
    const { hostelBed } = response?.data?.data
    temp.bedStatus = hostelBed?.bedStatus;
    await axios
      .put(`/api/hostel/updateHostelBedAssignment/${rowDetails?.id}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Food Status updated",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
        }
        setAlertOpen(true);
        onClosePopUp();
        getData();
      })
      .catch((err) => console.error(err));
  };
  const updateOccupiedDate = async () => {
    const temp = {};
    temp.hostelBlockId = rowDetails?.hostelBlockId;
    temp.hostelFloorId = rowDetails?.hostelFloorId;
    temp.hostelRoomId = rowDetails?.hostelRoomId;
    temp.acYearId = rowDetails?.acYearId;
    temp.hostelBedId = rowDetails?.hostelBedId;
    temp.studentId = rowDetails?.studentId;
    temp.hostelFeeTemplateId = rowDetails?.hostelFeeTemplateId;
    temp.fromDate = moment(values?.occupiedDate).format("YYYY-MM-DD");
    temp.toDate = rowDetails?.toDate;
    temp.foodStatus = rowDetails?.foodStatus;
    // temp.vacateBy = 1;
    temp.expectedJoiningDate = rowDetails?.expectedJoiningDate;
    temp.bedStatus = "Occupied";
    temp.active = true;
    await axios
      .put(`/api/hostel/updateHostelBedAssignment/${rowDetails?.id}`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Occupied date updated",
          });
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
        }
        setAlertOpen(true);
        onClosePopUp();
        getData();
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box sx={{ position: "relative", mt: 2 }}>
        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="acyearId"
              options={academicYearOptions}
              value={values.acyearId}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!values.acyearId}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="blockName"
              label="Block Name"
              value={values.blockName}
              options={hostelBlocks}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          <Grid item xs={12} md={5} sx={{ textAlign: "right" }}>
            <Button
              onClick={
                pathname.toLowerCase() === "/hostelbedviewmaster/hostelbedview"
                  ? () => navigate("/HostelBedViewMaster/HostelBedView/New")
                  : () => navigate("/AllHostelBedViewMaster/AllHostelBedView/New")
              }
              variant="contained"
              disableElevation
              sx={{ borderRadius: 2 }}
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Grid>
        </Grid>
        <GridIndex rows={rows} columns={columns} columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel} />
      </Box>
      <ModalWrapper
        title="Food Type"
        maxWidth={600}
        open={foodTypeOpen}
        setOpen={() => onClosePopUp()}
      >
        <Grid container rowSpacing={2} columnSpacing={4} mt={1}>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="foodType"
              label="Select"
              options={foodTypeOptions}
              value={values.foodType}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              sx={{ borderRadius: 2 }}
              variant="contained"
              onClick={() => updateFoodType()}
              disabled={!values.foodType}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Update"
              )}
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
      <ModalWrapper
        title="Occupied Date"
        maxWidth={600}
        open={occupiedTypeOpen}
        setOpen={() => onClosePopUp()}
      >
        <Grid container rowSpacing={2} columnSpacing={4} mt={1}>
          <Grid item xs={12} md={4} mt={2}>
            <CustomDatePicker
              name="occupiedDate"
              label="Reporting Date"
              value={values.occupiedDate}
              // minDate={new Date()}
              maxDate={new Date(new Date().setMonth(new Date().getMonth() + 10))}
              handleChangeAdvance={handleChangeAdvance}
              required
            />

          </Grid>
          <Grid item xs={12} align="right">
            <Button
              sx={{ borderRadius: 2 }}
              variant="contained"
              onClick={() => updateOccupiedDate()}
              disabled={!values.occupiedDate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Update"
              )}
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
      {vacateBedOpen && (
        <ModalWrapper
          title={`Vacate Bed - ${rowDetails?.bedName}`}
          open={vacateBedOpen}
          setOpen={onClosePopUp}
        >
          <VacateBed rowDetails={rowDetails} getData={getData} />
        </ModalWrapper>
      )}
      {changeBedOpen && (
        <ModalWrapper
          title={`Change Bed - ${rowDetails?.bedName}`}
          open={changeBedOpen}
          setOpen={onClosePopUp}
        >
          <ChangeBed rowDetails={rowDetails} getData={getData} />
        </ModalWrapper>
      )}
      {cancelBedOpen && (
        <ModalWrapper
          title={`Cancel Bed - ${rowDetails?.bedName}`}
          // maxWidth={1000}
          open={cancelBedOpen}
          setOpen={onClosePopUp}
        >
          <CancelBed rowDetails={rowDetails} getData={getData} />
        </ModalWrapper>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
export default HostelBedViewIndex;
