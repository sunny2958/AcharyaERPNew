import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Button,
  Grid,
  Box,
  IconButton,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
  Breadcrumbs,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";
import { useLocation, useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  cancelled: {
    background: "#ffcdd2 !important",
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": { textDecoration: "none" },
  },
  breadcrumbsContainer: {
    position: "relative",
    marginBottom: 10,
    width: "fit-content",
    zIndex: theme.zIndex.drawer - 1,
  }
}));

function AssetsAndExpenditurePaymentVoucher() {
  const [rows, setRows] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    dept_name: false,
    school_name_short: false,
    created_username: false,
    verifierName: false
  });

  const [loading, setLoading] = useState(false);
  const [breadCrumbs, setBreadCrumbs] = useState([])
  const setCrumbs = useBreadcrumbs();
  const location = useLocation()
  const queryValues = location.state;
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    // setCrumbs([{ name: "" }]);
    // if (queryValues?.isBRSTrue) {
    //   setBreadCrumbs([
    //     { name: "Bank Balance", link: "/bank-balance" },
    //     { name: "BRS", link: "/institute-bank-balance", state: { bankGroupId: queryValues?.bankGroupId } },
    //     { name: "Monthly Transaction", link: "/Accounts-ledger-monthly-detail", state: queryValues },
    //     { name: 'Daily Summary', link: "/Accounts-ledger-day-transaction", state: queryValues },
    //     { name: `${queryValues?.voucherHeadName || ""} FY ${queryValues?.fcYear} as on ${moment().format('DD-MMMM-YYYY')}` },
    //   ]);
    // } else {
    //   setBreadCrumbs([
    //     { name: "Ledger", link: "/Accounts-ledger", state: queryValues },
    //     { name: "Monthly Transaction", link: "/Accounts-ledger-monthly-detail", state: queryValues },
    //     { name: 'Daily Summary', link: "/Accounts-ledger-day-transaction", state: queryValues },
    //     { name: `${queryValues?.voucherHeadName || ""} FY ${queryValues?.fcYear} as on ${moment().format('DD-MMMM-YYYY')}` },
    //   ])
    // }
    getData()
  }, []);


  const getData = async () => {
    setLoading(true);
    const { voucherHeadId, fcYearId, schoolId, month, date } = queryValues
    const params = {
      ...(voucherHeadId && { voucherHeadNewId: voucherHeadId }),
      ...(fcYearId && { fcYearId }),
      ...(schoolId && { schoolId }),
      ...(date && { date })
    }
   // const baseUrl = '/api/finance/getAllExpenditureOrAssetsDetails'
   const baseUrl = '/api/finance/getAllDebitDetailOfExpenditureOrAssetsDetails'
    await axios
      .get(baseUrl, { params })
      .then((response) => {
        setLoading(false);
        setRows(response?.data?.data);
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: "Something went wrong.",
        });
        setAlertOpen(true);
        console.error(err);
      });
  };

  const getRowClassName = (params) => {
    if (!params.row.active) {
      return classes.cancelled;
    }
  };

  const columns = [
    {
      // field: "id",
      field: "journal_voucher_id",
      headerName: "JV",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            handleGeneratePdf(
              params.row.journal_voucher_number,
              params.row.school_id,
              params.row.financial_year_id
            )
          }
        >
          <PrintIcon color="primary" sx={{ fontSize: 17 }} />
        </IconButton>
      ),
    },

    { field: "journal_voucher_number", headerName: "JV No.", flex: 1, align: "center" },
    {
      field: "created_date",
      headerName: "Date",
      flex: 1,
      valueGetter: (value, row) => moment(value).format("DD-MM-YYYY"),
      align: "center"
    },
    { field: "school_name_short", headerName: "School", flex: 1, align: "center" },
    { field: "dept_name", headerName: "Dept", flex: 1 },
    {
      field: "credit",
      headerName: "Amount",
      flex: 0.8,
      headerAlign: "right",
      align: "right",
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "verifierName",
      headerName: "Verified By",
      flex: 1,
      valueGetter: (value, row) => row.verifierName ?? row.jvVerifier_name,
    },
    { field: "pay_to", headerName: "Vendor", flex: 1 },
  ];

  const handleGeneratePdf = async (
    journalVoucherNumber,
    schoolId,
    fcYearId
  ) => {
    navigate(`/generate-journalvoucher-pdf/${journalVoucherNumber}`, {
      state: { schoolId, fcYearId, isLedger: true, ...queryValues },
    });
  };

  return (
    <>
      <Box sx={{ position: "relative", width: "100%" }}>
        <CustomBreadCrumbs crumbs={breadCrumbs} />
        <Box sx={{ position: "absolute", width: "100%", marginTop: "10px" }}>
          <GridIndex
            rows={rows}
            columns={columns}
            loading={loading}
            columnVisibilityModel={columnVisibilityModel}
            setColumnVisibilityModel={setColumnVisibilityModel}
            getRowClassName={getRowClassName}
            getRowId={(row) => row?.journal_voucher_id}
          />
        </Box>

      </Box>
    </>
  );
}

export default AssetsAndExpenditurePaymentVoucher;

const CustomBreadCrumbs = ({ crumbs = [] }) => {
  const navigate = useNavigate()
  const classes = useStyles()
  if (crumbs.length <= 0) return null

  return (
    <Box className={classes.breadcrumbsContainer}>
      <Breadcrumbs
        style={{ fontSize: "1.15rem" }}
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {crumbs?.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <span key={index}>
              {!isLast ? (
                <Typography
                  onClick={() => navigate(crumb.link, { state: crumb.state })}
                  className={classes.link}
                  fontSize="inherit"
                >
                  {crumb.name}
                </Typography>
              ) : (
                <Typography color="text.primary" fontSize="inherit">
                  {crumb.name}
                </Typography>
              )}
            </span>
          );
        })}
      </Breadcrumbs>
    </Box>
  )
}
