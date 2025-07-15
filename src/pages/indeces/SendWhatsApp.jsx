import { useState, useEffect, lazy } from "react";
import {
  Box, Grid, Button, Typography
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs.js";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { makeStyles } from "@mui/styles";
import FormGroup from "@mui/material/FormGroup";
import useAlert from "../../hooks/useAlert.js";
import axios from "../../services/Api.js";
import moment from "moment";
import DOMPurify from "dompurify";
import FormWrapper from "../../components/FormWrapper";
const logos = require.context("../../assets", true);
const ModalWrapper = lazy(() => import("../../components/ModalWrapper"));
const CustomAutocomplete = lazy(() =>
  import("../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomDatePicker = lazy(() =>
  import("../../components/Inputs/CustomDatePicker.jsx")
);
const GridIndex = lazy(() => import("../../components/GridIndex.jsx"));
const CustomFileInput = lazy(() =>
  import("../../components/Inputs/CustomFileInput.jsx")
);

const style = makeStyles((theme) => ({
  main: {
    position: "relative",
    padding: "10px",
    minHeight: "180px",
    backgroundColor: "#eceff1",
    borderRadius: "5px",
    cursor: "pointer"
  },
  imgStyle: {
    width: "30px",
    position: "absolute",
    right: "-10px",
    top: "-12px",
    border: "1px solid #fff",
    borderRadius: "50%"
  }
}));

const yearLists = [
  { label: "1/0", value: "1/0" },
  { label: "2/0", value: "2/0" },
  { label: "3/0", value: "3/0" },
  { label: "4/0", value: "4/0" },
  { label: "5/0", value: "5/0" },
  { label: "6/0", value: "6/0" },
  { label: "7/0", value: "7/0" },
  { label: "8/0", value: "8/0" },
  { label: "9/0", value: "9/0" },
  { label: "10/0", value: "10/0" }
];

const semLists = [
  { label: "1/1", value: "1/1" },
  { label: "1/2", value: "1/2" },
  { label: "2/3", value: "2/3" },
  { label: "2/4", value: "2/4" },
  { label: "3/5", value: "3/5" },
  { label: "3/6", value: "3/6" },
  { label: "4/7", value: "4/7" },
  { label: "4/8", value: "4/8" },
  { label: "5/9", value: "5/9" },
  { label: "5/10", value: "5/10" },
  { label: "6/11", value: "6/11" },
  { label: "6/12", value: "6/12" }
];

const recipientTypeLists = [
  { label: "Students", value: "STUDENT" },
  { label: "Staff", value: "STAFF" },
];

const initialState = {
  acYear: null,
  acYearList: [],
  schoolId: null,
  programId: null,
  programmList: null,
  programSpecializationId: null,
  loading: false,
  schoolList: [],
  programmeSpecializationList: [],
  whatsappTemplateList: [],
  feeAdmissionCategoryList: [],
  yearSem: "",
  yearSemLists: [],
  whatsappTemplate: null,
  recipientType: null,
  feeAdmissionCategory: null,
  programSpecilizationDetail: null,
  studentList: [],
  checked: false,
  dateAndTemplateDetail: [],
  isPreviewModalOpen: false,
  content: "",
  commencementId: null,
  commencementList: [],
  attachment: null,
  fileUrl: null,
  cardIndex: null,
  date: null
};

const SendWhatsApp = () => {
  const [{ acYear, acYearList, schoolId, loading, schoolList, programId, programmList, programSpecializationId, programmeSpecializationList, yearSem, yearSemLists,
    whatsappTemplate, whatsappTemplateList, feeAdmissionCategory, feeAdmissionCategoryList, studentList, checked, dateAndTemplateDetail, isPreviewModalOpen, commencementId, commencementList, content,
    attachment, fileUrl, cardIndex, recipientType, date
  }, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const boxStyle = style();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  useEffect(() => {
    setCrumbs([]);
    getAcyear();
    getSchoolData();
    getWhatsappData();
    getFeeCategory();
    getcommencementData();
  }, []);

  const columns = [
    { field: "auid", headerName: "Auid", flex: 1 },
    { field: "studentName", headerName: "Name", flex: 1 },
    { field: "phone", headerName: "Phone No.", flex: 1, renderCell: (params) => params.row.phone.replace(/\d(?=\d{2})/g, '*') },
    {
      field: "isSelected",
      headerName: "Checkbox Selection",
      flex: 1,
      align: "center",
      renderHeader: () => (
        <FormGroup>
          {" "}
          <FormControlLabel control={headerCheckbox} />
        </FormGroup>
      ),
      renderCell: (params) => (
        <Checkbox
          sx={{ padding: 0 }}
          checked={params.value}
          onChange={handleCellCheckboxChange(params.row.id)}
        />
      ),
    },
  ];

  const handleCellCheckboxChange = (id) => (event) => {
    let updatedLists = studentList.map((el) =>
      el.id === id ? { ...el, isSelected: event.target.checked } : el
    );
    setState((prevState) => ({
      ...prevState,
      checked: updatedLists.every((ele) => ele.isSelected),
      studentList: updatedLists,
    }));
  };

  const handleHeaderCheckboxChange = (event) => {
    event.stopPropagation();
    const updatedList = studentList.map((el) => ({ ...el, isSelected: event.target.checked }));
    setState((prevState) => ({
      ...prevState,
      studentList: updatedList,
      checked: event.target.checked,
    }));
  };

  const headerCheckbox = (
    <Checkbox
      checked={checked ? true : false}
      onClick={(e) => handleHeaderCheckboxChange(e)}
      indeterminate={studentList?.some((row) => row.isSelected)}
    />
  );

  const handleChangeAdvance = (name, newValue) => {
    if (name == "schoolId") {
      getProgramData(newValue)
    };
    if (name == "programId") {
      getYearSemData(newValue);
      getProgramSpecializationData(newValue)
    };
    if (name == "whatsappTemplate") {
      setState((prevState) => ({
        ...prevState,
        studentList: []
      }))
    };
    setState((prevState) => ({
      ...prevState,
      [name]: newValue
    }))
  };

  const getAcyear = async () => {
    try {
      const res = await axios.get(`/api/academic/academic_year`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          acYearList: res.data.data.map((ele) => ({ value: ele.ac_year_id, label: ele.ac_year }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getSchoolData = async () => {
    try {
      const res = await axios.get(`/api/institute/school`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          schoolList: res.data.data.map((ele) => ({ value: ele.school_id, label: ele.school_name }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getProgramData = async (schoolId = null) => {
    try {
      const res = await axios.get(
        `/api/otherFeeDetails/getProgramsDetails?schoolId=${schoolId}`
      );
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          programmList: res?.data?.data.map((el) => ({
            label: el.programName,
            value: el.programId,
            numberOfSem: el.numberOfSem,
            numberOfYear: el.numberOfYear,
            programTypeName: el.programTypeName
          })),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProgramSpecializationData = async (programValueId = null) => {
    try {
      const response = await axios.get(
        `/api/academic/FetchProgramSpecialization/${schoolId}/${programValueId}`
      );
      if (response.status == 200 || response.status == 201) {
        setState((prevState) => ({
          ...prevState,
          programmeSpecializationList: response.data.data.map((el) => ({
            label: el.program_specialization_short_name,
            value: el.program_specialization_id,
          })),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getYearSemData = (programValueId = null) => {
    const programDetails = programmList.find((ele) => ele.value == programValueId);

    const list = (programDetails.programTypeName == "YEARLY") ? (yearLists.slice(0, programDetails.numberOfYear)) :
      semLists.slice(0, programDetails.numberOfSem);

    setState((prevState) => ({
      ...prevState,
      yearSemLists: list
    }))
  };

  const getcommencementData = async () => {
    try {
      const res = await axios.get(`/api/academic/fetchAllCommencementTypeDetail?page=0&page_size=10000000&sort=id`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          commencementList: res.data.data.Paginated_data.content.map((ele) => ({ value: ele.id, label: ele.commencement_type }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getWhatsappData = async () => {
    try {
      const res = await axios.get(`api/whatsapp/getAllTemplates`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          whatsappTemplateList: res.data.data.map((ele) => ({ value: ele.whatsappTemplateId, label: ele.templateName, content: ele.content, recipientType: ele.recipientType, templateName: ele.templateName }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getFeeCategory = async () => {
    try {
      const res = await axios.get(`api/student/FeeAdmissionCategory`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          feeAdmissionCategoryList: res.data.data.map((ele) => ({ value: ele.fee_admission_category_id, label: ele.fee_admission_category_type }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const getStudentData = async () => {
    try {
      setLoading(true);
      const [year, sem] = yearSem?.split("/").map(Number)
      const payload = {
        "schoolId": schoolId,
        "programSpecializationId": programSpecializationId,
        "programId": programId,
        "year": year,
        "sem": sem,
        "commencementId": commencementId,
        "whatsappTemplateId": whatsappTemplate.value,
        "acYear": acYear,
        "feeAdmissionCategoryId": feeAdmissionCategory
      }
      const res = await axios.post(`/api/whatsapp/getStudentList`, payload);
      if (res.status == 200 || res.status == 201) {
        const list = res.data.data.students;
        const dateAndTemplateDetails = { "lastDateToPay": res.data.data.lastDateToPay, "templateName": res.data.data.templateName, "fileName": null, };
        setState((prevState) => ({
          ...prevState,
          studentList: list.map((ele, index) => ({ ...ele, id: index + 1, isSelected: false })),
          dateAndTemplateDetail: dateAndTemplateDetails
        }));
        setLoading(false)
      }

    } catch (error) {
      setLoading(false)
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const InvokeWhatsappMSg = async () => {
    try {
      const studentIds = studentList.filter((obj) => obj.isSelected).map((li) => li.studentId)
      const params = new URLSearchParams();
      const paramsObj = {
        studentIdList: studentIds.join(" , "),
        templateName: dateAndTemplateDetail.find((obj) => obj.templateName)?.templateName,
        lastDateToPay: dateAndTemplateDetail.find((obj) => obj.lastDateToPay)?.lastDateToPay
      }
      Object.entries(paramsObj).forEach(([key, value]) => {
        if (value != null) {
          params.append(key, value);
        }
      });
      const res = await axios.post(`/api/whatsapp/sendMessageToStudents?${params.toString()}`);
      if (res.status == 200 || res.status == 201) {
        setState(initialState);
        setAlertMessage({
          severity: "success",
          message: res.data.data,
        });
        setAlertOpen(true);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handlePreviewTemplate = async () => {
    const htmlContent = whatsappTemplateList.find((li) => li.value == whatsappTemplate.value)?.content;
    const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent);
    setState((prevState) => ({
      ...prevState,
      isPreviewModalOpen: !isPreviewModalOpen,
      content: sanitizedHtmlContent
    }))
  };

  const handleFileDrop = (name, newFile) => {
    setState((prev) => ({
      ...prev,
      [name]: newFile,
    }));
  };

  const handleFileRemove = (name) => {
    setState((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleCard = (cardObj, index) => {
    setState((prevState) => ({
      ...prevState,
      whatsappTemplate: cardObj,
      cardIndex: index,
      recipientType: cardObj.recipientType !== "ALL" ? cardObj.recipientType : null
    }));
  };

  return (
    <Box
      sx={{
        position: "relative",
        marginLeft: "20px"
      }}
    >

      <Box mt={2} mb={2}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 3 }}>
          {whatsappTemplateList.map((li, index) => (<Grid item xs={12} md={3} key={index}>
            <Box className={boxStyle.main} sx={{ boxShadow: 2 }} onClick={() => handleCard(li, index)}>
              <Typography variant="subtitle2" sx={{ textAlign: "center" }}>{(li.label)?.toUpperCase()?.replaceAll("_", " ")}</Typography>
              {cardIndex == index && <img src={`${logos(`./animated-check-icon-unscreen.gif`)}`} alt="succesTick" className={boxStyle.imgStyle} />}
              {li.content && <Box p={2} sx={{ marginTop: "5px", borderRadius: "10px", backgroundColor: "#fff" }}>
                <Typography variant="subtitle2" sx={{ textAlign: "justify" }}>{(li.content) ? (li.content.length > 200) ? (li.content.substring(0, 215) + " " + "....") : (li.content) : ""}</Typography>
              </Box>}
            </Box>
          </Grid>
          ))}
        </Grid>
      </Box>

      {whatsappTemplateList?.length > 0 && whatsappTemplate && <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="recipientType"
              value={recipientType || null}
              label="Recipient Type"
              handleChangeAdvance={handleChangeAdvance}
              options={recipientTypeLists || []}
              disabled={whatsappTemplate?.recipientType !== "ALL"}
              required
            />
          </Grid>
          {recipientType == "STUDENT" &&
            <Grid item xs={12} md={2}>
              <CustomAutocomplete
                name="acYear"
                value={acYear}
                label="Ac Year"
                handleChangeAdvance={handleChangeAdvance}
                options={acYearList || []}
                required
              />
            </Grid>}
          {recipientType == "STUDENT" && <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              value={schoolId}
              label="School"
              handleChangeAdvance={handleChangeAdvance}
              options={schoolList || []}
              required
            />
          </Grid>}
          {recipientType == "STUDENT" && <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programId"
              value={programId}
              label="Program"
              disabled={!schoolId}
              handleChangeAdvance={handleChangeAdvance}
              options={programmList || []}
              required
            />
          </Grid>}
          {recipientType == "STUDENT" && <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="programSpecializationId"
              value={programSpecializationId}
              label="Program Specialization"
              disabled={!schoolId}
              handleChangeAdvance={handleChangeAdvance}
              options={programmeSpecializationList || []}
            />
          </Grid>}
          {recipientType == "STUDENT" && <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="yearSem"
              value={yearSem || ""}
              label="Year/Sem"
              handleChangeAdvance={handleChangeAdvance}
              options={yearSemLists}
              required
            />
          </Grid>}
          {recipientType == "STUDENT" && <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="commencementId"
              value={commencementId || ""}
              label="Type"
              handleChangeAdvance={handleChangeAdvance}
              options={commencementList}
              required
            />
          </Grid>}
          {recipientType == "STUDENT" && <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="feeAdmissionCategory"
              value={feeAdmissionCategory || ""}
              label="Category"
              handleChangeAdvance={handleChangeAdvance}
              options={feeAdmissionCategoryList}
            />
          </Grid>}

          {recipientType == "STAFF" && whatsappTemplate.templateName == "attendance_chk" && <Grid item xs={12} md={2}>
            <CustomDatePicker
              name="date"
              label="Date"
              minDate={date}
              value={date}
              handleChangeAdvance={handleChangeAdvance}
              helperText=""
              required
            />
          </Grid>}

          {recipientType == "STUDENT" && whatsappTemplate.templateName == "upload_doc_1" && <Grid item xs={12} md={3}>
            <CustomFileInput
              name="attachment"
              label="Pdf File Attachment"
              helperText="PDF - smaller than 2 MB"
              file={attachment}
              handleFileDrop={handleFileDrop}
              handleFileRemove={handleFileRemove}
              required
            />
          </Grid>}
          <Grid item xs={12} md={1} align="right">
            <Button
              variant="contained"
              disableElevation
              onClick={getStudentData}
              disabled={!recipientType}
            >
              Submit
            </Button>
          </Grid>
          <Grid item xs={12} md={1} align="right">
            <Button
              variant="contained"
              disableElevation
              disabled={!studentList.some((obj) => obj.isSelected)}
              onClick={handlePreviewTemplate}
            >
              Preview
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>}

      {studentList?.length > 0 && <Box sx={{ position: "absolute", width: "100%" }}>
        <GridIndex rows={studentList}
          columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel}
          loading={loading} />
      </Box>}

      <ModalWrapper
        title="WhatsApp Template"
        maxWidth={whatsappTemplate == 1 ? 500 : 700}
        open={isPreviewModalOpen}
        setOpen={handlePreviewTemplate}
      >
        {content ? <Box borderRadius={3}>
          <Grid container>
            <Grid item xs={12} sx={{ textAlign: "justify" }}>
              <div dangerouslySetInnerHTML={{ __html: content.replace('{{lastdate}}', dateAndTemplateDetail?.lastDateToPay ? moment(dateAndTemplateDetail?.lastDateToPay).format("DD-MM-YYYY") : "--") }}></div>
            </Grid>
            <Grid mt={1} item xs={12} align="right">
              <Button
                variant="contained"
                startIcon={<WhatsAppIcon />}
                disableElevation
                onClick={InvokeWhatsappMSg}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        </Box> :
          <Box>
            <Grid container>
              <Grid item xs={12} md={12}>
                {fileUrl ? (
                  <iframe
                    width="100%"
                    style={{ height: "100vh" }}
                    src={fileUrl}
                  ></iframe>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </Box>
        }
      </ModalWrapper>
    </Box>
  );
};

export default SendWhatsApp;
