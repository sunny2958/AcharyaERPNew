import { useState, useEffect, lazy } from "react";
import {
  Grid,
  IconButton,
  Tooltip,
  styled,
  tooltipClasses,
  CircularProgress
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";
import axios from "../../../services/Api";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ModalWrapper from "../../../components/ModalWrapper";
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);
const GridIndex = lazy(() => import("../../../components/GridIndex"));

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

const initialState = {
  studentBonafideList: [],
  loading: false,
  hostelFeeTemplateList: [],
  hostelFeeTemplateModal: false,
  hostelFeeTemplateLoading: false,
  hostelFeeTemplateId: null,
  studentBonafideDetail: null
};

const VacationLeaveIndex = () => {
  const [{ studentBonafideList, loading, hostelFeeTemplateList,
    hostelFeeTemplateModal, hostelFeeTemplateLoading, hostelFeeTemplateId, studentBonafideDetail },
    setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  useEffect(() => {
    setCrumbs([{ name: "Bonafide Index" }]);
    getStudentBonafideData();
  }, []);

  const columns = [
    { field: "bonafide_number", headerName: "Refrence Number", flex: 1 },
    { field: "auid", headerName: "Auid", flex: 1 },
    { field: "student_name", headerName: "Student Name", flex: 1 },
    { field: "bonafide_type", headerName: "Bonafide Type", flex: 1 },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
    },
    {
      field: "created_Date",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.created_Date
          ? moment(row.created_Date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "hostelFeeTemplate",
      headerName: "Hostel Fee Template",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <HtmlTooltip title="Update Hostel Fee Template">
          
          <IconButton
            onClick={() => handleHostelFeeTemplate(params.row)
            }
            disabled={!params.row.active || params.row.hostel_fee_template_id  ||
               (params.row?.bonafide_type !=="Provisional Bonafide" && params.row?.bonafide_type !=="Bonafide Letter")}
          >
           {!params.row.hostel_fee_template_id ? <AddBoxIcon fontSize="small" sx={{ cursor: "pointer" }} color={(params.row?.bonafide_type =="Provisional Bonafide" || params.row?.bonafide_type =="Bonafide Letter") ? "primary":"secondary"} />:
            <CheckCircleIcon fontSize="small"color="success"/>
           }
          </IconButton>
        </HtmlTooltip>,
      ],
    },
    {
      field: "id",
      headerName: "View Bonafide",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <HtmlTooltip title="View Bonafide">
          <IconButton
            onClick={() => onClickViewBonafide(params.row)
            }
            disabled={!params.row.active}
          >
            <VisibilityIcon fontSize="small" sx={{ cursor: "pointer" }} color={!params.row.active ? "secondary" : "primary"} />
          </IconButton>
        </HtmlTooltip>,
      ],
    },
  ];

  const handleHostelFeeTemplate = async (rowData) => {
    if(rowData){
      getHostelFeeTemplate(rowData)
    }else {
      setState((prevState) => ({
        ...prevState,
        hostelFeeTemplateModal: !hostelFeeTemplateModal,
        studentBonafideDetail: rowData,
        hostelFeeTemplateList: []
      }))
    }
  };

  const getHostelFeeTemplate = async (rowValue) => {
    try {
      const res = await axios.get(`api/finance/hostelFeeTemplateByAcademicYearAndSchool/${rowValue?.acYearId}/${rowValue.schoolId}`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          hostelFeeTemplateModal: !hostelFeeTemplateModal,
          studentBonafideDetail: rowValue,
          hostelFeeTemplateList: res.data.data.map((ele) => ({
            value: ele.hostel_fee_template_id,
            label: `${ele.template_name} - ${ele?.hostel_room_type_id} - ${ele?.total_amount}`
          }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const onClickViewBonafide = async (rowValue) => {
    try {
      const res = await axios.get("api/categoryTypeDetailsOnBonafide");
      if (res.status == 200 || res.status == 201) {
        const lists = res?.data?.data.map((obj) => ({
          label: obj.category_detail,
          name: obj.category_name_sort
        }));
        const name = lists.find((ele) => ele.label == rowValue?.bonafide_type)?.name;
        if (rowValue.hostel_fee_template_id) {
          getHostelFeeTemplateData(rowValue, name);
        } else {
          finalAction(rowValue, name)
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const getHostelFeeTemplateData = async (rowValue, name) => {
    try {
      if (rowValue?.hostel_fee_template_id) {
        const res = await axios.get(`/api/finance/hostelFeeTemplateByAcademicYearSchoolTemplateId/${rowValue?.acYearId}/${rowValue?.schoolId}/${rowValue.hostel_fee_template_id}`);
        if (res.status == 200 || res.status == 201) {
          finalAction(rowValue, name, res.data.data);
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  const finalAction = (rowValue, name, hostelData = []) => {
    navigate(`/BonafideView`, {
      state: {
        studentAuid: rowValue?.auid,
        bonafideType: rowValue?.bonafide_type,
        bonafideName: name,
        page: "Index",
        hostelFeeTemplateList: hostelData,
        semRange: null,
      },
    })
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const getStudentBonafideData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/student/fetchAllStudentBonafide?page=0&page_size=1000000&sort=created_Date`
      );
      setState((prevState) => ({
        ...prevState,
        studentBonafideList: res?.data?.data?.Paginated_data?.content,
        loading: false
      }));
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
      setLoading(false)
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const setHostelFeeTemplateLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      hostelFeeTemplateLoading: val
    }))
  };

  const handleHostelFeeTemplateSubmit = async () => {
    try {
      setHostelFeeTemplateLoading(true);
      const res = await axios.patch(`api/student/updateHostelFeeTemplateId/${studentBonafideDetail?.id}?hostelFeeTemplateId=${hostelFeeTemplateId}`);
      if (res.status == 200 || res.status == 201) {
        setHostelFeeTemplateLoading(false);
        setAlertMessage({
          severity: "success",
          message: "Student hostel fee template updated successfully!!",
        });
        setAlertOpen(true);
        handleHostelFeeTemplate();
        getStudentBonafideData();
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setHostelFeeTemplateLoading(false);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Button
        onClick={() => navigate("/BonafideForm")}
        variant="contained"
        disableElevation
        startIcon={<AddIcon />}
        sx={{ position: "absolute", right: 0, marginTop: { xs: 1, md: -6 }, borderRadius: 2 }}
      >
        Create
      </Button>
      <Box sx={{ position: "absolute", width: "100%", marginTop: { xs: 10, md: -1 }, }}>
        <GridIndex rows={studentBonafideList} columns={columns}
          loading={loading}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel} />
      </Box>

      <ModalWrapper
        open={hostelFeeTemplateModal}
        setOpen={handleHostelFeeTemplate}
        maxWidth={400}
        title={"Update Hostel Fee Template"}
      >
        <Box p={1}>
          <Grid container mt={2}>
            <Grid item xs={12}>
              <CustomAutocomplete
                name="hostelFeeTemplateId"
                label="Hostel Fee Template"
                value={hostelFeeTemplateId}
                options={hostelFeeTemplateList || []}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid mt={2} item xs={12} textAlign="right">
              <Button
                variant="contained"
                color="primary"
                onClick={handleHostelFeeTemplateSubmit}
                disabled={hostelFeeTemplateLoading || !hostelFeeTemplateId}
              >
                {hostelFeeTemplateLoading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>
    </Box>
  );
};

export default VacationLeaveIndex;
