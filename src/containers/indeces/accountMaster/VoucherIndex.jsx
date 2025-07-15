import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import GridIndex from "../../../components/GridIndex";
import AddIcon from "@mui/icons-material/Add";
import { Check, HighlightOff } from "@mui/icons-material";
import { Box, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";

function VoucherIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        cash_or_bank: false,   
        is_common: false,
        is_salaries: false,
        hostel_status: false
  })

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true)
    await axios
      .get(
        `/api/finance/fetchAllVoucherHeadNewDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
         setLoading(false)
      })
      .catch((err) =>{
        console.error(err)
         setLoading(false)
  });
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/finance/VoucherHeadNew/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/finance/activateVoucherHeadNew/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const columns = [
    { field: "voucher_head", headerName: "Voucher Head", flex: 1 },
    { field: "voucher_head_short_name", headerName: "Short Name", flex: 1 },
    { field: "ledger_name", headerName: "Ledger", flex: 1 },
    { field: "voucher_type", headerName: "Voucher Type", flex: 1 },
    { field: "priority", headerName: "Priority", flex: 1 },
    {
      field: "cash_or_bank",
      headerName: "Cash/Bank",
      flex: 1,
      valueGetter: (value, row) => (row.cash_or_bank ? "Yes" : "No"),
    },
    {
      field: "is_vendor",
      headerName: "Is Vendor",
      flex: 1,
      valueGetter: (value, row) => (row.is_vendor ? "Yes" : "No"),
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      valueGetter: (value, row) => (row?.type === 'EXPENDITURE' ? "Expenditure" : row?.type === "ASSETS/ADVANCE" ? "Assets/Advance": ""),
    },

    {
      field: "budget_head",
      headerName: "Budget Head",
      flex: 1,
      hide: true,
      valueGetter: (value, row) => (row.budget_head ? "Yes" : "No"),
    },
    {
      field: "is_common",
      headerName: "Is Common",
      flex: 1,
      hide: true,
      valueGetter: (value, row) => (row.is_common ? "Yes" : "No"),
    },
    {
      field: "is_salaries",
      headerName: "Is Salaries",
      flex: 1,
      hide: true,
      valueGetter: (value, row) => (row.is_salaries ? "Yes" : "No"),
    },
    {
      field: "hostel_status",
      headerName: "Hostel Status",
      flex: 1,
      hide: true,
      valueGetter: (value, row) => (row.hostel_status ? "Yes" : "No"),
    },
    {
      field: "opening_balance",
      headerName: "OB",
      renderCell: (params) =>
        params.row.cash_or_bank !== true ? (
          <IconButton
            label="Update"
            color="primary"
            onClick={() =>
              navigate(
                `/AccountMaster/OpeningBalanceUpdateForm/${params.row.id}`
              )
            }
          >
            <EditIcon />
          </IconButton>
        ) : (
          <></>
        ),
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
       valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "count",
      headerName: "Update",
      renderCell: (params) => {
        return (
          <IconButton
            label="Update"
            color="primary"
            onClick={() =>
              navigate(`/AccountMaster/Voucher/Update/${params.row.id}`)
            }
          >
            <EditIcon />
          </IconButton>
        );
      },
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Button
        onClick={() => navigate("/AccountMaster/Voucher/New")}
        variant="contained"
        disableElevation
        sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        startIcon={<AddIcon />}
      >
        Create
      </Button>
      <GridIndex rows={rows} columns={columns} loading={loading}  columnVisibilityModel={columnVisibilityModel} setColumnVisibilityModel={setColumnVisibilityModel}/>
    </Box>
  );
}

export default VoucherIndex;
