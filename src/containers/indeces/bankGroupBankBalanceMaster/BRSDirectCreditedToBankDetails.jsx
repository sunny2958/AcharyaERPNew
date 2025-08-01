import { useState, useEffect } from "react";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
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

function BRSDirectCreditedToBankDetail() {
    const [directCreditsData, setDirectCreditsData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [breadCrumbs, setBreadCrumbs] = useState([])
    const navigate = useNavigate();
    const location = useLocation()
    const queryValues = location?.state
    const bankGroupId = location?.state?.id
    const setCrumbs = useBreadcrumbs();
    const roleShortName = JSON.parse(
        sessionStorage.getItem("AcharyaErpUser")
    )?.roleShortName;

    useEffect(() => {
        setBreadCrumbs([
            { name: "Bank Balance", link: "/bank-balance" },
            { name: "BRS", link: "/institute-bank-balance", state: { id: queryValues?.id } },
            { name: "BRS Transactions", link:"/institute-brs-transaction", state:queryValues },
            { name: "Direct Electronic Credits"},
        ]);
        setCrumbs([]);
        getDirectCreditToBankData();
    }, []);

    const columns = [
        { field: "transaction_date", headerName: "TRN Date", flex: 1, headerClassName: "header-bg", headerAlign: 'center', align: 'center',
            renderCell : (params) => {
                return parseDate(params?.row?.transaction_date)
            }
        },
        { field: "cheque_dd_no", headerName: "TRN No", flex: 1, headerClassName: "header-bg", headerAlign: 'center', align: 'left' },
        { field: "order_id", headerName: "Order Id", flex: 1, headerClassName: "header-bg", align: 'left', headerAlign: 'center' },
        { field: "auid", headerName: "AUID", flex: 1, headerClassName: "header-bg", align: 'center', headerAlign: 'center' },
        {
            field: "amount", headerName: "Pending", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center',
            valueGetter: (value,row) => row.amount == row.balance ? row.amount : ""
        },
        {
            field: "balance", headerName: "Partial Pending", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center',
            valueGetter: (value,row) => row.amount != row.balance ? row.balance : ""
        }
    ];

     const getDirectCreditToBankData = async () => {
        const { schoolId, bankId } = queryValues
        await axios
            .get(`/api/student/getAllBankImportPendingTransaction?schoolId=${schoolId}&bankId=${bankId}`)
            .then((res) => {
                const {bankImportTransactions } = res?.data?.data
                setDirectCreditsData(bankImportTransactions || [])
            })
            .catch((err) => console.error(err));
    };
    const parseDate = (raw) => {
            if (!raw) return '';
            const f1 = moment(raw, 'YYYY-MM-DD HH:mm:ss.SSS', true);
            if (f1.isValid()) return f1.format('DD-MM-YYYY HH:mm:ss');
    
            const f2 = moment(raw, 'DD/MM/YYYY', true);
            if (f2.isValid()) return f2.format('DD-MM-YYYY');
    
            const f3 = moment(raw);
            return f3.isValid() ? f3.format('DD-MM-YYYY') : '';
        };
    

    return (

        <Box sx={{ position: "relative", width: "100%" }}>
             <CustomBreadCrumbs crumbs={breadCrumbs} />
            <Box sx={{
                width: "70%",
                margin: "20px auto",
                '& .header-bg': {
                    fontWeight: "bold",
                    backgroundColor: "#376a7d !important",
                    color: "#fff"
                },
            }}>
                <GridIndex
                    rows={directCreditsData}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row?.bank_import_transaction_id}
                />
            </Box>
        </Box>
    );
}
export default BRSDirectCreditedToBankDetail;

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