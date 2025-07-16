import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
    Button,
    Grid,
    IconButton,
    tooltipClasses,
    Tooltip,
    styled,
    Typography,
    Breadcrumbs,
    Box,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: 20,
    },
    th: {
        border: "1px solid black",
        padding: "10px",
        textAlign: "center",
    },
    td: {
        border: "1px solid black",
        padding: "8px",
        textAlign: "center",
    },
    yearTd: {
        border: "1px solid black",
        padding: "8px",
        textAlign: "right",
    },
    cancelled: {
        background: "#ffcdd2 !important",
    },
    breadcrumbsContainer: {
        position: "relative",
        marginBottom: 10,
        width: "fit-content",
        zIndex: theme.zIndex.drawer - 1,
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: "none",
        cursor: "pointer",
        "&:hover": { textDecoration: "underline" },
    },
}));

function LedgerCreditPaymentDetail() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        approved_by: false,
        dept_name: false,
        // created_date: false,
        online: false,
        created_username: false,
        created_name: false
    });

    const { setAlertMessage, setAlertOpen } = useAlert();
    const classes = useStyles();
    const navigate = useNavigate();
    const location = useLocation()
    const pathname = location?.pathname
    const queryValues = location.state;

    useEffect(() => {
        getData();
    }, []);

    const getRowClassName = (params) => {
        if (!params.row.active) {
            return classes.cancelled;
        }
    };

    const getData = async () => {
        setLoading(true);
        const { voucherHeadId, fcYearId, schoolId, month, date, bankId } = queryValues
        let params = {}
        if (queryValues?.ledgerType === "ASSETS/ADVANCE" || queryValues?.ledgerType === "EXPENDITURE") {
            params = {
                ...(voucherHeadId && { voucherHeadNewId: voucherHeadId }),
                ...(fcYearId && { fcYearId }),
                ...(schoolId && { schoolId }),
                ...(date && { date })
            }
        } else {
            params = {
                page: 0,
                page_size: 1000000,
                sort: 'created_date',
                date_range: 'custom',
                start_date: date,
                end_date: date,
                school_id: schoolId,
                bank_id: bankId,
                active: true
            }
        }
        const assetAndExpensitureApi = pathname === "/ledger-assets-day-transaction-debit" ? "api/finance/getAllDebitDetailOfExpenditureOrAssetsDetails" : "/api/finance/getAllCreditDetailOfExpenditureOrAssetsDetails"
        const baseUrl = (queryValues?.ledgerType === 'ASSETS/ADVANCE' || queryValues?.ledgerType === 'EXPENDITURE') ? assetAndExpensitureApi : '/api/finance/fetchAllPaymentVoucher'
        await axios
            .get(baseUrl, { params })
            .then((response) => {
                const filteredData = response?.data?.data?.Paginated_data?.content
                setRows(filteredData || []);
                setLoading(false);
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
            field: "Print",
            headerName: "Print",
            renderCell: (params) =>
                params.row.type === "FUND-TRANSFER" ? (
                    <IconButton
                        color="primary"
                        onClick={() => navigate(`/fund-transfer-pdf/${params.row.id}`, { state: { query: queryValues } })}
                    >
                        <PrintIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                ) : params.row.type === "INTER-COLLEGE" ? (
                    <IconButton
                        color="primary"
                        onClick={() =>
                            navigate(`/contra-voucher-pdf-auto/${params.row.id}`, { state: { query: queryValues } })
                        }
                    >
                        <PrintIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                ) : (
                    <IconButton
                        color="primary"
                        onClick={() => navigate(`/payment-voucher-pdf/${params.row.id}`, { state: { query: queryValues } })}
                    >
                        <PrintIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                ),
        },
        { field: "school_name_short", headerName: "School", flex: 1, align: 'center' },
        { field: "voucher_no", headerName: "Voucher No", flex: 1, align: 'center' },
        { field: "type", headerName: "Type", flex: 1 },
        {
            field: "pay_to",
            headerName: "Pay to",
            flex: 1,
            valueGetter: (row, value) => value.pay_to ?? value.school_name_short,
        },
        {
            field: pathname === "/ledger-assets-day-transaction-debit" ? "debit" : pathname === "/ledger-assets-day-transaction-credit" ? 'credit' :  "debit_total",
            headerName: "Amount",
            flex: 0.8,
            headerAlign: "right",
            align: "right",
        },
        { field: "dept_name", headerName: "Dept", flex: 1, hide: true },
        { field: "created_name", headerName: "Created By", flex: 1 },
        {
            field: "created_date",
            headerName: "Created Date",
            flex: 1,
            valueGetter: (value, row) => moment(value).format("DD-MM-YYYY"),
        },
        { field: "created_username", headerName: "Approved By", flex: 1 },

        {
            field: "online",
            headerName: "Online",
            flex: 1,
            valueGetter: (value, row) => (value == 1 ? "Online" : ""),
        },
        { field: "remarks", headerName: "Remarks", flex: 1 },
    ];

    return (
        <>
            <Box sx={{ position: "relative", width: "100%" }}>
                <Box sx={{ position: "absolute", width: "100%", marginTop: "10px" }}>
                    <GridIndex
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        columnVisibilityModel={columnVisibilityModel}
                        setColumnVisibilityModel={setColumnVisibilityModel}
                        getRowClassName={getRowClassName}
                    />
                </Box>
            </Box>
        </>
    );
}

export default LedgerCreditPaymentDetail;
