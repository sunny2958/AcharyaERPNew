import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  styled,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  tableCellClasses,
  tooltipClasses,
  Typography,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import axios from "../../../services/Api";
import moment from "moment";
import { MONTH_LIST_OPTION } from "../../../services/Constants";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import ModalWrapper from "../../../components/ModalWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import OverlayLoader from "../../../components/OverlayLoader";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomSelect from "../../../components/Inputs/CustomSelect";

const initialValues = {
  fcYearId: null,
  monthId: null,
  date: "",
};

function StudentUniformTransactionIndex() {
  const [rows, setRows] = useState([]);
  const [brsTransactionData, setBrsTransactionDate] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [showBrsModel, setShowBrsModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedValues, setUpdatedValues] = useState({});
  const [showUpdateBankAmountModel, setShowUpdateBankAmountModel] =
    useState(false);
  const [refetchDate, setRefetchDate] = useState();
  const [type, setType] = useState("");
  const [isRefetchModelOpen, setIsRefetchModelOpen] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getAcademicYears();
    const currentMonthNumber = moment().month() + 1;
    setValues((prev) => ({
      ...prev,
      monthId: currentMonthNumber,
    }));
    setCrumbs([{ name: "Uniform Transactions" }]);
  }, []);

  useEffect(() => {
    if (values.fcYearId && values.monthId) getData();
  }, [values.fcYearId, values.monthId]);

  const getData = async () => {
    // const { fcYearId, monthId } = values
    const { fcYearId } = values;

    const baseUrl = "/api/finance/getUniformTransactions";
    let params = {
      ...(fcYearId && { fcYearId }),
      // ...(monthId && { month: monthId }),
    };
    setLoading(true);
    await axios
      .get(baseUrl, { params })
      .then((res) => {
        setRows(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setAlertMessage({
          severity: "error",
          message:
            err.response?.data?.message ||
            "Failed to fetch the uniform transaction data.",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  const getBRSData = async (date) => {
    await axios
      .get(`/api/finance/getDateWiseUniformTransactions?date=${date}`)
      .then((res) => {
        setBrsTransactionDate(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        setAlertMessage({
          severity: "error",
          message: err.response?.data?.message || "Failed to fetch the data.",
        });
        setAlertOpen(true);
      });
  };

  const getAcademicYears = async () => {
    try {
      const response = await axios.get("/api/FinancialYear");
      const { data } = response?.data;
      const optionData =
        data?.length > 0 &&
        data?.map((obj, index) => {
          return { value: obj.financial_year_id, label: obj.financial_year };
        });
      const currentYearId = optionData[optionData?.length - 1]?.value;
      setAcademicYearOptions(optionData || []);
      setValues((prev) => ({
        ...prev,
        fcYearId: currentYearId,
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the academic years !!",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCellClick = (param, headerName) => {
    if (headerName === "Amount") {
      getBRSData(param?.row?.transactionDate);
      setShowBrsModel(true);
    } else {
      setUpdatedValues({
        bankAmount: param?.row?.bankAmount,
        adjustment: param?.row?.adjustment,
        date: param?.row?.transactionDate,
      });
      setShowUpdateBankAmountModel(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setUpdatedValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleType = (e) => {
    setType(e.target.value);
  };

  const handleSubmit = async () => {
    const { bankAmount, adjustment, date } = updatedValues;
    const transactionDate = moment(date).format("YYYY-MM-DD");
    await axios
      .post(
        `/api/finance/save?bankAmount=${bankAmount}&adjustmentAmount=${adjustment}&transactionDate=${transactionDate}`
      )
      .then((res) => {
        setShowUpdateBankAmountModel(false);
        getData();
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "Error Occured",
        });
        setAlertOpen(true);
        setShowUpdateBankAmountModel(false);
      });
  };

  const handleRefetch = async () => {
    setIsRefetchModelOpen(true);
  };

  const handleRefetchSubmit = () => {
    const formatedDate = moment(refetchDate).format("YYYY-MM-DD");

    let url;

    if (type === "package") {
      url = `https://www.maruthiassociates.in/index.php?r=acerp-api/fetch-receipts-java&datee=${formatedDate}&type=package`;
    } else {
      url = `https://www.maruthiassociates.in/index.php?r=acerp-api/fetch-receipts-java&datee=${formatedDate}`;
    }

    window.open(`${url}`, "_blank", "noopener,noreferrer");
    setRefetchDate("");
    setType("");
    setIsRefetchModelOpen(false);
  };

  const handleRefetchInputChange = (name, newValue) => {
    setRefetchDate(newValue);
  };

  const columns = [
    {
      field: "transactionDate",
      headerName: "Date",
      flex: 1,
      valueGetter: (value, row) =>
        row?.transactionDate
          ? moment(row?.transactionDate).format("DD/MM/YYYY")
          : "",
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      headerAlign: "center",
      cellClassName: "rightAlignedCell",
      renderCell: (params) => (
        <Typography
          onClick={() => handleCellClick(params, "Amount")}
          sx={{
            color: "primary.main",
            textDecoration: "none",
            cursor: "pointer",
            textAlign: "right",
            width: "100%",
            border: "none",
          }}
          variant="body2"
        >
          {params?.row?.amount}
        </Typography>
      ),
    },
    {
      field: "bankAmount",
      headerName: "Bank Amount",
      flex: 1,
      headerAlign: "center",
      cellClassName: "rightAlignedCell",
      renderCell: (params) => (
        <Typography
          onClick={() => handleCellClick(params, "BankAmount")}
          sx={{
            color: "primary.main",
            textDecoration: "none",
            cursor: "pointer",
            textAlign: "right",
            width: "100%",
            border: "none",
          }}
          variant="body2"
        >
          {params?.row?.bankAmount}
        </Typography>
      ),
    },
    {
      field: "adjustment",
      headerName: "Adjustment",
      flex: 1,
      cellClassName: "rightAlignedCell",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          onClick={() => handleCellClick(params, "Adjustment")}
          sx={{
            color: "primary.main",
            textDecoration: "none",
            cursor: "pointer",
            textAlign: "right",
            width: "100%",
            border: "none",
          }}
          variant="body2"
        >
          {params?.row?.adjustment}
        </Typography>
      ),
    },
    {
      field: "balance",
      headerName: "Balance",
      flex: 1,
      cellClassName: "rightAlignedCell",
      headerAlign: "center",
    },
  ];

  const modalData = () => {
    return (
      <>
        {loading ? (
          <Grid item xs={12} align="center">
            <OverlayLoader />
          </Grid>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "70vh", overflow: "auto" }}
          >
            <Table
              stickyHeader
              aria-label="transaction table"
              sx={{
                borderCollapse: "collapse",
                "& th, & td": {
                  border: "1px solid #e0e0e0",
                  padding: "8px 12px",
                  textAlign: "left",
                },
                "& th": {
                  backgroundColor: "#182778",
                  color: "white",
                  fontWeight: "bold",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>AUID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>RPT</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Receipt Date
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", textAlign: "center !important" }}
                  >
                    Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>OrderID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>RazorPayID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brsTransactionData?.map((transaction, i) => (
                  <TableRow
                    key={i}
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: "#fafafa",
                      },
                    }}
                  >
                    <TableCell>{transaction.studentName}</TableCell>
                    <TableCell>{transaction.auid}</TableCell>
                    <TableCell>{transaction.RPTNo}</TableCell>
                    <TableCell>{transaction.receiptDate}</TableCell>
                    <TableCell sx={{ textAlign: "right !important" }}>
                      {transaction.amount}
                    </TableCell>
                    <TableCell>{transaction.orderId}</TableCell>
                    <TableCell>{transaction.razorPayId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}{" "}
      </>
    );
  };

  const BankAmountUpdateData = () => {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={3}
        sx={{ px: 2, py: 1 }}
      >
        <Grid item>
          <Typography variant="body2" fontSize={14}>
            <strong>Date</strong>
            {`: ${moment(updatedValues?.date).format("DD-MM-YYYY")}`}
          </Typography>
        </Grid>
        <Grid item sx={{ width: "100%" }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <CustomTextField
                name="bankAmount"
                label="Bank Amount"
                value={updatedValues.bankAmount}
                handleChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                name="adjustment"
                label="Adjustment"
                value={updatedValues.adjustment}
                handleChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 7, px: 4 }}
            disabled={
              updatedValues?.adjustment === null &&
              updatedValues?.bankAmount === null
            }
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Grid>
      </Grid>
    );
  };

  const RefetchUniformTransaction = () => {
    return (
      <Grid container direction="column" spacing={3} sx={{ p: 1 }}>
        <Grid item sx={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={10}>
              <CustomSelect
                name="type"
                label="Type"
                value={type || ""}
                items={[
                  { label: "Package", value: "package" },
                  { label: "Loose", value: "loose" },
                ]}
                handleChange={handleType}
              />
            </Grid>

            <Grid item xs={12} sm={10}>
              <CustomDatePicker
                name="refetchDate"
                label="Transaction Date"
                value={refetchDate || ""}
                handleChangeAdvance={handleRefetchInputChange}
                maxDate={new Date()}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: 1, px: 2 }}
              disabled={!refetchDate}
              onClick={handleRefetchSubmit}
            >
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ position: "relative" }}>
      <ModalWrapper
        open={showBrsModel}
        setOpen={setShowBrsModel}
        maxWidth={980}
        title={
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "1.3rem",
              color: "primary.main",
            }}
          >
            BRS Transaction
          </Box>
        }
      >
        {modalData()}
      </ModalWrapper>
      <ModalWrapper
        open={showUpdateBankAmountModel}
        setOpen={setShowUpdateBankAmountModel}
        maxWidth={600}
        title={
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "1.3rem",
              color: "primary.main",
              paddingBottom: 1,
            }}
          >
            <Typography variant="h6" mb={1}>
              Update Bank Amount
            </Typography>
            <Divider />
          </Box>
        }
      >
        {BankAmountUpdateData()}
      </ModalWrapper>
      <ModalWrapper
        open={isRefetchModelOpen}
        setOpen={setIsRefetchModelOpen}
        maxWidth={400}
        title={
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "1.3rem",
              color: "primary.main",
              paddingBottom: 1,
            }}
          >
            <Typography variant="h6" mb={1}>
              Refetch Uniform Transaction
            </Typography>
            <Divider />
          </Box>
        }
      >
        {RefetchUniformTransaction()}
      </ModalWrapper>
      <Box>
        <Grid
          container
          alignItems="center"
          gap={4}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Grid item xs={8} md={2.4}>
            <CustomAutocomplete
              label="Financial Year"
              name="fcYearId"
              options={academicYearOptions}
              value={values?.fcYearId}
              handleChangeAdvance={handleChangeAdvance}
              required={true}
            />
          </Grid>
          <Grid item xs={8} md={0.8}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={handleRefetch}
              sx={{ height: "38px" }}
            >
              Refetch
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box mt={2}>
        <GridIndex
          rows={rows}
          columns={columns}
          getRowId={(row, index) => row.transactionDate || `row-${index}`}
          loading={loading}
        />
      </Box>
    </Box>
  );
}
export default StudentUniformTransactionIndex;
