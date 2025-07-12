import { useState, useEffect } from "react";
import axios from "../services/Api";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Divider,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  tableCellClasses,
  TableBody,
} from "@mui/material";
import logo from "../assets/auzwhite.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import PrintIcon from "@mui/icons-material/Print";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function StudentTranscriptApplication() {
  const [studentData, setStudentData] = useState([]);
  const [transcriptCollectedData, setTranscriptCollectedData] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/student/getDataForTestimonials/${id}`)
      .then((res) => {
        setTranscriptCollectedData(
          res.data.data.Student_Transcript_Details.filter(
            (obj) => obj.not_applicable !== "YES"
          )
        );
        setStudentData(res.data.data.Student_details);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box m={2}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={9}>
            <Card>
              <CardHeader
                avatar={<Avatar alt="Acharya universiteti" src={logo} />}
                title="Acharya University"
                titleTypographyProps={{ variant: "h6" }}
                sx={{
                  backgroundColor: "auzColor.main",
                  color: "headerWhite.main",
                }}
              />
              <CardContent>
                <Grid container rowSpacing={1}>
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">Applicant Name</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {studentData.candidate_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">AUID</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {studentData.auid}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">
                      Date of Admission
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {Object.keys(studentData).length > 0
                        ? studentData.date_of_admission
                            ?.split("-")
                            .reverse()
                            .join("-")
                        : ""}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">DOB</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {Object.keys(studentData).length > 0
                        ? studentData?.dateofbirth
                            ?.split("-")
                            .reverse()
                            .join("-")
                        : ""}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">Gender</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {studentData.candidate_sex === "M"
                        ? "Male"
                        : studentData.candidate_sex === "F"
                        ? "Female"
                        : ""}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">Father Name</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {studentData.father_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">Mobile</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {studentData.mobile}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">School</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {studentData.school_name_short}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">Program</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {studentData.program_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">Specialization</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {studentData.program_specialization_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">
                      Admission Category
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {studentData.fee_admission_category_type}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2">Fee Template</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      {studentData.fee_template_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12} mt={2}>
                    <TableContainer component={Paper} elevation={2}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Transcript</StyledTableCell>
                            <StyledTableCell>
                              Date of Submission
                            </StyledTableCell>
                            <StyledTableCell>
                              Last Date of Submission
                            </StyledTableCell>
                            <StyledTableCell>Collected By</StyledTableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {transcriptCollectedData?.map((obj, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell>{obj.transcript}</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {obj.submitted_date}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {obj?.will_submit_by}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {obj.created_username}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  <Grid item xs={12} align="right">
                    <Link
                      to={`/StudentDocumentCollectionPdf/${id}`}
                      // target="_blank"
                    >
                      <PrintIcon
                        fontSize="large"
                        sx={{
                          color: "auzColor.main",
                        }}
                      />
                    </Link>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default StudentTranscriptApplication;
