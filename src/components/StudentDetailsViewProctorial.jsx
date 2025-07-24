import React, { useEffect, useState } from "react";
import { Grid, Tabs, Tab, styled, Box, IconButton, Typography, Button } from "@mui/material";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import axios from "../services/Api";
import GridIndex from "../components/GridIndex"; // adjust path as needed
import CustomModal from "../components/CustomModal"; // adjust path as needed
import moment from "moment/moment";
import ModalWrapper from "./ModalWrapper";
import CustomTextField from "./Inputs/CustomTextField";
import ForumIcon from "@mui/icons-material/Forum";
import useAlert from "../hooks/useAlert";
import CustomDatePicker from "./Inputs/CustomDatePicker";

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

const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;

const initialValues = {
  meetingAgenda: "",
  description: "",
};

const StudentDetailsViewDocuments = ({ state, id }) => {
  const [subTab, setSubTab] = useState("Meeting History");
  const [historyData, setHistoryData] = useState([]);
  const [historyIVRData, setIVRHistoryData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);
  const [proctor, setProctor] = useState({});
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [data, setData] = useState({});

  const setCrumbs = useBreadcrumbs();


  const checks = {
    meetingAgenda: [values.meetingAgenda !== ""],
    description: [values.description !== ""],
  };

  const errorMessages = {
    meetingAgenda: ["This field is required"],
    description: ["This field is required"],
  };

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
      type: "actions",
      getActions: (params) => {
        return [
          params?.row?.feedback ? (
            <span>{params?.row?.feedback}</span>
          ) : (
            <IconButton label="" onClick={() => handleMeetingFeedback(params)}>
              <ForumIcon />
            </IconButton>
          ),
        ];
      },
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

  const allowedRoleIds = [21, 16, 5, 1, 9];

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
    // { field: "usn", headerName: "USN", flex: 1, hide: true },
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
            <IconButton label="" onClick={() => handleFeedback(params)}>
              <ForumIcon />
            </IconButton>
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
        const userRoleId = Number(roleId); // make sure 'roleId' is available in scope

        if (!recordingUrl) {
          return <span style={{ color: '#999' }}>No recording available</span>;
        }

        const isAllowed = allowedRoleIds.includes(userRoleId);

        return (
          <audio
            controls
            controlsList="nodownload noplaybackrate"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              width: '100%',
              opacity: isAllowed ? 1 : 0.5,
              pointerEvents: isAllowed ? 'auto' : 'none',
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

  const handleFeedback = async (params) => {
    setValues((prev) => ({
      ...prev,
      "minutesOfMeeting": "",
    }));
    setFeedbackOpen(true);
    setProctor(params?.row)
  };

  const handleMeetingFeedback = async (params) => {
    setValues((prev) => ({
      ...prev,
      "feedbackDate": null,
      "minutesOfMeeting": "",
    }));
    setData(params.row);
    setFeedOpen(true);
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateCall = async () => {
    if (!values?.minutesOfMeeting) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
      return;
    }

    const temp = {
      ivr_creation_id: proctor?.ivr_creation_id,
      summarize: values?.minutesOfMeeting,
    };

    try {
      await axios.put(`/api/updateIvrCreation/${proctor?.ivr_creation_id}`, temp);
      await getIVRHistory();
      setFeedbackOpen((prevState) => !prevState);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "An error occurred",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCreateMeeting = async () => {
    const temp = [{
      active: true,
      meeting_type: data.meeting_type,
      proctor_student_meeting_id: data.id,
      meeting_id: data.meeting_id,
      chief_proctor_id: data.chief_proctor_id,
      proctor_id: data.proctor_id,
      emp_id: data.emp_id,
      student_id: data.student_id,
      remarks: data.remarks,
      date_of_meeting: data.date_of_meeting,
      meeting_agenda: data.meeting_agenda,
      feedback: values.minutesOfMeeting,
      faq_id: data.faq_id,
      feedback_date: values.feedbackDate
        ? values.feedbackDate.substr(0, 19) + "Z"
        : "",
      mode_of_contact: data.mode_of_contact,
      parent_name: data.parent_name,
      school_id: data.school_id,
    }]

    await axios
      .put(
        `/api/proctor/updateProctorStudentMeeting/${data.id.toString()}`,
        temp
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Feedback updated" });
          setAlertOpen(true);
          getHistory();
          setFeedOpen(false);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
      });
  };
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
      <ModalWrapper
        title="Call Summarize"
        maxWidth={800}
        open={feedbackOpen}
        setOpen={setFeedbackOpen}
      >
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
          marginTop={2}
        >
          <Grid item xs={12} md={8}>
            <CustomTextField
              multiline
              rows={2}
              name="minutesOfMeeting"
              label="Minutes of meeting / Call output"
              value={values.minutesOfMeeting}
              handleChange={handleChange}
              checks={checks.minutesOfMeeting}
              errors={errorMessages.minutesOfMeeting}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              onClick={handleCreateCall}
              sx={{ borderRadius: 2 }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <ModalWrapper
        title="Give Feedback"
        maxWidth={800}
        open={feedOpen}
        setOpen={setFeedOpen}
      >
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={2}
          marginTop={2}
        >
          <Grid item xs={12} md={8}>
            <CustomTextField
              multiline
              rows={2}
              name="minutesOfMeeting"
              label="Minutes of meeting / Meeting output"
              value={values.minutesOfMeeting}
              handleChange={handleChange}
              checks={checks.minutesOfMeeting}
              errors={errorMessages.minutesOfMeeting}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="feedbackDate"
              label="Feedback Date"
              value={values.feedbackDate}
              handleChangeAdvance={handleChangeAdvance}
              disablePast
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              onClick={handleCreateMeeting}
              sx={{ borderRadius: 2 }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

    </>
  );
};

export default StudentDetailsViewDocuments;
