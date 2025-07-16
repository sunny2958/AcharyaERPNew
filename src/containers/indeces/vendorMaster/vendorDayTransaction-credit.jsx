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
// import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
// import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
// import CustomTextField from "../../components/Inputs/CustomTextField";
import { makeStyles } from "@mui/styles";
// const ModalWrapper = lazy(() => import("../../../components/ModalWrapper"));

// const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));


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

function VendorDayCreditTransaction() {
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
  const pathname = location.pathname;
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    getData()
    if(queryValues?.ledgerType === 'ASSETS/ADVANCE' || queryValues?.ledgerType === 'EXPENDITURE'){
      return
    }else{
    setCrumbs([{ name: "" }]);
    if (queryValues?.isBRSTrue) {
      setBreadCrumbs([
        { name: "Bank Balance", link: "/bank-balance" },
        { name: "BRS", link: "/institute-bank-balance", state: { bankGroupId: queryValues?.bankGroupId } },
        { name: "Monthly Transaction", link: "/Accounts-ledger-monthly-detail", state: queryValues },
        { name: 'Daily Summary', link: "/Accounts-ledger-day-transaction", state: queryValues },
        { name: `${queryValues?.voucherHeadName || ""} FY ${queryValues?.fcYear} as on ${moment().format('DD-MMMM-YYYY')}` },
      ]);
    } else {
      setBreadCrumbs([
        { name: "Ledger", link: "/Accounts-ledger", state: queryValues },
        { name: "Monthly Transaction", link: "/Accounts-ledger-monthly-detail", state: queryValues },
        { name: 'Daily Summary', link: "/Accounts-ledger-day-transaction", state: queryValues },
        { name: `${queryValues?.voucherHeadName || ""} FY ${queryValues?.fcYear} as on ${moment().format('DD-MMMM-YYYY')}` },
      ])
    }
  }
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
    const baseUrl = 'api/finance/getAllCreditDetailsOfVendor'
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
      field: "id",
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
      field: pathname === ("/ledger-assets-day-transaction-debit" || "/ledger-expenditure-day-transaction-debit") ? "debit" : "credit",
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
      state: { schoolId, fcYearId, isLedger: true, path:pathname, ...queryValues },
    });
  };

  return (
    <>
      <Box sx={{ position: "relative", width: "100%" }}>
        {(queryValues?.ledgerType === 'ASSETS/ADVANCE' || queryValues?.ledgerType === 'EXPENDITURE') ? (
        <></>
        ):(
           <CustomBreadCrumbs crumbs={breadCrumbs} />
        )}
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

export default VendorDayCreditTransaction;

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
