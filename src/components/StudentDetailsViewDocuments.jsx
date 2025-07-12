import React from "react";
import { useState, useEffect } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Alert,
  Grid,
  Tabs,
  Tab,
  Button,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Box,
  Modal,
  IconButton,
  Stack,
  styled,
  Chip,
} from "@mui/material";
import CustomFileInput from "./Inputs/CustomFileInput";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import Resizer from "react-image-file-resizer";
import axios from "../services/Api";
import useAlert from "../hooks/useAlert";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ModalWrapper from "./ModalWrapper";
import DOCView from "./DOCView";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

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

const useModalStyles = makeStyles((theme) => ({
  box: {
    position: "fixed",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    maxHeight: "90vh",
    border: "7px solid white",
    width: "100%",
    background: "white",
    boxShadow: 24,
    overflow: "auto",
    outline: "none",
  },
  header: {
    top: 0,
    padding: "7px 0",
    background: "white",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: 500,
    color: theme.palette.primary.main,
  },
  objectTag: {
    height: "150px",
    width: "100%",
    maxHeight: "100%",
    position: "relative",
    textAlign: "center",
    [theme.breakpoints.up(1024)]: {
      height: "600px",
    },
  },
}));

const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;

const StudentDetailsViewDocuments = ({
  state,
  id,
  applicantData,
  getData,
  Image,
}) => {
  const popupclass = useModalStyles();

  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
  };
  const [values, setValues] = useState({ photo: "", academicDocuments: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [documentWrapperOpen, setDocumentWrapperOpen] = useState(false);
  const [filePath, setFilePath] = useState("");
  const [personalFile, setPersonalFile] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [academicLoading, setAcademicLoading] = useState(false);

  const userType = sessionStorage.getItem("usertype");
  const setCrumbs = useBreadcrumbs();
  const [templateWrapperOpen, setTemplateWrapperOpen] = useState(false);
  const [attachment, setAttachment] = useState("");

  const handleCreate = async () => {
    if (values.document !== "") {
      const documentData = new FormData();
      documentData.append("file", values.document);
      documentData.append("candidate_id", applicantData.candidate_id);
      setDocumentLoading(true);
      await axios
        .post(`/api/student/uploadFileForCandidateAttachment`, documentData)
        .then((res) => {
          setDocumentLoading(false);
          setAlertMessage({
            severity: "success",
            message: "Document uploded successfully !!",
          });
          setAlertOpen(true);
          setDocumentWrapperOpen(false);
          // getAttachmentDetails();
        })
        .catch((err) => console.error(err));
    }
  };
  const [hasFile, setHasFile] = useState(false);
  const [attachmentPath, setAttachmentPath] = useState("");

  const CandidateContractKey = "candidatecontract";


  const getAttachment = () => {
    axios
      .get(
        `/api/student/getStudentAttachmentData/${applicantData?.student_id}`
      )
      .then((response) => {
        setPersonalFile(response.data.data);
      })
      .catch((err) => console.error(err));
  };

  // const getAttachmentDetails = () => {
  //   axios
  //     .get(
  //       `/api/student/CandidateAttachmentDetails/${applicantData?.candidate_id}`
  //     )
  //     .then((response) => {
  //       setPersonalFile(
  //         response.data.data.filter((obj) => obj.attachment_purpose !== "photo")
  //       );
  //       const attachmentsArray = response.data.data;
  //       if (attachmentsArray.length <= 0) return setHasFile(false);

  //       for (const obj of attachmentsArray) {
  //         const { attachment_purpose, attachment_path } = obj;
  //         if (attachment_purpose === CandidateContractKey) {
  //           setFilePath(attachment_path);
  //           setHasFile(true);
  //         }
  //       }
  //     })
  //     .catch((err) => console.error(err));
  // };

  useEffect(() => {
    getAttachment()
    // getAttachmentDetails();
    // if (state) {
    //   setCrumbs([
    //     {
    //       name: "Student Master",
    //       link: "/student-master",
    //     },
    //     { name: applicantData?.candidate_name + "-" + applicantData?.auid },
    //   ]);
    // } else {
    //   setCrumbs([
    //     {
    //       name: "Student Master",
    //     },
    //     { name: applicantData?.candidate_name + "-" + applicantData?.auid },
    //   ]);
    // }
  }, []);

  const downloadContract = () => {
    axios
      .get(
        `/api/student/fileDownloadOfCandidateAttachment?attachment_path=${filePath}`,
        { responseType: "blob" }
      )
      .then((res) => {
        const path = URL.createObjectURL(res.data);
        setAttachmentPath(path);
        setShowAttachmentModal(true);
      })
      .catch((err) => console.log(err));
  };

  const handleViewBtn = async () => {
    downloadContract();
  };
  const handleDocument = () => {
    setDocumentWrapperOpen(true);
  };

  const handleFileDrop = (name, newFile) => {
    setSelectedFile(newFile);
    if (newFile)
      if (
        (newFile.name.toLowerCase().endsWith(".jpg") ||
          newFile.name.toLowerCase().endsWith(".jpeg") ||
          newFile.name.toLowerCase().endsWith(".png")) &&
        Math.round(newFile.size / 1024 / 1024) > 2
      ) {
        Resizer.imageFileResizer(
          newFile,
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            setValues((prev) => ({
              ...prev,
              [name]: uri,
            }));
          },
          "blob",
          200,
          200
        );
      } else {
        setValues((prev) => ({
          ...prev,
          [name]: newFile,
        }));
      }
  };

  const uploadImageToAPI = (image) => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image_file", selectedFile);
      formData.append("student_id", id);
      setDocumentLoading(true);
      axios
        .post(`api/student/studentImageUploadFile`, formData)
        .then((response) => {
          const photoUrl = response.data.url;
          setDocumentLoading(false);
          setAlertMessage({
            severity: "success",
            message: "Document uploded successfully !!",
          });
          setAlertOpen(true);
          setValues((prev) => ({
            ...prev,
            photo: photoUrl,
          }));
          setSelectedFile(null);
          getData();
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };

  const DownloadAttachment = (attachmentPath) => {
    if (attachmentPath) {
      axios
        .get(
          `/api/student/fileDownloadOfCandidateAttachment?attachment_path=${attachmentPath}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const url = URL.createObjectURL(res.data);
          window.open(url);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
    setSelectedFile(null);
  };

  const checks = {
    photo: [
      values.photo !== "",
      values.photo && values.photo.size < 2000000,
      (values.photo && values.photo.name.endsWith(".jpg")) ||
      (values.photo && values.photo.name.endsWith(".png")),
    ],
    academicDocuments: [
      values.academicDocuments !== "",
      values.academicDocuments &&
      values.academicDocuments.name.endsWith(".pdf"),
      values.academicDocuments && values.academicDocuments.size < 2000000,
    ],
  };

  const errorMessages = {
    photo: [
      "This field is required",
      "Maximum size 2 MB",
      "Please upload a png or jpg format",
    ],
    academicDocuments: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  const [subTab, setSubTab] = useState("Personal");

  const handleUpload = async () => {
    const dataArray = new FormData();
    dataArray.append("cwar[" + 0 + "].file", values.academicDocuments);
    dataArray.append("cwar[" + 0 + "].attachment_purpose", "student academic");
    dataArray.append("candidate_id", applicantData.candidate_id);
    dataArray.append("active", true);

    setAcademicLoading(true);
    await axios
      .post(
        "/api/student/uploadCandidateAttachmentFromStudentProfile",
        dataArray
      )
      .then((res) => {
        if (res.data.status === 200) {
          setValues((prev) => ({
            ...prev,
            academicDocuments: "",
            photo: ""
          }));
          setAlertMessage({
            severity: "success",
            message: "Uploaded successfully !!",
          });
          setAlertOpen(true);
          setAcademicLoading(false);
          setIsEdit(false);
          // getAttachmentDetails();
        } else {
          setAlertMessage({
            severity: "error",
            message: "Something went wrong !!",
          });
          setAlertOpen(true);
          setAcademicLoading(false);
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
        setAcademicLoading(false);
      });
  };
  const handleView = async (params) => {
    setTemplateWrapperOpen(true)
    setAttachment(params.attachments_file_path)
  };
  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  const isPDF = (fileName) => {
    return /\.pdf$/i.test(fileName);
  };

  return (
    <>
      <Modal
        open={showAttachmentModal}
        setOpen={setShowAttachmentModal}
        style={{ height: "100%" }}
      >
        <Box className={popupclass.box} borderRadius={3} maxWidth={800}>
          <Grid container className={popupclass.header}>
            <Grid item xs={11} pl={2}>
              <Typography variant="h6" className={popupclass.title}>
                {`Contract document ${id}`}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                onClick={() => setShowAttachmentModal(false)}
                sx={{ position: "absolute", top: 0, right: 0 }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Grid>
          </Grid>

          <Box p={2} pt={0}>
            <Box mt={2}>
              <Grid container rowSpacing={2}>
                <object
                  className={popupclass.objectTag}
                  data={attachmentPath}
                  type="application/pdf"
                >
                  <p>Unable to preview the document</p>
                </object>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Modal>
      <ModalWrapper
        open={templateWrapperOpen}
        setOpen={setTemplateWrapperOpen}
        maxWidth={1200}
      >
        <>
          {attachment && <DOCView
            attachmentPath={`/api/student/viewStudentFiles?fileName=${attachment}`}
          />}
        </>
      </ModalWrapper>
      <Grid container spacing={2} columnSpacing={4} sx={{ marginTop: "1px" }}>
        <Grid item xs={4} md={2}>
          <CustomTabs
            value={subTab}
            onChange={handleSubTabChange}
            orientation="vertical"
            variant="scrollable"
            className="customTabs"
          >
            <CustomTab value="Personal" label="Personal" />
            <CustomTab value="Academics" label="Academics" />
            <CustomTab value="Photo" label="Photo" />
            <CustomTab value="Contract" label="Contract" />
          </CustomTabs>
        </Grid>
        <Grid item xs={8} md={10}>
          {subTab === "Photo" && userType.toLowerCase() !== "student" ? (
            <>
              <Card>
                <CardHeader
                  title="Photo"
                  titleTypographyProps={{ variant: "subtitle2" }}
                  sx={{
                    backgroundColor: "rgba(74, 87, 169, 0.1)",
                    color: "#46464E",
                    padding: 1,
                  }}
                />
                <CardContent>
                  <Grid container columnSpacing={1} rowSpacing={1}>
                    <Grid item xs={12} md={8}>
                      <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                        <ul>
                          <li>
                            Close up of the head and top of the shoulders such
                            that the face takes up 80-85% of the photograph.
                          </li>
                          <li>
                            The photograph should be in color and in the size of
                            45mm x 35mm.
                          </li>
                          <li>
                            Background of the photograph should be a bright
                            uniform colour.
                          </li>
                          <li>The photographs must:</li>
                        </ul>
                      </div>
                      <div style={{ marginLeft: "50px" }}>
                        <ul style={{ listStyleType: "circle" }}>
                          <li>
                            Show the applicant looking directly at the camera.
                          </li>
                          <li>Show the skin tones naturally.</li>
                          <li>
                            Have appropriate brightness and contrast - Show the
                            applicants eyes open & clearly visible, - Should not
                            have hair across the eyes.
                          </li>
                          <li>
                            Be taken with uniform lighting and not show shadows
                            or flash reflections on the face and no red eye.
                          </li>
                        </ul>
                      </div>
                    </Grid>
                     <Grid item xs={12} md={4}>
                      <CustomFileInput
                        name="photo"
                        label="3x4 rasm"
                        helperText="2 MB dan kichikroq hujjatni yuklang"
                        file={values.photo}
                        handleFileDrop={handleFileDrop}
                        handleFileRemove={handleFileRemove}
                        checks={checks.photo}
                        errors={errorMessages.photo}
                      />
                      <Button
                        variant="contained"
                        disabled={documentLoading || values.photo === ""}
                        onClick={uploadImageToAPI}
                        sx={{
                          backgroundColor: "auzColor.main",
                          margin: 2,
                          ":hover": {
                            bgcolor: "auzColor.main",
                          },
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontSize: 13 }}>
                          {documentLoading ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Upload"
                          )}
                        </Typography>
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={4}></Grid>

                    {Image && (
                      <Grid item xs={12} md={4}>
                        <img
                          src={Image}
                          alt="Uploaded"
                          height={200}
                          width={200}
                          style={{ objectFit: "cover", borderRadius: 4 }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {subTab === "Photo" ? (
                <Alert severity="error">You do not have permission!</Alert>
              ) : (
                <></>
              )}
            </>
          )}
          {subTab === "Contract" && userType.toLowerCase() !== "student" ? (
            <>
              <Card>
                <CardHeader
                  title="Contract"
                  titleTypographyProps={{ variant: "subtitle2" }}
                  sx={{
                    backgroundColor: "rgba(74, 87, 169, 0.1)",
                    color: "#46464E",
                    padding: 1,
                  }}
                />
                <CardContent>
                  <Grid container columnSpacing={1} rowSpacing={1}>
                    <Grid item xs={12} md={4}>
                      <CustomFileInput
                        name="document"
                        label="Contract Document"
                        helperText="PDF - smaller than 2 MB"
                        file={values.document}
                        handleFileDrop={handleFileDrop}
                        handleFileRemove={handleFileRemove}
                        checks={checks.document}
                      />

                      <Button
                        variant="contained"
                        onClick={handleCreate}
                        sx={{
                          backgroundColor: "auzColor.main",
                          margin: 2,
                          ":hover": {
                            bgcolor: "auzColor.main",
                          },
                        }}
                        disabled={documentLoading || values.document === ""}
                      >
                        <Typography variant="subtitle2" sx={{ fontSize: 13 }}>
                          {documentLoading ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Upload"
                          )}
                        </Typography>
                      </Button>
                      {hasFile && (
                        <Button
                          onClick={handleViewBtn}
                          variant="contained"
                          startIcon={<CloudDownloadIcon />}
                          sx={{
                            backgroundColor: "auzColor.main",
                            ":hover": {
                              bgcolor: "auzColor.main",
                            },
                          }}
                        >
                          View
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </>
          ) : (
            <></>
          )}
          {subTab === "Personal" && (
            <>
              {/* <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title="Documents"
                    titleTypographyProps={{ variant: "subtitle2" }}
                    sx={{
                      backgroundColor: "rgba(74, 87, 169, 0.1)",
                      color: "#46464E",
                      padding: 1,
                    }}
                  />
                  {personalFile.length > 0 ? (
                    <CardContent>
                      <Grid container>
                        {personalFile.map((obj, i) => {
                          if (
                            obj.attachment_purpose === "passport" ||
                            obj.attachment_purpose === "contract"
                          ) {
                            return (
                              <Grid item xs={12} md={4} key={i}>
                                <IconButton
                                  onClick={() =>
                                    DownloadAttachment(obj.attachment_path)
                                  }
                                >
                                  <FilePresentIcon />
                                  <Typography>
                                    {obj.attachment_purpose === "passport"
                                      ? "Passport"
                                      : "Contract"}
                                  </Typography>
                                </IconButton>
                              </Grid>
                            );
                          }
                          return null;
                        })}
                      </Grid>
                    </CardContent>
                  ) : (
                    <CardContent>No Documents Available</CardContent>
                  )}
                </Card>
              </Grid> */}

              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title="Documents"
                    titleTypographyProps={{ variant: "subtitle2" }}
                    sx={{
                      backgroundColor: "rgba(74, 87, 169, 0.08)",
                      color: "#3f3f46",
                      py: 1,
                      px: 2,
                    }}
                  />
                  {personalFile.length > 0 ? (
                    <CardContent>
                      <Grid container spacing={1.5}>
                        {personalFile.map((file, i) => {
                          const isImg = isImage(file.attachments_file_path);
                          const isPdf = isPDF(file.attachments_file_path);

                          return (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                              <Box
                                sx={{
                                  border: "1px solid #e0e0e0",
                                  borderRadius: 2,
                                  p: 1.5,
                                  backgroundColor: "#fcfcfc",
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  transition: "0.2s",
                                  "&:hover": {
                                    boxShadow: 2,
                                    backgroundColor: "#fff",
                                  },
                                }}
                              >
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                  {isPdf ? (
                                    <PictureAsPdfIcon sx={{ color: "#d32f2f", fontSize: 28 }} />
                                  )
                                    // : isImg ? (
                                    //   <Box
                                    //     component="img"
                                    //     src={file?.attachments_file_path}
                                    //     alt="thumbnail"
                                    //     sx={{
                                    //       width: 32,
                                    //       height: 32,
                                    //       objectFit: "cover",
                                    //       borderRadius: 1,
                                    //       border: "1px solid #ccc",
                                    //     }}
                                    //   />
                                    // ) 
                                    : (
                                      <InsertPhotoIcon sx={{ color: "#1976d2", fontSize: 28 }} />
                                    )}
                                  <Box>
                                    <Typography variant="body2" fontWeight={500} noWrap>
                                      {file.attachments_subcategory_name}
                                    </Typography>
                                    <Chip
                                      label={file.attachments_category_name_short}
                                      size="small"
                                      sx={{
                                        mt: 0.5,
                                        backgroundColor: "#e3f2fd",
                                        color: "#1976d2",
                                        fontSize: "0.7rem",
                                        height: 20,
                                      }}
                                    />
                                  </Box>
                                </Box>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  sx={{ fontSize: "0.75rem", textTransform: "none" }}
                                  onClick={() => handleView(file)}
                                >
                                  {isPdf ? "View PDF" : "View Image"}
                                </Button>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </CardContent>
                  ) : (
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">
                        No Documents Available
                      </Typography>
                    </CardContent>
                  )}
                </Card>
              </Grid>


            </>
          )}

          {subTab === "Academics" && (
            <>
              <Grid item xs={12}>
                <Card>
                  {subTab === "Academics" &&
                    userType.toLowerCase() !== "student" ? (
                    <CardHeader
                      title="Academic Documents"
                      titleTypographyProps={{ variant: "subtitle2" }}
                      action={
                        <IconButton onClick={() => setIsEdit(true)}>
                          <EditIcon />
                        </IconButton>
                      }
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        padding: 1,
                      }}
                    />
                  ) : (
                    <>
                      <CardHeader
                        title="Academic Documents"
                        titleTypographyProps={{ variant: "subtitle2" }}
                        sx={{
                          backgroundColor: "rgba(74, 87, 169, 0.1)",
                          color: "#46464E",
                          padding: 1,
                        }}
                      />
                    </>
                  )}

                  <CardContent>
                    {isEdit ? (
                      <Grid container rowSpacing={2}>
                        <Grid item xs={12}>
                          <CustomFileInput
                            name="academicDocuments"
                            label="Academic Document"
                            helperText="PDF - smaller than 2 MB"
                            file={values.academicDocuments}
                            handleFileDrop={handleFileDrop}
                            handleFileRemove={handleFileRemove}
                            checks={checks.academicDocuments}
                            errors={errorMessages.academicDocuments}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Stack
                            direction="row"
                            justifyContent="right"
                            spacing={2}
                          >
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => setIsEdit(!isEdit)}
                            >
                              Cancel
                            </Button>

                            <Button
                              variant="contained"
                              color="success"
                              onClick={handleUpload}
                              disabled={
                                values.academicDocuments === "" ||
                                checks?.academicDocuments?.includes(false) ===
                                true ||
                                checks?.academicDocuments?.includes(null) ===
                                true
                              }
                            >
                              {academicLoading ? (
                                <CircularProgress size={26} />
                              ) : (
                                "Upload"
                              )}
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid container>
                        {personalFile.length > 0 ? (
                          personalFile
                            ?.filter(
                              (item) =>
                                item.attachment_purpose === "academic" ||
                                item.attachment_purpose === "student academic"
                            )
                            ?.map((obj, i) => {
                              return (
                                <Grid item xs={12} md={2} key={i}>
                                  <IconButton
                                    onClick={() =>
                                      DownloadAttachment(obj.attachment_path)
                                    }
                                  >
                                    <FilePresentIcon />
                                    {/* <Typography>Class XII</Typography> */}
                                    <Typography>
                                      {"Document " + (i + 1)}
                                    </Typography>
                                  </IconButton>
                                </Grid>
                              );
                            })
                        ) : (
                          <>
                            <Typography>No documents available</Typography>
                          </>
                        )}
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default StudentDetailsViewDocuments;
