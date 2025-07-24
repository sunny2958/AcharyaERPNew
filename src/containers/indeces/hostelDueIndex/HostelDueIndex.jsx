import React, { useState, useEffect } from "react";
import axios from "../../../services/Api";
import {
  Grid,
  Typography,
  Box,
} from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";

const initialValues = { acYearId: "" };

function HostelDueIndex() {
  const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAcademicYearData();
  }, []);

  useEffect(() => {
    if (values?.acYearId) {
      getData();
    }
  }, [values?.acYearId]);

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

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/finance/getHostelDueReportByAcademicYearGroupedByBlock${values?.acYearId ? `?acYearId=${values?.acYearId}` : ""}`
      );

      const data = response.data.data;

      const mapped = Object.keys(data).map((block, index) => ({
        id: index + 1,
        block: block,
        fixed: data[block].totalAmount || 0,
        paid: data[block].totalPaidAmount || 0,
        due: data[block].totalDueAmount || 0,
        waiverAmount: data[block].waiverAmount || 0,
      }));

      if (mapped.length > 0) {
        const totalRow = {
          id: "total",
          block: "Total",
          fixed: mapped.reduce((acc, r) => acc + r.fixed, 0),
          paid: mapped.reduce((acc, r) => acc + r.paid, 0),
          due: mapped.reduce((acc, r) => acc + r.due, 0),
          waiverAmount: mapped.reduce((acc, r) => acc + r.waiverAmount, 0),
          isTotal: true,
        };
        setRows([...mapped, totalRow]);
      } else {
        setRows(mapped);
      }
    } catch (error) {
      setAlertMessage("Error fetching data");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const columns = [
    {
      field: "block",
      headerName: "Block",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: params.row.isTotal ? "bold" : "500",
            color: params.row.isTotal ? "#fff" : "#1976d2",
            cursor: params.row.isTotal ? "default" : "pointer",
            textAlign: "center",
            width: "100%",
          }}
        >
          {params.row.block}
        </Typography>
      ),
    },
    {
      field: "fixed",
      headerName: "Fixed",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderHeader: () => (
        <Box display="flex" alignItems="center" justifyContent="center">
          Fixed
        </Box>
      ),
    },
    {
      field: "paid",
      headerName: "Paid",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderHeader: () => (
        <Box display="flex" alignItems="center" justifyContent="center">
          Paid
        </Box>
      ),
    },
    {
      field: "waiverAmount",
      headerName: "Waiver",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderHeader: () => (
        <Box display="flex" alignItems="center" justifyContent="center">
          Waiver
        </Box>
      ),
    },
    {
      field: "due",
      headerName: "Due",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderHeader: () => (
        <Box display="flex" alignItems="center" justifyContent="center">
          Due
        </Box>
      ),
      renderCell: (params) => (
        <Typography
          onClick={() => {
            if (params.row?.isTotal) return; // Don’t navigate on total row
            navigate(`/HostelDueMaster/HostelDue/${params.row.id}`);
          }}
          sx={{
            fontWeight: params.row.isTotal ? "bold" : "500",
            color: params.row.isTotal ? "#fff" : "#1976d2",
            cursor: params.row.isTotal ? "default" : "pointer",
            textAlign: "center",
            width: "100%",
            "&:hover": { textDecoration: params.row.isTotal ? "none" : "underline" },
          }}
        >
          {params.row.due}
        </Typography>
      ),
    },
  ];

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
      </Grid>

      <Box mt={2}>
        <GridIndex
          rows={rows}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.id}
          getRowClassName={(params) =>
            params.row?.isTotal ? "custom-total-row" : ""
          }
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#376a7d",
              color: "#fff",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            },
            "& .custom-total-row": {
              backgroundColor: "#376a7d",
              pointerEvents: "none",
            },
            "& .custom-total-row .MuiDataGrid-cell": {
              color: "#fff !important",
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </>
  );
}

export default HostelDueIndex;
