import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Backdrop, Box, CircularProgress, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import moment from "moment";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";

const breadCrumbsList = [
  { name: "Approve Cancel Admissions" },
  { name: "History", link: "/canceladmission-history" },
];

function ApproveCancelAdmissionIndex() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    setCrumbs(breadCrumbsList);
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "/api/fetchAllCancelAdmissionsDetail?page=0&page_size=1000000&sort=created_date"
      );
      setRows(response.data.data.Paginated_data.content);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (attachmentPath) => {
    try {
      setLoading(true);
      const documentResponse = await axios.get(
        `/api/cancelAdmissionsFileviews?fileName=${attachmentPath}`,
        { responseType: "blob" }
      );
      const url = URL.createObjectURL(documentResponse.data);
      window.open(url);
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
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (id, cancelId) => {
    navigate(`/canceladmission-view/${id}/${cancelId}`);
  };

  const columns = [
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "student_name", headerName: "Student Name", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    { field: "created_username", headerName: "Initiated By", flex: 1 },
    {
      field: "created_date",
      headerName: "Initiated Date",
      flex: 1,
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY LT"),
    },
    {
      field: "attachment_path",
      headerName: "Document",
      flex: 1,
      hideable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDownloadDocument(params.value)}
          title="Document"
          sx={{ padding: 0 }}
        >
          <Visibility color="primary" sx={{ fontSize: 24 }} />
        </IconButton>
      ),
    },
    {
      field: "application",
      headerName: "Application",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            handleViewApplication(params.row.student_id, params.row.id)
          }
          title="Application"
          sx={{ padding: 0 }}
        >
          <DescriptionIcon color="primary" sx={{ fontSize: 24 }} />
        </IconButton>
      ),
    },
    {
      field: "student_id",
      headerName: "Approve",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            navigate(
              `/approve-canceladmission/${params.value}/${params.row.id}`
            )
          }
          title="Cancel Admission"
          sx={{ padding: 0 }}
        >
          <AddBoxIcon color="primary" sx={{ fontSize: 24 }} />
        </IconButton>
      ),
    },
  ];
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        sx={{
          margin: "20px 0px",
        }}
      >
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default ApproveCancelAdmissionIndex;
