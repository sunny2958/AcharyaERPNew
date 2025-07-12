import { useEffect, useState } from "react"
import { Box, Button, Grid, Typography } from "@mui/material"
import GridIndex from "../../../components/GridIndex"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import axios from "../../../services/Api";
import moment from "moment";
import { useLocation, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";


const RazorPayMissingSettlement = () => {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState(new Date().toISOString().split("T")[0])
    const { pathname, state } = useLocation();

    const setCrumbs = useBreadcrumbs()
    useEffect(() => {
        getSettlementData()
        setCrumbs([
            { name: "Razorpay Missing Settlements" },
        ])
    }, [date])

    const getSettlementData = () => {
        setLoading(true)
        const formatedDate = moment(date).format("YYYY-MM-DD")
        axios.get(`api/allPendingSettlements?date=${formatedDate}`)
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

    const handleChangeAdvance = (name, newValue) => {
        setDate(newValue)
    };

    const columns = [
        {
            field: "settledAt",
            headerName: "Transaction Date",
            flex: 1,
            renderCell: (params) => {
                return params?.row?.settledAt ? moment(params?.row?.settledAt).format('DD-MM-YYYY') : ""
            }
        },
        {
            field: "settlementId",
            headerName: "Settlement",
            flex: 1,
            //  hide: true,
        },
        {
            field: "entityId",
            headerName: "Transaction No",
            flex: 1,
            //  hide: true,
        },
        {
            field: "orderId",
            headerName: "Reference No",
            flex: 1,
        },
        {
            field: "settlementUtr",
            headerName: "Settlement Utr",
            flex: 1,
        },
        {
            field: "instName",
            headerName: "School",
            flex: 1
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 1,
            headerAlign: "center",
            cellClassName: "rightAlignedCell"
        },
    ];

    return (
        <Box sx={{ position: "relative", mt: 2, mb: 3 }}>
            <Box sx={{ position: "absolute", top: -80, right: 0 }}>
                <CustomDatePicker
                    name="settlementDate"
                    label="Settlement Date"
                    value={date || ""}
                    handleChangeAdvance={handleChangeAdvance}
                    maxDate={new Date()}
                />
            </Box>
            <GridIndex
                rows={rows}
                columns={columns}
                loading={loading}
                rowSelectionModel={[]}
                getRowId={row => row.settlementId}
            />
        </Box>
    )
}

export default RazorPayMissingSettlement