import { useState, useEffect, lazy } from "react";
import GridIndex from "../../../components/GridIndex.jsx";
import {
  Box,
  Typography,
  Grid,
  styled,
  Tooltip,
  tooltipClasses,
  Breadcrumbs,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "../../../services/Api.js";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs.js";
import useAlert from "../../../hooks/useAlert.js";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "#5A5A5A",
    maxWidth: 270,
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
  },
}));

const useStyles = makeStyles((theme) => ({
  inactiveRow: {
    background: "#fdecea !important",
  },
}));

function AssetsAndExpenditureReceiptDetail() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    fee_template_name: false,
    created_username: false,
    cheque_dd_no: false,
    school_name_short: false,
    bank_name: false,
    created_date: false
  });
  const { setAlertMessage, setAlertOpen } = useAlert();
  const location = useLocation();
  const queryValues = location.state;
  const classes = useStyles();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const { voucherHeadId, fcYearId, date, schoolId } =
      queryValues;
     const params = {
            ...(voucherHeadId && { voucherHeadNewId: voucherHeadId }),
            ...(date && { date }),
            ...(fcYearId && { fcYearId }),
            ...(schoolId && { schoolId })
        }
    const baseUrl = "api/finance/getBulkReceiptForExpenditureOrAssetsDetails";
    await axios
      .get(baseUrl, { params })
      .then((res) => {
        setLoading(false);
        setRows(res?.data?.data);
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

  const columns = [
    {
      field: "receipt_type",
      headerName: "Type",
      flex: 1,
      hideable: false,
      renderCell: (params) => "BULK"},
    {
      field: "from_name",
      headerName: "Name",
      flex: 1,
      hideable: false
    },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      // hideable: false,
      valueGetter: (value, row) =>
        row.school_name_short ? row.school_name_short : "",
    },
    {
      field: "bulk_fee_receipt",
      headerName: "Receipt No",
      flex: 1,
      hideable: false,
      align: "center",
    },
    {
      field: "created_date",
      headerName: "Receipt Date",
      flex: 1,
      valueGetter: (row, value) => moment(row).format("DD-MM-YYYY"),
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
      hideable: false,
      align: "center",
      valueGetter: (value, row) => (row.auid ? row.auid : ""),
    },
    {
      field: "fee_template_name",
      headerName: "Template",
      flex: 1,
      valueGetter: (value, row) =>
        row.fee_template_name ? row.fee_template_name : "",
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      hideable: false,
      type: "number",
      valueGetter: (value, row) => {
        return row?.amount !== 0
          ? row.amount?.toFixed(2)
          : "";
      },
    },
    {
      field: "bank_short_name",
      headerName: "Bank",
      flex: 1,

      valueGetter: (value, row) =>
        row.transaction_type?.toLowerCase() == "cash"
          ? `Cash-${row.inter_school_short_name}`
          : row.bank_short_name
          ? `${row.bank_short_name}-${row.inter_school_short_name}`
          : null,
    },
     { field: "remarks", headerName: "Remarks", flex: 1 },

    {
      field: "cheque_dd_no",
      headerName: "Transaction Ref",
      flex: 1,
      // hideable: false,
      valueGetter: (value, row) =>
        row?.cheque_dd_no || row?.dd_number || row?.dd_bank_name
          ? row?.cheque_dd_no || row?.dd_number + "_" + row?.dd_bank_name
          : "",
    },
    {
      field: "transaction_no",
      headerName: "Trn No",
      flex: 1,
      valueGetter: (value, row) =>
        row?.transaction_no
          ? row.transaction_no
          : row?.dd_number
          ? row.dd_number
          : "",
    },
    {
      field: "transaction_date",
      headerName: "Trn Date",
      flex: 1,
      align: "center",
      valueGetter: (value, row) =>
        row?.transaction_date
          ? row.transaction_date
          : row?.dd_date
          ? moment(row.dd_date).format("DD-MM-YYYY")
          : null,
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
  ];
  
  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ position: "absolute", width: "100%", marginTop: "10px" }}>
        <GridIndex
          rows={rows}
          columns={columns}
          loading={loading}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel}
          getRowId={(row, index) => row?.bulk_fee_receipt_id}
          getRowClassName={(params) => {
            return params.row.active === false ? `${classes.inactiveRow}` : "";
          }}
        />
      </Box>
    </Box>
  );
}

export default AssetsAndExpenditureReceiptDetail;
