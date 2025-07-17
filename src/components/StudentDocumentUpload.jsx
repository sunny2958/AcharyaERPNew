import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Paper,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "../services/Api";
import useAlert from "../hooks/useAlert";
import ModalWrapper from "./ModalWrapper";
import DOCView from "./DOCView";

const Id = sessionStorage.getItem("empId");

const NoteBox = ({ icon, color, text, label }) => (
  <Box display="flex" alignItems="flex-start" gap={1}>
    <Box
      sx={{
        backgroundColor: color,
        width: 24,
        height: 24,
        borderRadius: "50%",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
      }}
    >
      {icon}
    </Box>
    <Typography variant="body2">
      <strong>{label}:</strong> {text}
    </Typography>
  </Box>
);

const StudentDocumentUpload = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const [selectedSubCategories, setSelectedSubCategories] = useState({});
  const [mappedFiles, setMappedFiles] = useState({});
  const [isDragging, setIsDragging] = useState(null);
  const fileInputRef = useRef({});
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
  const [uploadedAttachments, setUploadedAttachments] = useState([]);
  const [templateWrapperOpen, setTemplateWrapperOpen] = useState(false);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    setSelectedSubCategories({});
    setMappedFiles({});
    if (Id) {
      getStudentAttachmentDetails()
    }
    axios
      .get("/api/getAllAttachmentCategory")
      .then((res) => {
        const categories = res.data.data;
        setMainCategories(categories);
        if (categories.length > 0) {
          handleMainCategorySelect(categories[0]);
        }
      })
      .catch(() => {
        setAlertMessage({ severity: "error", message: "Failed to load categories" });
        setAlertOpen(true);
      });
  }, []);

  useEffect(() => {
    setSelectedSubCategories({});
    setMappedFiles({});
  }, [Id]);

  const getStudentAttachmentDetails = () => {
    axios
      .get(`/api/student/getStudentAttachmentDetails?student_id=${Id}`)
      .then((res) => {
        setUploadedAttachments(res.data.data || []);
      })
      .catch(() => {
        setAlertMessage({ severity: "error", message: "Failed to load" });
        setAlertOpen(true);
      });
  }

  const fetchSubCategories = async (mainId) => {
    try {
      const studentResponse = await axios.get(
        `/api/student/getStudentDetailsBasedOnAuidAndStrudentId?student_id=${Id}`
      );
      const studentData = studentResponse.data?.data?.[0] || {};
      console.log(studentData, "studentData");

      const categoryResponse = await axios.get(
        `/api/getAttachCategoryDetails?attachments_category_id=${mainId}`
      );
      let subcategories = categoryResponse.data?.data || [];

      const excludedIds = [14, 15, 16, 17, 18, 19, 20, 21, 22];
      if (studentData.fee_admission_category_short_name === "INT") {
        excludedIds.push(3);
      }
      if (mainId === 3 || mainId === 1) {
        subcategories = subcategories.filter(
          (item) => !excludedIds.includes(item.id)
        );
      }
      setSubCategoriesMap((prev) => ({
        ...prev,
        [mainId]: subcategories,
      }));
    } catch (error) {
      console.error(error);
      setAlertMessage({
        severity: "error",
        message: "Failed to load subcategories",
      });
      setAlertOpen(true);
    }
  };


  const handleMainCategorySelect = (cat) => {
    const id = cat.attachments_category_id;
    setSelectedMainCategory(cat);
    setSelectedSubCategories({});
    setMappedFiles({});
    fetchSubCategories(id);
  };

  const handleSubCategoryToggle = (name) => {
    setSelectedSubCategories((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
    if (selectedSubCategories[name]) {
      const updated = { ...mappedFiles };
      const removed = updated[name];
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      delete updated[name];
      setMappedFiles(updated);
    }
  };

  const handleFilesForSubcategory = (subcatName, files) => {
    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 200 * 1024; // 200 KB

    const file = Array.from(files)[0];

    if (!file) return;

    if (!validTypes.includes(file.type)) {
      setAlertMessage({ severity: "error", message: "Only JPEG, and PNG files are allowed." });
      setAlertOpen(true);
      return;
    }

    if (file.size > maxSize) {
      setAlertMessage({ severity: "error", message: "File size must be less than 200 KB." });
      setAlertOpen(true);
      return;
    }

    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;

    setMappedFiles((prev) => ({
      ...prev,
      [subcatName]: { file, preview: previewUrl },
    }));
  };

  const deleteFile = (e, sub) => {
    e.preventDefault();
    e.stopPropagation();
    const removed = mappedFiles[sub];
    if (removed?.preview) URL.revokeObjectURL(removed.preview);
    const newMap = { ...mappedFiles };
    delete newMap[sub];
    setMappedFiles(newMap);
    const newSubs = { ...selectedSubCategories };
    delete newSubs[sub];
    setSelectedSubCategories(newSubs);
  };

  const getUploadedFileForSubcategory = (subcatName) =>
    uploadedAttachments.find((att) => att.attachments_subcategory_name === subcatName);

  const handleSubmit = async () => {
    setLoading(true);

    if (!selectedMainCategory || Object.keys(mappedFiles).length === 0) {
      setAlertMessage({ severity: "error", message: "Category & files required" });
      setAlertOpen(true);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("attachments_category_id", selectedMainCategory.attachments_category_id);
    formData.append("student_id", Id);

    const subcats = subCategoriesMap[selectedMainCategory.attachments_category_id] || [];
    subcats.forEach((sub) => {
      const name = sub.attachments_subcategory_name;
      const short = sub.attachments_subcategory_name_short;
      if (mappedFiles[name]?.file) {
        formData.append(short, mappedFiles[name].file);
      }
    });

    try {
      const response = await axios.post(
        "/api/student/uploadStudentAttachmentForStudent",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { success, status, message, data } = response.data || {};
      const { already_uploaded = [], successful_uploads = [] } = data || {};

      if (already_uploaded.length > 0) {
        const formatted = already_uploaded.map(item => item.split(":")[0]).join(", ");
        setAlertMessage({
          severity: "warning",
          message: `${formatted} already uploaded.`,
        });
      } else if (status === 206) {
        setAlertMessage({ severity: "warning", message: message });
      } else if (successful_uploads.length > 0) {
        setAlertMessage({ severity: "success", message: "Upload successful." });
      } else {
        setAlertMessage({ severity: "info", message: "No new files uploaded." });
      }

      setAlertOpen(true);
      setSelectedSubCategories({});
      setMappedFiles({});
      getStudentAttachmentDetails()
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Upload failed",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (e, params) => {
    e.preventDefault();
    e.stopPropagation();
    setTemplateWrapperOpen(true)
    setAttachment(params.attachments_file_path)
  };

  return (
    <>
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
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Documents Upload
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography fontWeight={600} mb={1}>
                Main Categories
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {mainCategories.map((cat) => (
                  <Chip
                    key={cat.attachments_category_id}
                    label={cat.attachments_category_name}
                    onClick={() => handleMainCategorySelect(cat)}
                    color={
                      selectedMainCategory?.attachments_category_id === cat.attachments_category_id
                        ? "primary"
                        : "default"
                    }
                    clickable
                  />
                ))}
              </Box>
            </Paper>

            <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
              <Typography fontWeight={600} mb={1}>
                Subcategories
              </Typography>
              {selectedMainCategory ? (
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {(subCategoriesMap[selectedMainCategory.attachments_category_id] || []).map((sub) => (
                    <Chip
                      key={sub.id}
                      label={sub.attachments_subcategory_name}
                      onClick={() => handleSubCategoryToggle(sub.attachments_subcategory_name)}
                      variant={
                        selectedSubCategories[sub.attachments_subcategory_name] ? "filled" : "outlined"
                      }
                      color="secondary"
                      clickable
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2">Select a main category to begin.</Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                borderLeft: "4px solid #f44336",
                backgroundColor: "#fdecea",
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} color="#b71c1c" gutterBottom>
                📌 Important Notes
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={2}>
                <Box sx={{ flex: "1 1 calc(50% - 8px)" }}>
                  <NoteBox
                    icon="⚠️"
                    color="#f44336"
                    label="Upload Guideline"
                    text="All documents must be uploaded in JPEG, PNG and less than 200 KB."
                  />
                </Box>

                {selectedSubCategories["STUDY CERTIFICATE"] && (
                  <Box sx={{ flex: "1 1 calc(50% - 8px)" }}>
                    <NoteBox
                      icon="📘"
                      color="#1976d2"
                      label="Study Certificate"
                      text="Minimum period of 7 years from 1st to 12th standard."
                    />
                  </Box>
                )}

                {selectedSubCategories["MIGRATION CERTIFICATE"] && (
                  <Box sx={{ flex: "1 1 calc(50% - 8px)" }}>
                    <NoteBox
                      icon="📄"
                      color="#00796b"
                      label="Migration Certificate"
                      text="Applicable only for students other than Karnataka PUC Board."
                    />
                  </Box>
                )}

                {selectedSubCategories["EXPERIENCE CERTIFICATE"] && (
                  <Box sx={{ flex: "1 1 calc(50% - 8px)" }}>
                    <NoteBox
                      icon="💼"
                      color="#5d4037"
                      label="Experience Certificate"
                      text="Applicable only for working professional admissions."
                    />
                  </Box>
                )}

                {selectedSubCategories["SIGNATURE"] && (
                  <Box sx={{ flex: "1 1 calc(50% - 8px)" }}>
                    <NoteBox
                      icon="✍️"
                      color="#6a1b9a"
                      label="Signature"
                      text="Only the student's signature needs to be uploaded."
                    />
                  </Box>
                )}
              </Box>
            </Paper>

            {Object.entries(selectedSubCategories).some(([_, checked]) => checked) && (
              <Paper elevation={2} sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  {Object.entries(selectedSubCategories)
                    .filter(([_, checked]) => checked)
                    .map(([subcatName]) => {
                      const uploadedFile = getUploadedFileForSubcategory(subcatName);

                      return (
                        <Grid item xs={12} sm={6} md={4} key={subcatName}>
                          <Box
                            sx={{
                              border: "2px dashed #90caf9",
                              borderRadius: "12px",
                              p: 3,
                              height: "230px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              textAlign: "center",
                              backgroundColor: "#f9f9f9",
                            }}
                          >
                            <Typography fontWeight="bold" mb={1} sx={{ textTransform: "uppercase" }}>
                              {subcatName}
                            </Typography>

                            {uploadedFile ? (
                              <>
                                <Typography variant="body2" color="textSecondary" mb={1}>
                                  Document already uploaded.
                                </Typography>
                                <Tooltip title="View Uploaded File">
                                  <IconButton size="large" onClick={(e) => handleView(e, uploadedFile)}>
                                    <VisibilityIcon color="success" fontSize="large" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            ) : (
                              <>
                                <Box
                                  onClick={() => fileInputRef.current[subcatName]?.click()}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(subcatName);
                                  }}
                                  onDragLeave={() => setIsDragging(null)}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragging(null);
                                    handleFilesForSubcategory(subcatName, e.dataTransfer.files);
                                  }}
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    backgroundColor: isDragging === subcatName ? "#e3f2fd" : "inherit",
                                    transition: "0.3s",
                                  }}
                                >
                                  <input
                                    ref={(el) => {
                                      if (!fileInputRef.current) fileInputRef.current = {};
                                      fileInputRef.current[subcatName] = el;
                                    }}
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    hidden
                                    onChange={(e) => {
                                      handleFilesForSubcategory(subcatName, e.target.files);
                                      e.target.value = null;
                                    }}
                                  />
                                  <CloudUploadIcon fontSize="large" sx={{ color: "#3f51b5" }} />
                                  <Typography variant="body2" mt={1}>
                                    Click or Drag JPEG, PNG
                                  </Typography>

                                  {mappedFiles[subcatName] && (
                                    <Box mt={2} display="flex" alignItems="center" gap={1}>
                                      <Box
                                        component="img"
                                        src={mappedFiles[subcatName].preview}
                                        alt="preview"
                                        sx={{
                                          width: 40,
                                          height: 40,
                                          borderRadius: "6px",
                                          objectFit: "cover",
                                          border: "1px solid #ccc",
                                          cursor: "pointer",
                                          transition: "transform 0.2s ease-in-out",
                                          "&:hover": {
                                            transform: "scale(2)",
                                            zIndex: 10,
                                            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                          },
                                        }}
                                      />
                                      <Box display="flex" alignItems="center" gap={0.5} maxWidth={130}>
                                        <Tooltip title={mappedFiles[subcatName].file.name}>
                                          <Typography variant="body2" noWrap sx={{ maxWidth: "100%" }}>
                                            {mappedFiles[subcatName].file.name}
                                          </Typography>
                                        </Tooltip>
                                        <IconButton size="small" onClick={(e) => deleteFile(e, subcatName)}>
                                          <HighlightOffIcon fontSize="small" color="error" />
                                        </IconButton>
                                      </Box>
                                    </Box>
                                  )}
                                </Box>
                              </>
                            )}
                          </Box>
                        </Grid>

                      );
                    })}
                </Grid>
              </Paper>
            )}
          </Grid>
        </Grid>

        <Box mt={4} textAlign="right">
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              loading ||
              !selectedMainCategory ||
              Object.keys(mappedFiles).length === 0 ||
              Object.entries(selectedSubCategories).filter(([_, checked]) => checked).length !==
              Object.keys(mappedFiles).length
            }
          >
            {loading ? <CircularProgress size={25} color="primary" /> : "Upload Files"}
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default StudentDocumentUpload;
