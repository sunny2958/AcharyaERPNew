import React, { useState, useEffect } from "react";
import axios from "../services/Api";
import GridIndex from "./GridIndex";
import { useNavigate } from "react-router-dom";
import { Tooltip, Typography } from "@mui/material";
import { checkFullAccess, convertToDMY } from "../utils/DateTimeUtils";
import moment from "moment";
import { CustomDataExport } from "./CustomDataExport";

const EmployeeInactive = () => {
  const [rows, setRows] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    school_name_short: false,    
    ctc: false 
  })
  const navigate = useNavigate();

  const getData = async () => {
    await axios
      .get(
        `/api/employee/fetchAllInActiveEmployeeDetails?page=${0}&page_size=${100000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content.map((ele,index)=>({...ele,id:index+1})));
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getData();
  }, []);

  const getContractDetails = async (id) => {
    navigate(`/EmployeeContractPdf/${id}`);
  };

  const columns = [
    { field: "empcode", headerName: "Staff Code", flex: 1, hideable: false },
    {
      field: "employee_name",
      headerName: "Staff Name",
      width: 220,
      hideable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{ cursor: "pointer", textTransform: "capitalize" }}
              onClick={() =>
                navigate(
                  `/EmployeeDetailsView/${params.row.id}/${params.row.offer_id}/profile`
                )
              }
            >
              {params.row.phd_status === "holder"
                ? "Dr. " + params.row.employee_name
                : params.row.employee_name
                ? params.row.employee_name
                : ""}
            </Typography>
          </>
        );
      },
    },

    {
      field: "empTypeShortName",
      headerName: "Type",
      flex: 1,
      hideable: false,
    },
    { field: "email", headerName: "Email", flex: 1, hideable: false },
    {
      field: "mobile",
      headerName: "Phone",
      flex: 1,
      renderCell: (params) => {
        const mobile = params.row?.mobile;
        if (mobile && mobile.length === 10) {
          const maskedMobile = `${mobile.slice(0, 2)}XXXXXX${mobile.slice(8)}`;
          return <>{maskedMobile}</>;
        }
        return <>{mobile ? mobile : ""}</>;
      },
    },

    {
      field: "relieving_date",
      headerName: "Relieving date",
      flex: 1,
      hideable: false,
      renderCell: (params) =>
        moment(params.row.relieving_date).format("DD-MM-YYYY"),
    },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
    //  hide: true,
    },
    {
      field: "job_short_name",
      headerName: "Job Type",
      flex: 1,
    },
    {
      field: "dept_name_short",
      headerName: "Department",
      flex: 1,
      hideable: false,
    },
    {
      field: "designation_short_name",
      headerName: "Designation",
      width: 200,
      flex: 1,
      hideable: false,
    },
    {
      field: "date_of_joining",
      headerName: "DOJ",
      flex: 1,
      hideable: false,
    },
    {
      field: "ctc",
      headerName: "CTC",
      flex: 1,
      hideable: false,
    //  hide: true,
      renderCell: (params) => {
        return (
          <>
            {checkFullAccess(params.row.id) && (
              <>
                {params.row.empTypeShortName === "CON"
                  ? params.row.consolidated_amount
                  : params.row.ctc}
              </>
            )}
          </>
        );
      },
    },
  ];
  return (
    <>
      {rows.length > 0 && (
        <CustomDataExport dataSet={rows} titleText="Employee Inactive" />
      )}
      <GridIndex
       rows={rows}
       columns={columns}
       columnVisibilityModel={columnVisibilityModel}
       setColumnVisibilityModel={setColumnVisibilityModel}/>
    </>
  );
};

export default EmployeeInactive;
