import { useState, useEffect,lazy } from "react";
import GridIndex from "../../../components/GridIndex";
import {
  Box,
  Grid,
  Button,
  styled,
  Tooltip,
  tooltipClasses,
  Menu, MenuItem,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";

const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker.jsx")
);

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "#5A5A5A",
    maxWidth: 270,
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
  },
}));

const filterLists = [
  { label: "Today", value: "today" },
  { label: "1 Week", value: "week" },
  { label: "1 Month", value: "month" },
  { label: "Custom Date", value: "custom" },
];

const initialValues = {
  filterList: filterLists,
  filter:filterLists[0].value,
  schoolId:null,
  schoolList:[],
  startDate: "",
  endDate: ""
};

function CancelReceiptIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
   const [anchorEl, setAnchorEl] = useState(null);

  const {pathname, state: queryValues} = useLocation();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    transaction_type: false,
    bank_name: false,
    fee_template_name: false,
    cheque_dd_no: false,
    date: pathname === '/Accounts-ledger-day-credit-transaction' ? false : true,
    created_username: pathname === '/Accounts-ledger-day-credit-transaction' ? false : true,
    school_name_short:false
  });
  const navigate = useNavigate();

  useEffect(() => {
     getSchoolDetails();
  }, []);

  useEffect(() => {
    getData();
  }, [values.schoolId, values.filter, values.startDate, values.endDate]);

  const getSchoolDetails = async () => {
    try {
      const res = await axios.get(`/api/institute/school`);
      if (res.status == 200 || res.status == 201) {
        const list = res.data.data.map((obj) => ({
          value: obj.school_id,
          label: obj.school_name,
        }));
        setSchoolList(list);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setSchoolList = (lists) => {
    setValues((prevState) => ({
      ...prevState,
      schoolList: lists,
    }));
  };

  const getData = async () => {
    setLoading(true);
    let apiParams = null;
    let params = null;
    if (pathname === '/Accounts-ledger-day-credit-transaction') {
      apiParams = `page=${0}&page_size=${1000000}&sort=created_date&date_range=custom&school_id=${queryValues?.schoolId}&bank_id=${queryValues?.bankId}&start_date=${moment(
        queryValues?.date
      ).format("YYYY-MM-DD")}&end_date=${moment(queryValues?.date).format("YYYY-MM-DD")}`;
    } else {
      params = new URLSearchParams();
      const keys = {
        "page": 0,
        "page_size": 1000000,
        "sort": "created_date",
        "school_id": values.schoolId,
        "date_range": values.filter,
        "start_date": values.startDate ? moment(values.startDate).format("YYYY-MM-DD") : null,
        "end_date": values.endDate ? moment(values.endDate).format("YYYY-MM-DD") : null,
      };
      Object.entries(keys).forEach(([key, value]) => {
        if (value != null) {
          params.append(key, value);
        }
      });
    }
      await axios
        .get(
          `/api/finance/fetchAllCancelledReceipts?${pathname === '/Accounts-ledger-day-credit-transaction' ? apiParams : params}`
        )
        .then((res) => {
          setLoading(false);
          setRows(res.data.data.Paginated_data.content);
        })
        .catch((err) => {
          setLoading(false);
          console.error(err)
        });
  };

  const columns = [
    { field: "receipt_type", headerName: "Type", flex: 1,hideable:false,renderCell:(params)=> (params.row.receipt_type == "HOS" ? "HOST" :
      params.row.receipt_type == "General" ? "GEN": params.row.receipt_type == "Registration Fee" ?
     "REGT":  params.row.receipt_type == "Exam Fee" ? "EXAM" : (params.row.receipt_type)?.toUpperCase())},
    {
      field: "fee_receipt",
      headerName: "Receipt No",
      flex: .8,
      hideable:false,
      align:"center"
    },
    {
      field: "date",
      headerName: "Date",
      flex: .8,
      hideable: false,
      valueGetter: (value, row) =>
        row.created_date
          ? moment(row.created_date).format("DD-MM-YYYY")
          : "",
      align: pathname === '/Accounts-ledger-day-credit-transaction' ? 'center' : 'left'
    },
    {
      field: "transaction_type",
      headerName: "Transaction Type",
      flex: 1,
      hide: true,
    },

    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
      hideable:false,
      valueGetter: (value, row) => (row.auid ? row.auid : ""),
      align: pathname === '/Accounts-ledger-day-credit-transaction' ? 'center' : 'left'
    },
    {
      field: "student_name",
      headerName: "Name",
      flex: 1,
      hideable:false,
      renderCell: (params) => {
        return (
          <HtmlTooltip title={params.row.student_name}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.student_name || ""}
            </Typography>
          </HtmlTooltip>
        )
      },
    },
    {
      field: "school_name_short",
      headerName: "Institute",
      flex: 1
    },
    {
      field: "fee_template_name",
      headerName: "Template",
      flex: 1,
      hideable:false,
      valueGetter: (value, row) =>
        row.fee_template_name ? row.fee_template_name : "NA",
      hide: true,
    },
    {
      field: "amount",
      headerName: "Paid",
      flex: .5,
      hideable:false,
      align:"center",
      valueGetter: (value, row) =>
        row.amount ? row.amount : row.amount,
      align: pathname === '/Accounts-ledger-day-credit-transaction' ? 'right' : 'left'
    },

    {
      field: "cheque_dd_no",
      headerName: "Transaction Ref",
      flex: 1,
      hide:true,
      renderCell: (params) => {
        return params?.row?.cheque_dd_no?.length > 15 ? (
          <HtmlTooltip title={params.row.cheque_dd_no}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.cheque_dd_no}
            </Typography>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip title={params.row.cheque_dd_no}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.cheque_dd_no}
            </Typography>
          </HtmlTooltip>
        );
      },
    },
    { field: "transaction_date", headerName: "Transaction Date", flex: 1,
      valueGetter: (value, row) =>
        row.transaction_date
          ? moment(row.transaction_date).format("DD-MM-YYYY")
          : "",
      align: pathname === '/Accounts-ledger-day-credit-transaction' ? 'center' : 'left'
    },
    { field: "bank_name", headerName: "Bank", flex: 1, hide: true },
    {
      field: "remarks",
      headerName: "Cancelled Remarks",
      flex: 1,
      hideable:false,
      renderCell: (params) => {
        return (
          <HtmlTooltip title={params.row?.remarks}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row?.remarks}
            </Typography>
          </HtmlTooltip>
        )
      },
    },
    {
      field: "created_date",
      headerName: "Cancelled Date",
      flex: 1,
      valueGetter: (value, row) =>
        row.created_date
          ? moment(row.created_date).format("DD-MM-YYYY")
          : "",
      align: pathname === '/Accounts-ledger-day-credit-transaction' ? 'center' : 'left'
    },
    { field: "created_username", headerName: "Cancelled By", flex: 1,hideable:false },
  ];

  const setNullField = () => {
    setValues((prevState)=>({
      ...prevState,
      startDate:null,
      endDate:null
    }))
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if(name == "filter"){
      setNullField()
    }
  };

  const handleCancel = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
     setAnchorEl(null);
  };

  return (
    <Box>
      {pathname !== '/Accounts-ledger-day-credit-transaction' ?(
        <Grid
          container
          sx={{ display: "flex", justifyContent: "flex-end", gap: "10px",marginTop: { xs:2, md: -5 }}}
        >
          <Grid xs={12} md={2}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={values.schoolList || []}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          <Grid xs={12} md={2}>
            <CustomAutocomplete
              name="filter"
              label="filter"
              value={values.filter}
              options={values.filterList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          {values.filter == "custom" && (
            <Grid item xs={12} md={2}>
              <CustomDatePicker
                name="startDate"
                label="From Date"
                value={values.startDate}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          )}
          {values.filter == "custom" && (
            <Grid item xs={12} md={2}>
              <CustomDatePicker
                name="endDate"
                label="To Date"
                value={values.endDate}
                handleChangeAdvance={handleChangeAdvance}
                disabled={!values.startDate}
                required
              />
            </Grid>
          )}
          <Grid xs={12} md={1}>
           <Button
            aria-controls="cancel-menu"
            onClick={handleCancel}
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
          >
            create
          </Button>
          <Menu
            id="cancel-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={()=>navigate("/Cancelfeereceipt")}>
              College
            </MenuItem>
            <MenuItem onClick={()=>navigate("/CancelHostelReceipt")}>
              Hostel
            </MenuItem>
          </Menu>
          </Grid>
        </Grid>
      ):<></>}
      <Box sx={{ position: "relative", marginTop: "10px" }}>
        <Box sx={{position:"absolute",width:"100%",}}>
          <GridIndex
            rows={rows}
            columns={columns}
            loading={loading}
            columnVisibilityModel={columnVisibilityModel}
            setColumnVisibilityModel={setColumnVisibilityModel} />
        </Box>
      </Box>
    </Box>
  );
}

export default CancelReceiptIndex;
