import { useEffect, useState } from "react"
import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material"
import GridIndex from "../../../components/GridIndex"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import axios from "../../../services/Api";
import moment from "moment";
import { useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const FALLBACKCRUMB = [
    {
        text: `Fee Receivable as on ${moment(new Date()).format("DD-MM-YYYY")}`,
        action: () => { },
        isParent: false
    }
]

const StudentDueReport = () => {
    const [rows, setRows] = useState([])
    const [columns, setColumns] = useState([])
    const [breadCrumbs, setBreadCrumbs] = useState(FALLBACKCRUMB)
    const [loading, setLoading] = useState(false)
    const [showButton, setShowButton] = useState(true)
    const [isBranchWiseDueReport, setIsBranchWiseDueReport] = useState(true)
    const { pathname } = useLocation();
    const setCrumbs = useBreadcrumbs();

    const roleShortName = JSON.parse(
        sessionStorage.getItem("AcharyaErpUser")
    )?.roleShortName;

    useEffect(() => {
          setCrumbs([])
        getInstituteData()
    }, [])

    const getInstituteData = () => {
        setLoading(true)
        const baseUrl = (roleShortName === "SAA" || pathname === "/student-due-report") ? "/api/student/allSchoolWiseDueReport" : "/api/student/schoolWiseDueReport"
        axios.get(baseUrl)
            .then(res => {
                setShowButton(true)
                setBreadCrumbs(FALLBACKCRUMB)
                const data = res.data.data
                if (!data && data.schoolWiseDueReportLists.length <= 0) {
                    setLoading(false)
                    setColumns([])
                    setRows([])
                    return
                }
                const { schoolWiseDueReportLists, grantDueTotal, grantAddOnTotal, grantHostelFeeTotal, grantTotal } = data
                const columns = [
                    {
                        field: "inst", headerName: "School Name", flex: 1, minWidth: 400, headerAlign: 'center', headerClassName: "header-bg",
                        renderCell: (params) => {
                            if (!params.row.isClickable)
                                return <Typography fontWeight="bold">{params.row.inst}</Typography>

                            return <Button onClick={() => getBranchData(params.row)} sx={{ padding: 0, fontWeight: "bold" }}>
                                {params.row.inst}
                            </Button>
                        }
                    },
                    { field: "collegeDue", headerName: "College Due", flex: 1, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "addOn", headerName: "Add On", flex: 1, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "hostelFee", headerName: "Hostel Due", flex: 1, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },                  
                    {
                        field: "total", headerName: "Total", flex: 1, align: 'right', headerAlign: 'right', headerClassName: "header-bg",
                        renderCell: (params) => {
                            const total = new Intl.NumberFormat('en-IN').format(params?.row?.total) || 0
                            if (!params.row.isClickable)
                                return <Typography fontWeight="bold">{total}</Typography>

                            return <Button onClick={() => getBranchData(params.row)} sx={{ padding: 0, fontWeight: "bold" }}>
                                {total}
                            </Button>
                        }
                    },
                ]

                const dataRows = schoolWiseDueReportLists?.map(obj => {
                    const { schoolId, schoolName,schoolShortName, collegeDue, addOn, hostelFee, uniformAmount, total } = obj
                     if (total > 0)
                        return {
                            id: schoolId, inst: schoolName, collegeDue, addOn, isLastRow: false, uniformAmount,
                            hostelFee: hostelFee ? hostelFee : 0, total, isClickable: total > 0 ? true : false
                        }
                     else return {}
                })
                dataRows.push({
                    id: Date.now(),
                    inst: "",
                    collegeDue: grantDueTotal ? grantDueTotal : 0,
                    addOn: grantAddOnTotal ? grantAddOnTotal : 0,
                    hostelFee: grantHostelFeeTotal ? grantHostelFeeTotal : 0,
                    total: grantTotal ? grantTotal : 0, isClickable: false,
                    isLastRow: true
                })

                setColumns(columns)
                setRows(dataRows?.filter(obj => Object.keys(obj).length > 0))
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    // const getNewAdmissionDues = () => {
    //     setLoading(true)
    //     const baseUrl = (roleShortName === "SAA" || pathname === "/student-due-report") ? "/api/student/newAddmissionsDueReport" : "api/student/schoolWiseNewAddmissionsDueReport"
       
    //     axios.get(baseUrl)
    //         .then(res => {
    //             setShowButton(false)
    //             const data = res.data.data
    //             if (!data && data.newAddmissionDueReports.length <= 0) {
    //                 setLoading(false)
    //                 setColumns([])
    //                 setRows([])
    //                 return
    //             }
    //             const { newAddmissionDueReports, totalEligibleStudent, totalReceivableAmount, totalStudent } = data
    //             const academicYear = newAddmissionDueReports?.length > 0 && newAddmissionDueReports[0]?.acYear
    //             const NEWFALLBACKCRUMB = [
    //                 {
    //                     text: `Due Amount For ${academicYear}`,
    //                     action: () => { },
    //                     isParent: false
    //                 }
    //             ]
    //             setBreadCrumbs(NEWFALLBACKCRUMB)
    //             const columns = [
    //                 {
    //                     field: "inst", headerName: "School Name", flex: 1, minWidth: 400, headerAlign: 'center', headerClassName: "header-bg",
    //                     renderCell: (params) => {
    //                         if (!params.row.isClickable)
    //                             return <Typography fontWeight="bold">{params.row.inst}</Typography>

    //                         return <Button onClick={() => getBranchData(params.row, params?.row?.acYearId)} sx={{ padding: 0, fontWeight: "bold" }}>
    //                             {params.row.inst}
    //                         </Button>
    //                     }
    //                 },
    //                 { field: "studentDueCount", headerName: "Student Count", flex: 1, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
    //                 {
    //                     field: "total", headerName: "Total", flex: 1, align: 'right', headerAlign: 'right', headerClassName: "header-bg",
    //                     renderCell: (params) => {
    //                         const total = new Intl.NumberFormat('en-IN').format(params?.row?.total) || 0
    //                         return <Typography fontWeight="bold">{total}</Typography>
    //                     }
    //                 },
    //             ]

    //             const dataRows = newAddmissionDueReports.map(obj => {
    //                 const { schoolNameShort, schoolName, studentDueCount, feeReceivable, schoolId, acYearId } = obj
    //                 if (feeReceivable > 0){
    //                     return {
    //                         id: schoolId, inst: schoolName, studentDueCount, isLastRow: false,
    //                          total: feeReceivable, isClickable: feeReceivable > 0 ? true : false, acYearId
    //                     }
    //                 }
    //                  else return {}
    //             })
    //             dataRows.push({
    //                 id: Date.now(),
    //                 inst: "",
    //                 acYearId: "",
    //                 studentDueCount: totalStudent ? totalStudent : 0,
    //                 // eligible: totalEligibleStudent ? totalEligibleStudent : 0,
    //                 total: totalReceivableAmount ? totalReceivableAmount : 0,
    //                 isClickable: false,
    //                 isLastRow: true
    //             })

    //             setColumns(columns)
    //             setRows(dataRows.filter(obj => Object.keys(obj).length > 0))
    //             setLoading(false)
    //         })
    //         .catch(err => {
    //             console.log(err)
    //             setLoading(false)
    //         })
    // }

    const getBranchData = (selectedInst) => {
        setShowButton(false)
        setLoading(true)
        // const url = acYear ? `/api/student/branchWiseDueReport?schoolId=${selectedInst.id}&acYearId=${acYear}` : `/api/student/branchWiseDueReport?schoolId=${selectedInst.id}`
                const url = `/api/student/branchWiseDueReport?schoolId=${selectedInst.id}`
        axios.get(url)
            .then(res => {
                setBreadCrumbs([
                    {
                        text: selectedInst.inst,
                        action: () => getInstituteData(selectedInst),
                        isParent: true
                    },
                    {
                        text: "Programme",
                        action: () => { },
                        isParent: false
                    }
                ])
                const data = res.data.data
                if (!data && data.branchWisedueReports.length <= 0) {
                    setLoading(false)
                    setColumns([])
                    setRows([])
                    return
                }
                const maxSem = Math.max(...data.branchWisedueReports.map(o => o.numberOfSemester))

                const columns = [
                    { field: "program", headerName: "Course", flex: 1, minWidth: 110, headerClassName: "header-bg" },
                    { field: "programSpecialization", headerName: "Branch", flex: 1, minWidth: 110, headerClassName: "header-bg" }
                ]

                for (let index = 1; index <= maxSem; index++) {
                    columns.push({
                        field: `sem${index}`,
                        headerName: `Sem ${index}`,
                        flex: 1,
                        minWidth: 120,
                        type: "number",
                        align: 'right',
                        headerAlign: 'right',
                        headerClassName: "header-bg",
                        renderCell: (params) => {
                            const value = params?.row[`sem${index}`];
                            const isClickable = isBranchWiseDueReport && params.row.isClickable && value > 0;
                            if (isClickable) {
                                return (<Button onClick={() => getSemesterData(selectedInst, params.row, index)}>
                                    {params?.row[`sem${index}`]}
                                </Button>)
                            }
                            return params?.row[`sem${index}`]
                        }
                    })
                }

                columns.push(
                    {
                        field: "hostelDue", headerName: "Hostel Due", minWidth: 140, type: "number", align: 'right', sortable: false,
                        headerAlign: 'right', headerClassName: "header-bg", disableColumnMenu: true,
                    },
                    {
                        field: "total", headerName: "Total Due", minWidth: 140, type: "number", align: 'right', sortable: false,
                        headerAlign: 'right', headerClassName: "header-bg", disableColumnMenu: true, pinned: true,
                        renderCell: (params) => {
                            const total = new Intl.NumberFormat('en-IN').format(params?.row?.total) || 0
                            if (!params.row.isClickable)
                                return <Typography fontWeight="bold">{total}</Typography>

                            return (<Button onClick={() => getStudentData(selectedInst, params.row)}>
                                {total}
                            </Button>)
                        }
                    })

                const { branchWisedueReports, grandTotal, totalSem1, totalSem2, totalSem3, totalSem4, totalSem5,
                    totalSem6, totalSem7, totalSem8, totalSem9, totalSem10, totalSem11, totalSem12, totalHostelDue } = data

                const rows = branchWisedueReports.map((obj, i) => {
                    const { programId, programSpecializationId, program, programSpecialization, sem1,
                        sem2, sem3, sem4, sem5, sem6, sem7, sem8, sem9, sem10, sem11, sem12, hostelDue, total
                    } = obj
                    return {
                        id: i, programId, programSpecializationId, program, programSpecialization, sem1,
                        sem2, sem3, sem4, sem5, sem6, sem7, sem8, sem9, sem10, sem11, sem12, hostelDue, isLastRow: false,
                        isClickable: total > 0 ? true : false, total
                    }
                })

                rows.push({
                    id: branchWisedueReports.length + 1, programId: branchWisedueReports.length + 1,
                    programSpecializationId: branchWisedueReports.length + 1, program: "", programSpecialization: "",
                    sem1: totalSem1, sem2: totalSem2, sem3: totalSem3, sem4: totalSem4, sem5: totalSem5, sem6: totalSem6,
                    sem7: totalSem7, sem8: totalSem8, sem9: totalSem9, sem10: totalSem10, sem11: totalSem11,
                    sem12: totalSem12, hostelDue: totalHostelDue, total: grandTotal, isClickable: false, isLastRow: true
                })

                setColumns(columns)
                setRows(rows)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    const getSemesterData = (selectedInst, selectedBranch, selectedSemester) => {
        setShowButton(false)
        setLoading(true)
        axios.get(`/api/student/SemWiseStudentWiseDueReport?schoolId=${selectedInst?.id}&programId=${selectedBranch?.programId}&programSpecializationId=${selectedBranch?.programSpecializationId}&sem=${selectedSemester}&pageSize=100&pageNo=0`)
            .then(res => {
                const currentSem = `Semester ${selectedSemester}`
                setBreadCrumbs([
                    {
                        text: selectedInst.inst,
                        action: () => getInstituteData(),
                        isParent: true
                    },
                    {
                        text: currentSem,
                        action: () => getBranchData(selectedInst),
                        isParent: true
                    },
                    {
                        text: "Student",
                        action: () => { },
                        isParent: false
                    }
                ])
                const data = res.data.data
                if (data === null) {
                    setLoading(false)
                    setColumns([])
                    setRows([])
                    return
                }

                const columns = [
                    { field: "studentName", headerName: "Student Name", flex: 1, headerClassName: "header-bg" },
                    { field: "auid", headerName: "AUID", flex: 1, headerClassName: "header-bg" },
                    { field: "templateName", headerName: "Fee Template", flex: 1, headerClassName: "header-bg" },
                    { field: "year/sem", headerName: "Year/Sem", flex: 1, align: 'center',  headerAlign: 'center', headerClassName: "header-bg",
                        renderCell: (params) => {
                            if(params?.row?.isLastRow){
                                return <Typography></Typography>;
                            }
                            const year = Number(params?.row?.currentYear) || 0;
                            const sem = Number(params?.row?.currentSem) || 0;
                            return <Typography>{year}/{sem}</Typography>;
                        }
                     },
                    //   {
                    //     field: "semDue", headerName: "College Due", flex: 1, type: "number", align: 'right', sortable: false,
                    //     headerAlign: 'right', headerClassName: "header-bg", disableColumnMenu: true, pinned: true,
                    //     renderCell: (params) => {
                    //         const total = Number(params?.row?.semDue) || 0;
                    //         const formatted = new Intl.NumberFormat('en-IN').format(total);
                    //         return <Typography>{formatted}</Typography>;
                    //     }
                    // },
                    {
                        field: "inrValue", headerName: "College Due (₹)", type: "number", minWidth: 150, align: 'right', sortable: false,
                        headerAlign: 'right', headerClassName: "header-bg", disableColumnMenu: true, pinned: true,
                        renderCell: (params) => {
                            const total = Number(params?.row?.inrValue) || 0;
                            const formatted = new Intl.NumberFormat('en-IN').format(total);
                            return <Typography>{formatted}</Typography>;
                        }
                    },
                    { field: "addOn", headerName: "Add On Due", flex: 1, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "hostelDue", headerName: "Hostel Due", flex: 1, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    {
                        field: "total", headerName: "Total Due", flex: 1, type: "number", align: 'right', sortable: false,
                        headerAlign: 'right', headerClassName: "header-bg", disableColumnMenu: true, pinned: true,
                        renderCell: (params) => {
                            const total = Number(params?.row?.total) || 0;
                            const formatted = new Intl.NumberFormat('en-IN').format(total);
                            return <Typography>{formatted}</Typography>;
                        }
                    }
                ]

                const {
                    semisterWiseStudentDueReports, grantTotalDue, addOnTotal, inrTotal, semTotal, hotstelTotal } = data
                const rows = semisterWiseStudentDueReports.map((obj, i) => {
                    const { semDue, auid, studentName, templateName, currentYear, currentSem, addOnDue,
                        currencyType, exchangeRate, inrValue, hostelDue } = obj
                    const totalDue = Number(inrValue || 0) + Number(addOnDue || 0) + Number(hostelDue || 0)
                    return {
                        id: i, total: totalDue, auid, studentName, currencyType, exchangeRate,
                        templateName, currentYear, currentSem, inrValue, hostelDue: hostelDue || 0, addOn: addOnDue ? addOnDue : 0, semDue
                    }
                })

                rows.push({
                    id: Date.now(), semDue: semTotal, inrValue: inrTotal, hostelDue: hotstelTotal || 0,
                    total: grantTotalDue, isClickable: false, isLastRow: true, addOn: addOnTotal, auid: "", studentName: "", templateName: "", 
                })


                setColumns(columns)
                setRows(rows)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    const getStudentData = (selectedInst, selectedBranch) => {
        setLoading(true)
        setIsBranchWiseDueReport(false)
        axios.get(`/api/student/studentWiseDueReport?schoolId=${selectedInst?.id}&programId=${selectedBranch?.programId}&programSpecializationId=${selectedBranch?.programSpecializationId}&pageSize=100&pageNo=0`)
            .then(res => {
                setColumns([])
                setShowButton(false)
                setBreadCrumbs([
                    {
                        text: selectedInst.inst,
                        action: () => getInstituteData(),
                        isParent: true
                    },
                    {
                        text: selectedBranch.program,
                        action: () => getBranchData(selectedInst),
                        isParent: true
                    },
                    {
                        text: "Student",
                        action: () => { },
                        isParent: false
                    }
                ])
                const data = res.data.data
                if (!data && data?.studentWiseDueReports.length <= 0) {
                    setLoading(false)
                    setColumns([])
                    setRows([])
                    return
                }
                const maxSem = data.studentWiseDueReports[0].numberOfSemester
                const columns = [
                    { field: "studentName", headerName: "Student Name", flex: 1, minWidth: 170, headerClassName: "header-bg" },
                    { field: "auid", headerName: "AUID", flex: 1, minWidth: 140, headerClassName: "header-bg" },
                    { field: "feeTemplateName", headerName: "Fee Template", flex: 1, minWidth: 120, headerClassName: "header-bg" }
                ]

                for (let index = 1; index <= maxSem; index++) {
                    columns.push({ field: `sem${index}`, headerName: `Sem ${index}`, flex: 1, minWidth: 120, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" })
                }

                columns.push(
                    { field: "addOn", headerName: "Add On Due", flex: 1, minWidth: 140, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    { field: "hostelFee", headerName: "Hostel Due", flex: 1, minWidth: 140, type: "number", align: 'right', headerAlign: 'right', headerClassName: "header-bg" },
                    {
                        field: "total", headerName: "Total Due", minWidth: 140, type: "number", align: 'right', sortable: false,
                        headerAlign: 'right', headerClassName: "header-bg", disableColumnMenu: true, pinned: true,
                        renderCell: (params) => {
                            const total = Number(params?.row?.total) || 0;
                            const formatted = new Intl.NumberFormat('en-IN').format(total);
                            return <Typography fontWeight="bold">{formatted}</Typography>;
                        }
                    }
                )

                const { studentWiseDueReports, grantTotalDue, totalSem1, totalSem2, totalSem3, totalSem4, totalSem5,
                    totalSem6, totalSem7, totalSem8, totalSem9, totalSem10, totalSem11, totalSem12, totalAddOn, totalhostelDue } = data

                const rows = studentWiseDueReports.map((obj, i) => {
                    const { programId, sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8, sem9,
                        sem10, sem11, sem12, totalDue, auid, studentName, feeTemplateName, addOn, hostelFee
                    } = obj
                    return {
                        id: i, programId, sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8, sem9,
                        sem10, sem11, sem12, isLastRow: false, isClickable: false, total: totalDue, auid, studentName,
                        feeTemplateName, addOn: addOn ? addOn : 0, hostelFee: hostelFee ? hostelFee : 0
                    }
                })

                rows.push({
                    id: Date.now(), sem1: totalSem1, sem2: totalSem2, sem3: totalSem3,
                    sem4: totalSem4, sem5: totalSem5, sem6: totalSem6, sem7: totalSem7, sem8: totalSem8,
                    sem9: totalSem9, sem10: totalSem10, sem11: totalSem11, sem12: totalSem12,
                    total: grantTotalDue, isClickable: false, isLastRow: true, addOn: totalAddOn, hostelFee: totalhostelDue,
                    auid: "", studentName: "", feeTemplateName: ""
                })

                setColumns(columns)
                setRows(rows)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    return (<Box>
        <Grid container alignItems="center" justifyContent="space-between" pt={3} rowGap={2} className="main-grid">
            <Grid item xs={12} md={12} lg={1}></Grid>
            <Grid item xs={12} md={12} lg={10} sx={{
                '& .last-row': { fontWeight: 700, backgroundColor: "#376a7d !important", color: "#fff", fontSize: "13px" },
                '& .last-column': { fontWeight: "bold" },
                '& .last-row:hover': { fontWeight: 700, backgroundColor: "#376a7d !important", color: "#fff", fontSize: "13px" },
                '& .header-bg': { fontWeight: "bold", backgroundColor: "#376a7d", color: "#fff", fontSize: "15px" },
            }}
                className="children-grid"
            >
                <CustomBreadCrumbs arr={breadCrumbs} />
                {/* <Box sx={{ display: "flex", justifyContent: 'space-between', marginBottom: '10px' }}>
                    <CustomBreadCrumbs arr={breadCrumbs} />
                    {showButton ? (
                        <Button
                            style={{ borderRadius: 7 }}
                            variant="contained"
                            color="primary"
                            onClick={getNewAdmissionDues}
                        >
                            New Admissions
                        </Button>
                    ) : <></>}
                </Box> */}
                <GridIndex
                    initialState={{
                        pinnedColumns: { left: ['program'] },
                    }}
                    rows={rows}
                    columns={columns}
                    getRowClassName={(params) => {
                        return params.row.isLastRow ? "last-row" : ""
                    }}
                    loading={loading}
                    rowSelectionModel={[]}
                />
            </Grid>
            <Grid item xs={12} md={12} lg={1} className="empty-grid"></Grid>
        </Grid>
    </Box>)
}

export default StudentDueReport


const CustomBreadCrumbs = ({ arr }) => {
    if (arr.length <= 0) return null

    return (<Box>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            {arr.map((obj, i) => {
                const { text, action, isParent } = obj

                if (isParent) return (<Typography key={i} variant="h5" sx={{
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: "#2F38AB",
                }} onClick={action}> {text}</Typography>)
                return (<Typography key={i} variant="h5" sx={{ fontWeight: "bold" }}> {text}</Typography>)
            })}
        </Breadcrumbs>
    </Box>)
}