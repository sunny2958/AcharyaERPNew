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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";
import moment from 'moment';
import { MONTH_LIST_OPTION } from '../../../services/Constants';
import { BlobProvider } from '@react-pdf/renderer';
import LedgerMonthlyTransactionPdf from './LedgerMonthlyTransactionPdf';
import useAlert from '../../../hooks/useAlert';
import LedgerMonthlyInstTransactionPdf from './LedgerMonthlyInstTransactionPDF';
import PrintIcon from '@mui/icons-material/Print';

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



const LedgerMonthlyInstTransaction = () => {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [breadCrumbs, setBreadCrumbs] = useState([])
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
        if (queryValues?.isBRSTrue) {
            setBreadCrumbs([
                { name: "Bank Balance", link: "/bank-balance" },
                { name: "BRS", link: "/institute-bank-balance", state: { bankGroupId: queryValues?.bankGroupId } },
                { name: "Monthly Transaction", link: "/Accounts-ledger-monthly-detail", state: queryValues },
                { name: 'Institute Summary' }
            ]);
        } else {
            setBreadCrumbs([
                { name: "Ledger", link: "/Accounts-ledger", state: queryValues },
                { name: "Monthly Transaction", link: "/Accounts-ledger-monthly-detail", state: queryValues },
                { name: 'Institute Summary' }
            ])
        }
        setCrumbs([])
    }, [])

    useEffect(() => {
        getData()
    }, [currMonth?.month])

    const getData = async () => {
        const { voucherHeadId, fcYearId, schoolId, year, ledgerType } = queryValues
        const baseUrl = ledgerType === 'EARNINGS' ? "/api/finance/getMonthAndSchoolWiseSummary" : "/api/finance/getMonthlyLedger"
        let params = {}
        if(ledgerType === 'EARNINGS'){
             params = {
            ...(voucherHeadId && { voucherHeadNewId: voucherHeadId }),
            ...(year && { year }),
            ...(currMonth?.month && { month: currMonth?.month })
        }
        }else{
              params = {
            ...(voucherHeadId && { voucherHeadNewId: voucherHeadId }),
            ...(currMonth?.month && { month: currMonth?.month }),
            ...(fcYearId && { fcYearId })
        }
        }
        setLoading(true)
        await axios
            .get(baseUrl, { params })
            .then((res) => {
                const { data } = res?.data
                const rowData = []
                data?.vendorDetails?.length > 0 && data?.vendorDetails?.forEach(el => {
                    rowData.push({
                        credit: el?.credit,
                        debit: el?.debit,
                        month_name: el?.month_name,
                        school_id: el?.school_id,
                        school_name: el?.school_name,
                        school_name_short: el?.school_name_short,
                        month: el?.month,
                        openingBalance: formatDrCr(el?.openingBalance, queryValues?.ledgerType),
                        closingBalance: formatDrCr(el?.closingBalance, queryValues?.ledgerType),
                    })
                });

                setRows({
                    vendorDetails: rowData,
                    totalCredit: data?.totalCredit,
                    totalDebit: data?.totalDebit,
                    // openingBalance: data?.openingBalance,
                    schoolName: data?.schoolName,
                    closingBalance: data?.closingBalance
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
        } else if (ledgerType === "CASHORBANK" || ledgerType === 'EARNINGS') {
            return value > 0 ? `${absVal} Dr` : `${absVal} Cr`;
        } else {
            return value;
        }
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

    const getFormattedMonthYear = (monthNumber, fcYear) => {
        const monthMap = {
            1: 'Jan',
            2: 'Feb',
            3: 'Mar',
            4: 'Apr',
            5: 'May',
            6: 'Jun',
            7: 'Jul',
            8: 'Aug',
            9: 'Sep',
            10: 'Oct',
            11: 'Nov',
            12: 'Dec',
        };

        const [startYear, endYear] = fcYear.split("-");
        const yearSuffix = monthNumber >= 4 ? startYear : endYear;

        return `${monthMap[monthNumber]} ${yearSuffix}`;
    };

    return (

        <Box sx={{
            width: '100%',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                width: '100%'
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
                            <LedgerMonthlyInstTransactionPdf
                                rows={rows}
                                queryValues={queryValues}
                                month={getFormattedMonthYear(queryValues?.month, queryValues?.fcYear)}
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
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative',
                minHeight: 300,
                width: '70%',
                margin: "auto"
            }}>
                {loading ? (
                    <Box sx={{
                        position: 'absolute',
                        top: 56,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 1
                    }}>
                        <CircularProgress size={24} thickness={4} sx={{ color: '#2c3e50' }} />
                    </Box>
                ) : (
                    <>
                        <Box sx={{
                            p: 2,
                            backgroundColor: '#376a7d',
                            color: 'white',
                        }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>
                                {queryValues?.voucherHeadName}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                                {getFormattedMonthYear(currMonth?.month, queryValues?.fcYear)}
                            </Typography>
                            <Typography variant="body1" sx={{ textAlign: 'center', opacity: 0.9 }}>
                                {`As on ${moment().format('DD-MM-YYYY')}`}
                            </Typography>
                        </Box>

                        <TableContainer>
                            <Table size="small" sx={{
                                '& .MuiTableCell-root': {
                                    // fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                                    fontSize: '0.8125rem',
                                    lineHeight: '1.43',
                                    padding: '10px 16px',
                                    // borderRight: '1px solid rgba(224, 224, 224, 0.5)',
                                    '&:last-child': { borderRight: 'none' }
                                }
                            }}>
                                <TableHead>
                                    <TableRow sx={{
                                        backgroundColor: '#f5f5f5',
                                        '& th': {
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            fontWeight: 'bold',
                                            fontSize: '0.8125rem',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                            borderTop: '1px solid rgba(224, 224, 224, 1)',
                                        }
                                    }}>
                                        <TableCell sx={{ width: '20%' }} align="center">School</TableCell>
                                        <TableCell sx={{ width: '20%' }} align="right">Opening Balance</TableCell>
                                        <TableCell sx={{ width: '20%' }} align="right">Debit</TableCell>
                                        <TableCell sx={{ width: '20%' }} align="right">Credit</TableCell>
                                        <TableCell sx={{ width: '20%' }} align="right">Closing Balance</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows?.vendorDetails?.length > 0 ? (<>
                                        {rows?.vendorDetails?.map((row, index) => (
                                            <TableRow
                                                key={index}
                                                hover
                                                sx={{
                                                    //   cursor: 'pointer',
                                                    '&:nth-of-type(even)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                                                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                                                }}
                                            >
                                                <TableCell align="center" sx={{
                                                    fontWeight: 400,
                                                    color: 'rgba(0, 0, 0, 0.87)'
                                                }}>
                                                    {row?.school_name_short}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {formatCurrency(row.openingBalance)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {formatCurrency(row.debit)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {formatCurrency(row.credit)}
                                                </TableCell>
                                                <TableCell align="right" sx={{
                                                    fontWeight: 500,
                                                    color: 'rgba(0, 0, 0, 0.87)'
                                                }}>
                                                    {formatCurrency(row.closingBalance)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow sx={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            '& td': {
                                                fontWeight: 600,
                                                borderTop: '1px solid rgba(0, 0, 0, 0.12)'
                                            }
                                        }}>
                                            <TableCell align="center">Total</TableCell>
                                            <TableCell align="right"></TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(rows?.totalDebit)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(rows?.totalCredit)}
                                            </TableCell>
                                            <TableCell align="right">
                                            </TableCell>
                                        </TableRow>
                                    </>) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4, border: 'none' }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    color: 'text.secondary',
                                                    height: '200px',
                                                    border: 'none'
                                                }}>

                                                    <Typography variant="body1" sx={{ fontWeight: 500, margin: "auto" }}>
                                                        No data available
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>)}
            </Box>
        </Box>
    );
};

export default LedgerMonthlyInstTransaction;

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
