import React, { useEffect, useState, useMemo } from "react";
import _ from "lodash";
import axios from "../../../services/Api";
import {
    Box,
    Grid,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    Tooltip,
    Typography,
    styled,
    tableCellClasses,
    tooltipClasses,
} from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import OverlayLoader from "../../../components/OverlayLoader";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import { useLocation } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "rgba(74, 87, 169, 0.1)",
        color: "#46464E",
        textAlign: "center",
        padding: 2,
        border: "1px solid rgba(224, 224, 224, 1)",
    },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
        textAlign: "center",
        padding: 3,
        border: "1px solid rgba(224, 224, 224, 1)",
        backgroundColor: '#F5F5F5',
    },
}));

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "white",
        color: "rgba(0, 0, 0, 0.6)",
        maxWidth: 270,
        fontSize: 12,
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
        padding: "10px",
        textAlign: "center",
    },
}));

function FacultyFeedbackReportByCourse() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const [column, setColumn] = useState()
    const [sectionKeys, setSectionKeys] = useState([])
    const [allCourses, setAllCourses] = useState([])
    const [courseSectionMap, setCourseSectionMap] = useState([])
    const [tab, setTab] = useState('course')
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const { setAlertMessage, setAlertOpen } = useAlert();
    const setCrumbs = useBreadcrumbs();
    const location = useLocation();
    const queryParams = location.state;
    const pathname = location.pathname;

    useEffect(() => {
        const masterPathlink = pathname.includes("-inst") ? "/FacultyFeedbackMaster-course-inst" : pathname.includes("-dept") ? "/FacultyFeedbackMaster-course-dept" : "/FacultyFeedbackMaster-course"

        setCrumbs([{ name: "Faculty Feedback Master-course", link: masterPathlink }, { name: "Faculty Feedback Report- Course" }]);
        getAllFacultySubject()
    }, []);

    useEffect(() => {
        setRows([])
        getFeedbackReport()
    }, [tab])

    const getAllFacultySubject = () => {
        // setLoading(true)
        const { year, sem, employee_id, acYear, school_id, ...query } = queryParams
        const yearAndSem = query?.yearSem && query?.yearSem?.split("/")
        const selectedYear = yearAndSem?.length > 0 ? yearAndSem[0] : ""
        const selectedSem = yearAndSem?.length > 0 ? yearAndSem[1] : ""
        const year_sem = selectedSem ? selectedSem : selectedYear ? selectedYear : 0
        const params = { year_sem, ...query }
        const baseUrl = "api/academic/getCourseAssignmentBasedOnProgramSpecialization"
        axios.get(baseUrl, { params })
            .then(res => {
                const { data } = res.data
                const columnData = data?.length > 0 && data?.map((col, index) => {
                    return {
                        field: col?.course_code,
                        headerName: `${col?.course_name},${col?.course_code}`,
                        flex: 1,
                        align: 'center',
                        headerAlign: 'center',
                    }
                })
                if (columnData?.length > 0) {
                    setColumn([...columnData])
                }
            })
            .catch(err => {
                setAlertMessage({
                    severity: "error",
                    message: "Failed to create, Please try after sometime",
                });
                setAlertOpen(true);
            })
    }

    const getFeedbackReport = () => {
        setLoading(true)
        const { year_sem, acYear, ...params } = queryParams
        const baseUrl = tab === 'course' ? "/api/student/getFeedbackRatingReportCourseWise" : "api/student/getFeedbackRatingReportSectionWiseReport"
        axios.get(baseUrl, { params })
            .then(res => {
                const { data } = res.data
                if (tab === 'course') {
                    const grouped = {};
                    data.forEach((item, index) => {
                        const { emp_id, employee_name, course_code, overall_section_average } = item;
                        if (!grouped[emp_id]) {
                            grouped[emp_id] = {
                                emp_id,
                                employee_name
                            };
                            grouped[emp_id].count = 0;
                        }
                        const colKey = course_code;
                        grouped[emp_id][colKey] = overall_section_average;
                    });
                    const finalRowData = Object.values(grouped).map(({ count, ...rest }) => rest);
                    setRows(finalRowData);
                } else {
                    const grouped = {};
                    const courseSection = {};
                    data?.forEach((item) => {
                        const empKey = item.empId;
                        const course = `${item.course_name},${item.course_code}`;
                        const section = item.section_name;
                        const value = item.avg_ratings_percentage;

                        if (!grouped[empKey]) {
                            grouped[empKey] = {
                                empId: item.empId,
                                employee_name: item.employee_name,
                                total_student: item.totalStudents,
                                feedback_count: item.feedBackgivenStudent,
                                feedback: {}
                            };
                        }

                        const sectionKey = `${course}__${section}`;
                        grouped[empKey].feedback[sectionKey] = value;

                        if (!courseSection[course]) {
                            courseSection[course] = new Set();
                        }
                        courseSection[course].add(section);
                    });

                    const allCourse = Object.keys(courseSection);

                    const sectionKey = allCourse.flatMap(course =>
                        Array.from(courseSection[course]).map(section => ({
                            field: `${course}__${section}`,
                            course,
                            section
                        }))
                    );
                    setRows(Object.values(grouped));
                    setSectionKeys(sectionKey);
                    setAllCourses(allCourse);
                    setCourseSectionMap(courseSection);
                }
                setLoading(false)
            }).catch(err => {
                setLoading(false);
                setAlertMessage({
                    severity: "error",
                    message: "Failed to create, Please try after sometime",
                });
                setAlertOpen(true);
            })
    }

    function courseTableHead(percentageType) {
        if (percentageType === 'course') {
            return column?.map((item, index) => {
                const courseName = item?.headerName ? item?.headerName?.split(",")[0] : ""
                const courseCode = item?.headerName ? item?.headerName?.split(",")[1] : ""
                return <StyledTableCell key={index} sx={{ textAlign: 'center' }}>
                    <Tooltip title={courseName} arrow>
                        <span>{courseCode}</span>
                    </Tooltip>
                </StyledTableCell>

            });
        } else {
            return allCourses?.map((item, index) => {
                const courseName = item ? item?.split(",")[0] : ""
                const courseCode = item ? item?.split(",")[1] : ""
                return <StyledTableCell key={courseCode} colSpan={courseSectionMap[item]?.size || 1}>
                    <Tooltip title={courseName} arrow>
                        <span>{courseCode}</span>
                    </Tooltip>
                </StyledTableCell>

            });
        }
    }

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
        if (newValue === 'course') {
            setSectionKeys([]);
            setAllCourses([]);
            setCourseSectionMap({});
        }
        setPage(0);
    };

    function getOrdinal(n) {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    const tableData = useMemo(
        () => (
            <TableContainer component={Paper} elevation={3}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                colSpan={2 + (column?.length || 0)}
                                sx={{
                                    backgroundColor: "#376a7d",
                                    color: "headerWhite.main",
                                    textAlign: "center",
                                }}
                            >

                                {`Faculty Feedback Report for the Academic Year - ${queryParams?.acYear}, ${queryParams?.sem
                                    ? `${getOrdinal(queryParams.sem)} Sem`
                                    : `${getOrdinal(queryParams?.year)} Year`
                                    }`}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <StyledTableCell sx={{ maxWidth: 50 }}>Sl No</StyledTableCell>
                            <StyledTableCell sx={{ alignItems: "center", textAlign: "center !important" }}>Employee Name</StyledTableCell>
                            {courseTableHead("course")}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((obj, index) => (
                                    <TableRow key={index}>
                                        <StyledTableCellBody>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                {page * rowsPerPage + index + 1}
                                            </Typography>
                                        </StyledTableCellBody>

                                        <StyledTableCellBody sx={{ textAlign: "left !important" }}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                <HtmlTooltip
                                                    title={
                                                        <Box>
                                                            <Typography>
                                                                {obj.employee_name}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                >
                                                    <span>
                                                        {obj.employee_name}
                                                    </span>
                                                </HtmlTooltip>
                                            </Typography>
                                        </StyledTableCellBody>
                                        {column?.map((item, j) => {
                                            const sectionPercentage = obj[item?.field] ? obj[item?.field] : ""
                                            return <StyledTableCellBody
                                                key={j}
                                                sx={{
                                                    backgroundColor: sectionPercentage ? '#E0F7FA !important' : '#F5F5F5',
                                                    fontWeight: sectionPercentage ? 'bold' : 'normal',
                                                    color: sectionPercentage ? '#006064' : '#9e9e9e',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {sectionPercentage}
                                            </StyledTableCellBody>
                                        })}
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={2 + (column?.length || 0)}
                                    sx={{ textAlign: "center" }}
                                >
                                    <Typography variant="subtitle2">No Records</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[50, 100, 200]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>
        ),
        [rows, page, rowsPerPage]
    );

    const sectionTableData = useMemo(() => (
        <Paper elevation={3}>
            <Box sx={{ overflowX: 'auto', width: '100%' }}>
                <Table size="small" sx={{ minWidth: 1200 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                colSpan={4 + sectionKeys?.length}
                                sx={{
                                    backgroundColor: "#376a7d",
                                    color: "headerWhite.main",
                                    textAlign: "center",
                                }}
                            >
                                {`Faculty Feedback Report for the Academic Year - ${queryParams?.acYear}, ${queryParams?.sem
                                    ? `${getOrdinal(queryParams.sem)} Sem`
                                    : `${getOrdinal(queryParams?.year)} Year`
                                    }`}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <StyledTableCell rowSpan={2}>Sl No</StyledTableCell>
                            <StyledTableCell rowSpan={2} sx={{ textAlign: "Center !important" }}>Employee Name</StyledTableCell>
                            {/* {allCourses.map(course => (
                                <StyledTableCell key={course} colSpan={courseSectionMap[course]?.size || 1}>
                                    {course}
                                </StyledTableCell>
                            ))} */}
                            {courseTableHead("courseAndSection")}
                            <StyledTableCell rowSpan={2}>Total Student</StyledTableCell>
                            <StyledTableCell rowSpan={2}>Feedback Count</StyledTableCell>
                        </TableRow>
                        <TableRow>
                            {sectionKeys.map(({ section, field }) => (
                                <StyledTableCell key={field}>Section {section}</StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => (
                                    <TableRow key={row.empId}>
                                        <StyledTableCellBody>{page * rowsPerPage + index + 1}</StyledTableCellBody>
                                        <StyledTableCellBody sx={{ textAlign: "left !important" }}>{row.employee_name}</StyledTableCellBody>
                                        {sectionKeys.map(({ field }) => {
                                            const sectionPercentage = row.feedback[field] ? row?.feedback[field] : ""
                                            return <StyledTableCellBody
                                                key={field}
                                                align="center"
                                                sx={{
                                                    backgroundColor: sectionPercentage ? '#E0F7FA !important' : '#F5F5F5',
                                                    fontWeight: sectionPercentage ? 'bold' : 'normal',
                                                    color: sectionPercentage ? '#006064' : '#9e9e9e',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {sectionPercentage}
                                            </StyledTableCellBody>
                                        })}
                                        <StyledTableCellBody>{row.total_student}</StyledTableCellBody>
                                        <StyledTableCellBody>{row.feedback_count}</StyledTableCellBody>
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow>
                                {/* <TableCell colSpan={sectionKeys.length + 2} align="center">
                                    <Typography variant="subtitle2">No Records Found</Typography>
                                </TableCell> */}
                                <TableCell
                                    colSpan={4 + (sectionKeys?.length || 0)}
                                    align="center"
                                    sx={{ py: 3 }}
                                >
                                    <Typography variant="subtitle2" color="textSecondary">
                                        No Records Found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>
            <TablePagination
                rowsPerPageOptions={[50, 100, 200]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />
        </Paper>
    ), [rows, sectionKeys, allCourses, page, rowsPerPage]);

    return (
        <>
            <Box>
                <Tabs value={tab} onChange={handleChangeTab}>
                    <Tab value="course" label="Course" />
                    {pathname === "/facultyFeedbackMasterCourseIndex" ? (
                        <Tab value="course-and-section" label="Course And Section" />
                    ) : <></>}
                </Tabs>

                <Grid container mt={2}>
                    {loading ? (
                        <Grid item xs={12} md={10} align="center">
                            <OverlayLoader />
                        </Grid>
                    ) : (
                        <>{tab == 'course' ? tableData : sectionTableData}</>
                    )}
                </Grid>
            </Box>
        </>
    );
}

export default FacultyFeedbackReportByCourse;