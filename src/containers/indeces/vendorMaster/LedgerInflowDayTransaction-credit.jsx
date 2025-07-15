import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
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
import { useLocation, useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";

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

function InflowDayCreditTransaction() {
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
        const baseUrl = '/api/finance/getAllCreditDetailsOfInFlow'
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
            field: "receipt_type",
            headerName: "Type",
            flex: 1,
            hideable: false,
            renderCell: (params) =>
                params.row.receipt_type == "HOS"
                    ? "HOST"
                    : params.row.receipt_type == "General"
                        ? "GEN"
                        : params.row.receipt_type == "Registration Fee"
                            ? "REGT"
                            : params.row.receipt_type == "Bulk Fee"
                                ? "BULK"
                                : params.row.receipt_type == "Exam Fee"
                                    ? "EXAM"
                                    : params.row.receipt_type?.toUpperCase(),
        },
        {
            field: "student_name",
            headerName: "Name",
            flex: 1,
            hideable: false,
            renderCell: (params) => {
                return params.row.student_name && params.row.student_name ? (
                    <HtmlTooltip title={params.row.student_name}>
                        <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            sx={{ fontSize: 13, cursor: "pointer" }}
                        >
                            {params.row.student_name ? params.row.student_name : ""}
                        </Typography>
                    </HtmlTooltip>
                ) : (
                    <HtmlTooltip title={params.row.bulk_user_name}>
                        <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            sx={{ fontSize: 13, cursor: "pointer" }}
                        >
                            {params.row.bulk_user_name ? params.row.bulk_user_name : ""}
                        </Typography>
                    </HtmlTooltip>
                );
            },
            valueGetter: (value, row) =>
                row?.student_name
                    ? row.student_name
                    : row?.bulk_user_name
                        ? row.bulk_user_name
                        : "",
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
            field: "fee_receipt",
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
            align: "center",
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
            align: "center",
        },
        {
            field: "inr_value",
            headerName: "Amount",
            flex: 1,
            hideable: false,
            type: "number",
            valueGetter: (value, row) => {
                return row.inr_value % 1 !== 0
                    ? row.inr_value?.toFixed(2)
                    : row.inr_value;
            },
        },
        { field: "remarks", headerName: "Remarks", flex: 1 },
        { field: "created_username", headerName: "Created By", flex: 1 },
    ];

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
                        getRowId={(row) => row?.fee_receipt}
                    />
                </Box>

            </Box>
        </>
    );
}

export default InflowDayCreditTransaction;

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
