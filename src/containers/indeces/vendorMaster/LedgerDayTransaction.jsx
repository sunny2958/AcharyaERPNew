import React, { useEffect, useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TableFooter,
    Box,
    Button,
    Breadcrumbs,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../../services/Api';
import useBreadcrumbs from '../../../hooks/useBreadcrumbs';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MONTH_LIST_OPTION } from '../../../services/Constants';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";
import moment from 'moment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PrintIcon from '@mui/icons-material/Print';
import LedgerDayTransactionPdf from './LedgerDayTransactionPdf';
import { BlobProvider } from '@react-pdf/renderer';
import useAlert from '../../../hooks/useAlert';



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
        "&:hover": { textDecoration: "none" },
    },
}));


const LedgerDayTransaction = () => {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [breadCrumbs, setBreadCrumbs] = useState()
    const location = useLocation()
    const queryValues = location.state;
    const setCrumbs = useBreadcrumbs();
    const navigate = useNavigate();
    const [currMonth, setCurrMonth] = useState({
        month: queryValues?.month,
        month_name: queryValues?.month_name
    })
    const { setAlertMessage, setAlertOpen } = useAlert();

    useEffect(() => {
        if (currMonth?.month) {
            getData()
            if (queryValues?.isBRSTrue) {
                setBreadCrumbs([
                    { name: "Bank Balance", link: "/bank-balance" },
                    { name: "BRS", link: "/institute-bank-balance", state: { bankGroupId: queryValues?.bankGroupId } },
                    { name: "Monthly Transaction", link: "/Accounts-ledger-monthly-detail", state: queryValues },
                    { name: 'Daily Summary' }
                ]);
            } else {
                setBreadCrumbs([
                    { name: "Ledger", link: "/Accounts-ledger", state: queryValues },
                    { name: "Monthly Transaction", link: "/Accounts-ledger-monthly-detail", state: queryValues },
                    { name: 'Daily Summary' }
                ])
            }
            setCrumbs([])
        }
    }, [currMonth?.month])

    const getData = async () => {
        const { voucherHeadId, fcYearId, schoolId } = queryValues
        const baseUrl = "/api/finance/getMonthlyLedger"
        const params = {
            ...(voucherHeadId && { voucherHeadNewId: voucherHeadId }),
            ...(currMonth?.month && { month: currMonth?.month }),
            ...(fcYearId && { fcYearId }),
            ...(schoolId && { schoolId })
        }
        setLoading(true)
        await axios
            .get(baseUrl, { params })
            .then((res) => {
                const { data } = res?.data
                const rowData = []
                let runningBalance = data?.openingBalance || 0;
                data?.vendorDetails?.length > 0 && data?.vendorDetails?.forEach(el => {
                    const balance = getClosingBalance(queryValues?.ledgerType, el?.debit, el?.credit)
                   // runningBalance += (el?.debit || 0) - (el?.credit || 0);
                   runningBalance += balance 
                    rowData.push({
                        credit: el?.credit,
                        debit: el?.debit,
                        month: el?.month,
                        month_name: el?.month_name,
                        created_date: el?.created_date,
                        // cumulativeBalance: runningBalance < 0 ? `${Math.abs(runningBalance.toFixed(2))} Cr` : runningBalance === 0 ? 0 : `${runningBalance.toFixed(2)} Dr`
                        cumulativeBalance: formatDrCr(runningBalance, queryValues?.ledgerType),
                    })
                });
                const totalCumulativeBalance = Number(data?.openingBalance) + Number(data?.totalCredit) - Number(data?.totalDebit)
                setRows({
                    vendorDetails: rowData,
                    totalCredit: data?.totalCredit,
                    totalDebit: data?.totalDebit,
                    openingBalance: formatDrCr(data?.openingBalance, queryValues?.ledgerType),
                    schoolName: data?.schoolName
                });
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                setAlertMessage({
                    severity: "error",
                    message: "Something went wrong.",
                });
                setAlertOpen(true);
                console.error(err)
            });
    };

    const handlePreviousMonthOB = (month) => {
        const currMonthInd = MONTH_LIST_OPTION?.findIndex((mth) => mth?.value === month)
        if (currMonthInd + 1 > MONTH_LIST_OPTION[0]?.value) {
            const prevMonth = MONTH_LIST_OPTION[currMonthInd - 1];
            setCurrMonth((prev) => ({
                ...prev,
                ['month']: prevMonth?.value,
                ['month_name']: prevMonth?.label
            }));
        }
    }

    const handleNextMonthOB = (month) => {
        const currMonthInd = MONTH_LIST_OPTION?.findIndex((mth) => mth.value === month)
        if (currMonthInd < (MONTH_LIST_OPTION?.length - 1)) {
            const nextMonthInd = MONTH_LIST_OPTION[currMonthInd + 1];
            setCurrMonth((prev) => ({
                ...prev,
                ['month']: nextMonthInd?.value,
                ['month_name']: nextMonthInd?.label
            }));
        }
    };

    const handleCellClick = (row, type) => {
        const selectedDate = moment(row?.created_date).format("DD-MM-YYYY")
        const queryParams = { ...queryValues, date: row?.created_date, month: currMonth?.month, month_name: currMonth?.month_name, selectedDate }
        if (queryValues?.ledgerType === "VENDOR") {
            if (type === 'debit') {
                navigate('/vendor-day-transaction-debit', { state: queryParams })
            } else {
                navigate('/vendor-day-transaction-credit', { state: queryParams })
            }
        } else if (queryValues?.ledgerType === 'INFLOW') {
            if (type === 'credit') {
                navigate('/ledger-inflow-day-transaction-credit', { state: queryParams })
            }
        }else if (queryValues?.ledgerType === 'EXPENDITURE'){
             if (type === 'credit') {
                navigate('/ledger-expenses-day-transaction-credit', { state: queryParams })
            }
        }
        else if (queryValues?.ledgerType === 'ASSETS'){
             if (type === 'credit') {
                navigate('/ledger-assets-day-transaction-credit', { state: queryParams })
            }
        }
        else {
            if (type === 'debit') {
                navigate('/Accounts-ledger-day-transaction-debit', { state: queryParams })
            } else {
                navigate('/Accounts-ledger-day-credit-transaction', { state: queryParams })
            }
        }
    }

    const formatCurrency = (value, decimals = 2) => {
        if (value === null || value === undefined || value === '') return `0.00`;
        if (typeof value === 'string' && (value.includes('Cr') || value.includes('Dr'))) {
            const parts = value.split(' ');
            const numValue = parseFloat(parts[0]);
            const suffix = parts[1] || '';

            if (isNaN(numValue)) return `0.00`;

            return `${numValue.toLocaleString('en-IN', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            })} ${suffix}`;
        }

        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numValue)) return `0.00`;

        return numValue.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    };

    const formatDrCr = (value, ledgerType) => {
        const absVal = Math.abs(value);

        if (value === 0) return "0.00";

        if (ledgerType === "VENDOR" || ledgerType === "INFLOW") {
            return value < 0 ? `${absVal} Dr` : `${absVal} Cr`;
        } else if (ledgerType === "CASHORBANK" || ledgerType === "ASSETS" || ledgerType === "EXPENDITURE") {
            return value > 0 ? `${(absVal)} Dr` : `${(absVal)} Cr`;
        } else {
            return value;
        }
    };

    const getClosingBalance = (ledgerType, debit, credit) => {
        switch (ledgerType) {
            case 'CASHORBANK':
                return (debit || 0) - (credit || 0);
                break;
            case 'VENDOR':
            case 'INFLOW':
            case 'EXPENDITURE':
            case 'ASSETS':   
                return (credit || 0) - (debit || 0);
                break;
            default:
                return (debit || 0) - (credit || 0);
        }
    }

    return (
        <Paper elevation={0} sx={{
            p: 0,
            width: '100%',
            borderRadius: 2,
            backgroundColor: 'background.paper',
            //   boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 0
        }}>
            <Box sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                flexWrap: 'wrap',
                gap: 2,
                // borderBottom: '1px solid',
                // borderColor: 'divider'
            }}>
                <CustomBreadCrumbs crumbs={breadCrumbs} />

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexWrap: 'wrap'
                }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => handlePreviousMonthOB(currMonth?.month)}
                        sx={{
                            backgroundColor: 'background.default',
                            '&:hover': { backgroundColor: 'action.hover' },
                            fontWeight: 500,
                            color: 'text.primary',
                            minWidth: 100,
                            borderColor: 'divider'
                        }}
                        disabled={currMonth?.month === MONTH_LIST_OPTION[0]?.value}
                    >
                        Prev
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => handleNextMonthOB(currMonth?.month)}
                        sx={{
                            fontWeight: 500,
                            minWidth: 100,
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': { boxShadow: 'none' }
                        }}
                        disabled={currMonth?.month === MONTH_LIST_OPTION[MONTH_LIST_OPTION?.length - 1]?.value}
                    >
                        Next
                    </Button>
                    <BlobProvider
                        document={
                            <LedgerDayTransactionPdf
                                rows={rows}
                                queryValues={queryValues}
                                currMonth={currMonth}
                            />
                        }
                    >
                        {({ url, loading }) => (
                            <Button
                                variant="contained"
                                onClick={() => url && window.open(url, '_blank')}
                                disabled={loading}
                                startIcon={<PrintIcon />}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: 1,
                                    boxShadow: 'none'
                                }}
                            >
                                Print
                            </Button>
                        )}
                    </BlobProvider>
                </Box>
            </Box>

            <Box sx={{
                p: 2,
                backgroundColor: '#376a7d',
                color: 'white',
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                width: '70%',
                margin: "auto"
            }}>
                <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>
                    {rows?.schoolName}
                </Typography>
                <Typography variant="subtitle1" sx={{ textAlign: 'center', mt: 0.5 }}>
                    {`${queryValues?.voucherHeadName} Ledger for FY ${queryValues?.fcYear}`}
                </Typography>
                <Typography variant="body1" sx={{
                    textAlign: 'center',
                    opacity: 0.9,
                    mt: 0.5,
                    fontSize: '0.875rem'
                }}>
                    {`As on ${moment().format('DD-MM-YYYY')}`}
                </Typography>
            </Box>

            <Box sx={{
                // width: '100%',
                width: '70%',
                margin: "auto",
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                p: 2,
                backgroundColor: 'background.default',
                borderBottom: '1px solid',
                // borderColor: 'divider'
                borderLeft: '1px solid',
                borderRight: '1px solid',
                borderColor: 'divider'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{
                        fontWeight: 500,
                        color: 'text.secondary'
                    }}>
                        Opening Balance:
                    </Typography>
                    <Typography variant="body1" sx={{
                        fontWeight: 700,
                        color: 'text.primary'
                    }}>
                        {formatCurrency(rows?.openingBalance)}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{
                // width: '100%',
                overflow: 'hidden',
                borderLeft: '1px solid',
                borderRight: '1px solid',
                borderColor: 'divider',
                width: '70%',
                margin: "auto"
            }}>
                {loading ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 300,
                        p: 2
                    }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small" sx={{
                            minWidth: 650,
                            '& .MuiTableCell-root': {
                                py: '8px',
                                lineHeight: 1.4
                            }
                        }}>
                            <TableHead>
                                <TableRow sx={{
                                    backgroundColor: '#f8fafc',
                                    '& th': {
                                        fontWeight: 600,
                                        color: '#2c3e50',
                                        borderBottom: '1px solid',
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                        py: '10px'
                                    }
                                }}>
                                    <TableCell align="center">Date</TableCell>
                                    <TableCell align="right">Debit</TableCell>
                                    <TableCell align="right">Credit</TableCell>
                                    <TableCell align="right">Balance</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows?.vendorDetails?.length > 0 ? (
                                    rows.vendorDetails.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            hover
                                            sx={{
                                                '&:hover': { backgroundColor: 'rgba(55, 106, 125, 0.04)' },
                                                '& td': {
                                                    borderBottom: '1px solid',
                                                    borderColor: 'divider'
                                                }
                                            }}
                                        >
                                            <TableCell align="center">
                                                {row?.created_date ? moment(row?.created_date).format('DD-MM-YYYY') : ''}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row?.debit > 0 ? (
                                                    <Typography
                                                        onClick={() => handleCellClick(row, 'debit')}
                                                        sx={{
                                                            color: 'primary.main',
                                                            cursor: 'pointer',
                                                            fontWeight: 500,
                                                            fontSize: '13px',
                                                            '&:hover': { textDecoration: 'none' }
                                                        }}
                                                    >
                                                        {formatCurrency(row.debit)}
                                                    </Typography>
                                                ) : (
                                                    formatCurrency(row.debit)
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row?.credit > 0 ? (
                                                    <Typography
                                                        onClick={() => handleCellClick(row, 'credit')}
                                                        sx={{
                                                            color: 'primary.main',
                                                            cursor: 'pointer',
                                                            fontWeight: 500,
                                                            fontSize: '13px',
                                                            '&:hover': { textDecoration: 'none' }
                                                        }}
                                                    >
                                                        {formatCurrency(row.credit)}
                                                    </Typography>
                                                ) : (
                                                    formatCurrency(row.credit)
                                                )}
                                            </TableCell>
                                            <TableCell align="right" sx={{
                                                fontWeight: 500,
                                                color: 'black',
                                                fontSize: '13px',
                                            }}>
                                                {formatCurrency(row?.cumulativeBalance || 0)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}> {/* Reduced py */}
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 1
                                            }}>
                                                <ReceiptLongIcon sx={{
                                                    fontSize: 40,
                                                    color: 'text.disabled'
                                                }} />
                                                <Typography variant="body1" color="text.secondary">
                                                    No transactions this month
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                            {rows?.vendorDetails?.length > 0 && (
                                <TableFooter>
                                    <TableRow sx={{
                                        backgroundColor: '#f8fafc',
                                        '& td': {
                                            fontWeight: 600,
                                            borderTop: '1px solid',
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            py: '10px'
                                        }
                                    }}>
                                        <TableCell align="center" sx={{ color: 'black', fontWeight: '500', fontSize: '13px' }}>Total</TableCell>
                                        <TableCell align="right" sx={{ color: 'black', fontWeight: '500', fontSize: '13px' }}>
                                            {formatCurrency(rows?.totalDebit)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: 'black', fontWeight: '500', fontSize: '13px' }}>
                                            {formatCurrency(rows?.totalCredit)}
                                        </TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableFooter>
                            )}
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Paper>
    )
};

export default LedgerDayTransaction;

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