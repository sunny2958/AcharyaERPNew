import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  styled,
  tableCellClasses,
  Typography,
  TableContainer,
  Table,
  TableCell,
  Paper,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import FeeTemplateView from "../../../components/FeeTemplateView";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomModal from "../../../components/CustomModal";
import useAlert from "../../../hooks/useAlert";

const initValues = { remarks: "" };

const requiredFields = ["remarks"];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function PreScholarshipApproverForm() {
  const [values, setValues] = useState(initValues);
  const [feeTemplateId, setFeeTemplateId] = useState();
  const [confirmModalContent, setConfirmModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [noOfYears, setNoOfYears] = useState([]);
  const [yearwiseSubAmount, setYearwiseSubAmount] = useState({});
  const [yearWiseScholarship, setYearWiseScholarShip] = useState({});
  const [programData, setProgramData] = useState();
  const [reasonOptions, setReasonOptions] = useState([]);
  const [scholarshipTotal, setScholarshipTotal] = useState(0);
  const [subAmountTotal, setSubAmountTotal] = useState(0);
  const [programType, setProgramType] = useState("");
  const [year, setYear] = useState(null);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    remarks: ["This field required"],
  };

  useEffect(() => {
    getCandidateDetails();
  }, [pathname]);

  const getCandidateDetails = async () => {
    // fetching feeTemplateId
    const feetemplateId = await axios
      .get(`/api/student/findAllDetailsPreAdmission/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Index", link: "/PreScholarshipApproverIndex" },
          { name: res.data.data[0].candidate_name },
          { name: "Approve" },
        ]);
        setFeeTemplateId(res.data.data[0].fee_template_id);
        getFeetemplateDetail(res.data.data[0].fee_template_id);
        return res.data.data[0].fee_template_id;
      })
      .catch((err) => console.error(err));

    const scholarshipres = await axios.get(
      `/api/student/fetchscholarship/${id}`
    );

    if (scholarshipres?.status === 200 || scholarshipres?.status === 201) {
      const res = await axios.get(
        `/api/student/fetchScholarship2/${scholarshipres.data.data[0].scholarship_id}`
      );

      setYearWiseScholarShip(res.data.data[0]);

      const totalAmount = Array?.from(
        { length: 12 },
        (_, i) => res.data.data[0][`'year${i + 1}_amount`] || 0
      ).reduce((sum, val) => sum + val, 0);

      setSubAmountTotal(totalAmount);
    }
  };

  console.log(yearWiseScholarship);

  const getFeetemplateDetail = async (feetemplateId) => {
    await axios
      .get(`/api/finance/FetchAllFeeTemplateDetail/${feetemplateId}`)
      .then(async (res) => {
        const data = res.data.data[0];
        getAcademicProgram(
          data,
          data.ac_year_id,
          data.program_id,
          data.school_id,
          feetemplateId
        );
      })
      .catch((err) => console.error(err));
  };

  const getAcademicProgram = async (
    data,
    acYearId,
    programId,
    schoollId,
    feetemplateId
  ) => {
    await axios
      .get(
        `/api/academic/FetchAcademicProgram/${acYearId}/${programId}/${schoollId}`
      )
      .then((res) => {
        const years = [];

        if (data.program_type_name.toLowerCase() === "yearly") {
          setYear(res.data.data[0].number_of_years);
          for (let i = 1; i <= res.data.data[0].number_of_semester; i++) {
            setProgramType("Year");
            years.push({
              key: i,
              value: "Sem" + "-" + i,
              ["feeYear" + i]: 0,
            });
          }
        } else if (data.program_type_name.toLowerCase() === "semester") {
          setProgramType("Sem");
          setYear(res.data.data[0].number_of_semester);
          for (let i = 1; i <= res.data.data[0].number_of_semester; i++) {
            years.push({
              key: i,
              value: "Sem" + "-" + i,
              ["feeYear" + i]: 0,
            });
          }
        }
        setNoOfYears(years);

        fetchFeetemplateSubamount(years, feetemplateId);
      })
      .catch((err) => console.error(err));
  };

  const fetchFeetemplateSubamount = async (years, feetemplateId) => {
    await axios
      .get(`/api/finance/FetchFeeTemplateSubAmountDetail/${feetemplateId}`)
      .then((res) => {
        const subAmountHistory = [];

        res.data.data.map((obj) => {
          const AllYears = [];
          years.forEach((obj1) => {
            AllYears.push({
              key: obj1.key,
              ["year" + obj1.key]: obj["fee_year" + obj1.key + "_amt"],
              value: obj1.value,
            });
          });

          const fees = res.data.data[0];

          setYearwiseSubAmount(fees);
          setScholarshipTotal(fees?.fee_year_total_amount);

          subAmountHistory.push({
            remarks: obj.remarks,
            feetempSubAmtId: obj.fee_sub_amt_id,
            voucherHead: obj.voucher_head,
            boardName: obj.board_unique_name,
            aliasName: obj.alias_name,
            voucherId: obj.voucher_head_new_id,
            boardId: obj.board_unique_id,
            aliasId: obj.alias_id,
            receiveForAllYear: obj.receive_for_all_year,
            years: AllYears,
          });
        });

        // setTemplateData(subAmountHistory);
        setValues(subAmountHistory);
        // sethistoryData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const renderHeaderCells = (label, key, align) => (
    <StyledTableCell key={key} align={align}>
      <Typography variant="subtitle2">{label}</Typography>
    </StyledTableCell>
  );

  const renderTextInput = () => {
    return noOfYears.map((obj, i) => {
      return (
        <TableCell key={i} align="right">
          <CustomTextField
            name={`year${obj.key}_amount`}
            value={yearWiseScholarship[`year${obj.key}_amount`]}
            handleChange={(e) => handleChangeScholarship(e, obj.key)}
            sx={{
              "& .MuiInputBase-root": {
                "& input": {
                  textAlign: "right",
                },
              },
            }}
          />
        </TableCell>
      );
    });
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeScholarship = (e, key) => {
    const { name, value } = e.target;
    if (!/^\d*$/.test(value)) return;

    setYearWiseScholarShip((prev) => ({
      ...prev,
      [name]:
        Number(value) > yearwiseSubAmount?.[`fee_year${key}_amt`]
          ? yearwiseSubAmount?.[`fee_year${key}_amt`]
          : value,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = (status) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const submit = async () => {
        // Get scholarshipId and update pre approver data
        const scholarshipId = await axios
          .get(`/api/student/fetchscholarship/${id}`)
          .then((res) => {
            return res.data.data[0].scholarship_id;
          })
          .catch((err) => console.error(err));

        const scholarshipData = await axios
          .get(`/api/student/fetchScholarship2/${scholarshipId}`)
          .then((res) => {
            return res.data.data[0];
          })
          .catch((err) => console.error(err));

        const updateData = await axios
          .get(
            `/api/student/scholarshipapprovalstatus/${scholarshipData.scholarship_approved_status_id}`
          )
          .then((res) => {
            return res.data.data;
          })
          .catch((err) => console.error(err));

        updateData.year1_amount = Number(yearWiseScholarship.year1_amount);
        updateData.year2_amount = Number(yearWiseScholarship.year2_amount);
        updateData.year3_amount = Number(yearWiseScholarship.year3_amount);
        updateData.year4_amount = Number(yearWiseScholarship.year4_amount);
        updateData.year5_amount = Number(yearWiseScholarship.year5_amount);
        updateData.year6_amount = Number(yearWiseScholarship.year6_amount);
        updateData.year7_amount = Number(yearWiseScholarship.year7_amount);
        updateData.year8_amount = Number(yearWiseScholarship.year8_amount);
        updateData.year9_amount = Number(yearWiseScholarship.year9_amount);
        updateData.year10_amount = Number(yearWiseScholarship.year10_amount);
        updateData.year11_amount = Number(yearWiseScholarship.year11_amount);
        updateData.year12_amount = Number(yearWiseScholarship.year12_amount);

        updateData.pre_approval_status = status === "true" ? true : false;
        updateData.prev_approved_amount = scholarshipData.requested_scholarship;
        updateData.prev_approved_date = new Date();
        updateData.pre_approver_remarks = values.remarks;

        const temp = {};
        temp["sas"] = updateData;

        await axios
          .put(`/api/student/updateScholarshipStatus/${scholarshipId}`, temp)
          .then((res) => {})
          .catch((err) => console.error(err));

        // If pre approver reject then offer needs to be in activated
        if (status === "false") {
          await axios
            .delete(`/api/student/deactivatePreAdmissionProcess/${id}`)
            .then((res) => {})
            .catch((err) => console.error(err));

          await axios
            .delete(`/api/student/deactivateScholarship/${id}`)
            .then((res) => {})
            .catch((err) => console.error(err));

          await axios
            .delete(`/api/student/deactivateScholarshipapprovalstatus/${id}`)
            .then((res) => {})
            .catch((err) => console.error(err));

          await axios
            .delete(`/api/student/deactivateScholarshipAttachment/${id}`)
            .then((res) => {})
            .catch((err) => console.error(err));

          await axios
            .get(`/api/student/Candidate_Walkin/${id}`)
            .then((res) => {
              const data = res.data.data;
              data.npf_status = null;

              axios
                .put(`/api/student/Candidate_Walkin/${id}`, data)
                .then((res) => {})
                .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
        }

        setAlertMessage({
          severity: "success",
          message: "Scholarship approved successfully",
        });
        setAlertOpen(true);
        navigate("/PreScholarshipApproverIndex", { replace: true });
      };

      setConfirmModalContent({
        title: "",
        message:
          status === "true"
            ? "Are sure want to approve ? "
            : "Are sure want to reject ? ",
        buttons: [
          { name: "Yes", color: "primary", func: submit },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
      setConfirmModalOpen(true);
    }
  };
  return (
    <>
      <CustomModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        title={confirmModalContent.title}
        message={confirmModalContent.message}
        buttons={confirmModalContent.buttons}
      />

      <Box component="form" p={1}>
        <FormPaperWrapper>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12}>
              {feeTemplateId ? (
                <FeeTemplateView
                  feeTemplateId={feeTemplateId}
                  candidateId={id}
                  type={3}
                />
              ) : (
                <></>
              )}
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell />
                      {noOfYears.map((obj, i) =>
                        renderHeaderCells(obj.value, i, "right")
                      )}
                      {/* {renderHeaderCells("Total", 0, "right")} */}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      {renderHeaderCells("Fixed Fee")}
                      {noOfYears.map((obj, i) =>
                        renderHeaderCells(
                          yearwiseSubAmount[`fee_year${obj.key}_amt`],
                          i,
                          "right"
                        )
                      )}
                      {/* {renderHeaderCells(scholarshipTotal, 0, "right")} */}
                    </TableRow>

                    <TableRow>
                      {renderHeaderCells("Scholarship")}
                      {renderTextInput()}
                      {/* {renderHeaderCells(subAmountTotal, 0, "right")} */}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="remarks"
                label="Remarks"
                value={values.remarks}
                handleChange={handleChange}
                multiline
                rows={3}
                checks={checks.remarks}
                errors={errorMessages.remarks}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                justifyContent="flex-end"
                rowSpacing={2}
                columnSpacing={2}
              >
                <Grid item xs={12} md={1} align="right">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleCreate("false")}
                    fullWidth
                  >
                    Reject
                  </Button>
                </Grid>
                <Grid item xs={12} md={1} align="right">
                  <Button
                    variant="contained"
                    onClick={() => handleCreate("true")}
                    fullWidth
                  >
                    Approve
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default PreScholarshipApproverForm;
