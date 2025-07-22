import React, { useEffect, useState } from "react";
import { Grid, Tabs, Tab, styled, Box, IconButton, Typography } from "@mui/material";
import { useBeforeUnload } from "react-router-dom";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import axios from "../services/Api";
import GridIndex from "../components/GridIndex"; // adjust path as needed
import CustomModal from "../components/CustomModal"; // adjust path as needed
import moment from "moment/moment";

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

const StudentDetailsViewDocuments = ({ state, id }) => {
  const [subTab, setSubTab] = useState("Meeting History");
  const [historyData, setHistoryData] = useState([]);
  const [historyIVRData, setIVRHistoryData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [loading, setLoading] = useState(true);

  const setCrumbs = useBreadcrumbs();

  // useEffect(() => {
  //   setCrumbs([
  //     {
  //       name: "Student Master",
  //       link: "/student-master",
  //     },
  //   ]);
  // }, []);

  const getHistory = async () => {
    if (!id) return;
    try {
      const res = await axios.get(
        `/api/proctor/getAllMeetingDataBasedOnStudent/${id}`
      );
      const filteredData = res?.data?.data?.filter(
        (obj) => obj.student_id == id
      );
      setHistoryData(filteredData || []);
    } catch (err) {
      console.error("Error fetching meeting history:", err);
    } finally {
      setLoading(false)
    }
  };
  const getIVRHistory = async () => {
    if (!id) return;
    try {
      const res = await axios.get(
        `/api/getIvrCreationData/${id}`
      );
      const sortedData = res.data.data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setIVRHistoryData(sortedData || []);
    } catch (err) {
      console.error("Error fetching meeting history:", err);
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    if (subTab === "IVR History") {
      getIVRHistory()
    }
  }, [subTab])

  useEffect(() => {
    getHistory();
  }, [id]);

  const columns = [
    { field: "employeeName", headerName: "Proctor", flex: 1 },
    { field: "student_name", headerName: "Student", flex: 1 },
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "meeting_agenda", headerName: "Meeting Agenda", flex: 1 },
    // { field: "meeting_type", headerName: "Meeting Type", flex: 1 },
    {
      field: "date_of_meeting",
      headerName: "Meeting Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.date_of_meeting
          ? moment(row.date_of_meeting).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "feedback",
      headerName: "MOM",
      flex: 1,
    },

    {
      field: "feedback_date",
      headerName: "Feedback Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.feedback_date ? moment(row.feedback_date).format("DD-MM-YYYY") : "",
    },
  ];

  const rows = historyData.map((row, index) => ({
    id: row.id || index,
    ...row,
  }));


  const callHistoryColumns = [
    {
      field: "studentName",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          // onClick={() =>
          //   navigate(`/student-profile/${params.row.student_id}`, { state: true })
          // }
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "primary.main",
            textTransform: "capitalize",
            cursor: "pointer",
          }}
        >
          {params?.row?.studentName?.toLowerCase()}
        </Typography>
      ),
    },
    { field: "auid", headerName: "AUID", flex: 1, minWidth: 120 },
    { field: "usn", headerName: "USN", flex: 1 },
    { field: "callFrom", headerName: "Call From", flex: 1 },
    { field: "relationship", headerName: "Call To", flex: 1 },
    { field: "status", headerName: "status", flex: 1 },
    {
      field: "created_date",
      headerName: "Call Time",
      flex: 1,
      valueFormatter: (value) =>
        moment(value).format("DD-MM-YYYY HH:mm:ss"),
      renderCell: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY HH:mm:ss"),
    },
    { field: "customer", headerName: "Customer", flex: 1 },
    {
      field: "give feedback",
      type: "actions",
      flex: 1,
      headerName: "Call Summarize",
      getActions: (params) => {
        return [
          params?.row?.summarize ? (
            <span>{params?.row?.summarize}</span>
          ) : (
            <></>
          ),
        ];
      },
    },
    {
      field: "recording",
      headerName: "Recording",
      flex: 1,
      minWidth: 300,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const recordingUrl = params.row.recording;
        if (!recordingUrl) {
          return <span style={{ color: '#999' }}>No recording available</span>;
        }
        return (
          <audio
            controls
            controlsList="nodownload noplaybackrate"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              width: '100%',
            }}
            preload="none"
          >
            <source src={recordingUrl} type="audio/mpeg" />
            <source src={recordingUrl} type="audio/ogg" />
            <source src={recordingUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        );
      },
    }

  ];

  return (
    <>
      <Grid container spacing={2} columnSpacing={4} sx={{ marginTop: "1px" }}>
        <Grid item xs={4} md={2}>
          <CustomTabs
            value={subTab}
            onChange={(e, val) => setSubTab(val)}
            orientation="vertical"
            variant="scrollable"
            className="customTabs"
          >
            <CustomTab value="Meeting History" label="Meeting History" />
            <CustomTab value="IVR History" label="IVR History" />
          </CustomTabs>
        </Grid>

        <Grid item xs={12} md={10}>
          {subTab === "Meeting History" && (
            <Box sx={{ position: "relative", mt: 2 }}>
              <CustomModal
                open={modalOpen}
                setOpen={setModalOpen}
                title={modalContent.title}
                message={modalContent.message}
                buttons={modalContent.buttons}
              />
              <GridIndex rows={rows} columns={columns} loading={loading} />
            </Box>
          )}
          {subTab === "IVR History" && (
            <Box sx={{ position: "relative", mt: 2 }}>
              <CustomModal
                open={modalOpen}
                setOpen={setModalOpen}
                title={modalContent.title}
                message={modalContent.message}
                buttons={modalContent.buttons}
              />
              <GridIndex rows={historyIVRData} columns={callHistoryColumns} getRowId={row => row?.ivr_creation_id} />
            </Box>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default StudentDetailsViewDocuments;
