import React, { useEffect, useState } from 'react';
import {
    Paper,
    Box,
    Typography,
    Divider,
    Chip,
    Button,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Breadcrumbs,
    Pagination
} from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useLocation, useNavigate } from 'react-router-dom';
import useBreadcrumbs from '../../../hooks/useBreadcrumbs';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { makeStyles } from "@mui/styles";
import axios from '../../../services/Api';
import moment from 'moment';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BRSTransactionDetailsPdf from './BRSTransactionDetailsPdf';
import { BlobProvider } from '@react-pdf/renderer';
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

const rowStyle = {
    backgroundColor: '#f5f5f5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    borderBottom: '1px solid #e0e0e0'
};

const BRSTransactionDetail = () => {
    const [directCreditsData, setDirectCreditsData] = useState({})
    const [chqIssuedNotCreditData, setChqIssuedNotCreditData] = useState({})
    const [chqIssuedNotDebitData, setChqIssuedNotDebitData] = useState({})
    const [expanded, setExpanded] = useState({
        directCredits: false,
        chqIssued: false,
        chqDeposited: false
    });
    const [breadCrumbs, setBreadCrumbs] = useState([]);
    const [pagination, setPagination] = useState({
        directCredits: { page: 1, rowsPerPage: 20 },
        chqIssued: { page: 1, rowsPerPage: 20 },
        chqDeposited: { page: 1, rowsPerPage: 20 }
    });
    const navigate = useNavigate();
    const setCrumbs = useBreadcrumbs();
    const location = useLocation();
    const queryValues = location.state;

    useEffect(() => {
        setBreadCrumbs([
            { name: "Bank Balance", link: "/bank-balance" },
            { name: "BRS", link: "/institute-bank-balance", state: { bankGroupId: queryValues?.bankGroupId } },
            { name: "BRS Transactions" },
        ]);
        setCrumbs([]);
        getChqIssuedNotDebitData()
        getChqIssuedNotCreditData()
        getDirectCreditToBankData()
    }, [queryValues]);

    const getChqIssuedNotDebitData = async () => {
        const { schoolId, bankId } = queryValues
        await axios
            .get(`/api/finance/getChqIssuedNotDebit?schoolId=${schoolId}&bankId=${bankId}`)
            .then((res) => {
                const { data } = res?.data
                setChqIssuedNotDebitData(data || {})
            })
            .catch((err) => console.error(err));
    };

    const getChqIssuedNotCreditData = async () => {
        const { schoolId, bankId } = queryValues
        await axios
            .get(`api/finance/getChqIssuedNotCredit?schoolId=${schoolId}&bankId=${bankId}`)
            .then((res) => {
                const { data } = res?.data
                setChqIssuedNotCreditData(data || {})
            })
            .catch((err) => console.error(err));
    };

    const getDirectCreditToBankData = async () => {
        const { schoolId, bankId } = queryValues
        await axios
            .get(`/api/student/getAllBankImportPendingTransaction?schoolId=${schoolId}&bankId=${bankId}`)
            .then((res) => {
                const { data } = res?.data
                setDirectCreditsData(data || {})
            })
            .catch((err) => console.error(err));
    };

    const handleViewTransactionDetails = (row, type) => {
        if (type === 'chqIssued') {
            navigate('/brs-cheque-issued-not-debit-detail', { state: queryValues });
        } else if (type === 'chqDeposited') {
            navigate('/brs-cheque-issued-not-credit-detail', { state: queryValues });
        } else {
            navigate('/brs-direct-credit-to-bank-detail', { state: queryValues });
        }
    }

    const toggleExpand = (section) => {
        setExpanded({ ...expanded, [section]: !expanded[section] });
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

    const handlePageChange = (section, page) => {
        setPagination({
            ...pagination,
            [section]: {
                ...pagination[section],
                page
            }
        });
    };

    const getPaginatedData = (section) => {
        const { page, rowsPerPage } = pagination[section];
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        let items = []
        if (section === 'directCredits') {
            items = directCreditsData?.bankImportTransactions || []
        } else if (section === 'chqDeposited') {
            items = chqIssuedNotCreditData?.ddDetails || []
        } else {
            items = chqIssuedNotDebitData?.paymentVouchers || []
        }
        return items.slice(startIndex, endIndex);
    };

    return (
        <Box sx={{
            width: '100%',
            p: 1,
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <CustomBreadCrumbs crumbs={breadCrumbs} />
                <BlobProvider
                    document={
                        <BRSTransactionDetailsPdf
                            queryValues={queryValues}
                            chqIssuedNotDebitData={chqIssuedNotDebitData}
                            chqIssuedNotCreditData={chqIssuedNotCreditData}
                            directCreditsData={directCreditsData}
                        />
                    }
                >
                    {({ url, loading, error }) => (
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            onClick={() => {
                                if (url) {
                                    // Open in new tab for printing
                                    const pdfWindow = window.open(url, '_blank');
                                    setTimeout(() => {
                                        pdfWindow?.print();
                                    }, 1000);
                                }
                            }}
                            startIcon={<PrintIcon />}
                            sx={{ mt: 2 }}
                        >
                        Print PDF
                        </Button>
                    )}
                </BlobProvider>

            </Box>
            <Paper sx={{
                p: 0,
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                maxWidth: '800px',
                margin: '10px auto',
            }}>
                {/* <Box sx={{
                    p: 1.5,
                    backgroundColor: 'rgba(239, 83, 80, 0.08)',
                    borderLeft: '4px solid #ff5252',
                    mt: 2,
                    mb: 1,
                    borderRadius: '0 4px 4px 0'
                }}>
                    <Typography variant="body2" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: '#d32f2f'
                    }}>
                        <InfoOutlinedIcon fontSize="small" color="error" />
                        <Box component="span" sx={{ fontWeight: 500 }}>
                            Note:
                        </Box>
                        The cashbook ledger balance and receipt/payment transactions are fetched from ERP automatically in real-time.
                        Please provide the bank balance as per the passbook for reconciliation.
                    </Typography>
                </Box> */}
                <Box sx={{
                    p: 2,
                    backgroundColor: '#376a7d',
                    color: 'white',
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>
                        {queryValues?.schoolName}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                        {queryValues?.bankName} A/c No: {queryValues?.accountNo}
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: 'center', opacity: 0.9 }}>
                        Bank Reconciliation Statement as on {moment().format('DD-MM-YYYY')}
                    </Typography>
                </Box>
                <Box sx={{ backgroundColor: '#fafafa' }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 2,
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: '#f5f5f5'
                    }}>
                        <Typography>Bank Balance as per Cash Book (a)</Typography>
                        <Typography fontWeight={600}>{queryValues?.closingBalance || 0}</Typography>
                    </Box>

                    <Box sx={{ backgroundColor: '#eeeeee' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                p: 2,
                                borderBottom: '1px solid #e0e0e0',
                                cursor: 'pointer',
                                backgroundColor: '#f5f5f5',
                                '&:hover': { backgroundColor: '#e0e0e0' }
                            }}
                            onClick={() => toggleExpand('chqIssued')}
                        >
                            <Box>
                                <Typography>(+) Cheque Issued not Presented (b)</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {chqIssuedNotDebitData?.paymentVouchers?.length || 0} transactions
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography fontWeight={600}>{chqIssuedNotDebitData?.totalAmount?.toFixed(2) || 0}</Typography>
                                {chqIssuedNotDebitData?.paymentVouchers?.length > 50 ? (
                                    <IconButton onClick={() => handleViewTransactionDetails(chqIssuedNotDebitData?.paymentVouchers, 'chqIssued')} size="small">
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                ) : (
                                    <IconButton size="small">
                                        {expanded.chqIssued ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                    </IconButton>
                                )}
                            </Box>
                        </Box>
                        <Collapse in={expanded.chqIssued}>
                            <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb', backgroundColor: '#f8fafc' }}>
                                {chqIssuedNotDebitData?.paymentVouchers?.length ? (
                                    <>
                                        <TableContainer sx={{ mt: 2 }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                                                        <TableCell>VCHR No</TableCell>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell>Pay To</TableCell>
                                                        <TableCell align="right">Amount</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {getPaginatedData('chqIssued').map((item) => (
                                                        <TableRow key={item?.id} hover>
                                                            <TableCell>{item?.voucher_no}</TableCell>
                                                            <TableCell>{item?.created_date ? moment(item?.created_date).format("DD-MM-YYYY") : ""}</TableCell>
                                                            <TableCell>{item?.pay_to}</TableCell>
                                                            <TableCell align="right">{item?.credit}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                            <Pagination
                                                count={Math.ceil(chqIssuedNotDebitData?.paymentVouchers?.length / pagination.chqIssued.rowsPerPage)}
                                                page={pagination.chqIssued.page}
                                                onChange={(e, page) => handlePageChange('chqIssued', page)}
                                                color="primary"
                                                size="small"
                                            />
                                        </Box>
                                    </>
                                ) : (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            textAlign: 'center',
                                            color: '#888',
                                            fontStyle: 'italic'
                                        }}
                                    >
                                        No transactions found.
                                    </Box>
                                )}
                            </Box>
                        </Collapse>
                    </Box>
                    <Box sx={{ backgroundColor: '#eeeeee' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                p: 2,
                                borderBottom: '1px solid #e0e0e0',
                                cursor: 'pointer',
                                backgroundColor: '#f5f5f5',
                                '&:hover': { backgroundColor: '#e0e0e0' }
                            }}
                            onClick={() => toggleExpand('chqDeposited')}
                        >
                            <Box>
                                <Typography>(-) DD Deposits in Transit (c)</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {chqIssuedNotCreditData?.ddDetails?.length || 0} transactions
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography fontWeight={600}>{chqIssuedNotCreditData?.totalAmount?.toFixed(2) || 0}</Typography>
                                {chqIssuedNotCreditData?.ddDetails?.length > 50 ? (
                                    <IconButton onClick={() => handleViewTransactionDetails(chqIssuedNotCreditData?.ddDetails, 'chqDeposited')} size="small">
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                ) : (
                                    <IconButton size="small">
                                        {expanded.chqDeposited ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                    </IconButton>
                                )}
                            </Box>
                        </Box>
                        <Collapse in={expanded.chqDeposited}>
                            <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb', backgroundColor: '#f8fafc' }}>
                                {chqIssuedNotCreditData?.ddDetails?.length ? (
                                    <>
                                        <TableContainer sx={{ mt: 2 }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                                                        <TableCell>DD No</TableCell>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell>Bank</TableCell>
                                                        <TableCell align="right">Amount</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {getPaginatedData('chqDeposited').map((item) => (
                                                        <TableRow key={item?.id} hover>
                                                            <TableCell>{item?.dd_number}</TableCell>
                                                            <TableCell>{item?.created_date  ? moment(item?.dd_date).format("DD-MM-YYYY") : ""}</TableCell>
                                                            <TableCell>{item?.bank_name}</TableCell>
                                                            <TableCell align="right">{item?.dd_amount}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                            <Pagination
                                                count={Math.ceil(chqIssuedNotCreditData?.ddDetails?.length / pagination.chqDeposited.rowsPerPage)}
                                                page={pagination.chqDeposited.page}
                                                onChange={(e, page) => handlePageChange('chqDeposited', page)}
                                                color="primary"
                                                size="small"
                                            />
                                        </Box>
                                    </>
                                ) : (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            textAlign: 'center',
                                            color: '#888',
                                            fontStyle: 'italic'
                                        }}
                                    >
                                        No transactions found.
                                    </Box>
                                )}
                            </Box>
                        </Collapse>
                    </Box>
                    <Box sx={{ backgroundColor: '#eeeeee' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                p: 2,
                                borderBottom: '1px solid #e0e0e0',
                                cursor: 'pointer',
                                backgroundColor: '#f5f5f5',
                                '&:hover': { backgroundColor: '#e0e0e0' }
                            }}
                            onClick={() => toggleExpand('directCredits')}
                        >
                            <Box>
                                <Typography>(+) Direct Electronic Credits (d)</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {directCreditsData?.bankImportTransactions?.length || 0} transactions
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography fontWeight={600}>{directCreditsData?.totalAmount?.toFixed(2) || 0}</Typography>
                                {directCreditsData?.bankImportTransactions?.length > 50 ? (
                                    <IconButton onClick={() => handleViewTransactionDetails(directCreditsData?.bankImportTransactions, 'directCredits')} size="small">
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                ) : (
                                    <IconButton size="small">
                                        {expanded.directCredits ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                    </IconButton>
                                )}
                            </Box>
                        </Box>
                        <Collapse in={expanded.directCredits}>
                            {directCreditsData?.bankImportTransactions?.length ? (
                                <>
                                    <TableContainer sx={{ mt: 2 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                                                    <TableCell sx={{ width: 100, minWidth: '100px' }} align="center">TRN Date</TableCell>
                                                    <TableCell sx={{ width: 150, minWidth: '140px' }} align="center">TRN No</TableCell>
                                                    <TableCell sx={{ width: 140, minWidth: '140px' }} align="center">Order Id</TableCell>
                                                    <TableCell sx={{ width: 70, minWidth: '70px' }} align="center">AUID</TableCell>
                                                    <TableCell align="center" sx={{ width: 80, minWidth: '80px' }}>Pending</TableCell>
                                                    <TableCell align="center" sx={{ width: 80, minWidth: '80px' }}>Partial Pending</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {getPaginatedData('directCredits').map((item) => (
                                                    <TableRow key={item?.index} hover>
                                                        <TableCell align="center">{parseDate(item?.transaction_date)}</TableCell>
                                                        <TableCell
                                                            sx={{
                                                                maxWidth: 200,     
                                                                whiteSpace: 'normal',  
                                                                wordBreak: 'break-word',   
                                                                lineHeight: 1.4,           
                                                                fontSize: '13px',
                                                            }}
                                                        >
                                                            {item?.cheque_dd_no}
                                                        </TableCell>
                                                        <TableCell>{item?.order_id}</TableCell>
                                                        <TableCell>{item?.auid}</TableCell>
                                                        <TableCell align="center">{item?.amount == item?.balance  ? item.amount:""}</TableCell>
                                                        <TableCell align="center">{item?.amount != item?.balance  ? item.balance:""}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <Pagination
                                            count={Math.ceil(directCreditsData?.bankImportTransactions?.length / pagination.directCredits.rowsPerPage)}
                                            page={pagination.directCredits.page}
                                            onChange={(e, page) => handlePageChange('directCredits', page)}
                                            color="primary"
                                            size="small"
                                        />
                                    </Box>
                                </>
                            ) : (
                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        textAlign: 'center',
                                        color: '#888',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    No transactions found.
                                </Box>
                            )}
                        </Collapse>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 2,
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: '#f5f5f5'
                    }}>
                        <Typography fontWeight={600}>Total (a) + (b) - (c) + (d)</Typography>
                        <Typography fontWeight={700}>
                            {(queryValues?.closingBalance +
                                chqIssuedNotDebitData?.totalAmount -
                                chqIssuedNotCreditData?.totalAmount +
                                directCreditsData?.totalAmount)?.toFixed(2) || 0}
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 2,
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: '#eeeeee'
                    }}>
                        <Typography>Bank Balance as per Pass Book</Typography>
                        <Typography fontWeight={600}>{queryValues?.bankBalance || 0}</Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 2,
                        backgroundColor: '#f5f5f5'
                    }}>
                        <Typography fontWeight={600}>Difference</Typography>
                        <Typography fontWeight={600} color="#b91c1c">
                            {(
                                (queryValues?.closingBalance +
                                    chqIssuedNotDebitData?.totalAmount -
                                    chqIssuedNotCreditData?.totalAmount +
                                    directCreditsData?.totalAmount) -
                                queryValues?.bankBalance
                            )?.toFixed(2) || 0}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{
                    p: 1.5,
                    backgroundColor: 'rgba(239, 83, 80, 0.08)',
                    borderLeft: '4px solid #ff5252',
                    mt: 2,
                    mb: 1,
                    borderRadius: '0 4px 4px 0'
                }}>
                    <Typography variant="body2" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: '#d32f2f'
                    }}>
                        <InfoOutlinedIcon fontSize="small" color="error" />
                        <Box component="span" sx={{ fontWeight: 500 }}>
                            Note:
                        </Box>
                        The cashbook ledger balance and receipt/payment transactions are fetched from ERP automatically in real-time.
                        Please provide the bank balance as per the passbook for reconciliation.
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default BRSTransactionDetail;

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

