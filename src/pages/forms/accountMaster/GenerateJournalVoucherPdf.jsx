import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  Table,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Breadcrumbs,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../assets/acc.png";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import numberToWords from "number-to-words";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    position: "relative",
    marginBottom: 10,
    width: "fit-content",
    zIndex: theme.zIndex.drawer - 1,
    marginLeft: "-130px",
  },
  link: {
    color: "#4A57A9",
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": { textDecoration: "underline" },
  },
}));

const JournalVoucherPdf = () => {
  const [voucherData, setVoucherData] = useState([]);
  const [hideButtons, setHideButtons] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [breadCrumb, setBreadCrumb] = useState([]);
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const pathname = useLocation();
  const { schoolId, fcYearId } = pathname.state;
  const location = useLocation();
  const grnIndexStatus = location?.state?.grnIndexStatus;
  const indexStatus = location?.state?.indexStatus;
  const fromPath = location?.state?.path;
  const queryValues = location?.state;

  useEffect(() => {
    getPaymentVoucherData();
    if (queryValues?.ledgerType === "VENDOR" || queryValues?.ledgerType === 'ASSETS/ADVANCE' || queryValues?.ledgerType === 'EXPENDITURE') {
      setCrumbs([]);
      setBreadCrumb([
        {
          name: "Payment Tracker",
          link: queryValues?.path,
          state: queryValues,
        },
      ]);
    } else if (fromPath) {
      setCrumbs([{ name: "Po Payment History", link: fromPath }]);
    } else if (grnIndexStatus) {
      setCrumbs([{ name: "Payment Tracker", link: "/journalmaster/grn" }]);
    } else if (indexStatus) {
      setCrumbs([{ name: "Payment Tracker", link: "/VoucherMaster" }]);
    }
  }, []);

  const getPaymentVoucherData = async () => {
    try {
      const response = await axios.get(
        `/api/finance/getJournalVoucherByVoucherNumber/${id}/${schoolId}/${fcYearId}`
      );
      const { data } = response?.data;
      setVoucherData(data || []);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: "Something went wrong.",
      });
      setAlertOpen(true);
    }
  };

  function toUpperCamelCaseWithSpaces(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const convertToRupeesAndPaise = (amount) => {
    const [rupees, paise] = Number(amount)?.toFixed(2)?.split(".");

    let result = "";
    if (parseInt(rupees) > 0) {
      result += numberToWords.toWords(parseInt(rupees)) + " rupees";
    }
    if (parseInt(paise) > 0) {
      if (result) result += " and ";
      result += numberToWords.toWords(parseInt(paise)) + " paise";
    }
    if (!result) result = "zero rupees";

    return result;
  };

  const handleDownloadPdf = () => {
    setHideButtons(true);
    setTimeout(() => {
      const receiptElement = document.getElementById("receipt");
      if (receiptElement) {
        html2canvas(receiptElement, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");

          const imgWidth = 190;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

          // Open in new window as Blob URL and trigger print
          const pdfBlob = pdf.output("blob");
          const pdfUrl = URL.createObjectURL(pdfBlob);

          const printWindow = window.open(pdfUrl, "_blank");
          if (printWindow) {
            printWindow.addEventListener("load", () => {
              printWindow.focus();
              printWindow.print();
            });
          }

          setHideButtons(false);
        });
      }
    }, 100);
  };

  const bookmanFont = {
    fontFamily: "Bookman Old Style, serif",
    fontSize: "14px",
  };

  const headerStyle = {
    ...bookmanFont,
    fontWeight: "bold",
    fontSize: "14px",
  };

  const amountStyle = {
    ...bookmanFont,
    fontWeight: "bold",
    fontSize: "14px",
  };

  return (
    <Container>
      {queryValues?.ledgerType === "VENDOR" ? (
        <CustomBreadCrumbs crumbs={breadCrumb} />
      ) : (
        <></>
      )}
      <Paper
        id="receipt"
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 840,
          margin: "0 auto",
          position: "relative",
          ...bookmanFont,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Watermark Logo"
          sx={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "25%",
            height: "auto",
            opacity: 0.35, // Very light watermark
            fontSize: 14,
          }}
        />
        <Box
          sx={{
            display: hideButtons ? "none" : "flex",
            justifyContent: "flex-end",
            gap: 2,
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadPdf}
          >
            Print
          </Button>
        </Box>
        <Box sx={{ border: "1px solid #000", ...bookmanFont }}>
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                ...headerStyle,
              }}
            >
              {voucherData?.[0]?.school_name || ""}
            </Typography>
            <Typography variant="body1" sx={bookmanFont}>
              Acharya Dr. Sarvepalli Radhakrishna Road, Bengaluru, Karnataka
              560107
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center", mt: 1, mb: 2 }}>
            <Typography variant="h6" sx={headerStyle}>
              Journal Voucher
            </Typography>
          </Box>

          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 10px",
            }}
          >
            <Grid item xs={4}>
              <Typography variant="body1" sx={bookmanFont}>
                <Box component="span" sx={{ fontWeight: "600" }}>
                  Voucher No:{" "}
                </Box>{" "}
                {voucherData?.[0]?.journal_voucher_number}
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="body1" sx={bookmanFont}>
                <Box component="span" sx={{ fontWeight: "600" }}>
                  FC Year:{" "}
                </Box>{" "}
                {voucherData?.[0]?.financial_year}
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="right">
              <Typography variant="body1" sx={bookmanFont}>
                <Box component="span" sx={{ fontWeight: "600" }}>
                  Date:{" "}
                </Box>{" "}
                {moment(voucherData?.[0]?.created_date).format("DD-MM-YYYY")}
              </Typography>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    borderTop: "1px solid #000",
                    borderBottom: "1px solid #000",
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      borderRight: "1px solid #000",
                      borderBottom: "1px solid #000",
                      textAlign: "center",
                      ...headerStyle,
                    }}
                  >
                    Particulars
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      borderRight: "1px solid #000",
                      borderBottom: "1px solid #000",
                      textAlign: "center",
                      width: 100,
                      ...headerStyle,
                    }}
                  >
                    Debit (₹)
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      width: 100,
                      borderBottom: "1px solid #000",
                      ...headerStyle,
                    }}
                  >
                    Credit (₹)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {voucherData?.map((item, index) => {
                  return (
                    <TableRow sx={{ borderBottom: "none" }}>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                          padding: "0 16px !important",
                          ...bookmanFont,
                        }}
                      >
                        <>
                          <Typography
                            variant="body1"
                            gutterBottom={false}
                            sx={{ padding: "0", ...bookmanFont }}
                          >
                            {item?.voucher_head}
                          </Typography>
                        </>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #000",
                          borderBottom: "none",
                          textAlign: "right",
                          verticalAlign: "top",
                          padding: index == 0 ? "3px" : "0 5px",
                          ...bookmanFont,
                        }}
                      >
                        {item?.debit || ""}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "right",
                          borderBottom: "none",
                          verticalAlign: "top",
                          padding: index == 0 ? "3px" : "0 5px",
                          ...bookmanFont,
                        }}
                      >
                        {item?.credit || ""}
                      </TableCell>
                    </TableRow>
                  );
                })}

                <TableRow sx={{ borderBottom: "none" }}>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #000",
                      borderBottom: "none",
                      padding: "0 16px !important",
                      verticalAlign: "top",
                    }}
                  >
                    <>
                      <Typography variant="body1">
                        {/* {voucherData?.[0]?.vendor_bank_name} */}
                      </Typography>
                    </>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #000",
                      borderBottom: "none",
                      textAlign: "right",
                      verticalAlign: "top",
                      padding: "5px",
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      textAlign: "right",
                      borderBottom: "none",
                      verticalAlign: "top",
                      padding: "5px",
                    }}
                  ></TableCell>
                </TableRow>

                <TableRow sx={{ borderBottom: "none" }}>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #000",
                      borderBottom: "none",
                      paddingBottom: 0,
                    }}
                  >
                    <>
                      <Box sx={{ height: "100px" }} />
                      <Typography
                        variant="body1"
                        gutterBottom={false}
                        sx={bookmanFont}
                      >
                        Pay To : {voucherData?.[0]?.pay_to}
                      </Typography>

                      <Typography
                        variant="body1"
                        gutterBottom={false}
                        sx={bookmanFont}
                      >
                        Narration:{" "}
                        {/* {voucherData?.[0]?.type !== "Salary-JV" &&
                        voucherData?.[0]?.type !== "REFUND-JV"
                          ? voucherData?.[0]?.voucher_head
                          : ""}{" "} */}
                        {voucherData?.[0]?.remarks
                          ? ` ${voucherData?.[0]?.remarks}`
                          : ""}{" "}
                        {/* {voucherData?.[0]?.created_username &&
                        voucherData?.[0]?.type !== "Salary-JV" &&
                        voucherData?.[0]?.type !== "REFUND-JV"
                          ? ` created by ${voucherData?.[0]?.draftCreatedName}`
                          : ""} */}
                      </Typography>
                    </>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #000",
                      borderBottom: "1px solid #000",
                      textAlign: "right",
                      verticalAlign: "top",
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid #000",
                      textAlign: "right",
                      verticalAlign: "top",
                    }}
                  ></TableCell>
                </TableRow>
                <TableRow
                  sx={{ border: "none", height: "30px", padding: "0px" }}
                >
                  <TableCell
                    sx={{
                      borderRight: "1px solid #000",
                      borderBottom: "none",
                      paddingTop: 0,
                      paddingBottom: 0,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, ...bookmanFont }}
                    >
                      {" "}
                      {toUpperCamelCaseWithSpaces(
                        convertToRupeesAndPaise(
                          Number(voucherData?.[0]?.debit_total ?? 0)
                        )
                      )}{" "}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #000",
                      textAlign: "right",
                      padding: "5px",
                      fontWeight: 600,
                      ...bookmanFont,
                    }}
                  >
                    {voucherData?.[0]?.debit_total}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "right", padding: "5px", ...amountStyle }}
                  >
                    {voucherData?.[0]?.credit_total}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 10px",
            marginTop: "10px",
          }}
        >
          <Grid item xs={6}>
            <Typography variant="body1" textAlign="left" sx={bookmanFont}>
              Created By
              <br />
              {voucherData?.[0]?.draftCreatedName?.toUpperCase()}
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant="body1" sx={bookmanFont}>
              Verified By
              <br />
              {voucherData?.[0]?.verifier_name ??
                voucherData?.[0]?.jvVerifier_name}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default JournalVoucherPdf;

const CustomBreadCrumbs = ({ crumbs = [] }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  if (crumbs.length <= 0) return null;

  return (
    <Box className={classes.breadcrumbsContainer}>
      <Breadcrumbs
        style={{ fontSize: "1.15rem" }}
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {crumbs?.map((crumb, index) => {
          return (
            <span key={index}>
              <Typography
                onClick={() => navigate(crumb.link, { state: crumb.state })}
                className={classes.link}
                fontSize="inherit"
              >
                {crumb.name}
              </Typography>
            </span>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};
