import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Card, CardContent, Grid, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import { PDFDownloadLink, BlobProvider } from '@react-pdf/renderer';
import LedgerMasterIndexPdf from './LedgerMasterIndexPdf';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useAlert from "../../../hooks/useAlert";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import PrintIcon from '@mui/icons-material/Print';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomMonthYearPicker from "../../../components/Inputs/CustomMonthYearPicker";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";

const initialValues = {
    voucherHeadId: "",
    fcYearId: "",
    fcYear: "",
    voucherHeadName: ""
};

const VoucherTypes = [
    {
        value: 1,
        label: "Ledger"
    },
    {
        value: 2,
        label: "Bill No"
    },
    {
        value: 3,
        label: "Narration"
    },
    {
        value: 4,
        label: "Ledger Amount"
    },
    {
        value: 5,
        label: "Date"
    }
]

const ledgerAmountTypes = [
    {
        value: 1,
        label: "Credit"
    },
    {
        value: 2,
        label: "Debit"
    }
]

const ledgerAmountCondition = [
    {
        value: 1,
        label: "greater than"
    },
    {
        value: 2,
        label: "less than"
    },
    {
        value: 3,
        label: "equal to"
    }
]

const NarrationTypes = [
    {
        value: 1,
        label: "contains"
    },
    {
        value: 2,
        label: "excludes"
    },
    {
        value: 3,
        label: "equals"
    },
    {
        value: 3,
        label: "ends with"
    }
]

const dateTypes = [
    {
        value: 1,
        label: "Date"
    },
    {
        value: 2,
        label: "Month"
    },
    {
        value: 3,
        label: "Year"
    },
]

function VendorMasterIndex() {
    const [rows, setRows] = useState([]);
    const [values, setValues] = useState();
    const [vendorOptions, setVendorOptions] = useState([]);
    const [fcYearOptions, setFCYearOptions] = useState([]);
    const [loading, setLoading] = useState(false)
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        usn: false,
        collageWaiver: false,
        hostelWaiver: false,
    })
    const [showFilters, setShowFilters] = useState(false)
    const [selectedVoucher, setSelectedVoucher] = useState({
        voucherType: "",
        dateType: ""
    })
    const [filters, setFilters] = useState({})
    const navigate = useNavigate();
    const location = useLocation()
    const setCrumbs = useBreadcrumbs();
    const { setAlertMessage, setAlertOpen } = useAlert();

    const columns = [
        { field: "school_name_short", headerName: "Institute", flex: 1, headerClassName: "header-bg", headerAlign: 'center', align: 'center' },
        { field: "openingBalance", headerName: "Opening Balance", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center' },
        { field: "debit", headerName: "Debit", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        { field: "credit", headerName: "Credit", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
        { field: "closingBalance", headerName: "Closing Balance", flex: 1, headerClassName: "header-bg", align: 'right', headerAlign: 'center', },
    ];

    useEffect(() => {
        if (location?.state) {
            setValues(location.state);
            navigate(location.pathname, { replace: true, state: null });
        } else {
            setValues(initialValues)
        }
        setCrumbs([{ name: "Ledger" }])
        getVendorDetails();
        getFinancialYearDetails();
    }, []);

    useEffect(() => {
        if (values?.voucherHeadId && values?.fcYearId)
            getData();
    }, [values?.voucherHeadId, values?.fcYearId]);

    const getData = async () => {
        const { voucherHeadId, fcYearId } = values
        const baseUrl = "/api/finance/getLedgerSummaryByVoucherHeadId"
        const params = {
            ...(voucherHeadId && { voucherHeadNewId: voucherHeadId }),
            ...(fcYearId && { fcYearId }),
        }
        setLoading(true)
        await axios
            .get(baseUrl, { params })
            .then((res) => {
                const { data } = res?.data
                const rowData = []
                data?.vendorDetails?.length > 0 && data?.vendorDetails?.map((obj) => {
                    rowData.push({
                        school_name_short: obj?.school_name_short,
                        debit: formatCurrency(obj?.debit),
                        credit: formatCurrency(obj?.credit),
                        school_id: obj?.school_id,
                        bankId: obj?.bankId,
                        isLastRow: false,
                        ledgerType: obj?.ledgerType,
                        openingBalance: formatDrCr(obj?.openingBalance, obj?.ledgerType),
                        closingBalance: formatDrCr(obj?.closingBalance, obj?.ledgerType),
                    })
                })
                if (data?.vendorDetails?.length > 0) {
                    rowData.push({
                        school_name_short: "Total",
                        openingBalance: formatCurrency(data?.openingBalance),
                        debit: formatCurrency(data?.totalDebit),
                        credit: formatCurrency(data?.totalCredit),
                        closingBalance: formatCurrency(data?.closingBalance),
                        school_id: Date.now(),
                        isLastRow: true,
                        ledgerType: data?.vendorDetails[0]?.ledgerType
                    })
                }
                setRows(rowData || []);
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

    const formatDrCr = (value, ledgerType) => {
        const absVal = Math.abs(value);

        if (value === 0) return "0.00";

        if (ledgerType === "VENDOR" || ledgerType === "INFLOW") {
            return value < 0 ? `${formatCurrency(absVal)} Dr` : `${formatCurrency(absVal)} Cr`;
        } else if (ledgerType === "CASHORBANK" || ledgerType === 'EARNINGS' || ledgerType === "ASSETS/ADVANCE" || ledgerType === "EXPENDITURE") {
            return value > 0 ? `${formatCurrency(absVal)} Dr` : `${formatCurrency(absVal)} Cr`;
        } else {
            return value;
        }
    };

    const getVendorDetails = async () => {
        await axios
            .get('/api/finance/VoucherHeadNew')
            .then((res) => {
                const { data } = res?.data
                const optionData = [];
                data?.length > 0 && data?.forEach((obj) => {
                    optionData.push({
                        value: obj?.voucher_head_new_id,
                        label: obj?.voucher_head
                    });
                });
                setVendorOptions(optionData);
            })
            .catch((err) => {
                setAlertMessage({
                    severity: "error",
                    message: "Something went wrong.",
                });
                setAlertOpen(true);
                console.error(err)
            })
    };

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

                setFCYearOptions(optionData || []);
                if (!location?.state) {
                    setValues((prev) => ({
                        ...prev,
                        ['fcYearId']: optionData[0]?.value || "",
                        ['fcYear']: optionData[0]?.label
                    }));
                }
            })
            .catch((err) => {
                setAlertMessage({
                    severity: "error",
                    message: "Something went wrong.",
                });
                setAlertOpen(true);
                console.error(err)
            });
    };

    const handleChangeAdvance = (name, newValue, valueLabel) => {
        if (name === 'fcYearId') {
            const fcYearObj = fcYearOptions?.length > 0 && fcYearOptions?.find((fc) => fc.value === newValue)
            setValues((prev) => ({
                ...prev,
                [name]: newValue,
                ['fcYear']: fcYearObj?.label
            }));
        } else {
            setValues((prev) => ({
                ...prev,
                [name]: newValue,
                ['voucherHeadName']: valueLabel
            }));
        }
    };

    const handlePrevOBClick = () => {
        const currentIndex = fcYearOptions?.findIndex(
            (item) => item?.value === values?.fcYearId
        );
        if (currentIndex < fcYearOptions?.length - 1) {
            const prevYear = fcYearOptions[currentIndex + 1];
            setValues((prev) => ({
                ...prev,
                ['fcYearId']: prevYear?.value,
                ['fcYear']: prevYear?.label
            }));
        }
    };

    const handleNextOBClick = () => {
        const currentIndex = fcYearOptions?.findIndex(
            (item) => item?.value === values?.fcYearId
        );
        if (currentIndex > 0) {
            const nextFCYear = fcYearOptions[currentIndex - 1];
            setValues((prev) => ({
                ...prev,
                ['fcYearId']: nextFCYear?.value,
                ['fcYear']: nextFCYear?.label
            }));
        }
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

    const handleRowClick = (params) => {
         if (params?.row?.isLastRow && params?.row?.ledgerType !== "EARNINGS") return;
         
        const query = {
            ...values,
            schoolId: params.row.school_id,
            schoolName: params.row.school_name_short,
            bankId: params.row.bankId,
            fcYearOpt: fcYearOptions || [],
            ledgerType: params?.row.ledgerType,
            isTotalRow: params?.row?.isLastRow ? true : false,
        }
        navigate('/Accounts-ledger-monthly-detail', { state: query })
    }

    const handleFilter = () => {
        setShowFilters(!showFilters)
        setSelectedVoucher({})
        setFilters({})
    }

    const handleFilterChange = (name, value, valueLabel) => {
        if (name === 'voucherType') {
            setSelectedVoucher(prev => ({ ...prev, voucherType: valueLabel }))
            setFilters({})
        }
        if (name === 'dateRange') {
            setSelectedVoucher(prev => ({ ...prev, dateType: valueLabel }))
            setFilters({})
        }
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    return (
        <>
            <Box sx={{ position: "relative" }}>
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 2,
                    p: 2,
                    backgroundColor: 'rgba(245, 245, 245, 0.5)',
                    borderRadius: 1,
                    alignItems: 'flex-end',
                    width: '70%',
                    margin: 'auto',
                }}>
                    <Box sx={{ flex: 1, minWidth: 250 }}>
                        <CustomAutocomplete
                            name="voucherHeadId"
                            label="List Of Ledgers"
                            value={values?.voucherHeadId}
                            options={vendorOptions}
                            handleChangeAdvance={handleChangeAdvance}
                            size="small"
                        />
                    </Box>

                    <Box sx={{ width: 200 }}>
                        <CustomAutocomplete
                            name="fcYearId"
                            label="Financial Year"
                            value={values?.fcYearId}
                            options={fcYearOptions}
                            handleChangeAdvance={handleChangeAdvance}
                            disabled={true}
                            size="small"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'end' }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={handlePrevOBClick}
                            disabled={values?.fcYearId === fcYearOptions[fcYearOptions?.length - 1]?.value}
                            sx={{
                                backgroundColor: '#f5f5f5',
                                '&:hover': {
                                    backgroundColor: '#e0e0e0',
                                },
                                fontWeight: 500,
                                color: '#424242',
                                height: '36px'
                            }}
                        >
                            Prev Year
                        </Button>
                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardIcon />}
                            onClick={handleNextOBClick}
                            disabled={values?.fcYearId === fcYearOptions[0]?.value}
                            sx={{
                                backgroundColor: '#e3f2fd',
                                '&:hover': {
                                    backgroundColor: '#bbdefb',
                                },
                                fontWeight: 500,
                                color: '#1976d2',
                                height: '36px'
                            }}
                        >
                            Next Year
                        </Button>
                        <BlobProvider
                            document={
                                <LedgerMasterIndexPdf
                                    data={{ columns, rows }}
                                    filters={{
                                        voucherHeadName: values?.voucherHeadName,
                                        fcYear: values?.fcYear
                                    }}
                                />
                            }
                        >
                            {({ url, loading }) => (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={rows?.length === 0}
                                    onClick={() => {
                                        if (url) {
                                            window.open(url, '_blank');
                                        }
                                    }}
                                    sx={{ height: '36px' }}
                                >
                                    Print PDF
                                </Button>
                            )}
                        </BlobProvider>
                    </Box>
                </Box>
                <Box sx={{
                    width: '70%',
                    margin: '20px auto 10px auto',
                    textAlign: 'left',
                    paddingRight: '12px'
                }}>
                    <Typography variant="subtitle2" sx={{
                        fontWeight: 600,
                        color: '#376a7d',
                        fontStyle: 'italic',
                        fontSize: '16px',
                        textAlign: 'center'
                    }}>
                        {values?.voucherHeadName ? (
                            `${values?.voucherHeadName} Ledger for FY ${values?.fcYear} as on ${moment().format('DD-MM-YYYY')}`
                        ) : (
                            <></>
                        )}
                    </Typography>
                </Box>
                <Box sx={{
                    height: 'calc(100vh - 220px)',
                    width: '70%',
                    margin: 'auto',
                    '& .last-row': {
                        fontWeight: 700,
                        backgroundColor: "#376a7d !important",
                        color: "#fff",
                        '&:hover': {
                            backgroundColor: "#2a5262 !important", 
                        }
                    },
                    '& .header-bg': {
                        fontWeight: "bold",
                        backgroundColor: "#376a7d !important",
                        color: "#fff"
                    },
                }}>
                    <GridIndex
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        getRowClassName={(params) => params.row.isLastRow ? "last-row" : ""}
                        getRowId={(row) => row?.school_id}
                        columnVisibilityModel={columnVisibilityModel}
                        setColumnVisibilityModel={setColumnVisibilityModel}
                        // isRowSelectable={(params) => !params.row.isLastRow}
                        onRowClick={(params) => handleRowClick(params)}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-row:hover': {
                                cursor: 'pointer',
                                backgroundColor: 'rgba(55, 106, 125, 0.08)',
                            },
                            '& .MuiDataGrid-cell:focus': { outline: 'none' },
                        }}
                    />
                </Box>
            </Box>
        </>
    );

    // return (
    //     <Box sx={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         height: 'auto',
    //         p: 2,
    //         gap: 1,
    //         overflow: 'hidden',
    //         boxSizing: 'border-box'
    //     }}>
    //         <Box sx={{
    //             display: 'flex',
    //             flexWrap: 'wrap',
    //             gap: 2,
    //             mb: 2,
    //             p: 2,
    //             backgroundColor: 'rgba(245, 245, 245, 0.5)',
    //             borderRadius: 1,
    //             alignItems: 'flex-end',
    //             width: '100%',
    //             boxSizing: 'border-box',
    //             justifyContent: "space-between"
    //         }}>
    //             <Box sx={{ display: "flex", gap: 3 }}>
    //                 <Box sx={{ flex: 1, minWidth: 450 }}>
    //                     <CustomAutocomplete
    //                         name="voucherHeadId"
    //                         label="List Of Ledgers"
    //                         value={values?.voucherHeadId}
    //                         options={vendorOptions}
    //                         handleChangeAdvance={handleChangeAdvance}
    //                         size="small"
    //                     />
    //                 </Box>
    //                 <Box sx={{ width: 300 }}>
    //                     <CustomAutocomplete
    //                         name="fcYearId"
    //                         label="Financial Year"
    //                         value={values?.fcYearId}
    //                         options={fcYearOptions}
    //                         handleChangeAdvance={handleChangeAdvance}
    //                         disabled={true}
    //                         size="small"
    //                     />
    //                 </Box>
    //             </Box>

    //             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'end' }}>
    //                 <Button
    //                     variant="outlined"
    //                     startIcon={<ArrowBackIcon />}
    //                     onClick={handlePrevOBClick}
    //                     disabled={values?.fcYearId === fcYearOptions[fcYearOptions?.length - 1]?.value}
    //                     sx={{
    //                         backgroundColor: '#f5f5f5',
    //                         '&:hover': { backgroundColor: '#e0e0e0' },
    //                         fontWeight: 500,
    //                         color: '#424242',
    //                         height: '36px'
    //                     }}
    //                     size="small"
    //                 >
    //                     Prev Year
    //                 </Button>
    //                 <Button
    //                     variant="outlined"
    //                     endIcon={<ArrowForwardIcon />}
    //                     onClick={handleNextOBClick}
    //                     disabled={values?.fcYearId === fcYearOptions[0]?.value}
    //                     sx={{
    //                         backgroundColor: '#e3f2fd',
    //                         '&:hover': { backgroundColor: '#bbdefb' },
    //                         fontWeight: 500,
    //                         color: '#1976d2',
    //                         height: '36px'
    //                     }}
    //                     size="small"
    //                 >
    //                     Next Year
    //                 </Button>
    //                 <Button
    //                     variant="outlined"
    //                     onClick={handleFilter}
    //                     startIcon={<FilterListIcon />}
    //                     sx={{
    //                         height: '36px',
    //                         fontWeight: 500,
    //                         backgroundColor: showFilters ? '#e0e0e0' : '#f5f5f5',
    //                         '&:hover': { backgroundColor: '#e0e0e0' },
    //                         color: '#424242'
    //                     }}
    //                     size="small"
    //                 >
    //                     {showFilters ? 'Hide Filters' : 'Show Filters'}
    //                 </Button>
    //                 <BlobProvider
    //                     document={
    //                         <LedgerMasterIndexPdf
    //                             data={{ columns, rows }}
    //                             filters={{
    //                                 voucherHeadName: values?.voucherHeadName,
    //                                 fcYear: values?.fcYear
    //                             }}
    //                         />
    //                     }
    //                 >
    //                     {({ url, loading }) => (
    //                         <Button
    //                             variant="contained"
    //                             color="primary"
    //                             disabled={rows?.length === 0}
    //                             onClick={() => {
    //                                 if (url) {
    //                                     window.open(url, '_blank');
    //                                 }
    //                             }}
    //                             sx={{ height: '36px' }}
    //                         >
    //                             Print PDF
    //                         </Button>
    //                     )}
    //                 </BlobProvider>
    //             </Box>
    //         </Box>

    //         {values?.voucherHeadName && (
    //             <Typography variant="subtitle1" sx={{
    //                 fontWeight: 600,
    //                 color: '#2c3e50',
    //                 textAlign: 'center',
    //                 py: 1
    //             }}>
    //                 {`${values.voucherHeadName} Ledger for FY ${values.fcYear} as on ${moment().format('DD-MM-YYYY')}`}
    //             </Typography>
    //         )}

    //         {!showFilters && (
    //             <Box sx={{
    //                 width: '100%',
    //                 overflow: 'hidden',
    //                 border: '1px solid #e0e0e0',
    //                 borderRadius: '8px',
    //                 boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    //             }}>
    //                 <GridIndex
    //                     rows={rows}
    //                     columns={columns}
    //                     loading={loading}
    //                     getRowClassName={(params) => params.row.isLastRow ? "last-row" : ""}
    //                     getRowId={(row) => row?.school_id}
    //                     columnVisibilityModel={columnVisibilityModel}
    //                     setColumnVisibilityModel={setColumnVisibilityModel}
    //                     // isRowSelectable={(params) => !params.row.isLastRow}
    //                     onRowClick={(params) => handleRowClick(params)}
    //                     sx={{
    //                         width: '100%',
    //                         border: 'none',
    //                         '& .MuiDataGrid-root': {
    //                             border: 'none',
    //                             fontFamily: 'inherit'
    //                         },
    //                         '& .MuiDataGrid-columnHeaders': {
    //                             backgroundColor: '#376a7d',
    //                             color: '#fff',
    //                             borderTopLeftRadius: '8px',
    //                             borderTopRightRadius: '8px',
    //                             fontSize: '0.875rem'
    //                         },
    //                         '& .MuiDataGrid-cell': {
    //                             borderBottom: '1px solid #f0f0f0',
    //                             fontSize: '0.875rem',
    //                             padding: '8px 16px',
    //                             display: 'flex',
    //                             alignItems: 'center',
    //                             '& .MuiDataGrid-cellContent': {
    //                                 width: '100%'
    //                             }
    //                         },
    //                         '& .MuiDataGrid-cellContent': {
    //                             whiteSpace: 'normal',
    //                             lineHeight: '1.4',
    //                             display: 'flex',
    //                             alignItems: 'center',
    //                             minHeight: '100%'
    //                         },
    //                         '& .MuiDataGrid-row': {
    //                             '&:hover': {
    //                                 backgroundColor: 'rgba(44, 62, 80, 0.04)',
    //                                 cursor: 'pointer'
    //                             },
    //                             '&:nth-of-type(even)': {
    //                                 backgroundColor: '#f9f9f9'
    //                             }
    //                         },
    //                         '& .MuiDataGrid-virtualScroller': {
    //                             backgroundColor: '#fff'
    //                         },
    //                         '& .MuiDataGrid-footerContainer': {
    //                             borderTop: '1px solid #e0e0e0',
    //                             backgroundColor: '#f5f5f5',
    //                             borderBottomLeftRadius: '8px',
    //                             borderBottomRightRadius: '8px'
    //                         },
    //                         '& .last-row': {
    //                             fontWeight: 700,
    //                             backgroundColor: "#376a7d !important",
    //                             color: "#fff !important",
    //                             '& .MuiDataGrid-cell': {
    //                                 borderBottom: 'none',
    //                                 display: 'flex',
    //                                 alignItems: 'center'
    //                             }
    //                         },
    //                         '& .header-bg': {
    //                             fontWeight: "bold",
    //                             backgroundColor: "#376a7d !important",
    //                             color: "#fff !important"
    //                         },
    //                         '& .MuiDataGrid-columnSeparator': {
    //                             display: 'none'
    //                         },
    //                         '& .MuiDataGrid-menuIcon': {
    //                             color: '#fff'
    //                         },
    //                         '& .MuiDataGrid-sortIcon': {
    //                             color: '#fff'
    //                         }
    //                     }}
    //                 />
    //             </Box>
    //         )}

    //         {showFilters && (
    //             <Box sx={{
    //                 display: 'flex',
    //                 gap: 2,
    //                 width: '100%',
    //                 boxSizing: 'border-box'
    //             }}>
    //                 <Box sx={{
    //                     width: 'calc(100% - 300px)',
    //                     overflow: 'hidden',
    //                     border: '1px solid #e0e0e0',
    //                     borderRadius: '8px',
    //                     boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    //                 }}>
    //                     <GridIndex
    //                         rows={rows}
    //                         columns={columns}
    //                         loading={loading}
    //                         getRowClassName={(params) => params.row.isLastRow ? "last-row" : ""}
    //                         getRowId={(row) => row?.school_id}
    //                         columnVisibilityModel={columnVisibilityModel}
    //                         setColumnVisibilityModel={setColumnVisibilityModel}
    //                         // isRowSelectable={(params) => !params.row.isLastRow}
    //                         onRowClick={(params) => handleRowClick(params)}
    //                         sx={{
    //                             width: '100%',
    //                             border: 'none',
    //                             '& .MuiDataGrid-root': {
    //                                 border: 'none',
    //                                 fontFamily: 'inherit'
    //                             },
    //                             '& .MuiDataGrid-columnHeaders': {
    //                                 backgroundColor: '#2c3e50',
    //                                 color: '#fff',
    //                                 borderTopLeftRadius: '8px',
    //                                 borderTopRightRadius: '8px',
    //                                 fontSize: '0.875rem'
    //                             },
    //                             '& .MuiDataGrid-cell': {
    //                                 borderBottom: '1px solid #f0f0f0',
    //                                 fontSize: '0.875rem',
    //                                 padding: '8px 16px',
    //                                 display: 'flex',
    //                                 alignItems: 'center',
    //                                 '& .MuiDataGrid-cellContent': {
    //                                     width: '100%'
    //                                 }
    //                             },
    //                             '& .MuiDataGrid-cellContent': {
    //                                 whiteSpace: 'normal',
    //                                 lineHeight: '1.4',
    //                                 display: 'flex',
    //                                 alignItems: 'center',
    //                                 minHeight: '100%'
    //                             },
    //                             '& .MuiDataGrid-row': {
    //                                 '&:hover': {
    //                                     backgroundColor: 'rgba(44, 62, 80, 0.04)',
    //                                     cursor: 'pointer'
    //                                 },
    //                                 '&:nth-of-type(even)': {
    //                                     backgroundColor: '#f9f9f9'
    //                                 }
    //                             },
    //                             '& .MuiDataGrid-virtualScroller': {
    //                                 backgroundColor: '#fff'
    //                             },
    //                             '& .MuiDataGrid-footerContainer': {
    //                                 borderTop: '1px solid #e0e0e0',
    //                                 backgroundColor: '#f5f5f5',
    //                                 borderBottomLeftRadius: '8px',
    //                                 borderBottomRightRadius: '8px'
    //                             },
    //                             '& .last-row': {
    //                                 fontWeight: 700,
    //                                 backgroundColor: "#2c3e50 !important",
    //                                 color: "#fff !important",
    //                                 '& .MuiDataGrid-cell': {
    //                                     borderBottom: 'none',
    //                                     display: 'flex',
    //                                     alignItems: 'center'
    //                                 }
    //                             },
    //                             '& .header-bg': {
    //                                 fontWeight: "bold",
    //                                 backgroundColor: "#2c3e50 !important",
    //                                 color: "#fff !important"
    //                             },
    //                             '& .MuiDataGrid-columnSeparator': {
    //                                 display: 'none'
    //                             },
    //                             '& .MuiDataGrid-menuIcon': {
    //                                 color: '#fff'
    //                             },
    //                             '& .MuiDataGrid-sortIcon': {
    //                                 color: '#fff'
    //                             }
    //                         }}
    //                     />
    //                 </Box>

    //                 <Box sx={{
    //                     width: 300,
    //                     flexShrink: 0,
    //                     p: 2,
    //                     backgroundColor: 'white',
    //                     borderRadius: '8px',
    //                     boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    //                     border: '1px solid #e0e0e0'
    //                 }}>
    //                     <CustomAutocomplete
    //                         name="voucherType"
    //                         label="Filter by"
    //                         value={filters?.voucherType}
    //                         options={VoucherTypes}
    //                         handleChangeAdvance={handleFilterChange}
    //                         size="small"
    //                     />

    //                     <Box sx={{ mt: 2, mb: 2 }}>
    //                         {selectedVoucher?.voucherType === "Ledger" && (
    //                             <CustomTextField
    //                                 label="Ledger name"
    //                                 name="ledgerName"
    //                                 value={filters?.ledgerName}
    //                                 handleChange={handleChange}
    //                             />
    //                         )}

    //                         {selectedVoucher?.voucherType === "Ledger Amount" && (
    //                             <Box sx={{ display: 'flex', flexDirection: "column", gap: 1 }}>
    //                                 <CustomAutocomplete
    //                                     name="amountType"
    //                                     label="Type"
    //                                     value={filters?.amountType}
    //                                     options={ledgerAmountTypes}
    //                                     handleChangeAdvance={handleFilterChange}
    //                                     size="small"
    //                                 />
    //                                 <CustomAutocomplete
    //                                     name="amountCondition"
    //                                     label="Condition"
    //                                     value={filters?.amountCondition}
    //                                     options={ledgerAmountCondition}
    //                                     handleChangeAdvance={handleFilterChange}
    //                                     size="small"
    //                                 />
    //                                 <CustomTextField
    //                                     label="Amount"
    //                                     name="amount"
    //                                     value={filters?.amount}
    //                                     handleChange={handleChange}
    //                                 />
    //                             </Box>
    //                         )}

    //                         {selectedVoucher?.voucherType === "Narration" && (
    //                             <Box sx={{ display: 'flex', flexDirection: "column", gap: 1 }}>
    //                                 <CustomAutocomplete
    //                                     name="narrationCondition"
    //                                     label="Condition"
    //                                     value={filters?.narrationCondition}
    //                                     options={NarrationTypes}
    //                                     handleChangeAdvance={handleFilterChange}
    //                                     size="small"
    //                                 />
    //                                 <CustomTextField
    //                                     label="Narration"
    //                                     name="narrationText"
    //                                     value={filters?.narrationText}
    //                                     handleChange={handleChange}
    //                                 />
    //                             </Box>
    //                         )}

    //                         {selectedVoucher?.voucherType === "Date" && (
    //                             <Box sx={{ display: 'flex', flexDirection: "column", gap: 1 }}>
    //                                 <CustomAutocomplete
    //                                     name="dateRange"
    //                                     label="Range"
    //                                     value={filters?.dateRange}
    //                                     options={dateTypes}
    //                                     handleChangeAdvance={handleFilterChange}
    //                                     size="small"
    //                                 />
    //                                 {/* <CustomTextField
    //                                     label={filters.dateRange === "Month" ? "MM-YYYY" : filters.dateRange === "Year" ? "YYYY" : "DD-MM-YYYY"}
    //                                     name="date"
    //                                     value={filters?.date}
    //                                     handleChange={handleChange}
    //                                 /> */}
    //                                 {selectedVoucher?.dateType === 'Date' ? (
    //                                     <CustomDatePicker
    //                                         name="date"
    //                                         label="Date"
    //                                         value={filters?.date}
    //                                         handleChangeAdvance={handleFilterChange}
    //                                     />
    //                                 ) : <></>}
    //                                 {selectedVoucher?.dateType === 'Month' ? (
    //                                     <CustomMonthYearPicker
    //                                         name="date"
    //                                         label="Month"
    //                                         //   minDate={new Date()}
    //                                         value={filters?.date}
    //                                         handleChangeAdvance={handleFilterChange}
    //                                     />
    //                                 ) : <></>}
    //                             </Box>
    //                         )}
    //                     </Box>

    //                     <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
    //                         <Button
    //                             variant="outlined"
    //                             size="small"
    //                             onClick={() => {
    //                                 setFilters({});
    //                                 // setSelectedVoucher("");
    //                                  setSelectedVoucher({});
    //                             }}
    //                             sx={{ borderRadius: '4px', textTransform: 'none', fontSize: '0.85rem', px: 2, py: 0.5 }}
    //                         >
    //                             Clear
    //                         </Button>
    //                         <Button
    //                             variant="contained"
    //                             size="small"
    //                             onClick={() => console.log("Filters applied:", filters)}
    //                             sx={{ borderRadius: '4px', textTransform: 'none', fontSize: '0.85rem', px: 2, py: 0.5, boxShadow: 'none' }}
    //                         >
    //                             Apply
    //                         </Button>
    //                     </Box>
    //                 </Box>
    //             </Box>
    //         )}
    //     </Box>
    // )
}
export default VendorMasterIndex;
