import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    makeStyles,
    Tooltip,
    CircularProgress
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);

const InstituteBankBalance = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const [currFcYear, setCurrFcYear] = useState({})
    const [fcYearOption, setFcYearOption] = useState([])
    const navigate = useNavigate();
    const location = useLocation()
    const bankGroupId = location?.state?.bankGroupId
    const setCrumbs = useBreadcrumbs();
    const roleShortName = JSON.parse(
        sessionStorage.getItem("AcharyaErpUser")
    )?.roleShortName;

    useEffect(() => {
        setCrumbs([{ name: "Bank Balance", link: "/bank-balance" }, { name: "BRS" }])
          getFinancialYearDetails()
    }, []);


    useEffect(() => {
        if (bankGroupId)
            getData()
    }, [bankGroupId]);

    const getData = async() =>{
        setLoading(true);
                await axios
                    .get(`/api/finance/getLedgerByBankGroupId?bankGroupId=${bankGroupId}`)
                    .then((res) => {
                        const { data } = res?.data
                        setRows(data || {})
                        setLoading(false);
                    })
                    .catch((err) =>{
                        setLoading(false);
                        console.error(err)
                    })
                    }

    const getFinancialYearDetails = async () => {
        await axios
            .get(`/api/FinancialYear`)
            .then((res) => {
                const { data } = res?.data
                const filteredOptions = data?.length > 0 && data?.filter(item => item?.financial_year >= "2025-2026")
                const optionData = filteredOptions?.map(item => ({
                    label: item.financial_year,
                    value: item.financial_year_id
                }));
                setFcYearOption(optionData || [])
                setCurrFcYear({
                    ['fcYearId']: optionData[0]?.value || "",
                    ['fcYear']: optionData[0]?.label
                });
            })
            .catch((err) => console.error(err));
    };

    const viewClosingBalanceDetails = (voucher_head_new_id, schoolId, schoolName, bankName, bankId) => {
        const queryValues = { voucherHeadId: voucher_head_new_id, schoolId, voucherHeadName: bankName, fcYearOpt: fcYearOption, isBRSTrue: true, bankGroupId, bankId, ...currFcYear }
        navigate('/Accounts-ledger-monthly-detail', { state: queryValues })
    }

    const handleBRSAmount = (row) => {
        const queryValues = { bankBalance: row?.bank_balance, closingBalance: row?.closingBalance, bankGroupId, schoolId: row?.school_id, bankId: row?.bankId, accountNo: row?.account_number, bankName: row?.bank_name, schoolName: row?.school_name }
        navigate('/institute-brs-transaction', { state: queryValues })
    }

    const headers = [
        { id: 'bank', label: 'Bank', width: '15%' },
        { id: 'institute', label: 'Institute', width: '20%' },
        { id: 'closing_balance', label: 'Book Balance', width: '15%', align: 'right' },
        { id: 'bank_balance', label: 'Bank Balance', width: '15%', align: 'right' },
        { id: 'brs_amount', label: 'BRS Difference', width: '15%', align: 'right' },
        { id: 'updated', label: 'BB updated date', width: '20%', align: 'center' }
    ];

    return (
        <Paper elevation={0} sx={{
            width: "90%",
            margin: "auto",
            mt: 2,
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '200px'
        }}>
            <TableContainer>
                <Table
                    size="small"
                    sx={{
                        tableLayout: 'fixed',
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                        '& .MuiTableCell-root': {
                            borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
                            padding: '8px 16px',
                            height: '40px'
                        },
                        '& .MuiTableHead-root .MuiTableCell-root': {
                            borderBottom: 'none'
                        }
                    }}
                >
                    <TableHead
                        sx={{
                            background: 'linear-gradient(135deg, #376a7d 0%, #2a5262 100%)',
                            '& .MuiTableCell-root': {
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: '13px',
                                letterSpacing: '0.5px',
                                py: '12px'
                            }
                        }}>
                        <TableRow>
                            {headers.map((header) => (
                                <TableCell
                                    key={header.id}
                                    align={header.align || 'left'}
                                    sx={{
                                        width: header.width,
                                        borderRight: header.id !== 'updated' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                    }}
                                >
                                    {header.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1
                            }}>
                                <CircularProgress size={60} thickness={4} sx={{ color: '#376a7d' }} />
                            </Box>
                        ) : (rows.length > 0 ? (
                                    rows?.map((row, index) => {
                                        const isBalanced = row?.brs_amount !== 0;
                                        return <TableRow
                                            key={index}
                                            sx={{
                                                '& .MuiTableCell-root': {
                                                    py: '4px',
                                                    height: '30px',
                                                    backgroundColor: isBalanced ? 'rgba(239, 83, 80, 0.08)' : 'rgba(76, 175, 80, 0.15)',
                                                    '&:hover': {
                                                        backgroundColor: isBalanced ? 'rgba(239, 83, 80, 0.12)' : 'rgba(76, 175, 80, 0.25)'
                                                    },
                                                    transition: 'background-color 0.3s ease'
                                                    // fontSize: '13px', 
                                                },
                                            }}
                                        >
                                            <TableCell align="left" sx={{ fontWeight: 500 }}>
                                                {row.bank_name}
                                            </TableCell>
                                            <TableCell align="left" sx={{
                                                width: '20%',
                                            }}>
                                                {row.school_name}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="text"
                                                    onClick={() => viewClosingBalanceDetails(
                                                        row?.voucher_head_new_id,
                                                        row?.school_id,
                                                        row?.school_name,
                                                        row?.bank_name,
                                                        row?.bankId
                                                    )}
                                                    sx={{
                                                        color: '#376a7d',
                                                        fontWeight: 500,
                                                        fontSize: '12px',
                                                        textTransform: 'none',
                                                        minWidth: 0,
                                                        padding: '4px 8px',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(55, 106, 125, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    {/* {formatCurrency(row?.closing_balance)} */}
                                                    {row?.closingBalance}
                                                </Button>
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500 }}>
                                                {/* {formatCurrency(row?.bank_balance)} */}
                                                {row?.bank_balance}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="text"
                                                    onClick={() => handleBRSAmount(row)}
                                                    sx={{
                                                        color: '#376a7d',
                                                        fontWeight: 500,
                                                        fontSize: '12px',
                                                        textTransform: 'none',
                                                        minWidth: 0,
                                                        padding: '4px 8px',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(55, 106, 125, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    {formatCurrency(row?.brs_amount || 0)}
                                                </Button>
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: '#666', fontSize: '12px' }}>
                                                {row?.balanceUpdatedOn ?
                                                    moment(row?.balanceUpdatedOn).format("DD-MM-YYYY h:mm:ss a") :
                                                    ''}
                                            </TableCell>
                                        </TableRow>
                                    })
                                ) : (
                                    // No Data State
                                    <TableRow>
                                        <TableCell colSpan={headers.length} align="center" sx={{ py: 4 }}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                color: 'text.secondary'
                                            }}>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    No reconciliation data available
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default InstituteBankBalance;
