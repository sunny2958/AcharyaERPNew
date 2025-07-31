import { useEffect, useState, lazy } from "react";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Grid, Backdrop, Box, CircularProgress, IconButton, Button } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import AddBoxIcon from "@mui/icons-material/AddBox";
import moment from "moment";
import { Visibility } from "@mui/icons-material";
const ModalWrapper = lazy(() => import("../../../components/ModalWrapper.jsx"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField.jsx")
);

const breadCrumbsList = [
  { name: "Approve Cancel Admissions", link: "/approve-canceladmission" },
  { name: "History" },
];

function CancelAdmissionHistoryIndex() {
  const [rows, setRows] = useState([]);
  const [isRetrieveModalOpen, setIsRetrieveModalOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [rowDetails, setRowDetails] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    retrieveByUserName: false,
    retrieve_date: false,
    retrieve_remarks:false,
    rejected_by:false,
    rejected_date:false,
    rejected_remarks:false
  });
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    setCrumbs(breadCrumbsList);
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "/api/fetchAllCancelAdmissionsReport?page=0&page_size=100&sort=created_date"
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

  const columns = [
    { field: "auid", headerName: "AUID", flex: 1, hideable: false },
    {
      field: "student_name",
      headerName: "Student Name",
      flex: 1,
      hideable: false,
    },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      hideable: false,
    },
    { field: "remarks", headerName: "Remarks", flex: 1, hideable: false },
    { field: "created_username", headerName: "Initiated By", flex: 1 },
    {
      field: "created_date",
      headerName: "Initiated Date",
      flex: 1,
      hideable: false,
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
          title="View Document"
          sx={{ padding: 0 }}
        >
          <Visibility color="primary" sx={{ fontSize: 24 }} />
        </IconButton>
      ),
    },
    {
      field: "approvedByName",
      headerName: "Approved By",
      flex: 1,
      hideable: false,
    },
    {
      field: "approved_date",
      headerName: "Approved Date",
      flex: 1,
      hideable: false,
      valueGetter: (value, row) =>
        value ? moment(value).format("DD-MM-YYYY LT") : "",
    },
    {
      field: "approved_remarks",
      headerName: "Approved Remarks",
      flex: 1,
      hide: true,
    },
    {
      field: "retrieve", headerName: "Retrieve", flex: 1, hide: true,
      renderCell: (params) => (
        <IconButton onClick={() => handleRetrieve(params.row)} disabled={params.row.retrieve_remarks}>
          <AddBoxIcon color={params.row.retrieve_remarks ? "secondary" : "primary"} sx={{ fontSize: 24 }} />
        </IconButton>
      ),
    },
    { field: "retrieveByUserName", headerName: "Retrieved By", flex: 1, hide: true },
    {
      field: "retrieve_date",
      headerName: "Retrieved Date",
      flex: 1,
      hide: true,
      valueGetter: (value, row) =>
        value ? moment(value).format("DD-MM-YYYY") : "",
    },
    {
      field: "retrieve_remarks",
      headerName: "Retrieved Remarks",
      flex: 1,
      hide: true,
    },
    { field: "rejected_by", headerName: "Rejected By", flex: 1, hide: true },
    {
      field: "rejected_date",
      headerName: "Rejected Date",
      flex: 1,
      hide: true,
      valueGetter: (value, row) =>
        value ? moment(value).format("DD-MM-YYYY LT") : "",
    },
    {
      field: "rejected_remarks",
      headerName: "Rejected Remarks",
      flex: 1,
      hide: true,
    },
  ];

  const handleRetrieve = (rowValue) => {
    setIsRetrieveModalOpen(!isRetrieveModalOpen);
    setRowDetails(rowValue);
    setRemarks("")
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setRemarks(value)
  };

  const onSubmit = async () => {
    try {
      let payload = {
        "cancel_id": rowDetails.id,
        "auid": rowDetails?.auid,
        "retrieve_remarks": remarks
      }
      const res = await axios.put(`/api/updateRetrieveStudentAdmission/${rowDetails.id}`, payload);
      if (res.status == 200 || res.status == 201) {
        getData();
        setIsRetrieveModalOpen(!isRetrieveModalOpen);
        setAlertMessage({
          severity: "success",
          message: "Retrieved successfully!!"
        });
        setAlertOpen(true);
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
        <GridIndex rows={rows} columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel} />
      </Box>
      <ModalWrapper
        title=""
        maxWidth={400}
        open={isRetrieveModalOpen}
        setOpen={() => handleRetrieve()}
      >
        <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid item xs={12}>
            <CustomTextField
              name="remarks"
              label="Retrieve Remarks"
              value={remarks || ""}
              handleChange={handleChange}
              required
              multiline
               rows={2}
            />
          </Grid>
          <Grid item mt={1} xs={12} textAlign="right">
            <Button
              onClick={onSubmit}
              variant="contained"
              disableElevation
              disabled={!remarks}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
    </>
  );
}

export default CancelAdmissionHistoryIndex;
