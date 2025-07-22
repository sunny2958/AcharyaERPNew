import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../services/Api";
import {
  Box,
} from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import GridIndex from "../../../components/GridIndex";



function HostelStudentDueIndex() {
  const [rows, setRows] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const { id } = useParams();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/hostel/hostelBedAssignmentByAcYearAndhostelBlock/${id}`
      );
      const data = response.data.data;

      // Add total row if data exists
      if (data.length > 0) {
        const totalRow = {
          id: "total",
          auid: "",
          studentName: "Total",
          usn: "",
          acYear: "",
          occipiedDate: "",
          year: "",
          sem: "",
          bedName: "",
          fixed: data.reduce((acc, row) => acc + (row.fixed || 0), 0),
          paid: data.reduce((acc, row) => acc + (row.paid || 0), 0),
          waiver: data.reduce((acc, row) => acc + (row.waiver || 0), 0),
          due: data.reduce((acc, row) => acc + (row.due || 0), 0),
          isTotal: true,
        };
        setRows([...data, totalRow]);
      } else {
        setRows(data);
      }
    } catch (error) {
      setAlertMessage("Error fetching data");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const detailedColumns = [
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "studentName", headerName: "Student", flex: 1 },
    { field: "usn", headerName: "USN", flex: 1 },
    { field: "acYear", headerName: "Ac Year", flex: 1 },
    { field: "occipiedDate", headerName: "Occupied Date", flex: 1 },
    {
      field: "Year/sem",
      headerName: "Year/Sem",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.row?.isTotal) {
          return "-";
        }
        return `${params?.row?.year || "-"} / ${params?.row?.sem || "-"}`;
      },
    },

    { field: "bedName", headerName: "Bed", flex: 1 },
    {
      field: "fixed",
      headerName: "Fixed",
      flex: 1,
      align: "right",
      headerAlign: "center",
    },
    {
      field: "paid",
      headerName: "Paid",
      flex: 1,
      align: "right",
      headerAlign: "center",
    },
    {
      field: "waiver",
      headerName: "Waiver",
      flex: 1,
      align: "right",
      headerAlign: "center",
    },
    {
      field: "due",
      headerName: "Due",
      flex: 1,
      align: "right",
      headerAlign: "center",
    },
  ];

  return (
    <>
      <Box mt={4}>
        <GridIndex
          rows={rows}
          columns={detailedColumns}
          loading={isLoading}
          getRowId={(row) => row.studentId || row.id}
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
              "& *": {
                color: "#fff !important",
              },
            },
          }}
        />
      </Box>
    </>
  );
}

export default HostelStudentDueIndex;
