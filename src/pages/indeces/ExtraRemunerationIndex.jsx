import { useEffect, useState } from "react";
import axios from "../../services/Api";
import { Box, Button, Tooltip, styled, tooltipClasses } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import moment from "moment";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
  },
}));

function ExtraRemunerationIndex() {
  const [paginationData, setPaginationData] = useState({
    rows: [],
    loading: false,
    page: 0,
    pageSize: 100000,
    total: 0,
  });
  const [filterString, setFilterString] = useState("");

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  const columns = [
    { field: "emp_code", headerName: "Emp Code", flex: 1 },
    { field: "employee_name", headerName: "Emp Name", width: 220 },
    { field: "school", headerName: "School", width: 150 },
    { field: "designation_name", headerName: "Designation", flex: 1 },
    { field: "month", headerName: "Month", flex: 1 },
    { field: "year", headerName: "Year", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 200,
      renderCell: (params) =>
        params?.row?.remarks?.length > 30 ? (
          <HtmlTooltip title={params?.row?.remarks}>
            <span>{params?.row?.remarks?.substr(0, 25) + " ...."}</span>
          </HtmlTooltip>
        ) : (
          params.row.remarks
        ),
    },
    { field: "createdUserName", headerName: "Created By", flex: 1 },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      renderCell: (params) =>
        moment(params.row.createdDate).format("DD-MM-YYYY"),
    },
  ];

  useEffect(() => {
    setCrumbs([{ name: "Extra Remuneration" }]);
  }, []);

  useEffect(() => {
    getData();
  }, [paginationData.page, paginationData.pageSize, filterString]);

  const getData = async () => {
    setPaginationData((prev) => ({
      ...prev,
      loading: true,
    }));

    const searchString = filterString !== "" ? "&keyword=" + filterString : "";

    await axios(
      `/api/employee/getInvPayData?page=${paginationData.page}&page_size=${paginationData.pageSize}&sort=createdAt${searchString}`
    )
      .then((res) => {
        setPaginationData((prev) => ({
          ...prev,
          rows: res.data.data.content,
          total: res.data.data.totalElements,
          loading: false,
        }));
      })
      .catch((err) => console.error(err));
  };

  const handleOnPageChange = (newPage) => {
    setPaginationData((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleOnPageSizeChange = (newPageSize) => {
    setPaginationData((prev) => ({
      ...prev,
      pageSize: newPageSize,
    }));
  };

  const handleOnFilterChange = (value) => {
    setFilterString(
      value.items?.length > 0
        ? value.items[0].value === undefined
          ? ""
          : value.items[0].value
        : value.quickFilterValues.join(" ")
    );
  };

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <Button
        onClick={() => navigate("/Extraremuneration")}
        variant="contained"
        disableElevation
        sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        startIcon={<AddIcon />}
      >
        Create
      </Button>

      <GridIndex
        rows={paginationData.rows}
        columns={columns}
        // rowCount={paginationData.total}
        // page={paginationData.page}
        // pageSize={paginationData.pageSize}
        // handleOnPageChange={handleOnPageChange}
        // handleOnPageSizeChange={handleOnPageSizeChange}
        // loading={paginationData.loading}
        // handleOnFilterChange={handleOnFilterChange}
      />
    </Box>
  );
}

export default ExtraRemunerationIndex;
