import { useEffect, useState } from "react"
import { Box, Button, Grid, Typography } from "@mui/material"
import GridIndex from "../../../components/GridIndex"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import axios from "../../../services/Api";
import moment from "moment";
import { useLocation, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";


const RazorPayReceiptDetail = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const { pathname, state } = useLocation();
  const { settlementId } = useParams()
  const selectedDate = state?.settlementDate;
  const setCrumbs = useBreadcrumbs()
  useEffect(() => {
    getSettlementData()
    setCrumbs([
      { name: "Razorpay Settlements", link: "/razorpay-settlement-master" },
      { name: "Settlement Receipt" }
    ])
  }, [settlementId])

  const getSettlementData = () => {
    setLoading(true)
    axios.get(`/api/getReceiptGeneratedSettlements?settlementId=${settlementId}`)
      .then(res => {
        const { data } = res?.data
        setRows([...data] || [])
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  const columns = [
    {
      field: "transaction_date",
      headerName: "Transaction Date",
      flex: 1,
      renderCell: (params) => {
        return params?.row?.transaction_date ? moment(params?.row?.transaction_date).format('DD-MM-YYYY h:mm:ss a') : ""
      }
    },
    {
      field: "transaction_no",
      headerName: "Transaction No",
      flex: 1,
      //  hide: true,
    },
    {
      field: "order_id",
      headerName: "Reference No",
      flex: 1,
    },
    {
      field: "settlement_utr",
      headerName: "Settlement Utr",
      flex: 1,
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      headerAlign: "center",
      cellClassName: "rightAlignedCell"
    },
    {
      field: "created_username",
      headerName: "Created Username",
      flex: 1
    },
  ];

  return (
    <Box mt={2}>
      <GridIndex
        rows={rows}
        columns={columns}
        loading={loading}
        rowSelectionModel={[]}
        getRowId={row => row.order_id}
      />
    </Box>
  )
}

export default RazorPayReceiptDetail