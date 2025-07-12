import React, { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Grid,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Hotel";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import ModalWrapper from "../../../components/ModalWrapper";
import GridIndex from "../../../components/GridIndex";

const initialValues = { acYearId: "", currentYear: true, blockName: "" };

const occupancy = [
  { value: 1, label: "SINGLE OCCUPANCY" },
  { value: 2, label: "DOUBLE OCCUPANCY" },
  { value: 3, label: "TRIPLE OCCUPANCY" },
  { value: 4, label: "QUADRUPLE OCCUPANCY" },
  { value: 6, label: "SIXTAPLE OCCUPANCY" },
  { value: 7, label: "SEVEN OCCUPANCY" },
  { value: 8, label: "EIGHT OCCUPANCY" },
];

function HostelDueReport() {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  console.log(data, "data");

  const [isLoading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [hostelBlocks, setHostelBlocks] = useState([]);

  useEffect(() => {
    getAcademicYearData();
    getHostelBlocks();
    getData();
  }, []);

  useEffect(() => {
    if (values?.acYearId || values?.blockName) {
      getData();
    }
  }, [values?.acYearId, values?.blockName]);

  const getAcademicYearData = async () => {
    try {
      const res = await axios.get("/api/academic/academic_year");
      const data = res.data.data.map((obj) => ({
        value: obj.ac_year_id,
        label: obj.ac_year,
      }));

      setAcademicYearOptions(data);

      if (data.length > 0) {
        setValues((prev) => ({
          ...prev,
          acYearId: data[0]?.value,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getHostelBlocks = async () => {
    try {
      const res = await axios.get(`/api/hostel/HostelBlocks`);
      const hostelBlocks = res?.data?.data?.map((obj) => ({
        value: obj.hostelBlockId,
        label: obj.blockName,
      }));
      setHostelBlocks(hostelBlocks);
    } catch (err) {
      console.error(err);
    }
  };

  const getData = async () => {
    setLoading(true);
    if (!values.acYearId) return
    try {
      const queryParams = new URLSearchParams();
      if (values?.acYearId) queryParams.append("acYearId", values.acYearId);
      if (values?.blockName) queryParams.append("blockId", values.blockName);

      const response = await axios.get(
        `/api/finance/dueReportBlockWiseAndRoomType${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
      );

      const responseData = response?.data?.data || {};

      const mapped = Object.entries(responseData).flatMap(([blockShortName, blockArray]) =>
        blockArray.map((item) => ({
          id: `${blockShortName}-${item.hostel_block_id}-${item.room_type_id}`,
          block_short_name: blockShortName,
          block_name: item.block_name,
          hostel_block_id: item.hostel_block_id,
          room_type_id: item.room_type_id,
          bedCount: item.bedCount || 0,
          totalAmount: item.totalAmount || 0,
          totalWaiverAmount: item.totalWaiverAmount || 0,
          totalPaidAmount: item.totalPaidAmount || 0,
          totalDueAmount: item.totalDueAmount || 0,
        }))
      );

      if (mapped.length > 0) {
        const totalRow = {
          id: "total",
          block_name: "Total",
          bedCount: mapped.reduce((acc, r) => acc + (r.bedCount || 0), 0),
          totalAmount: mapped.reduce((acc, r) => acc + (r.totalAmount || 0), 0),
          totalWaiverAmount: mapped.reduce((acc, r) => acc + (r.totalWaiverAmount || 0), 0),
          totalPaidAmount: mapped.reduce((acc, r) => acc + (r.totalPaidAmount || 0), 0),
          totalDueAmount: mapped.reduce((acc, r) => acc + (r.totalDueAmount || 0), 0),
          isTotal: true,
        };
        setRows([...mapped, totalRow]);
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error(error);
      setAlertMessage({
        severity: "error",
        message: error.response?.data?.message || "Failed to fetch",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    const currentYear = academicYearOptions[0]?.value === newValue;
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
      currentYear: name === "acYearId" ? currentYear : prev.currentYear,
    }));
  };

  const handleHistory = async (params) => {
    setData(params)
    setHistoryOpen(true);
    try {
      const response = await axios.get(
        `/api/finance/dueReportWithStudentDetails?acYearId=${values?.acYearId}&blockId=${params?.hostel_block_id}&roomType=${params?.room_type_id}`
      );

      const rawData = response?.data?.data || [];

      const mappedData = rawData.map((item, index) => ({
        ...item,
        id: index + 1,
      }));

      if (mappedData.length > 0) {
        const totalRow = {
          id: "total",
          student_name: "Total",
          auid: "",
          dueAmount: mappedData.reduce((acc, cur) => acc + (cur.dueAmount || 0), 0),
          totalAmount: mappedData.reduce((acc, cur) => acc + (cur.totalAmount || 0), 0),
          paidAmount: mappedData.reduce((acc, cur) => acc + (cur.paidAmount || 0), 0),
          waiverAmount: mappedData.reduce((acc, cur) => acc + (cur.waiverAmount || 0), 0),
          isTotal: true,
        };
        setHistoryData([...mappedData, totalRow]);
      } else {
        setHistoryData([]);
      }

    } catch (err) {
      console.error(err);
    }
  };

  const callHistoryColumns = [
    {
      field: "student_name",
      headerName: "Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: params.row?.isTotal ? "bold" : "normal",
            width: "100%",
            textAlign: "center",
          }}
        >
          {params.row?.isTotal ? "Total" : params.row?.student_name || "-"}
        </Typography>
      ),
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: params.row?.isTotal ? "bold" : "normal",
            width: "100%",
            textAlign: "center",
          }}
        >
          {params.row?.isTotal ? "-" : params.row?.auid || "-"}
        </Typography>
      ),
    },
    {
      field: "dueAmount",
      headerName: "Due Amount",
      flex: 1,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: params.row?.isTotal ? "bold" : "normal",
            textAlign: "right",
            width: "100%",
          }}
        >
          {params.row?.dueAmount?.toLocaleString("en-IN") || 0}
        </Typography>
      ),
    },
    {
      field: "paidAmount",
      headerName: "Paid Amount",
      flex: 1,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: params.row?.isTotal ? "bold" : "normal",
            textAlign: "right",
            width: "100%",
          }}
        >
          {params.row?.paidAmount?.toLocaleString("en-IN") || 0}
        </Typography>
      ),
    },
    {
      field: "waiverAmount",
      headerName: "Waiver Amount",
      flex: 1,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: params.row?.isTotal ? "bold" : "normal",
            textAlign: "right",
            width: "100%",
          }}
        >
          {params.row?.waiverAmount?.toLocaleString("en-IN") || 0}
        </Typography>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: params.row?.isTotal ? "bold" : "normal",
            textAlign: "right",
            width: "100%",
          }}
        >
          {params.row?.totalAmount?.toLocaleString("en-IN") || 0}
        </Typography>
      ),
    },
  ];


  const columns = [
    {
      field: "block_short_name",
      headerName: "Block Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            color: params.row?.isTotal ? "#fff" : "#1976d2",
            width: "100%",
            textAlign: "center",
          }}
        >
          {params.row.block_short_name}
        </Typography>
      ),
    },

    {
      field: "room_type_id",
      headerName: "Occupancy Type",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography sx={{ fontWeight: "bold", width: "100%", textAlign: "center" }}>
          {params.row?.isTotal ? "" : occupancy.find((o) => o.value == params.row?.room_type_id)?.label || ""}
        </Typography>
      ),
    },
    {
      field: "bedCount",
      headerName: "Total Beds",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Box display="flex" alignItems="center" justifyContent="center">
          <BedIcon sx={{ mr: 1 }} />
          Total Beds
        </Box>
      ),
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
            color: params.row?.isTotal ? "#fff" : "#1976d2",
          }}
        >
          {params.row.bedCount}
        </Typography>
      ),
    },

    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      align: "right",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography sx={{ fontWeight: params.row?.isTotal ? "bold" : "normal", width: "100%", textAlign: "right" }}>
          {params.row.totalAmount?.toLocaleString("en-IN") || 0}
        </Typography>
      ),
    },
    {
      field: "totalWaiverAmount",
      headerName: "Waiver Amount",
      flex: 1,
      align: "right",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography sx={{ fontWeight: params.row?.isTotal ? "bold" : "normal", width: "100%", textAlign: "right" }}>
          {params.row.totalWaiverAmount?.toLocaleString("en-IN") || 0}
        </Typography>
      ),
    },
    {
      field: "totalPaidAmount",
      headerName: "Paid Amount",
      flex: 1,
      align: "right",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography sx={{ fontWeight: params.row?.isTotal ? "bold" : "normal", width: "100%", textAlign: "right" }}>
          {params.row.totalPaidAmount?.toLocaleString("en-IN") || 0}
        </Typography>
      ),
    },
    {
      field: "totalDueAmount",
      headerName: "Due Amount",
      flex: 1,
      align: "right",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography sx={{ fontWeight: params.row?.isTotal ? "bold" : "normal", width: "100%", textAlign: "right" }}>
          {params.row.totalDueAmount?.toLocaleString("en-IN") || 0}
        </Typography>
      ),
    },
  ];
  const getRoomTypeLabel = (id) => {
    return occupancy.find((o) => o.value === id)?.label || "";
  };
  return (
    <>
      <Grid container spacing={2} justifyContent="flex-end" mb={2}>
        <Grid item xs={12} sm={4} md={3}>
          <CustomAutocomplete
            name="acYearId"
            label="Academic Year"
            value={values.acYearId}
            options={academicYearOptions}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <CustomAutocomplete
            name="blockName"
            label="Block Name"
            value={values.blockName}
            options={hostelBlocks}
            handleChangeAdvance={handleChangeAdvance}
          />
        </Grid>
      </Grid>

      <Box mt={2} sx={{ position: "relative" }}>
        <GridIndex
          rows={rows}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.id}
          onRowClick={(params) => {
            if (!params.row?.isTotal) {
              handleHistory(params.row);
            }
          }}
          getRowClassName={(params) =>
            params.row?.isTotal ? "custom-total-row" : ""
          }
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#376a7d",
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
            },
            "& .custom-total-row": {
              backgroundColor: "#376a7d",
              pointerEvents: "none",
            },
            "& .custom-total-row .MuiDataGrid-cell": {
              color: "#fff !important",
              fontWeight: "bold",
              justifyContent: "center !important",
            },
          }}
        />

      </Box>

      <ModalWrapper open={historyOpen} setOpen={setHistoryOpen} title={`Student Details${data
          ? ` — ${data.block_name} (${getRoomTypeLabel(data.room_type_id)})`
          : ""
        }`}>
        <GridIndex
          rows={historyData}
          columns={callHistoryColumns}
          getRowId={(row) => row.id}
          getRowClassName={(params) =>
            params.row?.isTotal ? "custom-total-row" : ""
          }
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
            },
            "& .custom-total-row": {
              backgroundColor: "#376a7d",
              pointerEvents: "none",
            },
            "& .custom-total-row .MuiDataGrid-cell": {
              color: "#fff !important",
              fontWeight: "bold",
              justifyContent: "center !important",
            },
          }}

        />
      </ModalWrapper>
    </>
  );
}

export default HostelDueReport;
