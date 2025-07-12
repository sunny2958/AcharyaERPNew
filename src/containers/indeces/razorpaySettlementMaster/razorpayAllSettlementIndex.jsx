import { useEffect, useState } from "react"
import { Box, Breadcrumbs, Button, CircularProgress, Divider, Grid, Typography } from "@mui/material"
import GridIndex from "../../../components/GridIndex"
import axios from "../../../services/Api";
import { useNavigate, useLocation } from "react-router-dom";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import moment from "moment";
import CustomFilter from "../../../components/Inputs/CustomCommonFilter";
import ModalWrapper from "../../../components/ModalWrapper";
import useAlert from "../../../hooks/useAlert";

const RazorPaySettlementIndex = () => {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState()
    const [refetchDate, setRefetchDate] = useState()
    const [isRefetchModelOpen, setIsRefetchModelOpen] = useState(false)
    const { pathname } = useLocation();
    const navigate = useNavigate()
     const { setAlertMessage, setAlertOpen } = useAlert();
    const roleShortName = JSON.parse(
        sessionStorage.getItem("AcharyaErpUser")
    )?.roleShortName;

    useEffect(() => {
        getAllSettlementData()
    }, [date])

    const getAllSettlementData = () => {
        setLoading(true)

        const tabName = pathname.split("/").filter(Boolean)[1]
        const formatedDate = date ? moment(date).format("YYYY-MM-DD") : ""
        let params = {
            ...(tabName !== 'pending-settlement' && date && { settledDate: formatedDate }),
            ...(tabName === 'pending-settlement' && date && { date: formatedDate }),
        }
        const baseUrl = tabName === 'pending-settlement' ? `/api/allPendingSettlements` : `/api/settelmentSummary`
        axios.get(baseUrl, { params })
            .then(res => {
                const { data } = res
                setRows(data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
                 setAlertMessage({
                        severity: "error",
                        message: "Failed to Fetch, Please try after sometime",
                    });
                    setAlertOpen(true);
            })
    }

    const getSettlementData = (rowData) => {
        const { date, settlementId } = rowData
        navigate(`${pathname}/${settlementId}`, {
            state: {
                settlementDate: date,
            }
        })
    }
    const getReceiptData = (selectedSettlementId) => {
        navigate(`/razorpay-settlement-master/settlement-receipt/${selectedSettlementId}`)
    }
    const getPendingAmountData = (selectedSettlementId) => {
        navigate(`/razorpay-settlement-master/pending-settlement/${selectedSettlementId}`)
    }

    const handleChangeAdvance = (name, newValue) => {
        setDate(newValue)
    };

   const handleRefetchInputChange = (name, newValue) => {
        setRefetchDate(newValue)
    }; 

    const refetchSettlement = () =>{
        setRefetchDate("")
         setIsRefetchModelOpen(true)
    }

    const handleRefetchSubmit = () =>{
        refetchSettlementData(refetchDate)
    }

       const refetchSettlementData = () => {
        setLoading(true)
        const settlementRefetchdate = new Date(refetchDate);
        const year = settlementRefetchdate?.getFullYear();
        const month = settlementRefetchdate?.getMonth() + 1; 
        const day = settlementRefetchdate?.getDate();
        axios.post(`/api/razorPaySettlements?year=${year}&month=${month}&day=${day}`)
            .then(res => {
                 setLoading(false);
                setDate(refetchDate)
                getAllSettlementData()
                setIsRefetchModelOpen(false)
            }).catch((err) => {
        console.log(err);
        setAlertMessage({
                        severity: "error",
                        message: "Failed to refetch, Please try after sometime",
                    });
                    setAlertOpen(true);
        setLoading(false);
      });
    }


    const columns = [
        {
            field: "date",
            headerName: "Settlement date",
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            headerClassName: "header-bg",
            renderCell: (params) => {
                return params?.row?.date ? moment(params?.row?.date).format('DD-MM-YYYY') : ""
            }
        },
        {
            field: "settlementId",
            headerName: "Settlements",
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            headerClassName: "header-bg",
            renderCell: (params) => {
                return (<Button onClick={() => getSettlementData(params.row)}>
                    {params.row.settlementId}
                </Button>)
            }
        },
        {
            field: "totalCredit",
            headerName: "Settlement Amount",
            flex: 1,
            type: "number",
            align: 'right',
            headerAlign: 'center',
            headerClassName: "header-bg"
        },
        {
            field: "receiptAmount",
            headerName: "Receipt Amount",
            flex: 1, type: "number",
            align: 'right',
            headerAlign: 'center',
            headerClassName: "header-bg",
            renderCell: (params) => {
                if (params?.row?.receiptAmount > 0) {
                    return (<Button onClick={() => getReceiptData(params?.row?.settlementId)}>
                        {params?.row?.receiptAmount}
                    </Button>)
                } else {
                    return params?.row?.receiptAmount
                }
            }
        },
        // {
        //     field: "totalDebit",
        //     headerName: "Transfer Amount",
        //     flex: 1,
        //     type: "number",
        //     align: 'right',
        //     headerAlign: 'center',
        //     headerClassName: "header-bg"
        // },
        {
            field: "uniformAmount",
            headerName: "Uniform Amount",
            flex: 1,
            type: "number",
            align: 'right',
            headerAlign: 'center',
            headerClassName: "header-bg"
        },
        {
            field: "addOnAmount",
            headerName: "Add On Amount",
            flex: 1,
            type: "number",
            align: 'right',
            headerAlign: 'center',
            headerClassName: "header-bg"
        },
        {
            field: "pendingAmount",
            headerName: "Pending Amount",
            flex: 1,
            type: "number",
            align: 'right',
            headerAlign: 'center',
            headerClassName: "header-bg",
            renderCell: (params) => {
                if (params?.row?.pendingAmount > 0) {
                    return (<Button onClick={() => getPendingAmountData(params?.row?.settlementId)}>
                        {params?.row?.pendingAmount}
                    </Button>)
                } else {
                    return params?.row?.pendingAmount
                }
            }
        }
    ]

     const RefetchSettlementField = () => {
        return (
          <Grid
            container
            direction="column"
            spacing={3}
            sx={{ p: 1 }}
          >
            <Grid item sx={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={10}>
                 <CustomDatePicker
                    name="refetchDate"
                    label="Settlement Date"
                    value={refetchDate || ""}
                    handleChangeAdvance={handleRefetchInputChange}
                    maxDate={new Date()}
                />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 1, px: 2 }}
                  disabled={!refetchDate || loading}
                  onClick={handleRefetchSubmit}
                >
                  {loading ? (
                    <CircularProgress
                      size={25}
                      color="blue"
                      style={{ margin: "2px 13px" }}
                    />
                  ) : (
                    <strong>{"Save"}</strong>
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )
      }

    return (
        <>
         <ModalWrapper
                open={isRefetchModelOpen}
                setOpen={setIsRefetchModelOpen}
                maxWidth={400}
                title={
                  <Box
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: "1.3rem",
                      color: "primary.main",
                      paddingBottom: 1,
                    }}
                  >
                    <Typography variant="h6" mb={1}>
                     Refetch Settlement
                    </Typography>
                    <Divider />
                  </Box>
                }
              >
                {RefetchSettlementField()}
              </ModalWrapper>
        <Box sx={{ position: "relative", mt: 2, mb: 3 }}>
            <Box sx={{ position: "absolute", top: -80, right: 0, display:"flex", gap:3 }}>
                <CustomDatePicker
                    name="settlementDate"
                    label="Settlement Date"
                    value={date || ""}
                    handleChangeAdvance={handleChangeAdvance}
                    maxDate={new Date()}
                />
                 <Button
                    style={{ borderRadius: 7 }}
                    variant="contained"
                    color="primary"
                    onClick={refetchSettlement}
                    sx={{height: '38px'}}
                >
                  Refetch
                </Button>
            </Box>
            <GridIndex
                rows={rows}
                columns={columns}
                loading={loading}
                rowSelectionModel={[]}
                getRowId={row => row.settlementId}
            />
        </Box>
        </>
    )
}

export default RazorPaySettlementIndex