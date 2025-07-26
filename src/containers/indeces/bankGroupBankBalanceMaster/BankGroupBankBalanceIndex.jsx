import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Card, CardContent, CircularProgress, InboxIcon, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";

const BankGroupBankBalanceIndex = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const setCrumbs = useBreadcrumbs();
    useEffect(() => {
        setCrumbs([{ name: "" }]);
        getCashInHandData()
    }, []);

    const getCashInHandData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`api/finance/getTotalCashInHand`);
            if (res.status == 200 || res.status == 201) {
                getData(res.data.data);
            }
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    };

    const getData = async (cashInHandDetails) => {
        try {
            const res = await axios.get(
                '/api/finance/fetchAllBanknDetails?page=0&page_size=10000&sort=created_date'
            );
            const { Paginated_data } = res?.data?.data;
            const result = [];
            Paginated_data?.content?.forEach(item => {
                const groupId = item.bank_group_id;
                const groupName = item.bank_group_name;
                const balance = Number(item.bank_balance) || 0;

                const existingGroup = result.find(group => group.id === groupId);
                if (existingGroup) {
                    existingGroup.total_balance += balance;
                } else {
                    result.push({
                        id: groupId,
                        bank_group_name: groupName,
                        total_balance: balance,
                    });
                }
            });

            let cashInHand = null;
            let cashCredit = null;
            const termLoanGroups = [];
            const regularGroups = [];
            result.forEach(group => {
                const name = group.bank_group_name?.toLowerCase().trim();

                if (name === 'cash in hand') {
                    cashInHand = { ...group, isCashInHand: true };
                } else if (name === 'cash credits') {
                    cashCredit = { ...group, isCashCredit: true };
                } else if (name.includes('term loan')) {
                    termLoanGroups.push({ ...group, isTermLoan: true });
                }
                else {
                    group.total_balance = parseFloat(group.total_balance.toFixed(2));
                    regularGroups.push(group);
                }
            });
            const totalBalance = regularGroups.reduce((sum, g) => sum + g.total_balance, 0);
            const totalRow = {
                id: 'total',
                bank_group_name: 'Total',
                total_balance: parseFloat(totalBalance.toFixed(2)),
                isTotal: true,
            };

            const data = [
                ...regularGroups,
                totalRow,
                ...termLoanGroups,
                ...(cashCredit ? [cashCredit] : []),
                ...(cashInHand ? [cashInHand] : [])
            ];
            const finalData = data?.map((ele) => (ele.id == cashInHandDetails?.bankGroupId ? ({ ...ele, "total_balance": cashInHandDetails?.CashInHandAmount }) : { ...ele }));
            setRows(finalData);
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCellClick = (bankGroupId, row) => {

        if (row?.bank_group_name === "Cash in Hand") {
            navigate('/Accounts-ledger', { state: row })
        } else {
            navigate('/institute-bank-balance', { state: { bankGroupId } })
        }
    }

    return (
        <Box sx={{
            p: 3,
            maxWidth: 800,
            mx: "auto",
            fontFamily: "'Roboto', sans-serif"
        }}>
            <Box sx={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, #2c3e50 0%, #376a7d 100%)',
                color: 'white',
                p: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
            }}>
                <Typography variant="h5" sx={{
                    fontWeight: 700,
                    letterSpacing: 1,
                    mb: 1
                }}>
                    JMJ EDUCATION SOCIETY
                </Typography>
                <Typography variant="Subtitle1" sx={{
                    fontWeight: 500,
                    opacity: 0.9
                }}>
                    Bank Balance as on {moment().format('DD MMMM YYYY')}
                </Typography>
            </Box>
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                    '&:hover': {
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }
                }}
            >
                <Table size="small" sx={{
                    borderCollapse: "separate",
                    borderSpacing: 0,
                }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell
                                sx={{
                                    fontWeight: "600",
                                    fontSize: '14px',
                                    width: '60%',
                                    py: 2,
                                    letterSpacing: '0.5px',
                                    borderRight: "1px solid rgba(0,0,0,0.05)",
                                }}
                            >
                                Bank Groups
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    fontWeight: "600",
                                    fontSize: '14px',
                                    width: '40%',
                                    py: 2,
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Bank Balance
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {loading ? (
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10
                        }}>
                            <CircularProgress size={60} thickness={4} sx={{ color: '#376a7d' }} />
                        </Box>
                    ) : (
                        <TableBody>
                            {rows?.length > 0 ? (
                                rows?.map((row, i) => {
                                    const isTotal = row?.isTotal;
                                    const isCashInHand = row?.isCashInHand;
                                    const isCashCredit = row?.isCashCredit;
                                    const isTermLoan = row?.isTermLoan;

                                    const isSpecial = isTotal || isCashInHand || isCashCredit || isTermLoan;
                                    return isSpecial ? (
                                        <TableRow
                                            key={i}
                                            onClick={!isTotal ? () => handleCellClick(row?.id, row) : undefined}
                                            sx={{
                                                backgroundColor: isTotal ? '#f8f9fa' : '#e8f4ff',
                                                cursor: !isTotal ? 'pointer' : 'default',
                                                '& .MuiTableCell-root': {
                                                    py: '4px',
                                                    height: '30px',
                                                    // fontSize: '13px',
                                                },
                                                '&:hover': {
                                                    backgroundColor: isTotal ? '#f1f3f5' : '#e0ecfa'
                                                }
                                            }}
                                        >
                                            <TableCell
                                                sx={{
                                                    borderRight: "1px solid rgba(0,0,0,0.05)",
                                                    fontWeight: isTotal ? 'bold' : 600,
                                                    color: isTotal ? '#2c3e50' : '#376a7d',
                                                    fontSize: isTotal ? '14px' : '13px',
                                                    py: 2,
                                                    borderBottom: i === rows.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                {row?.bank_group_name}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    fontWeight: isTotal ? 'bold' : 600,
                                                    color: isTotal ? '#2c3e50' : '#376a7d',
                                                    fontSize: '13px',
                                                    py: 2,
                                                    borderBottom: i === rows.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                {row?.total_balance}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <TableRow
                                            key={i}
                                            sx={{
                                                '& .MuiTableCell-root': {
                                                    py: '4px',
                                                    height: '30px',
                                                    fontSize: '13px',
                                                },
                                                '&:hover': {
                                                    backgroundColor: 'rgba(55, 106, 125, 0.03)'
                                                },
                                                '&:last-child td': {
                                                    borderBottom: 'none'
                                                }
                                            }}
                                        >
                                            <TableCell
                                                sx={{
                                                    borderRight: "1px solid rgba(0,0,0,0.05)",
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    py: 2,
                                                    color: '#4a5568',
                                                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                {row?.bank_group_name}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    py: 2,
                                                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                <Box
                                                    onClick={() => handleCellClick(row?.id, row)}
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        //   px: 1.5,
                                                        py: 0.5,
                                                        borderRadius: '4px',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(55, 106, 125, 0.08)',
                                                            transform: 'translateX(-2px)'
                                                        }
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            color: '#376a7d',
                                                            fontWeight: '500',
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        {row?.total_balance}
                                                    </Typography>
                                                    <Box sx={{
                                                        ml: 1,
                                                        display: 'flex',
                                                        color: 'rgba(55, 106, 125, 0.6)'
                                                    }}>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })) : (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 4,
                                    height: 200
                                }}>
                                    <Typography variant="h6" sx={{ color: '#78909c', mb: 1 }}>
                                        No Data Available
                                    </Typography>
                                </Box>
                            )}
                        </TableBody>
                    )}
                </Table>
            </TableContainer>
        </Box>
    );
};

export default BankGroupBankBalanceIndex;

