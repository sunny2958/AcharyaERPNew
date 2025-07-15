import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
    IconButton,
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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

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
        "&:hover": { textDecoration: "none" },
    },
    breadcrumbsContainer: {
        position: "relative",
        marginBottom: 10,
        width: "fit-content",
        zIndex: theme.zIndex.drawer - 1,
    }
}));

function VendorDayDebitTransaction() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        approved_by: false,
        dept_name: false,
        // created_date: false,
        shool_short_name: false,
        online: false,
        created_username: false,
        created_name: false
    });
    const [breadCrumbs, setBreadCrumbs] = useState([])
    const setCrumbs = useBreadcrumbs();
    const { setAlertMessage, setAlertOpen } = useAlert();
    const classes = useStyles();
    const navigate = useNavigate();
    const location = useLocation()
    const queryValues = location.state;

    const maxLength = 200;

    useEffect(() => {
        getData();
        if (queryValues?.ledgerType === 'ASSETS/ADVANCE' || queryValues?.ledgerType === 'EXPENDITURE') {
            return
        } else {
            setCrumbs([])
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

    const getRowClassName = (params) => {
        if (!params.row.active) {
            return classes.cancelled;
        }
    };

    const getData = async () => {
        setLoading(true);
        const { voucherHeadId, fcYearId, schoolId, month, date } = queryValues
        const params = {
            ...(voucherHeadId && { voucherHeadNewId: voucherHeadId }),
            ...(fcYearId && { fcYearId }),
            ...(schoolId && { schoolId }),
            ...(date && { date })
        }
        const baseUrl = '/api/finance/getAllDebitDetailsOfVendor'
        await axios
            .get(baseUrl, { params })
            .then((response) => {
                const filteredData = response?.data?.data
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
                <IconButton
                    color="primary"
                    onClick={() => navigate(`/payment-voucher-pdf/${params?.row?.payment_voucher_id}`, { state: { query: queryValues } })}
                >
                    <PrintIcon sx={{ fontSize: 17 }} />
                </IconButton>
        },
        { field: "shool_short_name", headerName: "School", flex: 1, align: 'center' },
        { field: "voucher_no", headerName: "Voucher No", flex: 1, align: 'center' },
        { field: "type", headerName: "Type", flex: 1 },
        {
            field: "credit",
            headerName: "Amount",
            flex: 0.8,
            headerAlign: "right",
            align: "right",
        },
        { field: "remarks", headerName: "Remarks", flex: 1 },
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
        {
            field: "pay_to",
            headerName: "Pay to",
            flex: 1,
            valueGetter: (row, value) => value.pay_to ?? value.school_name_short,
        },
    ];

    return (
        <>
            <Box sx={{ position: "relative", width: "100%" }}>
                {(queryValues?.ledgerType === 'ASSETS/ADVANCE' || queryValues?.ledgerType === 'EXPENDITURE') ? (
                    <></>
                ) : (
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
                        getRowId={(row, index) => row?.payment_voucher_id}
                    />
                </Box>
            </Box>
        </>
    );
}

export default VendorDayDebitTransaction;

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
