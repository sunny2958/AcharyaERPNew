import { useEffect, useState } from "react"
import { Box, Button, Grid, Typography } from "@mui/material"
import GridIndex from "../../../components/GridIndex"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import axios from "../../../services/Api";
import moment from "moment";
import { useLocation, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";


const RazorPayPendingSettlementDetail = () => {
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
      { name: "Pending Settlement" }
    ])
  }, [settlementId])

  const getSettlementData = () => {
    setLoading(true)
    axios.get(`api/getPendingBankImportSettlements?settlementId=${settlementId}`)
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
      field: "settled_at",
      headerName: "Transaction Date",
      flex: 1,
      renderCell: (params) => {
        return params?.row?.settled_at ? moment(params?.row?.settled_at).format('DD-MM-YYYY') : ""
      }
    },
    {
      field: "entity_id",
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
      field: "bank_import_transaction_id",
      headerName: "Bank Import",
      flex: 1,
      headerAlign: "center",
      align: "center"
    },
    {
      field: "credit",
      headerName: "Amount",
      flex: 1,
      headerAlign: "center",
      cellClassName: "rightAlignedCell"
    },
    // {
    //   field: "created_at",
    //   headerName: "Created At",
    //   flex: 1
    // },
  ];

  return (
    <Box mt={2}>
      <GridIndex
        rows={rows}
        columns={columns}
        loading={loading}
        rowSelectionModel={[]}
        getRowId={row => row.entity_id}
      />
    </Box>
  )
}

export default RazorPayPendingSettlementDetail