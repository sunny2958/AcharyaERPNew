import { useState, useEffect, lazy } from "react";
import {
  Box, Grid, Button, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses, styled,
  CircularProgress,
  Typography
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs.js";
import { CSVLink } from "react-csv";
import useAlert from "../../hooks/useAlert.js";
import { makeStyles } from "@mui/styles";
import axios from "../../services/Api.js";
import moment from "moment";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { GenerateSalaryMisReport } from "./GenerateSalaryMisReport.jsx";
const ModalWrapper = lazy(() => import("../../components/ModalWrapper"));
const CustomAutocomplete = lazy(() =>
  import("../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomDatePicker = lazy(() =>
  import("../../components/Inputs/CustomDatePicker")
);
const GridIndex = lazy(() => import("../../components/GridIndex.jsx"));

const useStyles = makeStyles((theme) => ({
  header: {
    color: "white", textAlign: "center", fontSize: "14px"
  },
  flexCenter: {
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },
  flexAlignCenter: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  box: {
    marginTop: "8px",
    boxShadow:
      "0px 8px 8px 0px rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      textAlign: "center",
    },
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center"
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
}));

const StyledOddTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const salaryReportTypeList = [
  { value: "bank", label: "Bank" },
  { value: "lic", label: "LIC" },
  { value: "advance", label: "Advance" },
  { value: "tds", label: "TDS" },
  { value: "pt", label: "PT" },
  { value: "esi", label: "ESI" },
  { value: "epf", label: "EPF" },
  { value: "summary", label: "Summary" },
  { value: "school", label: "School" },
];

const bankList = [
  { value: "YES BANK", label: "Yes Bank" },
  { value: "other", label: "Others" },
];

const employeeTypeList = [
  { value: "regular", label: "Regular" },
  { value: "consultant", label: "Consultant" }
];

const initialState = {
  schoolId: null,
  deptId: null,
  bank: null,
  loading: false,
  schoolList: [],
  deptList: [],
  salaryReportType: salaryReportTypeList[0].value,
  date: new Date(),
  rows: [],
  attendanceRows: [],
  earningRows: [],
  deductionRows: [],
  schoolRows: [],
  bankTotalNetPay: 0,
  licTotal: 0,
  esiTotal: 0,
  advanceTotal: 0,
  tdsTotal: 0,
  ptTotal: 0,
  grossEarningTotal: 0,
  totalEarning: 0,
  esimTotal: 0,
  esiGrossEarningTotal: 0,
  schoolNetPayTotal: 0,
  schoolShortName: "",
  epfRows: [],
  employeeType: employeeTypeList[0].value,
  consultantEpfRows: [],
  consultationTotal:0,
  consultantionTdsTotal:0,
  consultationPayableTotal:0
};

const SalaryMisIndex = () => {
  const [{ schoolId, loading, schoolList, schoolShortName, bank, salaryReportType, date, rows, attendanceRows, earningRows, deductionRows,
    schoolRows, bankTotalNetPay, licTotal, esiTotal, advanceTotal, tdsTotal, ptTotal, grossEarningTotal, totalEarning,
    esimTotal, esiGrossEarningTotal, schoolNetPayTotal, epfRows, employeeType, consultantEpfRows,consultationTotal,consultantionTdsTotal,consultationPayableTotal }, setState] = useState(initialState);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [reportPath, setReportPath] = useState(null);
  const [bankExportData, setBankExportData] = useState([]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    contract_empcode: false,
    date_of_joining: false,
    departmentShortName: false,
    designationShortName: false,
    empcode:false,
    schoolShortName:false,
    dateofbirth:false
  });
  const classes = useStyles();

  useEffect(() => {
    setCrumbs([{ name: `${salaryReportType?.toUpperCase()}` }]);
  }, [salaryReportType]);

  useEffect(() => {
    getSchoolData();
  }, []);

  useEffect(() => {
    getData(salaryReportType)
  }, [schoolId, bank, date, employeeType]);

  const getSchoolData = async () => {
    try {
      const res = await axios.get(`/api/institute/school`);
      if (res.status == 200 || res.status == 201) {
        setState((prevState) => ({
          ...prevState,
          schoolList: res.data.data.map((ele) => ({ value: ele.school_id, label: ele.school_name, schoolShortName: ele.school_name_short }))
        }))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const getData = async (type = "bank") => {
    try {
      if (date && (type !== "summary" && type !== "school")) {
        setLoading(true);
        const apiUrl = `api/employee/employeePayHistoryReport`;
        const res = await axios.get((!schoolId && !bank && date) ? `${apiUrl}?month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}` :
          (schoolId && bank && date) ? `${apiUrl}?schoolId=${schoolId}&bankId=${bank}&month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}` :
            (schoolId && !bank && date) ? `${apiUrl}?schoolId=${schoolId}&month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}` :
              (!schoolId && bank && date) ? `${apiUrl}?bankId=${bank}&month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}` : "");
        if (res.status == 200 || res.status == 201) {
          
          const epfList = res.data.data?.map((ep, index) => ({
            id: index + 1,
            uan_no: `\t${ep.uan_no}`,
            empcode: ep.empcode,
            contract_empcode: ep.contract_empcode,
            employee_name: ep.employee_name,
            dateofbirth: ep.dateofbirth,
            date_of_joining: ep.date_of_joining,
            schoolShortName: ep.schoolShortName,
            departmentShortName:ep.departmentShortName,
            designationShortName:ep.designationShortName,
            grossWages: ep.total_earning,
            edliWages: ep.pf_earnings,
            epfWages: ep.pf_earnings,
            epsWages: ep.pf_earnings,
            epscontriRemitted: ep.pension_fund,
            epfContriRemitted: ep.pf,
            epfEpsDiffRemitted: ep.epf_difference,
            ncpDays: 0,
            refundOfAdvances: 0
          }));

          const bankExportList = res.data.data?.map((ep, index) => ({
            id: index + 1,
            Bank: ep.bank_id,
            IFSCNo: ep.bank_ifsccode,
            BankAccountNo: `\t${ep.bank_account_no}`,
            EmployeeName: ep.employee_name,
            NetAmount: ep.netpay
          }));
          setBankExportData(bankExportList);
          setState((prevState) => ({
            ...prevState,
            rows: type == "bank" ? res.data.data?.filter((ele) => ele.netpay !== 0) :
              type == "lic" ? res.data.data?.filter((ele) => ele.lic !== 0) :
                type == "esi" ? res.data.data?.filter((ele) => ele.esi !== 0) :
                  type == "advance" ? res.data.data?.filter((ele) => ele.advance !== 0) :
                    type == "tds" ? res.data.data?.filter((ele) => ele.tds !== null && ele.tds !== 0) : res.data.data,
            loading: false,
            bankTotalNetPay: res.data.data?.filter((ele) => ele.netpay !== 0)?.reduce((acc, curr) => acc + curr.netpay, 0),
            licTotal: res.data.data?.filter((ele) => ele.lic !== 0)?.reduce((acc, curr) => acc + curr.lic, 0),

            esiTotal: res.data.data?.filter((ele) => ele.esi !== 0)?.reduce((acc, curr) => acc + curr.esi, 0),
            esiGrossEarningTotal: res.data.data?.filter((ele) => ele.esi !== 0)?.reduce((acc, curr) => acc + curr.gross_pay, 0),
            esimTotal: res.data.data?.filter((ele) => ele.esi !== 0)?.reduce((acc, curr) => acc + curr.esi_contribution_employee, 0),
            advanceTotal: res.data.data?.filter((ele) => ele.advance !== 0)?.reduce((acc, curr) => acc + curr.advance, 0),

            tdsTotal: res.data.data?.filter((ele) => ele.tds !== null && ele.tds !== 0)?.reduce((acc, curr) => acc + curr.tds, 0),
            grossEarningTotal: res.data.data?.filter((ele) => ele.tds !== null && ele.tds !== 0)?.reduce((acc, curr) => acc + curr.gross_pay, 0),
            ptTotal: res.data.data?.filter((ele) => ele.pt !== 0)?.reduce((acc, curr) => acc + curr.pt, 0),
            totalEarning: res.data.data?.filter((ele) => ele.pt !== 0)?.reduce((acc, curr) => acc + curr.total_earning, 0),
            epfRows: epfList
          }));
        }
      } else if (date && (type !== "school" && type == "summary")) {
        setLoading(true);
        if (employeeType == "regular") {
          const apiUrl = `/api/employee/employeesCountFromAttendanceAndPaySheet`;
          const res = await axios.get(`${apiUrl}?month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}`);
          if (res.status == 200 || res.status == 201) {
            const slipApiUrl = `api/employee/totalSalarySlipByMonthAndYear`;
            const slipRes = await axios.get(`${slipApiUrl}?month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}`);
            if (slipRes.status == 200 || slipRes.status == 201) {
              const attendanceList = [
                { id: 1, name: "Total Head Count", value: res.data.data[0]?.attendanceCount || 0 },
                { id: 2, name: "Paid Head Count", value: res.data.data[0]?.paidAttendanceCount || 0 },
                { id: 3, name: "Maternity Absentees", value: res.data.data[0]?.maternity || 0 },
                { id: 4, name: "Long Absentees", value: res.data.data[0]['Absentees/Inactive'] || 0 },
              ];
              const earningList = [
                { id: 1, name: "Total Earned Salary", value: slipRes.data.data?.totalEarning || 0 },
                { id: 2, name: "Exam Remuneration", value: slipRes.data.data?.totalExtraRemuneration.find((ele) => ele.type == "Exam Remuneration")?.totalExtraRemuneration || 0 },
                { id: 3, name: "Incentive/Arrears/Maternity", value: slipRes.data.data?.totalExtraRemuneration.filter((ele) => ele.type !== "Exam Remuneration").reduce((sum, acc) => sum + acc['totalExtraRemuneration'], 0) || 0 },
                { id: 4, name: "Total Gross Salary", value: slipRes.data.data?.grossPay || 0 },
              ];
              const deductionList = [
                { id: 1, name: "EPF", value: slipRes.data.data?.pf || 0 },
                { id: 2, name: "ESI", value: slipRes.data.data?.esi || 0 },
                { id: 3, name: "PT", value: slipRes.data.data?.pt || 0 },
                { id: 4, name: "LIC", value: slipRes.data.data?.lic || 0 },
                { id: 1, name: "ADVANCE", value: slipRes.data.data?.advance || 0 },
                { id: 2, name: "TDS", value: slipRes.data.data?.tds || 0 },
                { id: 3, name: "Total Deduction", value: slipRes.data.data?.totalDeduction || 0 },
                { id: 4, name: "Net Salary Payable", value: slipRes.data.data?.netPay || 0 },
              ];
              setState((prevState) => ({
                ...prevState,
                attendanceRows: attendanceList,
                earningRows: earningList,
                deductionRows: deductionList,
                loading: false
              }));
            }
          }
        } else {
          try {
            const apiUrl = `/api/consoliation/consultantSummary`;
            const res = await axios.get(`${apiUrl}/${moment(date).format("MM")}/${moment(date).format("YYYY")}`);
            if (res.status == 200 || res.status == 201) {
              setState((prevState) => ({
                ...prevState,
                consultantEpfRows: res.data.data,
                consultationTotal:res.data.data.reduce((acc,curr)=>(acc + curr['s715']),0),
                consultantionTdsTotal:res.data.data.reduce((acc,curr)=>(acc + curr['s742']),0),
                consultationPayableTotal:res.data.data.reduce((acc,curr)=>(acc + curr['s725']),0),
                loading: false
              }))
            }
          } catch (error) {
            setLoading(false)
            setAlertMessage({
              severity: "error",
              message: "An error occured",
            });
            setAlertOpen(true);
          }
        }
      } else {
        setLoading(true);
        const apiUrl = `/api/employee/payReportOfEmployeeBySchoolAndBank`;
        const res = await axios.get(`${apiUrl}?month=${moment(date).format("MM")}&year=${moment(date).format("YYYY")}`);
        if (res.status == 200 || res.status == 201) {
          setState((prevState) => ({
            ...prevState,
            schoolRows: res.data.data.map((ele, index) => ({ id: index + 1, ...ele })),
            schoolNetPayTotal: res.data.data?.reduce((acc, curr) => acc + curr?.totalNetPay, 0),
            loading: false
          }));
        }
      }
    } catch (error) {
      setLoading(false)
      setAlertMessage({
        severity: "error",
        message: "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name == "schoolId") {
      getSchoolShortName(newValue)
    };
    if (name == "salaryReportType") {
      clearRow(newValue);
    };
    setState((prevState) => ({
      ...prevState,
      [name]: newValue
    }))
  };

  const getSchoolShortName = (newValue) => {
    setState((prevState) => ({
      ...prevState,
      schoolShortName: schoolList.find((ele) => ele.value == newValue)?.schoolShortName
    }))
  };

  const clearRow = (newValue) => {
    setState((prevState) => ({
      ...prevState,
      rows: [],
      epfRows: [],
      earningRows: [],
      deductionRows: [],
      attendanceRows: [],
      schoolRows: [],
      consultantEpfRows:[],
      employeeType:employeeTypeList[0].value
    }));
    getData(newValue);
  };

  const bankReportColumns = [
    {
      field: "bank_id",
      headerName: "Bank",
      flex: 1,
      hide: true
    },
    {
      field: "bank_ifsccode",
      headerName: "IFSC No",
      flex: 1,
      hide: true
    },
    {
      field: "bank_account_no",
      headerName: "Bank Account No.",
      flex: 1,
      hide: false,
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(params.row?.bank_account_no)}</div>,
    },
    { field: "empcode", headerName: "Emp Code", flex: 1, hide: false },
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1, hide: true },
    { field: "employee_name", headerName: "Name", flex: 2, hide: false },
    { field: "date_of_joining", headerName: "DOJ", flex: 1, hide: true },
    {
      field: "schoolShortName",
      headerName: "Inst",
      flex: 1,
      hide: false
    },
    {
      field: "departmentShortName",
      headerName: "Dept",
      flex: 1,
      hide: true
    },
    {
      field: "designationShortName",
      headerName: "Desig",
      flex: 1,
      hide: true
    },
    {
      field: "netpay",
      headerName: "Net Amount",
      flex: 1,
      type: "number",
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number((params.row?.netpay)) || 0)}</div>,
      hide: false
    },
  ];

  const bankPrintColumns = [

    { field: "empcode", headerName: "Emp Code", flex: 1, hide: false },
    { field: "employee_name", headerName: "Emp Name", flex: 2, hide: false },
    {
      field: "bank_account_no",
      headerName: "Bank Account No.",
      flex: 1,
      hide: false
    },
    {
      field: "netpay",
      headerName: "Net Amount",
      flex: 1,
      type: "number",
      hide: false
    },
  ];

  const licColumns = [
    { field: "empcode", headerName: "Emp Code", flex: 1, hide: false },
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1, hide: true },
    { field: "employee_name", headerName: "Name", flex: 2, hide: false },
    { field: "date_of_joining", headerName: "DOJ", flex: 1, hide: true },
    {
      field: "schoolShortName",
      headerName: "Inst",
      flex: 1,
      hide: true
    },
    {
      field: "departmentShortName",
      headerName: "Dept",
      flex: 1,
      hide: true
    },
    {
      field: "designationShortName",
      headerName: "Desig",
      flex: 1,
      hide: true
    },
    { field: "lic_number", headerName: "LIC Policy No.", type: "number", flex: 1, hide: false },
    {
      field: "lic",
      headerName: "LIC Amount",
      type: "number",
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number((params.row?.lic)) || 0)}</div>,
      flex: 1,
      hide: false
    },
  ];

  const esiColumns = [
    { field: "empcode", headerName: "Emp Code", flex: 1, hide: false },
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1, hide: true },
    { field: "employee_name", headerName: "Name", flex: 2, hide: false },
    { field: "date_of_joining", headerName: "DOJ", flex: 1, hide: true },
    {
      field: "schoolShortName",
      headerName: "Inst",
      flex: 1,
      hide: true
    },
    {
      field: "departmentShortName",
      headerName: "Dept",
      flex: 1,
      hide: true
    },
    {
      field: "designationShortName",
      headerName: "Desig",
      flex: 1,
      hide: true
    },
    { field: "pay_days", headerName: "Pay Days", flex: 1, hide: false },
    { field: "gross_pay", headerName: "ESI Earning", type: "number", flex: 1, hide: false,
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number((params.row?.gross_pay)) || 0)}</div> 
     },
    { field: "esi", headerName: "ESIE", type: "number", flex: 1, hide: false,
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number((params.row?.esi)) || 0)}</div> 
     },
    { field: "esi_contribution_employee", headerName: "ESIM", type: "number", flex: 1, hide: false,
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number((params.row?.esi_contribution_employee)) || 0)}</div> 
     },
  ];
  const epfColumns = [
    { field: "uan_no", headerName: "UAN", flex: 1, hide: true},
    { field: "empcode", headerName: "Emp Code", flex: 1, hide: false },
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1, hide: true },
    { field: "employee_name", headerName: "Name", flex: 2, hide: false },
    { field: "dateofbirth", headerName: "DOB", flex: 2, hide: true,valueGetter:(value,row)=>(moment(row.dateofbirth).format("DD-MM-YYYY"))},
    { field: "date_of_joining", headerName: "DOJ", flex: 1, hide: true },
    {
      field: "schoolShortName",
      headerName: "Inst",
      flex: 1,
      hide: true
    },
    {
      field: "departmentShortName",
      headerName: "Dept",
      flex: 1,
      hide: true
    },
    {
      field: "designationShortName",
      headerName: "Desig",
      flex: 1,
      hide: true
    },
    { field: "grossWages", headerName: "Gross Wages", flex: 1, hide: false, type: "number",valueGetter:(value,row)=>(`${row.grossWages}`)},
    { field: "epfWages", headerName: "EPF Wages", flex: 1, type: "number", hide: false,valueGetter:(value,row)=>(`${row.epfWages}`)},
    { field: "epsWages", headerName: "EPS Wages", flex: 1, type: "number", hide: false,valueGetter:(value,row)=>(`${row.epsWages}`)},
    { field: "edliWages", headerName: "EDLI Wages", flex: 1, type: "number", hide: false,valueGetter:(value,row)=>(`${row.edliWages}`)},
    { field: "epfContriRemitted", headerName: "EPF Contri remitted", flex: 1, type: "number", hide: false,valueGetter:(value,row)=>(`${row.epfContriRemitted}`)},
    { field: "epscontriRemitted", headerName: "EPS Contri remitted", flex: 1, type: "number", hide: false,valueGetter:(value,row)=>(`${row.epscontriRemitted}`)},
    { field: "epfEpsDiffRemitted", headerName: "EPF EPS Diff remitted", flex: 1, type: "number", hide: false,valueGetter:(value,row)=>(`${row.epfEpsDiffRemitted}`)},
    { field: "ncpDays", headerName: "NCP Days", flex: 1, type: "number", hide: false,valueGetter:(value,row)=>(`${row.ncpDays}`)},
    { field: "refundOfAdvances", headerName: "Refund Of Advances", flex: 1, type: "number", hide: false,valueGetter:(value,row)=>(`${row.refundOfAdvances}`)}
  ];
  const ptColumns = [
    { field: "empcode", headerName: "Emp Code", flex: 1, hide: false },
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1, hide: true },
    { field: "employee_name", headerName: "Name", flex: 2, hide: false },
    { field: "date_of_joining", headerName: "DOJ", flex: 1, hide: true },
    {
      field: "schoolShortName",
      headerName: "Inst",
      flex: 1,
      hide: true
    },
    {
      field: "departmentShortName",
      headerName: "Dept",
      flex: 1,
      hide: true
    },
    {
      field: "designationShortName",
      headerName: "Desig",
      flex: 1,
      hide: true
    },
    { field: "total_earning", headerName: "Gross Amount", type: "number", flex: 1, hide: false,
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number((params.row?.total_earning)) || 0)}</div> 
     },
    { field: "pt", headerName: "Deduction Amount", type: "number", flex: 1, hide: false,
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number((params.row?.pt)) || 0)}</div> 
     },
  ];

  const advanceColumns = [
    { field: "empcode", headerName: "Emp Code", flex: 1, hide: false },
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1, hide: true },
    { field: "employee_name", headerName: "Name", flex: 2, hide: false },
    { field: "date_of_joining", headerName: "DOJ", flex: 1, hide: true },
    {
      field: "schoolShortName",
      headerName: "Inst",
      flex: 1,
      hide: true
    },
    {
      field: "departmentShortName",
      headerName: "Dept",
      flex: 1,
      hide: true
    },
    {
      field: "designationShortName",
      headerName: "Desig",
      flex: 1,
      hide: true
    },
    { field: "advance", headerName: "Advance Amount", type: "number", flex: 1, hide: false,
      type: "number",
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number((params.row?.advance)) || 0)}</div>,
     }
  ];

  const tdsColumns = [
    { field: "empcode", headerName: "Emp Code", flex: 1, hide: false },
    { field: "contract_empcode", headerName: "Contract EmpCode", flex: 1, hide: true },
    { field: "employee_name", headerName: "Name", flex: 2, hide: false },
    { field: "date_of_joining", headerName: "DOJ", flex: 1, hide: true },
    {
      field: "schoolShortName",
      headerName: "Inst",
      flex: 1,
      hide: true
    },
    {
      field: "departmentShortName",
      headerName: "Dept",
      flex: 1,
      hide: true
    },
    {
      field: "designationShortName",
      headerName: "Desig",
      flex: 1,
      hide: true
    },
    { field: "gross_pay", headerName: "Gross Earning", type: "number", flex: 1, hide: false,
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number((params.row?.gross_pay)) || 0)}</div> },
    { field: "tds", headerName: "TDS", type: "number", flex: 1, hide: false,
      renderCell: (params) => <div sx={{ textAlign: 'right', width: '100%' }}>{(Number((params.row?.tds)) || 0)}</div> 
     }
  ];

  const schoolColumns = [
    { field: "bankId", headerName: "Bank", flex: 1, hide: false },
    { field: "schoolNameShort", headerName: "Inst", flex: 1, hide: false },
    { field: "totalNetPay", headerName: "Amount", flex: 1, hide: false }
  ];

  const consultantEpfColumns = [
    { field: "school", headerName: "Inst", flex: 1, hide: false },
    { field: "s715", headerName: "Consultation Fee", flex: 1, hide: false },
    { field: "s742", headerName: "TDS", flex: 1, hide: false },
    { field: "s725", headerName: "Payable", flex: 1, hide: false },
  ];

  const attendanceColumns = [
    { field: "name", headerName: "Attendance Summary", flex: 1, hide: false },
    { field: "value", headerName: "Count", flex: 1, hide: false }
  ];

  const particularsColumns = [
    { field: "name", headerName: "Particulars", flex: 1, hide: false },
    { field: "value", headerName: "Amount", flex: 1, hide: false }
  ];

  const onClickPrint = async () => {
    const chunkArray = (array, chunkSize) =>
      Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, i) =>
        array.slice(i * chunkSize, i * chunkSize + chunkSize)
      );

    const list = salaryReportType == "school" ? schoolRows :
      salaryReportType == "epf" ? epfRows : (salaryReportType == "summary" && employeeType == "consultant") ? consultantEpfRows : rows;

    const pageSNo = salaryReportType == "lic" ? 35 : salaryReportType == "epf" ? 30 : 40;

    const rowChunks = chunkArray(list, pageSNo);
    const pages = [];
    rowChunks.forEach((rowChunk) => {
      pages.push({ rows: rowChunk });
    });

    const grandTotal = salaryReportType == "bank" ? bankTotalNetPay :
      salaryReportType == "lic" ? licTotal : salaryReportType == "advance" ? advanceTotal : salaryReportType == "tds" ? tdsTotal :
        salaryReportType == "pt" ? ptTotal : salaryReportType == "esi" ? esiTotal : salaryReportType == "school" ? schoolNetPayTotal : 0;

    const earningTotal = salaryReportType == "tds" ? grossEarningTotal :
      salaryReportType == "pt" ? totalEarning : salaryReportType == "esi" ? esiGrossEarningTotal : 0;

    const reportResponse = await GenerateSalaryMisReport(schoolShortName, pageSNo, salaryReportType, pages, date, (salaryReportType == "bank" ? bankPrintColumns :
      salaryReportType == "lic" ? licColumns : salaryReportType == "tds" ? tdsColumns : salaryReportType == "advance" ? advanceColumns :
        salaryReportType == "pt" ? ptColumns : salaryReportType == "esi" ? esiColumns : salaryReportType == "epf" ? epfColumns : salaryReportType == "school" ?
         schoolColumns : (salaryReportType == "summary" && employeeType =="consultant") ? consultantEpfColumns : []),
         grandTotal, earningTotal, esimTotal,
      attendanceColumns, attendanceRows, particularsColumns, earningRows, deductionRows,employeeType,
      consultationTotal,consultantionTdsTotal,consultationPayableTotal);
    if (!!reportResponse) {
      setReportPath(URL.createObjectURL(reportResponse));
      setIsPrintModalOpen(!isPrintModalOpen);
    }
  };

  return (
    <Box
      sx={{
        position: "relative"
      }}
    >
      <Grid container rowSpacing={{ xs: 1, md: 0 }} columnSpacing={{ xs: 3 }} sx={{ marginTop: { xs: 2, md: -5 }, justifyContent: "flex-end" }}>
        <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="salaryReportType"
            value={salaryReportType}
            label="Salary Report Type"
            handleChangeAdvance={handleChangeAdvance}
            options={salaryReportTypeList}
            required
          />
        </Grid>
        {salaryReportType == "summary" && <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="employeeType"
            value={employeeType}
            label="Employee Type"
            handleChangeAdvance={handleChangeAdvance}
            options={employeeTypeList}
            required
          />
        </Grid>}
        {salaryReportType == "bank" && <Grid item xs={12} md={2}>
          <CustomAutocomplete
            name="bank"
            value={bank}
            label="Bank"
            handleChangeAdvance={handleChangeAdvance}
            options={bankList}
          />
        </Grid>}
        {salaryReportType !== "summary" && salaryReportType !== "school" && <Grid item xs={12} md={3}>
          <CustomAutocomplete
            name="schoolId"
            value={schoolId}
            label="School"
            handleChangeAdvance={handleChangeAdvance}
            options={schoolList || []}
          />
        </Grid>}
        <Grid item xs={12} md={2}>
          <CustomDatePicker
            views={["month", "year"]}
            openTo="month"
            name="date"
            label="Select Month"
            inputFormat="MM/YYYY"
            helperText="mm/yyyy"
            value={date}
            handleChangeAdvance={handleChangeAdvance}
            minDate="01-01-2025"
            required
          />
        </Grid>
        {salaryReportType !=="epf" && salaryReportType !== "bank"  ? <Grid item xs={12} md={1}>
          <Button
            variant="contained"
            disableElevation
            startIcon={<PrintIcon />}
            disabled={loading || (rows?.length == 0 && salaryReportType !== "summary" && salaryReportType !== "school")}
            onClick={onClickPrint}
          >
            Print
          </Button>
        </Grid>:
        <Grid item xs={12} md={2} align="right">
          <Button
            variant="contained"
            disableElevation
            startIcon={<FileDownloadIcon />}
            disabled={loading || (rows?.length == 0 && salaryReportType !== "summary" && salaryReportType !== "school")}
          >            
            {salaryReportType =="epf" ? <CSVLink
              data={epfRows.map((row) => ({
                ...row
              }))}
              filename={`EPF Report For the month of ${moment(date).format("MM-YYYY")}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Export
            </CSVLink>:
            <CSVLink
              data={bankExportData.map((row) => ({
                ...row
              }))}
              filename={`Bank Report For the month of ${moment(date).format("MM-YYYY")}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Export
            </CSVLink>
            }
          </Button>
        </Grid>
        }
      </Grid>
      {!(salaryReportType == "summary" || salaryReportType == "school") ? <Box mt={1} sx={{ position: "absolute", width: "100%" }}>
        <GridIndex rows={salaryReportType == "epf" ? epfRows : rows}
          columns={salaryReportType == "bank" ? bankReportColumns : salaryReportType == "lic" ? licColumns : salaryReportType == "esi" ? esiColumns :
            salaryReportType == "epf" ? epfColumns : salaryReportType == "pt" ? ptColumns : salaryReportType == "advance" ? advanceColumns :
              salaryReportType == "tds" ? tdsColumns : []}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel}
          loading={loading}/>
      </Box> :
        <>
          {(salaryReportType == "summary" && employeeType == "regular") && <Box mt={1} className={classes.flexCenter}>
            <Box className={classes.box} sx={{ width: { xs: "100%", md: "50%" } }}>
              <TableContainer sx={{ width: "100%" }}>
                <Table size="small">
                  <TableHead className={classes.bg}>
                    <StyledTableRow>
                      <StyledTableCell sx={{ color: "white" }}>
                        Attendance Summary
                      </StyledTableCell>
                      <StyledTableCell sx={{ color: "white", textAlign: "right" }}>
                        Count
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  {!loading && <TableBody>
                    {attendanceRows?.map((obj, i) => {
                      return (
                        <StyledOddTableRow key={i}>
                          <StyledTableCell sx={{ textAlign: "justify" }}>
                            {obj.name}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "right" }}>
                            {new Intl.NumberFormat().format(obj.value)}
                          </StyledTableCell>
                        </StyledOddTableRow>
                      );
                    })}
                  </TableBody>}
                </Table>
              </TableContainer>
              {loading && <Box mt={2} className={classes.flexAlignCenter}>
                <CircularProgress
                  size={30}
                  color="primary"
                  style={{ margin: "2px 13px" }}
                />
              </Box>}
            </Box>
          </Box>}
          {(salaryReportType == "summary" && employeeType == "regular") && <Box mt={1} mb={2} className={classes.flexCenter}>
            <Box className={classes.box} sx={{ width: { xs: "100%", md: "50%" } }}>
              <TableContainer sx={{ width: "100%" }}>
                <Table size="small">
                  <TableHead className={classes.bg}>
                    <StyledTableRow>
                      <StyledTableCell sx={{ color: "white" }}>
                        Particulars
                      </StyledTableCell>
                      <StyledTableCell sx={{ color: "white", textAlign: "right" }}>
                        Amount
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  {!loading && <TableBody>
                    {earningRows?.map((obj, i) => {
                      return (
                        <StyledTableRow key={i}>
                          <StyledTableCell sx={{ textAlign: "justify" }}>
                            {obj.name == "Total Gross Salary" ? <b>{obj.name}</b> : obj.name}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "right" }}>
                            {obj.name == "Total Gross Salary" ? <b>{obj.value}</b> : obj.value}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                    {deductionRows?.map((obj, i) => {
                      return (
                        <StyledTableRow key={i}>
                          <StyledTableCell sx={{ textAlign: "justify" }}>
                            {obj.name == "Net Salary Payable" ? <b>{obj.name}</b> : obj.name}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "right" }}>
                            {obj.name == "Net Salary Payable" ? <b>{obj.value}</b> : obj.value}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                  </TableBody>}
                </Table>
              </TableContainer>
              {loading && <Box mt={2} className={classes.flexAlignCenter}>
                <CircularProgress
                  size={30}
                  color="primary"
                  style={{ margin: "2px 13px" }}
                />
              </Box>}
            </Box>
          </Box>}
          {salaryReportType == "school" && <Box mt={1} mb={2} className={classes.flexCenter}>
            <Box className={classes.box} sx={{ width: { xs: "100%", md: "50%" } }}>
              <TableContainer sx={{ width: "100%" }}>
                <Table size="small">
                  <TableHead className={classes.bg}>
                    <StyledTableRow>
                      <StyledTableCell sx={{ color: "white" }}>
                        Bank
                      </StyledTableCell>
                      <StyledTableCell sx={{ color: "white" }}>
                        Institute
                      </StyledTableCell>
                      <StyledTableCell sx={{ color: "white", textAlign: "right" }}>
                        Amount
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  {!loading && <TableBody>
                    {schoolRows?.map((obj, i) => {
                      return (
                        <StyledOddTableRow key={i}>
                          <StyledTableCell sx={{ textAlign: "justify" }}>
                            {obj.bankId}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "justify" }}>
                            {obj.schoolNameShort}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "right" }}>
                            {obj.totalNetPay}
                          </StyledTableCell>
                        </StyledOddTableRow>
                      );
                    })}
                  </TableBody>}
                  {schoolRows?.length > 0 && <StyledTableRow>
                    <StyledTableCell>
                    </StyledTableCell>
                    <StyledTableCell>
                      <b>TOTAL</b>
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "right" }}>
                      <b>{schoolRows.reduce((sum, acc) => sum + acc[`totalNetPay`], 0)}</b>
                    </StyledTableCell>
                  </StyledTableRow>}
                </Table>
              </TableContainer>
              {loading && <Box mt={2} className={classes.flexAlignCenter}>
                <CircularProgress
                  size={30}
                  color="primary"
                  style={{ margin: "2px 13px" }}
                />
              </Box>}
            </Box>
          </Box>}
          {(salaryReportType == "summary" && employeeType == "consultant") && <Box mt={1} mb={2} className={classes.flexCenter}>
            <Box className={classes.box} sx={{ width: { xs: "100%", md: "50%" } }}>
              <TableContainer sx={{ width: "100%" }}>
                <Table size="small">
                  <TableHead className={classes.bg}>
                    <StyledTableRow>
                      <StyledTableCell sx={{ color: "white" }}>
                        Institute
                      </StyledTableCell>
                      <StyledTableCell sx={{ color: "white", textAlign: "right" }}>
                        Consultation Fee
                      </StyledTableCell>
                      <StyledTableCell sx={{ color: "white", textAlign: "right" }}>
                        TDS
                      </StyledTableCell>
                      <StyledTableCell sx={{ color: "white", textAlign: "right" }}>
                        Payable
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  {!loading && <TableBody>
                    {consultantEpfRows?.map((obj, i) => {
                      return (
                        <StyledOddTableRow key={i}>
                          <StyledTableCell sx={{ textAlign: "justify" }}>
                            {obj.school}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "right" }}>
                            {obj.s715}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "right" }}>
                           {obj.s742}
                          </StyledTableCell>
                          <StyledTableCell sx={{ textAlign: "right" }}>
                           {obj.s725}
                          </StyledTableCell>
                        </StyledOddTableRow>
                      );
                    })}
                  </TableBody>}
                  {consultantEpfRows?.length > 0 && <StyledTableRow>
                    <StyledTableCell sx={{ textAlign: "left" }}>
                       <b>TOTAL</b>
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "right" }}>
                     <b>{consultantEpfRows.reduce((sum, acc) => sum + acc[`s715`], 0)}</b>
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "right" }}>
                      <b>{consultantEpfRows.reduce((sum, acc) => sum + acc[`s742`], 0)}</b>
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "right" }}>
                      <b>{consultantEpfRows.reduce((sum, acc) => sum + acc[`s725`], 0)}</b>
                    </StyledTableCell>
                  </StyledTableRow>}
                </Table>
              </TableContainer>
              {loading && <Box mt={2} className={classes.flexAlignCenter}>
                <CircularProgress
                  size={30}
                  color="primary"
                  style={{ margin: "2px 13px" }}
                />
              </Box>}
            </Box>
          </Box>}
        </>}
      <ModalWrapper
        title=""
        maxWidth={1000}
        open={isPrintModalOpen}
        setOpen={setIsPrintModalOpen}
      >
        <Box borderRadius={3}>
          {!!reportPath && (
            <object
              data={reportPath}
              type="application/pdf"
              style={{ height: "450px", width: "100%" }}
            >
              <p>
                Your web browser doesn't have a PDF plugin. Instead you can
                download the file directly.
              </p>
            </object>
          )}
        </Box>
      </ModalWrapper>
    </Box>
  );
};

export default SalaryMisIndex;