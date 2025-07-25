import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Box, Button, Breadcrumbs, Grid, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FormWrapper from "../../../components/FormWrapper";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
import GridIndex from "../../../components/GridIndex";

const initialValues = {
  fromMonth: null,
  toMonth: null,
};

const requiredFields = ["fromMonth", "toMonth"];

const FALLBACKCRUMB = [
  {
    text: ``,
    action: () => {},
    isParent: false,
  },
];

function ClosingcashReport() {
  const [values, setValues] = useState(initialValues);
  const [openData, setOpenData] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [breadCrumbs, setBreadCrumbs] = useState(FALLBACKCRUMB);
  const [loading, setLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([]);
  }, []);

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    const fromDate = moment(values.fromMonth).format("YYYY-MM-DD");
    const toDate = moment(values.toMonth).format("YYYY-MM-DD");
    await axios
      .get(
        `/api/finance/getCashDepositSummary?from_date=${fromDate}&to_date=${toDate}`
      )
      .then((res) => {
        setOpenData(true);
        const data = res.data;
        if (!data && data.length <= 0) {
          setLoading(false);
          setColumns([]);
          setRows([]);
          return;
        }

        const columns = [
          {
            field: "id",
            headerName: "Sl No.",
            flex: 1,
            headerClassName: "header-bg",
          },
          {
            field: "date",
            headerName: "Collection Date",
            flex: 1,
            headerClassName: "header-bg",
            renderCell: (params) => {
              return (
                <Button
                  onClick={() => getDateWise(params.row)}
                  sx={{ padding: 0, fontWeight: "bold" }}
                >
                  {moment(params.row.date).format("DD-MM-YYYY")}
                </Button>
              );
            },
          },
          {
            field: "cashCollection",
            headerName: "Cash Collection",
            flex: 1,
            type: "number",
            align: "right",
            headerAlign: "right",
            headerClassName: "header-bg",
          },

          {
            field: "closingCash",
            headerName: "Closing Cash",
            flex: 1,
            align: "right",
            headerAlign: "right",
            headerClassName: "header-bg",
          },

          {
            field: "depositedAmount",
            headerName: "Deposited Amount",
            flex: 1,
            type: "number",
            align: "right",
            headerAlign: "right",
            headerClassName: "header-bg",
          },

          {
            field: "balance",
            headerName: "Balance Amount",
            flex: 1,
            type: "number",
            align: "right",
            headerAlign: "right",
            headerClassName: "header-bg",
          },
        ];

        const dataRows = [];

        data.map((ele, i) => {
          dataRows.push({
            id: i + 1,
            balance: ele.balance_amount,
            cashSummary: ele.cashSummary,
            depositedAmount: ele.deposited_amount,
            closingCash: ele.closing_cash,
            cashCollection: ele.cash_collection,
            date: ele.date,
            payment: ele.payment,
          });
        });

        setColumns(columns);
        setRows(dataRows);
      })
      .catch((err) => {
        setOpenData(false);
      });
  };

  const getDateWise = async (rowData) => {
    await axios
      .get(`/api/finance/getCashDepositSummaryDatewise/${rowData.date}`)
      .then((res) => {
        console.log(res);

        setOpenData(true);
        const data = res.data.data;
        if (!data && data.length <= 0) {
          setLoading(false);
          setColumns([]);
          setRows([]);
          return;
        }

        const columns = [
          {
            field: "id",
            headerName: "Sl No.",
            flex: 1,
            headerClassName: "header-bg",
          },
          {
            field: "date",
            headerName: "Collection Date",
            flex: 1,
            headerClassName: "header-bg",
          },
          {
            field: "school",
            headerName: "School",
            flex: 1,
            headerClassName: "header-bg",
          },

          {
            field: "bank",
            headerName: "Bank",
            flex: 1,
            headerClassName: "header-bg",
          },

          {
            field: "createdBy",
            headerName: "Created By",
            flex: 1,
            headerClassName: "header-bg",
          },

          {
            field: "createdDate",
            headerName: "Created Date",
            flex: 1,
            headerClassName: "header-bg",
          },

          {
            field: "remarks",
            headerName: "Remarks",
            flex: 1,
            headerClassName: "header-bg",
          },
          {
            field: "closingCash",
            headerName: "Closing Cash",
            flex: 1,
            type: "number",
            align: "right",
            headerAlign: "right",
            headerClassName: "header-bg",
          },
          {
            field: "depositedAmount",
            headerName: "Deposited Amount",
            flex: 1,
            type: "number",
            align: "right",
            headerAlign: "right",
            headerClassName: "header-bg",
          },
          {
            field: "closingBalance",
            headerName: "Closing Balance",
            flex: 1,
            type: "number",
            align: "right",
            headerAlign: "right",
            headerClassName: "header-bg",
          },
        ];

        const dataRows = [];

        data.map((ele, i) => {
          dataRows.push({
            id: i + 1,
            bank: ele.bank_name,
            balance: ele.balance_amount,
            cashSummary: ele.cashSummary,
            depositedAmount: ele.deposited_amount,
            closingCash: ele.closing_cash,
            cashCollection: ele.cash_collection,
            closingBalance: ele.balance_amount,
            date: moment(ele.selectedDate).format("DD-MM-YYYY"),
            payment: ele.payment,
            school: ele.school_name_short,
            createdBy: ele.created_username,
            createdDate: moment(ele.created_date).format("DD-MM-YYYY"),
            remarks: `BEING CASH DEPOSITED TO ${ele.bank_name.toUpperCase()}`,
          });
        });

        setColumns(columns);
        setRows(dataRows);
      })
      .catch((err) => {
        setOpenData(false);
      });
  };

  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid item xs={12} md={10}>
        {openData ? (
          <>
            <Grid container rowSpacing={2} columnSpacing={2}>
              <Grid
                item
                xs={12}
                md={12}
                sx={{
                  "& .last-row": {
                    fontWeight: 700,
                    backgroundColor: "#376a7d !important",
                    color: "#fff",
                    fontSize: "13px",
                  },
                  "& .last-column": { fontWeight: "bold" },
                  "& .last-row:hover": {
                    fontWeight: 700,
                    backgroundColor: "#376a7d !important",
                    color: "#fff",
                    fontSize: "13px",
                  },
                  "& .header-bg": {
                    fontWeight: "bold",
                    backgroundColor: "#376a7d",
                    color: "#fff",
                    fontSize: "15px",
                  },
                }}
                className="children-grid"
              >
                <CustomBreadCrumbs arr={breadCrumbs} />

                <GridIndex
                  initialState={{
                    pinnedColumns: { left: ["program"] },
                  }}
                  rows={rows}
                  columns={columns}
                  getRowClassName={(params) => {
                    return params.row.isLastRow ? "last-row" : "";
                  }}
                  loading={loading}
                  rowSelectionModel={[]}
                />
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            <FormWrapper>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-end"
                rowSpacing={2}
                columnSpacing={2}
              >
                <Grid item xs={12} md={4} mt={2}>
                  <CustomDatePicker
                    name="fromMonth"
                    label="From Date"
                    value={values.fromMonth}
                    handleChangeAdvance={handleChangeAdvance}
                    helperText="dd/mm/yyyy"
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4} mt={2}>
                  <CustomDatePicker
                    name="toMonth"
                    label="To Date"
                    value={values.toMonth}
                    handleChangeAdvance={handleChangeAdvance}
                    helperText="dd/mm/yyyy"
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    onClick={handleCreate}
                    disabled={!requiredFieldsValid()}
                  >
                    GO
                  </Button>
                </Grid>
              </Grid>
            </FormWrapper>
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default ClosingcashReport;

const CustomBreadCrumbs = ({ arr }) => {
  if (arr.length <= 0) return null;

  return (
    <Box>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        {arr.map((obj, i) => {
          const { text, action, isParent } = obj;

          if (isParent)
            return (
              <Typography
                key={i}
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: "#2F38AB",
                }}
                onClick={action}
              >
                {" "}
                {text}
              </Typography>
            );
          return (
            <Typography key={i} variant="h5" sx={{ fontWeight: "bold" }}>
              {" "}
              {text}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};
