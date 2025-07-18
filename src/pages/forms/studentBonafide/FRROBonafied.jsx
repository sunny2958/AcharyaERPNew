import { useEffect, useState } from "react";
import FormWrapper from "../../../components/FormWrapper";
import { Grid, Box, Button, CircularProgress } from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import FRROExpansionTemplate from "./FRROExpansionTemplate";
import { GenerateFrroPdf } from "./GenerateFRROPdf";
import moment from "moment";
import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const INITIAL_VALUES = {
  fsisNo: "",
  studentName: "",
  dob: "",
  sex: "",
  fatherOrHusbandName: "",
  passportNo: "",
  passportValidFrom: "",
  passportValidTo: "",
  visaNo: "",
  visaValidFrom: "",
  visaValidTo: "",
  address: "",
  registrationNo: "",
  studentVisaIssued: "",
  nameAndReferenceNoOfInst: "",
  nameAndReferenceNoOfCourse: "",
  nameOfCourse: "",
  coursePeriodFrom: "",
  coursePeriodTo: "",
  attendingClass: "",
  extensionDate: "",
  yearAndSem: "",
  purpose: "",
  remarks: "",
};

const ModalSection = styled.div`
  visibility: 1;
  opacity: 1;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  transition: opacity 1s;
  z-index: 999;
`;

const ModalContainer = styled.div`
  max-width: 60%;
  min-height: 85%;
  max-height: 85%;
  margin: 100px auto;
  border-radius: 5px;
  width: 100%;
  position: relative;
  transition: all 2s ease-in-out;
  padding: 30px;
  background-color: #ffffff;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media screen and (max-width: 1024px) {
    min-width: 85%;
  }
`;

const FRROBonafied = () => {
  const [data, setData] = useState({});
  const [values, setValues] = useState(INITIAL_VALUES);
  const [loading, setLoading] = useState(false);
  const [selectedBonafied, setSelectedBonafied] = useState("");
  const [auid, setAuid] = useState("");
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [bonafiedTypes, setBonafiedTypes] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [noRecordFound, setNoRecordFound] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPath, setPreviewPath] = useState("");
  const [withLetterhead, setWithLetterhead] = useState("No");

  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getCategories();
    getStudentList();
    setCrumbs([{ name: "FRRO Master" }, { name: "Bonafide" }]);
  }, []);

  useEffect(() => {
    if (selectedBonafied !== "")
      setValues((prev) => ({
        ...prev,
        purpose: bonafiedTypes
          .filter((obj) => obj.value === selectedBonafied)[0]
          .label.split("-")[1],
      }));
  }, [selectedBonafied]);

  useEffect(() => {
    const getPdf = async () => {
      setPreviewPath(
        await GenerateFrroPdf(values, withLetterhead === "Yes" ? true : false,selectedBonafied)
      );
    };
    if (showPreview) getPdf();
  }, [showPreview, withLetterhead]);

  const getCategories = () => {
    axios
      .get("/api/getCategoriesForFrro")
      .then((res) => {
        const types = res.data.data.map((obj) => {
          return { value: obj.categoryDetailsId, label: obj.categoryName };
        });
        setBonafiedTypes(types);
        setSelectedBonafied(types.length > 0 ? types[0].value : "");
      })
      .catch((err) => console.log(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name === "bonafideTypeId") setSelectedBonafied(newValue);
    else if (name === "auid") setAuid(newValue);
  };

  const handleAttendingClass = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleLetterhead = (name, newValue) => setWithLetterhead(newValue);

  const handleChangeTextarea = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeDate = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getStudentList = async () => {
    axios
      .get("/api/frro/getStudentDetailsListForFrro")
      .then((res) => {
        const list = res.data.data.map((obj) => {
          return { value: obj.auid, label: `${obj.studentName}-${obj.auid}` };
        });
        setStudentList(list);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = async () => {
    try {
      if (!auid) return alert("Please select AUID from dropdown");
      setLoading(true);
      const res = await axios.get(
        `/api/frro/getStudentDetailsForFrro?auid=${auid}`
      );
      if (res.data.data && Object.keys(res.data.data).length > 0) {
        setNoRecordFound(false);
        setData(res.data.data);
        const obj = res.data.data;
        setValues({
          fsisNo: obj.fsis,
          studentName: obj.studentName,
          dob: moment(obj.dateOfBirth).format("DD-MM-YYYY"),
          sex: obj.sex,
          fatherOrHusbandName: obj.fatherName,
          passportNo: obj.passportNo,
          passportValidFrom: obj.passportIssueDate,
          passportValidTo: obj.passportExpiryDate,
          visaNo: obj.visaNo,
          visaValidFrom: obj.visaIssueDate,
          visaValidTo: obj.visaExpiryDate,
          address: obj.local_adress1,
          registrationNo: obj.auid,
          studentVisaIssued: obj.visaIssued ? obj.visaIssued : "",
          nameAndReferenceNoOfInst: obj.recognition ? obj.recognition : "",
          nameAndReferenceNoOfCourse: obj.affiliataion ? obj.affiliataion : "",
          nameOfCourse: obj.programShortName,
          coursePeriodFrom: "",
          coursePeriodTo: "",
          attendingClass: "",
          extensionDate: "",
          yearAndSem: `${obj.currentYear}/${obj.currentSem}`,
          purpose: bonafiedTypes
            .filter((obj) => obj.value === selectedBonafied)[0]
            .label.split("-")[1],
          remarks: "",
        });
      } else setNoRecordFound(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setNoRecordFound(true);
    }
  };

  const updateData = () => {
    let payload = { ...data };
    payload["visaIssued"] = values.studentVisaIssued;
    payload["recognition"] = values.nameAndReferenceNoOfInst;
    payload["affiliataion"] = values.nameAndReferenceNoOfCourse;
    axios
      .put(`/api/frro/updateFrro?studentId=${data.studentId}`, payload)
      .then((res) => {
        setAuid("");
        setNoRecordFound(true);
        setShowPreview(false);
        setPreviewPath("");
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to Update data");
      });
  };

  const downloadPdf = () => {
    setDownloadingPdf(true);
    const link = document.createElement("a");
    link.href = previewPath;
    link.setAttribute("download", "bonafied.pdf");
    document.body.appendChild(link);
    link.click();
    updateData();
    setDownloadingPdf(false);
  };

  return (
    <Box component="form" overflow="hidden" p={1} mt={2}>
      {showPreview && (
        <ModalSection>
          <ModalContainer>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Grid container sx={{ gap: "30px" }}>
                <Grid item xs={12} md={3}>
                  <CustomAutocomplete
                    name="withLetterhead"
                    label="With Letterhead?"
                    value={withLetterhead}
                    options={[
                      { label: "Yes", value: "Yes" },
                      { label: "No", value: "No" },
                    ]}
                    handleChangeAdvance={handleLetterhead}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={downloadingPdf}
                    onClick={downloadPdf}
                  >
                    Download
                  </Button>
                </Grid>
              </Grid>
              <CloseIcon
                style={{
                  fontSize: "30px",
                  cursor: "pointer",
                  position: "absolute",
                  right: "30px",
                }}
                onClick={() => setShowPreview(!showPreview)}
              />
            </Box>
            <object
              style={{ marginTop: "20px" }}
              data={previewPath}
              type="application/pdf"
              height="600"
            >
              <p>
                Your web browser doesn't have a PDF plugin. Instead you can
                download the file directly.
              </p>
            </object>
          </ModalContainer>
        </ModalSection>
      )}

      <FormWrapper>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 2, md: 4 }}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="bonafideTypeId"
              label="Bonafide Type"
              value={selectedBonafied}
              options={bonafiedTypes}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="auid"
              label="AUID"
              value={auid}
              options={studentList}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>Submit</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>

      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={2}></Grid>
        <Grid item xs={12} sm={12} md={12} lg={8}>
          {noRecordFound ? (
            <h2 style={{ textAlign: "center" }}>No Data Found</h2>
          ) : (
            <>
              <Button
                style={{ borderRadius: 7, float: "right" }}
                variant="contained"
                color="primary"
                disabled={downloadingPdf}
                onClick={() => setShowPreview(true)}
              >
                Preview
              </Button>
              <FRROExpansionTemplate
                data={values}
                handleChange={handleChangeTextarea}
                handleChangeDate={handleChangeDate}
                handleAttendingClass={handleAttendingClass}
                selectedBonafied={selectedBonafied}
              />
            </>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={2}></Grid>
      </Grid>
    </Box>
  );
};

export default FRROBonafied;
