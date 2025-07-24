import { useState, useEffect, lazy } from "react";
import GridIndex from "../../components/GridIndex.jsx";
import {
  Box,
  Grid,
  Typography
} from "@mui/material";
import axios from "../../services/Api.js";
import useBreadcrumbs from "../../hooks/useBreadcrumbs.js";
import moment from "moment";
const CustomDatePicker = lazy(() =>
  import("../../components/Inputs/CustomDatePicker.jsx")
);

const initialValues = {
  fromMonth: null,
  toMonth: null,
  loading: false,
  rows: []
};;

function TaxDeductionIndex() {
  const [values, setValues] = useState(initialValues);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    setCrumbs([{ name: "Tax Deduction" }])
  }, [])

  useEffect(() => {
    (values.fromMonth && values.toMonth) && getData();
  }, [values.fromMonth, values.toMonth])

  const getData = async () => {
    setLoading(true);
    let params = `fromMonth=${moment(values.fromMonth).format("MM")}&toMonth=${moment(values.toMonth).format("MM")}&year=${moment(values.fromMonth).format("YYYY")}`;
    await axios
      .get(`/api/employee/getTdsDeductions?${params}`)
      .then((res) => {
        const list = res.data.data.filter(li=>li.tdsDeducted !==0).map((ele, index) => ({ ...ele, id: index + 1 }));
        setLoading(false);
        setValues((prevState) => ({
          ...prevState,
          rows: list
        }))
      })
      .catch((err) => { setLoading(false); console.error(err) });
  };

  const setLoading = (val) => {
    setValues((prevState) => ({
      ...prevState,
      loading: val
    }))
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const columns = [
    {
      field: "empCode", headerName: "Code", flex: 1
    },
    {
      field: "employeeName",
      headerName: "Name",
      flex: 1,
      valueGetter: (value, row) => (row.employeeName?.split(" ")?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase()))?.join(" ")
    },
    {
      field: "school",
      headerName: "Institute",
      flex: 1
    },
    {
      field: "panNo",
      headerName: "PAN",
      flex: 1
    },
    {
      field: "totalEarning", headerName: "Total Earning", flex: 1,
      type: "number",
      renderCell: (params) => <Typography variant="p" sx={{ textAlign: 'right'}}>{(Number((params.row?.totalEarning)) || 0)}</Typography>
    },
    {
      field: "tdsDeducted",
      headerName: "TDS Deducted",
      flex: 1,
      type: "number",
      renderCell: (params) => <Typography variant="p" sx={{ textAlign: 'right'}}>{(Number((params.row?.tdsDeducted)) || 0)}</Typography>
    },
    {
      field: "month",
      headerName: "Month",
      flex: 1,
      valueGetter: (value, row) => (row.month?.charAt(0)?.toUpperCase() + row.month?.slice(1)?.toLowerCase())
    },
    {
      field: "year",
      headerName: "Year",
      flex: 1
    }
  ];

  return (
    <Box>
      <Grid container sx={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: { xs: 2, md: -5 } }}>
        <Grid item xs={12} md={2}>
          <CustomDatePicker
            views={["month"]}
            openTo="month"
            name="fromMonth"
            label="From Month"
            inputFormat="MMMM"
            helperText=""
            value={values.fromMonth}
            maxDate={values.toMonth}
            handleChangeAdvance={handleChangeAdvance}
            minDate="01-01-2025"
            required
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <CustomDatePicker
            views={["month"]}
            openTo="month"
            name="toMonth"
            label="To Month"
            inputFormat="MMMM"
            helperText=""
            value={values.toMonth}
            minDate={values.fromMonth}
            handleChangeAdvance={handleChangeAdvance}
            disabled={!values.fromMonth}
            required
          />
        </Grid>
      </Grid>
      <Box sx={{ position: "relative", marginTop: { xs: 8, md: 1 } }}>
        <Box sx={{
          position: "absolute",
          width: "100%",
          '& .last-row': {
            backgroundColor: '#edeef6 !important',
            color: '#000 !important',
            fontWeight: "bold"
          },
        }}>
          <GridIndex
            rows={values.rows}
            columns={columns}
            loading={values.loading}
            columnVisibilityModel={columnVisibilityModel}
            setColumnVisibilityModel={setColumnVisibilityModel} />
        </Box>
      </Box>
    </Box>
  );
}

export default TaxDeductionIndex;
